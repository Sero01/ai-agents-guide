---
title: "Multi-Agent Pipelines: Sequential, Parallel, and Hierarchical Topologies"
description: "How to build multi-agent pipelines. Covers sequential, parallel fan-out, and hierarchical agent topologies with complete Python code examples."
sidebar:
  order: 2
head:
  - tag: script
    attrs:
      type: application/ld+json
    content: |
      {"@context":"https://schema.org","@type":"TechArticle","headline":"Multi-Agent Pipelines: Sequential, Parallel, and Hierarchical Topologies","description":"How to build multi-agent pipelines. Covers sequential, parallel fan-out, and hierarchical agent topologies with complete Python code examples.","url":"https://agentguides.dev/agentic-workflows/multi-agent/","datePublished":"2026-01-01","dateModified":"2026-02-23","author":{"@type":"Person","name":"Parvez Ahmed"},"publisher":{"@type":"Person","name":"Parvez Ahmed"},"keywords":"multi-agent pipelines, multi-agent systems, AI agent topologies, sequential agents, parallel agents, hierarchical agents, AI automation"}
  - tag: script
    attrs:
      type: application/ld+json
    content: |
      {"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://agentguides.dev/"},{"@type":"ListItem","position":2,"name":"Agentic Workflows","item":"https://agentguides.dev/agentic-workflows/"},{"@type":"ListItem","position":3,"name":"Multi-Agent Pipelines","item":"https://agentguides.dev/agentic-workflows/multi-agent/"}]}
---

Multi-agent systems split a complex task across specialized agents that work in parallel, in sequence, or in a hierarchy. The fundamental motivation is specialization: different agents can have different system prompts, different tool access, and different models, each optimized for its specific role in the pipeline.

A single generalist agent is easier to build but harder to make excellent at any one thing. A team of specialized agents takes more engineering but can produce higher-quality results on complex tasks.

## Topologies

### Sequential Pipeline

Agents run one after another; each builds on the previous output.

```
[Researcher] → [Analyst] → [Writer] → [Editor]
```

Sequential is the simplest topology. Each agent receives the previous agent's output as its input. The workflow is predictable and easy to debug — at any point, you can inspect what was passed between stages and identify where quality degraded.

Use sequential pipelines when tasks have a natural dependency order. Research must happen before analysis, analysis before writing. If stages genuinely depend on each other, sequential is the right choice.

### Parallel Fan-Out

One orchestrator spawns multiple agents simultaneously; results are merged.

```
              ┌─[Agent A]─┐
Orchestrator ─┼─[Agent B]─┼─▶ Merge ─▶ Result
              └─[Agent C]─┘
```

**When to use:** Independent subtasks (e.g., research 5 competitors simultaneously). If the subtasks don't depend on each other, running them in parallel cuts total time by the number of parallel agents — 5 agents running in parallel instead of sequentially can finish in 1/5 the time.

The challenge with parallel fan-out is the merge step: how do you combine results from multiple agents into a coherent output? Sometimes the merge is simple (concatenate results, then summarize). Sometimes it requires another LLM call to synthesize the perspectives.

### Hierarchical (Orchestrator + Specialists)

An orchestrator plans and delegates; specialists execute.

```
Orchestrator
  ├── delegates to ResearchAgent
  ├── delegates to DataAgent
  └── synthesizes results
```

The hierarchical topology is the most flexible but also the most complex. The orchestrator receives the high-level task and decides which specialist to invoke for which part. Specialists operate in isolation from each other — they receive a subtask from the orchestrator and return a result, without knowing what other specialists are doing.

This is a good pattern when the orchestrator needs to adapt dynamically: if early research reveals that data analysis is more important than expected, the orchestrator can allocate more calls to the DataAgent.

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

The shared state pattern makes the pipeline's progress visible at every point. You can inspect `state["research"]` after the research stage completes, before kicking off analysis. This is useful for debugging and for human-in-the-loop workflows.

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

`asyncio.gather` runs all three coroutines concurrently. The Anthropic API client is synchronous by default, but wrapping calls in `asyncio` still achieves concurrency at the network I/O level — all three HTTP requests are in flight simultaneously.

For true async usage with the Anthropic SDK:

```python
import asyncio
from anthropic import AsyncAnthropic

async_client = AsyncAnthropic()

async def run_agent_async(task: str, system: str) -> str:
    response = await async_client.messages.create(
        model="claude-opus-4-6",
        max_tokens=1024,
        system=system,
        messages=[{"role": "user", "content": task}]
    )
    return response.content[0].text

async def multi_agent_research_async(topic: str) -> dict:
    results = await asyncio.gather(
        run_agent_async(f"Find recent news about {topic}", "You are a news researcher."),
        run_agent_async(f"Summarize technical aspects of {topic}", "You are a technical analyst."),
        run_agent_async(f"List key players in {topic}", "You are a market researcher."),
    )
    return {
        "news": results[0],
        "technical": results[1],
        "players": results[2],
    }
```

