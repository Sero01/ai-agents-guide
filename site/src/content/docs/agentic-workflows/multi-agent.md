---
title: "Multi-Agent Pipelines: Sequential, Parallel & Hierarchical Topologies (2026)"
description: "Guide to multi-agent pipelines. Learn sequential, parallel, and hierarchical agent topologies with Python code examples."
sidebar:
  order: 2
---

Multi-agent systems split a complex task across specialized agents that work in parallel, in sequence, or in a hierarchy.

## Topologies

### Sequential Pipeline

Agents run one after another; each builds on the previous output.

```
[Researcher] → [Analyst] → [Writer] → [Editor]
```

### Parallel Fan-Out

One orchestrator spawns multiple agents simultaneously; results are merged.

```
              ┌─[Agent A]─┐
Orchestrator ─┼─[Agent B]─┼─▶ Merge ─▶ Result
              └─[Agent C]─┘
```

**When to use:** Independent subtasks (e.g., research 5 competitors simultaneously).

### Hierarchical (Orchestrator + Specialists)

An orchestrator plans and delegates; specialists execute.

```
Orchestrator
  ├── delegates to ResearchAgent
  ├── delegates to DataAgent
  └── synthesizes results
```

## Communication Patterns

**Shared message queue:** Agents publish and subscribe to a message bus.

**Direct handoff:** One agent's output is passed directly as input to the next.

**Shared state store:** All agents read/write to a central state object (e.g., a dict or database record).

```python
# Shared state example
state = {
    "task": "Analyze AAPL Q4 earnings",
    "research": None,      # populated by ResearchAgent
    "analysis": None,      # populated by AnalysisAgent
    "final_report": None,  # populated by WriterAgent
}
```

## Code Example: Simple Parallel Agents

```python
import asyncio
import anthropic

client = anthropic.Anthropic()

async def run_agent(task: str, system: str) -> str:
    response = client.messages.create(
        model="claude-opus-4-6",
        max_tokens=1024,
        system=system,
        messages=[{"role": "user", "content": task}]
    )
    return response.content[0].text

async def multi_agent_research(topic: str) -> dict:
    # Run three specialized agents in parallel
    results = await asyncio.gather(
        run_agent(f"Find recent news about {topic}", "You are a news researcher."),
        run_agent(f"Summarize technical aspects of {topic}", "You are a technical analyst."),
        run_agent(f"List key players in {topic}", "You are a market researcher."),
    )
    return {
        "news": results[0],
        "technical": results[1],
        "players": results[2],
    }
```
