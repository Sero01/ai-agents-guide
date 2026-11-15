---
title: "AI Agents in Late 2026: What Changed Between July and November"
description: "A dated summary of agent-relevant developments from July to mid-November 2026: new frontier and open-weight models, 1,000-subagent runs, harness standardization, compaction research, and what each means for people building agents."
author: Parvez Ahmed
date: 2026-11-15
lastUpdated: 2026-11-15
sidebar:
  label: AI Agents in Late 2026
head:
  - tag: meta
    attrs:
      property: og:type
      content: article
  - tag: meta
    attrs:
      property: og:title
      content: "AI Agents in Late 2026: What Changed Between July and November"
  - tag: meta
    attrs:
      property: og:url
      content: https://agentguides.dev/research/ai-agents-state-late-2026/
  - tag: meta
    attrs:
      property: article:published_time
      content: "2026-11-15"
  - tag: link
    attrs:
      rel: canonical
      href: https://agentguides.dev/research/ai-agents-state-late-2026/
  - tag: script
    attrs:
      type: application/ld+json
    content: |
      {"@context":"https://schema.org","@graph":[{"@type":"Article","headline":"AI Agents in Late 2026: What Changed Between July and November","description":"A dated summary of agent-relevant developments from July to mid-November 2026: new models, 1,000-subagent runs, harness standardization and compaction research.","url":"https://agentguides.dev/research/ai-agents-state-late-2026/","datePublished":"2026-11-15","dateModified":"2026-11-15","author":{"@type":"Person","name":"Parvez Ahmed","url":"https://github.com/Sero01"},"publisher":{"@type":"Person","name":"Parvez Ahmed"},"keywords":"AI agents 2026, Claude Fable 5.2, GPT-6, Gemini 4, agent harness, long-horizon agents, open-weight models"},{"@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://agentguides.dev/"},{"@type":"ListItem","position":2,"name":"Research","item":"https://agentguides.dev/research/ai-agents-state-late-2026/"}]}]}
---

From July to mid-November 2026, every major lab shipped a new model generation, the longest published agent runs grew from hours to days, and the runtime around the model (the harness) became something you can buy off the shelf. This page sums up what changed and what it means if you build agents. Every item has a date and a source. Vendor benchmark figures are the vendor's own and have not been reproduced independently.

:::note[How this page is maintained]
Covers **July 1 – November 15, 2026**. Items we could not confirm from a primary source are left out rather than hedged. Model prices and benchmark cells live on the [AI Models Leaderboard](/leaderboard/), which is updated separately.
:::

## The five shifts that matter for builders

1. **Agent runs are now measured in days and thousands of subagents.** Anthropic describes a single Claude Fable 5.2 run that coordinated more than 1,000 subagents for eight days. Orchestration, not single-turn quality, is where the ceiling is.
2. **The harness is a product.** Claude Agent SDK, OpenAI Agents SDK and managed agent platforms give you compaction, permissions, sandboxes, hooks and subagents out of the box. Writing your own loop is now a choice, not a requirement. See [What Is an Agent Harness?](/ai-agents/agent-harness/)
3. **Mid-tier models got much cheaper.** Opus-class capability fell to $4/$20 per million tokens, Sonnet-class to $2/$10, and small models to $0.10/$0.50. That changes the maths of multi-agent designs where most tokens go to workers.
4. **Open weights caught up on context length.** Several October open-weight releases ship 1M-token windows, which makes self-hosted long-running agents practical.
5. **Benchmarks moved to agentic tasks.** New launches report long-horizon agentic suites (Terminal-Bench 4.0, DeepSWE, FrontierSWE, OSWorld, Remote Labor Index) rather than single-question tests, which most frontier models now score near the top of.

## Timeline

### Frontier models

