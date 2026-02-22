---
title: Multi-Agent Pipelines
description: Patterns for building reliable workflows with multiple AI agents.
---

# Multi-Agent Pipelines

A multi-agent pipeline coordinates multiple AI agents, each with a specific role, to complete complex tasks.

## Why Multiple Agents?

A single agent doing everything compounds errors and burns context. Multiple agents with clear responsibilities:

- **Reduce context bloat**: Each agent has a focused context window
- **Isolate failures**: One agent failing doesn’t cascade to others
- **Enable parallelism**: Independent agents run concurrently
- **Specialize**: Each agent is prompted for its specific task

## Core Patterns

### Orchestrator + Workers

The most common pattern. An orchestrator agent breaks down the goal and dispatches subtasks to worker agents.

```
Orchestrator
  ├── Worker A (research)
  ├── Worker B (writing)
  └── Worker C (review)
```

The orchestrator doesn’t do the work — it manages the workflow.

### Pipeline (Sequential)

Agents form a chain. Each agent’s output becomes the next agent’s input.

```
Scraper → Cleaner → Analyzer → Reporter
```

Simple to reason about. Fails if any stage fails.

### Parallel Fan-Out

One agent spawns multiple agents to work on subtasks simultaneously, then aggregates results.

```
         ┌─ Agent A (task 1)
Router ─┤─ Agent B (task 2) ─── Aggregator
         └─ Agent C (task 3)
```

Good for independent subtasks. Requires careful aggregation.

### Evaluator-Optimizer Loop

An executor agent produces output; an evaluator agent scores it. If below threshold, the executor revises.

```
Executor → Evaluator → (pass?) → Output
              ↓ (fail)
           Feedback → Executor
```

Useful for quality-sensitive tasks like code generation or content writing.

## The 3-Layer Architecture

This repo implements a practical multi-agent approach:

| Layer | Role | Implementation |
|-------|------|----------------|
| Directives | Goal definition | Markdown SOPs |
| Orchestrator | Coordination | AI agent (Claude Code) |
| Execution | Implementation | Python scripts |

The key insight: **keep the AI in the coordination layer, not the execution layer**. Execution is done by deterministic code.

This addresses the compounding error problem: deterministic scripts are 100% reliable (or they fail loudly), so reliability only compounds across orchestration decisions.

## Communication Between Agents

Agents communicate through:

- **Shared state** (files, databases): Simple, persistent, inspectable
- **Direct messages**: One agent calls another directly (MCP, function calls)
- **Message queues**: Decoupled, async, scalable (good for production)
- **Context passing**: Output of one is input to the next

## Failure Handling

### Retry with backoff
Transient failures (rate limits, network) resolve with simple retry.

### Checkpoint and resume
Save intermediate state so a failed pipeline can restart from the last checkpoint.

### Fallback agents
If primary agent fails, try an alternative (different model, different approach).

### Human-in-the-loop
For high-stakes decisions, pause and ask a human before continuing.

## When Not to Use Multi-Agent

- Simple tasks that fit in one context window
- When coordination overhead exceeds the benefit
- When you need low latency (orchestration adds round trips)
- When you’re still prototyping (start simple, add complexity only when needed)
