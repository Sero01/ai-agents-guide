---
title: "The Agentic Loop: Turns, Stop Conditions, Compaction, and Budgets"
description: "How the agent loop works in current agent SDKs: what a turn is, every way a loop can stop, parallel tool calls, context compaction, spend and turn budgets, and verification. Working Python for a manual loop, the Anthropic Tool Runner, and the Claude Agent SDK."
author: Parvez Ahmed
date: 2026-11-15
lastUpdated: 2026-11-15
sidebar:
  order: 3
head:
  - tag: meta
    attrs:
      property: og:type
      content: article
  - tag: meta
    attrs:
      property: og:title
      content: "The Agentic Loop: Turns, Stop Conditions, Compaction, and Budgets"
  - tag: meta
    attrs:
      property: og:url
      content: https://agentguides.dev/ai-agents/agent-loop/
  - tag: meta
    attrs:
      property: article:published_time
      content: "2026-11-15"
  - tag: link
    attrs:
      rel: canonical
      href: https://agentguides.dev/ai-agents/agent-loop/
  - tag: script
    attrs:
      type: application/ld+json
    content: |
      {"@context":"https://schema.org","@graph":[{"@type":"TechArticle","headline":"The Agentic Loop: Turns, Stop Conditions, Compaction, and Budgets","description":"How the agent loop works in current agent SDKs: turns, stop conditions, parallel tool calls, context compaction, budgets and verification, with working Python.","url":"https://agentguides.dev/ai-agents/agent-loop/","datePublished":"2026-11-15","dateModified":"2026-11-15","author":{"@type":"Person","name":"Parvez Ahmed","url":"https://github.com/Sero01"},"publisher":{"@type":"Person","name":"Parvez Ahmed"},"keywords":"agentic loop, agent loop, tool use loop, stop_reason, context compaction, task budget, Claude Agent SDK, Tool Runner, long-running agents"},{"@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://agentguides.dev/"},{"@type":"ListItem","position":2,"name":"AI Agents","item":"https://agentguides.dev/ai-agents/"},{"@type":"ListItem","position":3,"name":"Agentic Loop","item":"https://agentguides.dev/ai-agents/agent-loop/"}]}]}
---

Every agent runs a loop. The model gets the context, replies with text and/or tool calls, the harness runs the tools and appends the results, and the model goes again. The loop ends when the model replies without calling a tool, or when the harness stops it.

That description has not changed since ReAct. What has changed is how long the loop runs. In 2024 a typical agent run lasted a few turns. In 2026, coding and research agents routinely run for hours, and the longest published runs last days. At that length the interesting questions are no longer "how do I call a tool" but:

- What exactly is one turn, and what does it cost?
- What are *all* the ways the loop can stop, and do I handle each one?
- What happens when the context window fills up?
- How do I cap spend without cutting the agent off mid-thought?
- How do I know the agent actually finished?

This page answers each, with code. For the runtime around the loop (permissions, sandboxing, hooks, subagents), see [What Is an Agent Harness?](/ai-agents/agent-harness/).

## Anatomy of one turn

The Claude Agent SDK documentation defines a turn as "one pass through the loop":

1. **Assemble context**: system prompt, tool definitions, instruction files, conversation so far.
2. **Call the model.** It returns text, one or more tool calls, or both. On current models it usually also thinks first; that reasoning happens inside the call.
3. **Check why it stopped** (`stop_reason`). This step is often skipped, and skipping it causes bugs.
4. **Run the tools.** Calls that only read can run in parallel; calls that change state should run one at a time.
5. **Append results**: the assistant message *as returned*, then all tool results together in one user message.
6. **Decide whether to continue.** Check limits, budget and context size.

Two rules from step 5 are easy to get wrong:

- **Append the whole assistant message, not just its text.** It contains the tool-call blocks, thinking blocks and (if enabled) compaction blocks the API needs to see again on the next request.
- **Return every tool result from one turn in a single message.** Splitting them across messages works, but it teaches the model to stop making parallel calls.