Using `AsyncAnthropic` gives you genuinely non-blocking API calls, which matters when you have many agents running concurrently or when you're building a server that handles multiple concurrent requests.

## Complete Hierarchical Pipeline Example

```python
import anthropic
import json

client = anthropic.Anthropic()

def research_agent(subtopic: str) -> str:
    """Specialist: gathers factual information."""
    response = client.messages.create(
        model="claude-opus-4-6",
        max_tokens=1024,
        system="You are a factual research specialist. Provide accurate, detailed information.",
        messages=[{"role": "user", "content": f"Research: {subtopic}"}]
    )
    return response.content[0].text

def analysis_agent(research: str, question: str) -> str:
    """Specialist: draws insights from research."""
    response = client.messages.create(
        model="claude-opus-4-6",
        max_tokens=1024,
        system="You are an analytical specialist. Draw clear, evidence-based insights.",
        messages=[{
            "role": "user",
            "content": f"Question: {question}\n\nResearch:\n{research}\n\nProvide key insights."
        }]
    )
    return response.content[0].text

def orchestrator(task: str) -> str:
    """Orchestrator: plans and delegates the task."""
    # Step 1: Planning
    plan_response = client.messages.create(
        model="claude-opus-4-6",
        max_tokens=512,
        system="You are an orchestrator. Break tasks into clear research subtopics.",
        messages=[{
            "role": "user",
            "content": f"Task: {task}\n\nList 3 specific subtopics to research. Return as JSON: {{\"subtopics\": [...]}}"
        }]
    )

    plan_text = plan_response.content[0].text
    # Extract JSON from the response
    start = plan_text.find("{")
    end = plan_text.rfind("}") + 1
    plan = json.loads(plan_text[start:end])

    # Step 2: Delegate to research specialists
    research_results = {}
    for subtopic in plan["subtopics"]:
        research_results[subtopic] = research_agent(subtopic)

    # Step 3: Analyze combined research
    combined = "\n\n".join(f"### {k}\n{v}" for k, v in research_results.items())
    analysis = analysis_agent(combined, task)

    # Step 4: Synthesize final answer
    final = client.messages.create(
        model="claude-opus-4-6",
        max_tokens=1024,
        system="You synthesize research into clear, actionable summaries.",
        messages=[{
            "role": "user",
            "content": f"Task: {task}\n\nAnalysis:\n{analysis}\n\nWrite a clear, structured summary."
        }]
    )
    return final.content[0].text

result = orchestrator("What are the main challenges in deploying AI agents to production?")
print(result)
```

The orchestrator first generates a structured plan (as JSON for reliable parsing), then delegates to research specialists for each subtopic, then passes the combined research to an analysis specialist, and finally synthesizes everything into a final output. Each specialist knows nothing about the others — it just receives a task and returns a result.

## Error Handling in Multi-Agent Systems

Errors in multi-agent systems are harder to handle than in single agents because failure can happen at any stage, and agents may have already taken actions that can't be undone.

```python
import asyncio
from typing import Optional

async def resilient_agent(task: str, system: str, retries: int = 2) -> Optional[str]:
    """Run an agent with retry logic."""
    for attempt in range(retries + 1):
        try:
            response = client.messages.create(
                model="claude-opus-4-6",
                max_tokens=1024,
                system=system,
                messages=[{"role": "user", "content": task}]
            )
            return response.content[0].text
        except Exception as e:
            if attempt == retries:
                print(f"Agent failed after {retries + 1} attempts: {e}")
                return None
            await asyncio.sleep(2 ** attempt)  # Exponential backoff
    return None
```

Retry with exponential backoff handles transient API failures. For more serious errors (the agent produces unusable output, not just an exception), you may need a fallback path — a simpler agent, a cached result, or a human escalation.

## When Multi-Agent Systems Are Worth It

Multi-agent systems add complexity. They're worth it when:

- **The task genuinely benefits from specialization**: A researcher agent with a specific persona and search tools produces better research than a generalist agent doing everything.
- **Stages can run in parallel**: If three subtasks are independent, running them in parallel is faster than running them sequentially.
- **You need isolation**: Agents that operate in separate contexts don't contaminate each other's reasoning.
- **Different stages need different models**: You might use a cheaper model for data gathering and a more capable model for synthesis.

Avoid multi-agent complexity when a well-prompted single agent can do the job. More agents means more API calls, more latency, more failure points, and more debugging surface area.

## See Also

- [Agentic Workflows Overview](/agentic-workflows/) — Workflow design principles
- [Agent Patterns](/ai-agents/patterns/) — ReAct, Reflection, and other patterns for individual agents
- [Agent Frameworks](/frameworks/) — CrewAI and AutoGen implement these patterns with higher-level abstractions
