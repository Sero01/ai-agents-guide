---
title: AI Agents — Concepts & Architecture
description: What AI agents are, how they work, and the architectural patterns behind them.
sidebar:
  order: 1
---

An AI agent is a system that perceives its environment, reasons about it, and takes actions to achieve a goal — repeatedly, in a loop.

## What Makes Something an "Agent"?

The minimal definition: **a model + a loop + tools**.

```
while not done:
    observation → LLM → action → execute → observation
```

Most LLM chat interfaces are not agents — they're single-turn request/response. An agent persists across turns, maintains state, and uses tools to affect the world.

## The Agent Loop

Every agent runs some variation of the **ReAct loop**:

1. **Observe** — receive input (user message, tool result, environment state)
2. **Think** — reason about what to do next (the LLM's job)
3. **Act** — call a tool, execute code, or produce output
4. **Observe** — receive the result and loop

```python
# Simplified agent loop
while not agent.is_done():
    thought = llm.think(agent.context)
    action = thought.next_action
    result = tools.execute(action)
    agent.context.append(result)
```

## Core Architecture

```
┌─────────────────────────────────────────┐
│              Agent System               │
│                                         │
│  ┌─────────┐    ┌──────────────────┐   │
│  │  Input  │───▶│    LLM (Brain)   │   │
│  └─────────┘    └────────┬─────────┘   │
│                          │             │
│              ┌───────────▼──────────┐  │
│              │   Tool Dispatcher    │  │
│              └─┬──────┬──────┬─────┘  │
│                │      │      │         │
│           ┌────▼┐ ┌───▼─┐ ┌─▼────┐   │
│           │ Web │ │Code │ │ API  │   │
│           │ Srch│ │Exec │ │Calls │   │
│           └────┘ └─────┘ └──────┘   │
│                                         │
│  ┌──────────────────────────────────┐  │
│  │         Memory / State           │  │
│  └──────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

## See Also

- [Agent Patterns](/ai-agents/patterns/) — Common design patterns for agent systems
- [Tokens & Context](/ai-agents/tokens-context/) — Managing context windows effectively