## Every way a loop stops

| Stop | Where it comes from | What to do |
|---|---|---|
| Model finished (`end_turn`) | Model | Read the final text. Optionally verify it (see below) |
| Model wants tools (`tool_use`) | Model | Run them, append results, continue |
| Paused (`pause_turn`) | API, during long server-side tool use | Append the response as-is and call again; nothing to execute |
| Hit `max_tokens` | API | The reply was cut off. Raise `max_tokens` or stream; don't run a half-written tool call |
| Refusal (`refusal`) | Safety classifiers | Read `stop_details`; fall back or report. Don't treat it as success |
| Turn limit | Harness | Report "ran out of turns" with what was done so far |
| Spend/token budget | Harness or API | Report what was done; resume with a new budget if worthwhile |
| Wall-clock timeout | Harness | Same; long tasks should checkpoint progress to disk |
| Tool or API error | Environment | Return tool errors to the model; retry transient API errors with backoff |

A loop that only checks `end_turn` will spin forever on `max_tokens`, or treat a refusal as a finished answer. Handle each case on purpose.

## A manual loop that handles every stop

This is the loop written by hand against the Anthropic Messages API, using `claude-opus-5-5`. Opus 5.5 always uses adaptive thinking and defaults to `medium` effort, so the example sets `high` effort explicitly for agentic work.

```python
import json
import subprocess
import anthropic

client = anthropic.Anthropic()

TOOLS = [
    {
        "name": "run_tests",
        "description": "Run the project's test suite and return the last 4,000 characters of output. "
                       "Use after every code change. Takes ~30 seconds.",
        "input_schema": {
            "type": "object",
            "properties": {"path": {"type": "string", "description": "Test file or directory; '.' for all tests"}},
            "required": ["path"],
            "additionalProperties": False,
        },
        "strict": True,
    },
    {
        "name": "read_file",
        "description": "Read a UTF-8 text file from the repository and return its contents.",
        "input_schema": {
            "type": "object",
            "properties": {"path": {"type": "string"}},
            "required": ["path"],
            "additionalProperties": False,
        },
        "strict": True,
    },
]

def execute(name: str, args: dict) -> str:
    if name == "run_tests":
        out = subprocess.run(["pytest", args["path"]], capture_output=True, text=True, timeout=300)
        return (out.stdout + out.stderr)[-4000:]
    if name == "read_file":
        with open(args["path"], encoding="utf-8") as f:
            return f.read()
    raise ValueError(f"unknown tool {name}")

def run_agent(task: str, max_turns: int = 40) -> str:
    messages = [{"role": "user", "content": task}]

    for turn in range(max_turns):
        response = client.beta.messages.create(
            model="claude-opus-5-5",
            max_tokens=16000,
            output_config={"effort": "high"},
            # If a safety classifier declines, re-run on a fallback model chosen by refusal category.
            betas=["server-side-fallback-2026-07-01"],
            fallbacks="default",
            tools=TOOLS,
            messages=messages,
        )

        if response.stop_reason == "refusal":
            category = response.stop_details.category if response.stop_details else None
            return f"Stopped: request declined (category: {category})"

        if response.stop_reason == "max_tokens":
            return "Stopped: reply hit max_tokens. Raise the limit or stream the response."

        # Always append the full content: tool calls, thinking and compaction blocks included.
        messages.append({"role": "assistant", "content": response.content})

        if response.stop_reason == "pause_turn":
            continue  # nothing to execute; send it back to let the model resume

        if response.stop_reason == "end_turn":
            return "".join(b.text for b in response.content if b.type == "text")

        # stop_reason == "tool_use": run every call, return all results in ONE message.
        results = []
        for block in response.content:
            if block.type != "tool_use":
                continue
            try:
                output = execute(block.name, block.input)
                results.append({"type": "tool_result", "tool_use_id": block.id, "content": output})
            except Exception as exc:  # the model can usually recover if it sees the error
                results.append({"type": "tool_result", "tool_use_id": block.id,
                                "content": f"Error: {exc}", "is_error": True})
        messages.append({"role": "user", "content": results})

    return f"Stopped: reached {max_turns} turns without finishing."
```

