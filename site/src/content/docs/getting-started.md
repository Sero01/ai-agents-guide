---
title: Getting Started
description: Get started with AI agents and agentic workflows. What you need to know and where to begin.
---

# Getting Started with AI Agents

This guide covers what you need to know to start building AI agents and agentic workflows.

## What You’ll Learn

This site covers the full stack of AI agent development:

- **[AI Agents](/ai-agents)** — What they are, how the agent loop works, common patterns
- **[Agentic Workflows](/agentic-workflows)** — Designing multi-step workflows that are reliable
- **[MCP](/mcp)** — Model Context Protocol: how agents connect to tools and data
- **[Frameworks](/frameworks)** — LangChain, CrewAI, AutoGen compared
- **[Tools & Memory](/tools-memory)** — Extending agents with tools and memory systems
- **[Agent Instructions](/agent-instructions)** — CLAUDE.md and the AgentMD pattern
- **[Prompt Engineering](/prompt-engineering)** — Writing prompts specifically for agents
- **[Code Examples](/code-examples)** — Copy-paste examples for common patterns

## Prerequisites

You’ll get the most out of this if you:
- Know Python basics
- Have used a language model API (OpenAI, Anthropic, etc.)
- Understand what a REST API is

You do NOT need to know:
- Machine learning or model training
- Anything about neural networks or transformers

## Quickstart

The fastest way to build your first agent:

### 1. Get an API key

Sign up for [Anthropic](https://console.anthropic.com) or [OpenAI](https://platform.openai.com).

```bash
export ANTHROPIC_API_KEY=your_key_here
```

### 2. Install the SDK

```bash
pip install anthropic
```

### 3. Run a tool-using agent

```python
import anthropic

client = anthropic.Anthropic()

tools = [{
    "name": "calculator",
    "description": "Evaluate a math expression",
    "input_schema": {
        "type": "object",
        "properties": {"expression": {"type": "string"}},
        "required": ["expression"]
    }
}]

def calculator(expression: str) -> str:
    return str(eval(expression))  # don't use eval in production!

messages = [{"role": "user", "content": "What is 1337 * 42?"}]

while True:
    resp = client.messages.create(
        model="claude-sonnet-4-5",
        max_tokens=1024,
        tools=tools,
        messages=messages
    )
    
    if resp.stop_reason == "end_turn":
        print(resp.content[0].text)
        break
    
    messages.append({"role": "assistant", "content": resp.content})
    results = []
    for block in resp.content:
        if block.type == "tool_use":
            result = calculator(**block.input)
            results.append({"type": "tool_result", "tool_use_id": block.id, "content": result})
    messages.append({"role": "user", "content": results})
```

## Key Concepts to Understand First

Before diving deep, make sure you understand:

1. **The agent loop**: perceive → reason → act → observe → repeat
2. **Tool calling**: how models invoke functions
3. **Context windows**: the finite memory constraint
4. **Compounding errors**: why reliability is hard

All of these are covered in the [AI Agents](/ai-agents) section.

## Where to Go Next

- New to agents? Start with [What are AI Agents?](/ai-agents)
- Want to understand workflows? Read [Agentic Workflows](/agentic-workflows)
- Interested in MCP? See [What is MCP?](/mcp)
- Want to compare frameworks? See [Framework Comparison](/frameworks)
