---
title: Agentic Workflows
description: What agentic workflows are, how they differ from simple AI calls, and why they matter.
---

# Agentic Workflows

An **agentic workflow** is a process where an AI model takes a sequence of actions to complete a goal, rather than responding to a single prompt.

Instead of: *prompt → response*

Agentic workflows do: *goal → plan → actions → observation → more actions → result*

## What Makes a Workflow "Agentic"?

Three characteristics define agentic workflows:

### 1. Multi-Step Execution
The AI breaks a goal into steps and executes them in sequence. It doesn’t just answer — it acts.

### 2. Tool Use
The agent calls tools: web search, code execution, file operations, API calls. Tools extend what the model can do.

### 3. Feedback Loops
After each action, the agent observes the result and decides what to do next. This “observation” is key — it’s what separates an agent from a script.

## Simple vs. Agentic

| Simple AI Call | Agentic Workflow |
|----------------|------------------|
| Single prompt/response | Multi-step execution |
| Stateless | Maintains context across steps |
| No tools | Uses tools (search, code, APIs) |
| Human decides next step | Agent decides next step |
| Fast, cheap | Slower, more expensive |

## Common Patterns

### ReAct (Reason + Act)
The most common pattern. The agent alternates between reasoning ("I need to find X") and acting (calling a tool). It observes the result, reasons again, acts again.

### Plan-and-Execute
The agent creates a full plan upfront, then executes each step. More predictable than ReAct, but less adaptive.

### Reflexion
The agent reviews its own outputs and self-corrects. Useful for tasks with clear quality criteria (code, writing).

## When to Use Agentic Workflows

Agentic workflows make sense when:
- The task requires multiple steps that depend on each other
- You need to use multiple tools or data sources
- The path to completion isn’t fully known upfront
- The task takes longer than a single context window

Simple AI calls are better when:
- You need a fast, cheap response
- The task is well-defined and single-step
- You need deterministic, predictable output
- Latency matters

## The Reliability Problem

Agentic workflows have a compounding error problem. If each step succeeds 90% of the time:

- 1 step: 90% success
- 3 steps: 73% success  
- 5 steps: 59% success
- 10 steps: 35% success

This is why architecture matters. See [Multi-Agent Pipelines](/agentic-workflows/multi-agent) for patterns that address this.