What to notice:

- Every exit returns a distinct reason, so your logs say *why* a run ended.
- `strict: True` on each tool guarantees the arguments match the schema.
- `fallbacks="default"` reruns a refused request on a fallback model the API picks by refusal category. If the fallback also refuses, `stop_reason` is still `refusal`.
- Tool exceptions become `is_error` results instead of crashing the loop.

### The same loop with the Tool Runner

If you don't need that much control, the Anthropic SDK's Tool Runner (beta) runs the loop for you. You write the tools as typed functions:

```python
import anthropic
from anthropic import beta_tool

client = anthropic.Anthropic()

@beta_tool
def read_file(path: str) -> str:
    """Read a UTF-8 text file from the repository.

    Args:
        path: Path relative to the repository root.
    """
    with open(path, encoding="utf-8") as f:
        return f.read()

runner = client.beta.messages.tool_runner(
    model="claude-opus-5-5",
    max_tokens=16000,
    tools=[read_file],
    messages=[{"role": "user", "content": "Summarise what src/app.py does."}],
)

for message in runner:  # one BetaMessage per turn; stops when Claude stops calling tools
    print(message.stop_reason)
```

### The same loop with the Claude Agent SDK

The Claude Agent SDK runs the full Claude Code loop, with built-in file, shell and search tools. You set limits as options and read the outcome from the final `ResultMessage`:

```python
import asyncio
from claude_agent_sdk import query, ClaudeAgentOptions, ResultMessage

async def main():
    options = ClaudeAgentOptions(
        allowed_tools=["Read", "Grep", "Glob", "Bash(pytest *)"],
        permission_mode="acceptEdits",
        max_turns=60,
        max_budget_usd=10.00,  # covers subagent spend too
        effort="high",
    )
    async for message in query(prompt="Fix the failing test in tests/test_dates.py", options=options):
        if isinstance(message, ResultMessage):
            # subtype: success | error_max_turns | error_max_budget_usd | error_during_execution | ...
            print(message.subtype, message.num_turns, message.total_cost_usd)
            if message.subtype == "success":
                print(message.result)

asyncio.run(main())
```

## Parallel tool calls

Current models often request several tools in one turn, for example reading five files at once. Run independent read-only calls concurrently. Run calls that change state (edits, shell commands, writes) sequentially, in the order given. The Claude Agent SDK applies exactly this rule by default. Custom tools run sequentially unless marked read-only.

## When the context window fills

A 1M-token window sounds endless until an agent reads a large codebase or runs for a day. You have three tools, best used together:

**1. Server-side compaction.** The API summarizes earlier context once input passes a trigger threshold (150K tokens by default) and returns a `compaction` block that replaces the old history on the next request. It is a beta feature on current Claude models:

```python
response = client.beta.messages.create(
    betas=["compact-2026-01-12"],
    model="claude-opus-5-5",
    max_tokens=16000,
    tools=TOOLS,
    messages=messages,
    context_management={"edits": [{"type": "compact_20260112"}]},
)
messages.append({"role": "assistant", "content": response.content})  # keeps the compaction block
```

The Claude Agent SDK compacts automatically, emits a `compact_boundary` system message when it does, and fires a `PreCompact` hook first, which you can use to archive the full transcript.

**2. Clearing old tool results.** Context editing (`clear_tool_uses_20250919`) removes stale tool outputs while keeping a record that the calls happened. It is cheaper than summarizing and loses less. Use it when most of the context is old file reads.

**3. Subagents.** Hand read-heavy sub-tasks to a subagent with its own window. Only its final report enters the main context.

