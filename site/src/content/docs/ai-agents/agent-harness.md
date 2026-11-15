---
title: "What Is an Agent Harness? The Runtime Around the Model"
description: "An agent is a model plus a harness. What the harness does — the loop, tools, context management, permissions, sandboxing, hooks, subagents and instruction files — and how Claude Agent SDK, OpenAI Agents SDK and Codex-style CLIs implement it."
author: Parvez Ahmed
date: 2026-11-15
lastUpdated: 2026-11-15
sidebar:
  order: 2
head:
  - tag: meta
    attrs:
      property: og:type
      content: article
  - tag: meta
    attrs:
      property: og:title
      content: "What Is an Agent Harness? The Runtime Around the Model"
  - tag: meta
    attrs:
      property: og:url
      content: https://agentguides.dev/ai-agents/agent-harness/
  - tag: meta
    attrs:
      property: article:published_time
      content: "2026-11-15"
  - tag: link
    attrs:
      rel: canonical
      href: https://agentguides.dev/ai-agents/agent-harness/
  - tag: script
    attrs:
      type: application/ld+json
    content: |
      {"@context":"https://schema.org","@graph":[{"@type":"TechArticle","headline":"What Is an Agent Harness? The Runtime Around the Model","description":"An agent is a model plus a harness. What the harness does — the loop, tools, context management, permissions, sandboxing, hooks, subagents and instruction files — and how current SDKs implement it.","url":"https://agentguides.dev/ai-agents/agent-harness/","datePublished":"2026-11-15","dateModified":"2026-11-15","author":{"@type":"Person","name":"Parvez Ahmed","url":"https://github.com/Sero01"},"publisher":{"@type":"Person","name":"Parvez Ahmed"},"keywords":"agent harness, harness engineering, agent runtime, Claude Agent SDK, OpenAI Agents SDK, Codex CLI, agent sandbox, subagents, hooks, AGENTS.md"},{"@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://agentguides.dev/"},{"@type":"ListItem","position":2,"name":"AI Agents","item":"https://agentguides.dev/ai-agents/"},{"@type":"ListItem","position":3,"name":"Agent Harness","item":"https://agentguides.dev/ai-agents/agent-harness/"}]}]}
---

In 2024 people said an agent was "a model plus a loop plus tools". By 2026 that loop and everything around it has a name: the **harness**. The harness is the runtime that couples a model to the world. It runs the loop, executes tools, manages what the model sees, decides what it is allowed to do, and records what happened.

The term caught on in February 2026. Coding agents had grown into products where most of the engineering effort went into the code *around* the model rather than the prompt. Today the main model vendors each ship a harness you can embed: Anthropic's [Claude Agent SDK](https://code.claude.com/docs/en/agent-sdk/agent-loop), which is the Claude Code harness packaged as a library, and the [OpenAI Agents SDK](https://developers.openai.com/api/docs/guides/agents/sandboxes), which added a sandboxed, "model-native" harness in April 2026.

:::tip[The short version]
**Agent = model + harness.** Two agents running the same model can behave very differently because their harnesses differ. When an agent fails, check the harness (the context it was given, the tools it had, the stop condition) before blaming the model.
:::

## What a harness does

Every production harness we have looked at covers the same jobs. The names vary; the jobs don't.