| Date | Release | Why it matters for agents | Source |
|---|---|---|---|
| Sep 1 | **Claude Fable 5.1** (Anthropic), $10/$50 | Long-horizon flagship; successor shipped ten weeks later | [Review](/reviews/claude-fable-5/) |
| Sep 2 / Oct 13 | **Gemini 3.8 Flash**, **Gemini 4 Argon** (Google) | Argon is Google's new flagship at an introductory $2/$10, rising to $4/$20 on Dec 1 | [Leaderboard](/leaderboard/) |
| Sep 3 | **GPT-6 Astra** (OpenAI), 1.05M context, $10/$50 | OpenAI's agentic flagship | [Review](/reviews/gpt-6-astra-review/) |
| Sep 21 | **Grok 4.7** (xAI), 500K context, $2/$6 | | [Leaderboard](/leaderboard/) |
| Sep 22 | **Claude Opus 5.5** (Anthropic), 1M context, $4/$20 | Cheaper than Opus 5; thinking always on, effort defaults to `medium` | [Anthropic](https://www.anthropic.com/news) |
| Sep 22 – Oct 26 | **GPT-6 Sol, GPT-6.1 Sol, GPT-6 Luna, GPT-6.1 Terra** (OpenAI) | A full price ladder from $0.10/$0.50 (Luna) to $2/$10 (Sol) | [Leaderboard](/leaderboard/) |
| Sep 28 | **Claude Sonnet 5.5** (Anthropic), $2/$10 | Everyday coding and agent workhorse | [Anthropic](https://www.anthropic.com/news) |
| Oct 7 | **Claude Haiku 5.5** (Anthropic), $0.10/$0.50 | 1M context at small-model prices; a natural worker for subagent fan-out | [Anthropic](https://www.anthropic.com/news) |
| Oct 28 | **Gemini 4 Carbon** (Google), limited access | Restricted to selected security partners; no public API | [Leaderboard](/leaderboard/) |
| Nov 9 | **Claude Fable 5.2 / Mythos 5.2** (Anthropic), $8/$40 | Same model; Mythos lacks some cyber/bio safeguards and is limited to vetted organizations | [Anthropic](https://www.anthropic.com/claude-fable-and-mythos-5-2) |

### Open-weight models

| Date | Release | Notes |
|---|---|---|
| Sep 11 | **Atria Dawn Preview** (Shanghai AI Lab) | 744B mixture-of-experts tuned for agentic work. [Review](/reviews/atria-dawn-preview-review/) |
| Oct 6 / Oct 29 | **Mistral Large 4** | 1M context; preview in October, weights released October 29 |
| Oct 15 | **Muse Spark Open** (Meta) | 1M context, text/vision/audio, open weights under the Muse Model License |
| Oct 17 | **DeepSeek V4.1 Flash 1017** | 1M context, 384K max output, $0.15/$0.60 off-peak |
| Oct 19 | **MiniMax M3.1 Flash** | 1M context, $0.15/$0.60 |
| Oct 24 | **Kimi K3.1 Pro** (Moonshot AI) | Released via API first; Moonshot promised weights by November 4 |

## Claude Fable 5.2: the long-horizon numbers

The November 9 announcement is the most agent-focused launch of the period. The claims are Anthropic's own:

- **Scale of a single run.** An Anthropic engineer had Fable 5.2 build a prototype operating system from an empty folder; it coordinated over 1,000 subagents for eight days and produced an OS that boots on a laptop.
- **Formal mathematics.** About 1,000 Fable 5.2 agents formalized Fermat's Last Theorem in Lean in roughly 30 hours, against 11 days for an earlier internal research model. Anthropic edited this section on November 11 to describe more accurately what information the agents were given; the footnote lists the starting statements, sketch, definitions and lemmas supplied.
- **Production migration.** A team of agents on a pre-release build migrated a production service from Python to Rust; the new service starts about 26× faster.
- **Advisor and orchestrator roles.** Fable 5.2 can act as an *advisor* that smaller models consult, or an *orchestrator* that hands simpler tasks to smaller models. This is the expensive-planner, cheap-worker design many teams were already building by hand.
- **Vendor-reported benchmarks** (Fable 5.2 vs Opus 5.5 vs GPT-6 Astra): FrontierSWE v2 69.9% / 62.3% / 65.5%; OSWorld 2.1 (offline, partial) 89.3% / 87.2% / 79.5%; Remote Labor Index 41.3% / 21.3% / 20.8%. On AutomationBench, Gemini 4 Carbon (53.9%) scored above Fable 5.2 (51.4%).
- **Price.** $8/$40 per million tokens, down from $10/$50 for Fable 5.1. Anthropic still recommends Opus 5.5 as the daily driver for most coding and knowledge work.

**What it means for you:** if your agent already uses subagents, the advisor/orchestrator split is worth testing: a Fable- or Opus-class model plans and reviews, while Sonnet or Haiku workers do the reading and editing. Measure cost per completed task, not cost per call.

## The harness layer standardized

- **Nested subagents with limits.** Current Claude Agent SDK releases let subagents spawn subagents, by default up to three layers deep with 20 running at once, and the spend cap (`max_budget_usd`) covers the whole tree. ([Docs](https://code.claude.com/docs/en/agent-sdk/subagents))
- **Sandbox-native harnesses.** OpenAI's Agents SDK split the *harness* (credentials, orchestration) from the *sandbox* (untrusted execution) in April. Portable workspace manifests and snapshots let a run move between sandbox providers and survive a container dying. ([Docs](https://developers.openai.com/api/docs/guides/agents/sandboxes))
- **Shared formats won.** MCP, Agent Skills (`SKILL.md`) and `AGENTS.md` now work across vendors. A September source-code study of eleven coding harnesses found skills in 9 of 11 and MCP in 8 of 11. It also found that none imports a general-purpose agent framework; all run a hand-written loop. ([arXiv 2609.00006](https://arxiv.org/abs/2609.00006), preprint)

## Research worth knowing

- **Compaction has a cost.** ["The Compaction Cliff"](https://arxiv.org/abs/2608.22752) reports that rules stated in the conversation degrade with each round of context summarization; recall fell from 53% to 10% over five rounds. Keep critical rules in instruction files or hooks.
- **Training with compaction.** [CompactionRL](https://arxiv.org/abs/2607.05378) trains agents with compaction inside reinforcement-learning rollouts, so the model learns to work with its own summaries rather than despite them.
- **Alternatives to summarization.** ["Beyond Compaction"](https://arxiv.org/abs/2606.11213) proposes structured eviction (dropping whole categories of stale context) as a cheaper, more predictable option.
- **Harness research.** [Agentic Harness Engineering](https://arxiv.org/abs/2604.25850) (April) proposes improving coding-agent harnesses automatically, driven by observability data rather than hand-tuning.

All four are preprints and have not been peer-reviewed.

## What to update in your own stack

- **Re-run your effort sweep.** Opus 5.5 defaults to `medium` effort and Sonnet 5.5 recalibrated its levels. Settings carried over from older models are probably wrong.
- **Move rules out of the chat.** Anything that must hold across a long run belongs in `CLAUDE.md`/`AGENTS.md` or a `PreToolUse` hook.
- **Price your fan-out.** With $0.10/$0.50 workers available, a design that sends reading to many small-model subagents is often cheaper *and* better than one big context.
- **Handle refusals explicitly.** Current frontier models can return `stop_reason: "refusal"`. Check for it in your loop and configure a fallback model. See [The Agentic Loop](/ai-agents/agent-loop/#every-way-a-loop-stops).
- **Add a verification step.** Longer runs mean more chances to declare success too early. Run tests or a reviewer subagent before accepting "done".

## Sources

- Anthropic, [Introducing Claude Fable 5.2 and Claude Mythos 5.2](https://www.anthropic.com/claude-fable-and-mythos-5-2), November 9, 2026 (edited November 11)
- Anthropic, [Newsroom](https://www.anthropic.com/news) (Opus 5.5, Sonnet 5.5, Haiku 5.5 release dates)
- Anthropic, [Subagents in the SDK](https://code.claude.com/docs/en/agent-sdk/subagents)
- OpenAI, [Sandbox Agents](https://developers.openai.com/api/docs/guides/agents/sandboxes)
- AgentGuide [AI Models Leaderboard](/leaderboard/), refreshed 2026-11-02, for release dates, context windows and prices of non-Anthropic models (each cell links to its vendor source)
- arXiv preprints linked inline above
