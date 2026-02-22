---
title: "Top AI Agent Design Patterns 2026: ReAct, Reflection, Plan-and-Execute & More"
description: "The best AI agent design patterns explained with working code: ReAct, Reflection, Plan-and-Execute, Multi-Agent Orchestration, and Critic Loop. Build the most reliable, production-ready AI agents."
sidebar:
  order: 2
---

## ReAct (Reason + Act)

The most common agent pattern. The model interleaves reasoning steps with tool calls.

```
Thought: I need to find the current price of AAPL stock.
Action: search("AAPL stock price today")
Observation: AAPL is trading at $189.84
Thought: I have the price. I can now answer the user.
Answer: AAPL is currently trading at $189.84.
```

**When to use:** General-purpose agents that need to decide which tools to use.

## Reflection

The agent generates a response, then critiques it, then improves it.

```python
response = agent.generate(task)
critique = agent.reflect(response, task)
final = agent.revise(response, critique)
```

**When to use:** Tasks where quality matters more than speed (writing, code review, analysis).

## Plan-and-Execute

A planner LLM creates a task list; an executor LLM completes each step.

```
Planner:
  1. Research the company
  2. Find recent news
  3. Summarize key risks

Executor: (runs each step in sequence)
```

**When to use:** Long-horizon tasks with many steps; separates strategy from execution.

## Multi-Agent (Orchestrator + Specialists)

One orchestrator agent delegates to specialized sub-agents.

```
Orchestrator
  ├── ResearchAgent (web search, summarization)
  ├── CodeAgent (Python execution, debugging)
  └── WriterAgent (drafting, formatting)
```

**When to use:** Complex tasks that benefit from specialized models or parallel execution.

## Critic Loop

A dedicated critic agent checks the work of the primary agent and requests revisions.

**When to use:** High-stakes outputs (legal documents, financial analysis, security code).
