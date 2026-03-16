---
title: "AI Agent Design Patterns: ReAct, Reflection, Plan-and-Execute, and More"
description: "Core AI agent design patterns explained with working code: ReAct, Reflection, Plan-and-Execute, Multi-Agent Orchestration, and the Critic Loop pattern."
sidebar:
  order: 2
head:
  - tag: script
    attrs:
      type: application/ld+json
    content: |
      {"@context":"https://schema.org","@type":"TechArticle","headline":"AI Agent Design Patterns: ReAct, Reflection, Plan-and-Execute, and More","description":"Core AI agent design patterns explained with working code: ReAct, Reflection, Plan-and-Execute, Multi-Agent Orchestration, and the Critic Loop pattern.","url":"https://agentguides.dev/ai-agents/patterns/","datePublished":"2026-01-01","dateModified":"2026-02-23","author":{"@type":"Person","name":"Parvez Ahmed"},"publisher":{"@type":"Person","name":"Parvez Ahmed"},"keywords":"AI agent patterns, ReAct pattern, reflection pattern, plan-and-execute, multi-agent orchestration, AI design patterns, AI agent architecture"}
  - tag: script
    attrs:
      type: application/ld+json
    content: |
      {"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://agentguides.dev/"},{"@type":"ListItem","position":2,"name":"AI Agents","item":"https://agentguides.dev/ai-agents/"},{"@type":"ListItem","position":3,"name":"Agent Patterns","item":"https://agentguides.dev/ai-agents/patterns/"}]}
---

Design patterns for AI agents describe recurring solutions to common agent architecture problems. Unlike software design patterns which deal with code structure, agent patterns deal with how the LLM, tools, and control flow are arranged to accomplish complex tasks. Understanding these patterns helps you choose the right structure for a given problem rather than building agents ad hoc.

## ReAct (Reason + Act)

The most common agent pattern. The model interleaves reasoning steps with tool calls.

```
Thought: I need to find the current price of AAPL stock.
Action: search("AAPL stock price today")
Observation: AAPL is trading at $189.84
Thought: I have the price. I can now answer the user.
Answer: AAPL is currently trading at $189.84.
```

**How it works**: At each step, the model generates a `Thought` that explains what it's doing and why, then an `Action` (a tool call), then receives an `Observation` (the tool's result). This cycle repeats until the model produces a final `Answer` instead of a new thought and action.

The explicit reasoning step is the key innovation of ReAct. Without it, an agent might call tools correctly but in ways that are hard to interpret or debug. With explicit thought traces, you can read the agent's reasoning and understand why it made each decision.

**When to use**: General-purpose agents that need to decide which tools to use, when to stop searching and answer, and how to adapt when tools return unexpected results.

**Implementation note**: Modern LLMs like Claude implement ReAct through native tool calling rather than text generation of Thought/Action/Observation strings. The structured tool call API achieves the same effect with better reliability.

## Reflection

The agent generates a response, then critiques it, then improves it.

```python
response = agent.generate(task)
critique = agent.reflect(response, task)
final = agent.revise(response, critique)
```

**How it works**: After generating an initial response, the agent (or a separate LLM call) evaluates that response against the original task requirements. The critique identifies specific problems: factual errors, missing requirements, unclear sections. A final revision addresses the critique.

In practice, this is usually implemented as two separate prompts:

```python
import anthropic

client = anthropic.Anthropic()

def reflection_agent(task: str) -> str:
    # First pass
    initial = client.messages.create(
        model="claude-opus-4-6",
        max_tokens=2048,
        messages=[{"role": "user", "content": task}],
    ).content[0].text

    # Self-critique
    critique = client.messages.create(
        model="claude-opus-4-6",
        max_tokens=1024,
        messages=[{
            "role": "user",
            "content": f"Review this response to the task: '{task}'\n\nResponse:\n{initial}\n\nIdentify specific problems, errors, or gaps."
        }],
    ).content[0].text

    # Revised response
    final = client.messages.create(
        model="claude-opus-4-6",
        max_tokens=2048,
        messages=[{
            "role": "user",
            "content": f"Task: {task}\n\nInitial response:\n{initial}\n\nCritique:\n{critique}\n\nWrite an improved response that addresses the critique."
        }],
    ).content[0].text

    return final
```

**When to use**: Tasks where quality matters more than speed — technical writing, code review, complex analysis, anything where a first draft is likely imperfect. The extra LLM calls add latency and cost, but for output quality they're often worth it.

**Limitation**: Reflection only helps if the model can actually identify its own errors. If the model confidently produces wrong information, its self-critique may also be wrong. Reflection is not a substitute for external validation or tool grounding.