| Subsystem | Job | Example in practice |
|---|---|---|
| **Loop** | Send context to the model, run any tool calls it returns, append results, repeat until it stops | `query()` in the Claude Agent SDK; `Runner.run()` in the OpenAI Agents SDK |
| **Tools** | Give the model typed actions: read/edit files, run shell commands, search, call APIs | Built-in `Read`, `Edit`, `Bash`, `Grep`; MCP servers; custom functions |
| **Context management** | Decide what goes into the window each turn, and shrink it when it fills | Auto-compaction, clearing old tool results, loading files on demand |
| **Instructions** | Load durable project rules the model must follow every turn | `CLAUDE.md`, `AGENTS.md`, system prompt presets |
| **Permissions** | Decide which tool calls run automatically, need approval, or are refused | Permission modes, allow/deny rules, approval callbacks |
| **Sandbox** | Contain the blast radius of code the agent runs | Containers, OS-level sandboxing, remote sandbox providers |
| **Hooks** | Run your code at fixed points in the loop: before a tool, after a tool, before compaction, on stop | `PreToolUse` hook that blocks writes to `.env` |
| **Delegation** | Split work across subagents with their own context windows | Subagents, handoffs, agents-as-tools |
| **Extensions** | Load reusable capabilities on demand | Agent Skills (`SKILL.md`), plugins, MCP |
| **Observability** | Record every turn, tool call, token count and cost | Transcripts, OpenTelemetry spans, per-run cost |

