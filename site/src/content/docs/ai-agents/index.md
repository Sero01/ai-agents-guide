---
title: What are AI Agents?
description: A clear explanation of AI agents - what they are, how they work, and when to use them.
---

# What are AI Agents?

An **AI agent** is a system that uses an AI model to pursue a goal by taking actions, observing results, and deciding what to do next.

Unlike a simple AI call that answers a question, an agent operates in a loop:

```
Goal → Think → Act → Observe → Think → Act → ... → Done
```

## The Core Loop

Every AI agent, regardless of framework, runs some version of this loop:

1. **Perceive**: Receive input (goal, task, user message, tool result)
2. **Reason**: Decide what to do (which tool to call, what to say, whether to ask for help)
3. **Act**: Execute the decision (call a tool, generate output, ask a question)
4. **Observe**: See the result of the action
5. **Repeat**: Use the observation to inform the next decision

The loop continues until the agent decides the goal is complete, or it hits a limit.

## What Makes an Agent an Agent?

The key distinction from a simple AI call:

| Simple AI Call | AI Agent |
|----------------|----------|
| One prompt, one response | Autonomous loop |
| You decide next steps | Agent decides next steps |
| Stateless | Maintains state across steps |
| No tools | Uses tools to act in the world |

## Three Types of Agents

### Tool-Using Agents
The most common type. The model has access to tools (web search, code execution, file operations, APIs) and decides when and how to use them.

### Planning Agents
The model creates a plan before acting. Useful for complex tasks where the sequence of steps matters.

### Multi-Agent Systems
Multiple agents, each with a role, coordinate to complete a task. One agent orchestrates; others execute subtasks. See [Multi-Agent Pipelines](/agentic-workflows/multi-agent).

## When to Use an Agent

Agents are powerful but not always the right tool:

**Use an agent when:**
- The task requires multiple steps
- You don’t know the full path to completion upfront
- The task requires using multiple tools
- The context is too large for a single prompt

**Don’t use an agent when:**
- A simple prompt works
- You need fast, low-latency responses
- The task is well-defined and deterministic
- Cost is a constraint (agents use many more tokens)

## The Building Blocks

Every agent is built from:

- **Model**: The AI doing the reasoning (Claude, GPT-4, Gemini)
- **Tools**: Functions the agent can call
- **Memory**: How the agent remembers past actions
- **Instructions**: The system prompt defining the agent’s role and behavior

See [Agent Patterns](/ai-agents/patterns) for common architectures built from these blocks.