## Plan-and-Execute

A planner LLM creates a task list; an executor LLM completes each step.

```
Planner:
  1. Research the company's latest earnings report
  2. Identify key financial metrics (revenue, profit margin, YoY growth)
  3. Find recent news about the company
  4. Summarize key risks and opportunities

Executor: (runs each step in sequence, accumulating results)
```

**How it works**: The planner receives the high-level goal and produces a structured plan — a numbered list of concrete steps. The executor then handles each step independently, potentially using tools for each one. This separation lets you use different models for planning (needs broad reasoning) and execution (needs careful tool use).

**When to use**: Long-horizon tasks with many steps, tasks where the sequence of steps matters, situations where you want to inspect the plan before executing it (human-in-the-loop at the planning stage), cases where each step is well-defined enough to be assigned to a specialized executor.

**Advantages over pure ReAct**: With ReAct, the agent decides what to do next at each step, which can lead to meandering paths on complex tasks. With Plan-and-Execute, the overall strategy is decided upfront, reducing the risk of getting stuck partway through.

**When to avoid**: Tasks where the plan needs to adapt based on what earlier steps discover (the planner can't anticipate these adaptations). For dynamic tasks, ReAct's step-by-step adaptability is more appropriate.

## Multi-Agent (Orchestrator + Specialists)

One orchestrator agent delegates to specialized sub-agents.

```
Orchestrator
  ├── ResearchAgent (web search, summarization)
  ├── CodeAgent (Python execution, debugging)
  └── WriterAgent (drafting, formatting)
```

**How it works**: The orchestrator receives the task, breaks it into subtasks, and assigns each to the appropriate specialist. Specialists have access to different tool sets and different system prompts tuned for their role. Results from specialists are collected by the orchestrator and synthesized into a final output.

**When to use**: Complex tasks that benefit from specialized models or tool sets, tasks that can be parallelized (multiple specialists working simultaneously), situations where you want specialists to operate in isolated contexts without interference from each other's work.

This pattern is the basis of most production multi-agent systems. Each specialist agent operates within a bounded context, which makes individual agents easier to develop, test, and debug. The orchestrator's job is coordination and synthesis, not domain expertise.

See [Multi-Agent Pipelines](/agentic-workflows/multi-agent/) for implementation details including parallel execution with `asyncio`.

## Critic Loop

A dedicated critic agent checks the work of the primary agent and requests revisions.

**How it works**: Unlike reflection (where the same agent critiques itself), the critic loop uses a separate agent with an explicit evaluator persona. The critic has different instructions — it's optimized to find flaws, not to produce output. The primary agent revises based on the critic's feedback, and this cycle continues until the critic approves the output or a turn limit is hit.

```python
def critic_loop(task: str, max_iterations: int = 3) -> str:
    producer_prompt = "You produce high-quality technical content."
    critic_prompt = "You are a demanding technical reviewer. Be specific about every flaw."

    current_output = produce(task, producer_prompt)

    for _ in range(max_iterations):
        critique = evaluate(current_output, task, critic_prompt)
        if "APPROVED" in critique:
            break
        current_output = revise(current_output, critique, producer_prompt)

    return current_output
```

**When to use**: High-stakes outputs where errors are costly — legal documents, financial analysis, security-sensitive code, medical information. The critic acts as a quality gate before output is delivered.

**Limitation**: LLM critics can be inconsistent. The same output may receive different critiques on different runs. For truly high-stakes decisions, combine the critic pattern with human review rather than relying on LLM critique alone.

## Choosing a Pattern

| Pattern | Task type | Latency | Cost | Interpretability |
|---------|-----------|---------|------|------------------|
| ReAct | General, dynamic | Medium | Medium | High |
| Reflection | Quality-critical | High | High | Medium |
| Plan-and-Execute | Long-horizon, structured | Medium | Medium | High |
| Multi-Agent | Complex, parallelizable | Variable | High | Medium |
| Critic Loop | High-stakes outputs | High | High | Medium |

In practice, production agents often combine patterns. A Plan-and-Execute structure at the top level, with ReAct agents executing individual steps, and a Critic Loop before delivering the final result, is a reasonable architecture for high-quality, complex tasks.

## See Also

- [AI Agents: Concepts & Architecture](/ai-agents/) — The fundamental agent loop
- [Multi-Agent Pipelines](/agentic-workflows/multi-agent/) — Implementing multi-agent coordination
- [Prompt Engineering for Agents](/prompt-engineering/) — Writing prompts that make these patterns work