The loop itself is usually the smallest part. A [source-code study of eleven coding harnesses](https://arxiv.org/abs/2609.00006) (an arXiv preprint from September 2026 covering Claude Code, Codex CLI, Gemini CLI, OpenHands, Aider, OpenCode and others) found that **none of them imports a general-purpose agent framework**. All run a hand-written loop. Secondary write-ups of the paper also report that none retrieves code with vector embeddings; they use deterministic search (grep, glob, file reads).

## Subsystem by subsystem

### 1. The loop

The loop is covered in detail in [The Agentic Loop](/ai-agents/agent-loop/). The harness-level decisions are:

- **What counts as "done".** The default is "the model replied without calling a tool". Production harnesses add hard limits on top: a maximum number of turns, a spend cap, and a wall-clock timeout.
- **Parallel or sequential tools.** The Claude Agent SDK runs read-only tools (`Read`, `Glob`, `Grep`, read-only MCP tools) concurrently and state-changing tools (`Edit`, `Write`, `Bash`) one at a time.
- **Error handling.** A failed tool call goes back to the model as an error result rather than crashing the run. The model can usually recover if it can see what went wrong.

### 2. Tools

Tool design matters more than tool count. Patterns that hold up:

- **Few, general tools beat many narrow ones.** A shell and a file editor cover most of what a coding agent needs. Narrow tools are worth adding when they are much safer or much cheaper than the general one.
- **Tool descriptions are prompts.** Say when to use the tool, what it returns, and what it costs.
- **Load tool definitions lazily when you have many.** Tool search and MCP let the harness keep hundreds of tools available without putting every schema in context.

### 3. Context management

Long-running agents fill their context window. Harnesses respond in three ways:

1. **Compaction**: summarize older history and keep a verbatim recent tail. The eleven-harness study found that seven of the eleven had converged on this same design: when the token count crosses a threshold below the window limit, ask the model to summarize, keep the recent tail verbatim, and continue.
2. **Clearing**: drop stale tool results (a 5,000-line file read from 40 turns ago) while keeping the fact that the call happened.
3. **Isolation**: hand a sub-task to a subagent with a fresh context window. Only its final report comes back.

Compaction loses information. The Claude Agent SDK docs warn that "specific instructions from early in the conversation may not be preserved" and recommend putting persistent rules in `CLAUDE.md`, which is re-read rather than summarized. A 2026 preprint, ["The Compaction Cliff"](https://arxiv.org/abs/2608.22752), reports that safety rules stated only in the conversation degrade with each compaction round; recall fell from 53% after one round to 10% by round five. Put any rule that must survive in an instruction file or a hook, not in an early chat message.

### 4. Instruction files

`AGENTS.md` (the cross-vendor convention) and `CLAUDE.md` (Claude Code's) are plain Markdown files the harness loads into every session. They hold project conventions, commands, and rules. Write them as you would onboarding notes for a new engineer, keep them short, and remove rules the project has outgrown. A rule that conflicts with what the codebase actually does will be ignored, or worse, followed.

### 5. Permissions

A harness has to decide, for each tool call, whether to run it automatically, ask a human, or refuse. The Claude Agent SDK exposes six permission modes:

| Mode | Behaviour |
|---|---|
| `default` | Calls that need approval go to your `canUseTool` callback; with no callback they are denied |
| `acceptEdits` | File edits and common filesystem commands inside the working directory are auto-approved |
| `plan` | The agent plans; edits go to your callback |
| `dontAsk` | Never prompts; anything that would prompt is denied |
| `auto` | A model classifier reviews each action and allows or blocks it |
| `bypassPermissions` | Everything runs. The docs say to use it only in isolated environments |

Combine a mode with explicit rules (for example, allow `Bash(npm test)` and deny `Bash(rm *)`) rather than relying on one broad switch.

### 6. Sandboxing

Permissions decide *whether* an action runs; the sandbox decides *how much damage* it can do if it runs. The OpenAI Agents SDK's April 2026 update made this split explicit: the **harness** holds credentials and orchestrates, and a separate **sandbox** runs untrusted code. A *manifest* describes the workspace so the same agent can run on different sandbox providers, and snapshots let a run resume in a fresh container if the old one dies.

The eleven-harness study found that sandboxing was the area where harnesses differed most. Secondary coverage reports that two large open-source harnesses ship with no OS-level isolation at all. If you build on one of those, add a container yourself.

### 7. Hooks

Hooks are callbacks the harness runs at fixed points. They run in your process, cost no model tokens, and are deterministic, which makes them the right place for rules that must never be broken. The Claude Agent SDK documents events including `PreToolUse`, `PostToolUse`, `PreCompact`, `SubagentStart`/`SubagentStop` and `Stop`.

```python
from claude_agent_sdk import ClaudeAgentOptions, HookMatcher

async def protect_env_files(input_data, tool_use_id, context):
    path = input_data["tool_input"].get("file_path", "")
    if path.split("/")[-1].lower() == ".env":
        return {
            "hookSpecificOutput": {
                "hookEventName": input_data["hook_event_name"],
                "permissionDecision": "deny",
                "permissionDecisionReason": "Cannot modify .env files",
            }
        }
    return {}  # no opinion: normal permission rules apply

options = ClaudeAgentOptions(
    hooks={"PreToolUse": [HookMatcher(matcher="Write|Edit", hooks=[protect_env_files])]}
)
```

A matcher filters by tool name only. The hook above does not fire if the agent writes `.env` through `Bash`, so pair hooks with a sandbox for anything security-critical.

### 8. Delegation: subagents

A subagent is a second agent loop the main agent starts with a task description. It gets a fresh context window and its own tool set, and returns only a final report. Two reasons to use one:

- **Context isolation.** Reading 200 files to answer one question would flood the main agent's context. A subagent does the reading and returns the answer.
- **Parallelism.** Independent sub-tasks run at the same time.

```python
from claude_agent_sdk import query, ClaudeAgentOptions, AgentDefinition

options = ClaudeAgentOptions(
    allowed_tools=["Read", "Grep", "Glob"],
    agents={
        "code-reviewer": AgentDefinition(
            description="Reviews a diff for correctness bugs. Use after any non-trivial edit.",
            prompt="You are a code reviewer. Report only real bugs, with file:line.",
            tools=["Read", "Grep", "Glob"],
            model="sonnet",
            maxTurns=20,
        ),
    },
    max_budget_usd=5.00,
)

async for message in query(prompt="Review the changes on this branch", options=options):
    print(message)
```

In current Claude Agent SDK releases, subagents can spawn their own subagents. The defaults are three layers of depth (`CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH`) and 20 concurrent subagents (`CLAUDE_CODE_MAX_CONCURRENT_SUBAGENTS`). The spend cap covers subagent spend too. The OpenAI Agents SDK expresses the same idea as *handoffs* and *agents-as-tools*.

The scale this enables has grown quickly. Anthropic's [Claude Fable 5.2 announcement](https://www.anthropic.com/claude-fable-and-mythos-5-2) (November 9, 2026) describes a run that coordinated over 1,000 subagents for eight days to build a prototype operating system from an empty folder. At that scale the orchestration logic is the product.

### 9. Extensions: skills, plugins, MCP

Three open formats now carry across harnesses:

- **MCP** (Model Context Protocol) connects tools and data sources. See [What is MCP?](/mcp/).
- **Agent Skills** are folders with a `SKILL.md` file. Only the skill's short description sits in context; the full instructions load when the agent decides to use it ("progressive disclosure"). The eleven-harness study found `SKILL.md` skills in 9 of 11 harnesses, slightly ahead of MCP at 8 of 11.
- **`AGENTS.md`** instruction files, described above.

Because these formats are shared, a skill or MCP server you write once works in Claude Code, Codex, Gemini CLI and most open-source harnesses.

### 10. Observability

You cannot fix what you cannot see. At minimum, record for every run: the full transcript, each tool call with its arguments and result, token counts per turn, total cost, and the reason the run stopped. The Claude Agent SDK's final `ResultMessage` carries `subtype` (`success`, `error_max_turns`, `error_max_budget_usd`, …), `num_turns` and `total_cost_usd`. OpenTelemetry tracing is supported by both vendors' SDKs.

## Build, embed, or buy?

| Option | You own | Pick it when |
|---|---|---|
| **Write your own loop** on a model API | Everything | The task is narrow, you need full control, or you are learning. ~50 lines gets you started; see [A minimal working agent](/ai-agents/#a-minimal-working-agent) |
| **Embed a harness SDK** (Claude Agent SDK, OpenAI Agents SDK) | Hosting, tools, policy | You want compaction, permissions, hooks and subagents without writing them |
| **Managed agent platform** (e.g. Claude Managed Agents) | Configuration only | You want the vendor to run the loop *and* host the sandbox |
| **Framework** (LangGraph, CrewAI, AutoGen) | Graph/crew definitions | You need explicit, inspectable multi-step workflows more than an open-ended agent. See [Framework comparison](/frameworks/) |

## A harness checklist

Before you ship an agent, check that:

- [ ] The run has a turn limit, a spend cap and a timeout, and each produces a distinct, logged stop reason
- [ ] Rules that must always hold live in an instruction file or a hook, not in the first user message
- [ ] Irreversible actions (deploys, payments, emails, deletes) need approval or are blocked
- [ ] Code the agent runs is in a sandbox with no credentials it doesn't need
- [ ] Large read-heavy sub-tasks go to subagents so the main context stays small
- [ ] Tool errors return to the model as error results, not exceptions
- [ ] Every run produces a transcript and a cost figure you can look up later
- [ ] There is a check at the end (tests, a reviewer subagent, a validator) rather than trusting "I'm done"

## Sources

- Anthropic, [How the agent loop works](https://code.claude.com/docs/en/agent-sdk/agent-loop), [Subagents in the SDK](https://code.claude.com/docs/en/agent-sdk/subagents) and [Hooks](https://code.claude.com/docs/en/agent-sdk/hooks), Claude Agent SDK documentation
- OpenAI, [Sandbox Agents](https://developers.openai.com/api/docs/guides/agents/sandboxes), Agents SDK documentation
- Barbaste et al., [Harness Engineering: Anatomy, Architecture, and Evolution of Coding Agents](https://arxiv.org/abs/2609.00006), arXiv preprint, September 2026 (not peer-reviewed; several figures above are as reported in secondary coverage)
- [The Compaction Cliff in Long-Running AI Agent Memory](https://arxiv.org/abs/2608.22752), arXiv preprint, 2026
- Anthropic, [Introducing Claude Fable 5.2 and Claude Mythos 5.2](https://www.anthropic.com/claude-fable-and-mythos-5-2), November 9, 2026

## Continue reading

- **[The Agentic Loop](/ai-agents/agent-loop/)**: turns, stop conditions, compaction and budgets, with working code
- **[Tokens and Context Windows](/ai-agents/tokens-context/)**: how context fills up and what to do about it
- **[Multi-Agent Pipelines](/agentic-workflows/multi-agent/)**: orchestrator, fan-out and subagent topologies