:::caution[Compaction forgets]
Summaries drop detail, and they drop more with each round. A 2026 preprint, ["The Compaction Cliff"](https://arxiv.org/abs/2608.22752), measured recall of safety rules stated in-conversation falling from 53% after one compaction round to 10% after five. Keep must-follow rules in an instruction file (`CLAUDE.md`, `AGENTS.md`) or enforce them with a hook. Don't rely on the model remembering something it was told 300 turns ago.
:::

## Budgets: stopping gracefully instead of abruptly

A turn limit stops the loop from outside, and the model doesn't know it is coming. Two newer mechanisms let the model pace itself:

- **Task budgets** (Anthropic API, beta): give the model a token ceiling for the whole agentic task. The server shows it a countdown, so it can wrap up and report rather than be cut off. Unlike `max_tokens`, the model knows about it.
- **Spend caps** (Claude Agent SDK `max_budget_usd`, OpenAI and Managed Agents session budgets): a hard dollar limit enforced by the harness. The run ends with a distinct result type (`error_max_budget_usd`), so you can tell "out of money" from "failed".

```python
with client.beta.messages.stream(
    model="claude-opus-5-5",
    max_tokens=128000,
    output_config={"effort": "high", "task_budget": {"type": "tokens", "total": 200000}},
    betas=["task-budgets-2026-03-13"],
    tools=TOOLS,
    messages=messages,
) as stream:
    response = stream.get_final_message()
```

Judge cost per *completed task*, not per request. An agent at lower effort that needs three retries is not cheaper than one at higher effort that finishes first time.

## Verification: "done" is a claim, not a fact

When the loop ends on `end_turn`, the model has only *said* it is done. Long-running agents need a check that doesn't rely on the agent's own word:

- **Executable checks**: tests, type checker, linter, build. Run them at the end in your code, not as an optional tool.
- **A reviewer subagent** with a fresh context and a narrow brief ("find correctness bugs in this diff").
- **A rubric grader**: a separate model call that scores the output against explicit criteria and sends it back for another pass if it fails.
- **A human approval step** for anything irreversible.

If the check fails, append its output to the conversation and continue the loop. That is still one agent run, not a new one.

## Failure modes to watch in long loops

| Symptom | Likely cause | Fix |
|---|---|---|
| Same tool call repeated with same arguments | Tool result unhelpful or ambiguous | Return clearer errors; detect repeats in the harness and break |
| Agent "forgets" an early instruction | Instruction lived in chat history and was compacted away | Move it to an instruction file or a hook |
| Declares success, tests still fail | No verification step | Run checks in the harness after `end_turn` |
| Costs spike on some runs | Unbounded loop, huge tool outputs | Spend cap, truncate tool output, clear old results |
| Stops making parallel calls | Tool results split across messages | Return all results from one turn in one message |
| Edits files it shouldn't | Permissions too broad | Narrow allow rules; `PreToolUse` deny hook; sandbox |

## Sources

- Anthropic, [How the agent loop works](https://code.claude.com/docs/en/agent-sdk/agent-loop), Claude Agent SDK documentation
- Anthropic, [Automatic context compaction](https://platform.claude.com/cookbook/tool-use-automatic-context-compaction), Claude cookbook
- [The Compaction Cliff in Long-Running AI Agent Memory](https://arxiv.org/abs/2608.22752), arXiv preprint, 2026
- Yao et al., [ReAct: Synergizing Reasoning and Acting in Language Models](https://arxiv.org/abs/2210.03629), 2022

## Continue reading

- **[What Is an Agent Harness?](/ai-agents/agent-harness/)**: the runtime around the loop
- **[Agent Design Patterns](/ai-agents/patterns/)**: ReAct, reflection, plan-and-execute and orchestrator patterns
- **[Tokens and Context Windows](/ai-agents/tokens-context/)**: how context is counted and managed
