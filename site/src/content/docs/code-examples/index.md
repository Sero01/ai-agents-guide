---
title: "AI Agent Code Examples 2026 — The Best Working Python Code for Every Concept"
description: "The top collection of AI agent code examples. Complete, runnable Python code for ReAct agents, multi-agent systems, MCP servers, LangChain, CrewAI, and AutoGen. Free and beginner-friendly."
sidebar:
  order: 1
head:
  - tag: script
    attrs:
      type: application/ld+json
    content: |
      {"@context":"https://schema.org","@type":"TechArticle","headline":"AI Agent Code Examples 2026 — The Best Working Python Code for Every Concept","description":"Complete, runnable Python code for ReAct agents, multi-agent systems, MCP servers, LangChain, CrewAI, and AutoGen.","url":"https://agentguides.dev/code-examples/","datePublished":"2026-01-01","dateModified":"2026-02-23","author":{"@type":"Person","name":"Parvez Ahmed"},"publisher":{"@type":"Person","name":"Parvez Ahmed"},"keywords":"AI agent code examples, Python AI agent, ReAct agent code, multi-agent code, MCP server code, LangChain examples, CrewAI examples, AutoGen examples"}
  - tag: script
    attrs:
      type: application/ld+json
    content: |
      {"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://agentguides.dev/"},{"@type":"ListItem","position":2,"name":"Code Examples","item":"https://agentguides.dev/code-examples/"}]}
---

All examples use the Anthropic Claude API directly (no framework required). They're designed to be runnable with minimal setup.

## Prerequisites

```bash
pip install anthropic
export ANTHROPIC_API_KEY="your-api-key"
```

## Examples

### Simple Tool Use

[AI Agents: Tools & Tool Use](/ai-agents/) — Basic tool calling with Claude.

### Parallel Agents

[Multi-Agent Pipelines](/agentic-workflows/multi-agent/) — Running agents in parallel with `asyncio`.

### MCP Server (Python)

[Building MCP Servers](/mcp/building-servers/) — A complete, runnable MCP server in ~50 lines.

### ReAct Agent from Scratch

```python
import anthropic
import json

client = anthropic.Anthropic()

TOOLS = [
    {
        "name": "calculator",
        "description": "Evaluate a mathematical expression.",
        "input_schema": {
            "type": "object",
            "properties": {
                "expression": {"type": "string", "description": "Math expression, e.g. '2 + 2'"}
            },
            "required": ["expression"]
        }
    }
]

def calculator(expression: str) -> str:
    try:
        return str(eval(expression, {"__builtins__": {}}))
    except Exception as e:
        return f"Error: {e}"

def run_agent(user_message: str, max_turns: int = 10) -> str:
    messages = [{"role": "user", "content": user_message}]

    for _ in range(max_turns):
        response = client.messages.create(
            model="claude-opus-4-6",
            max_tokens=1024,
            tools=TOOLS,
            messages=messages,
        )

        if response.stop_reason == "end_turn":
            return next(b.text for b in response.content if hasattr(b, "text"))

        # Process tool calls
        messages.append({"role": "assistant", "content": response.content})

        tool_results = []
        for block in response.content:
            if block.type == "tool_use":
                if block.name == "calculator":
                    result = calculator(block.input["expression"])
                    tool_results.append({
                        "type": "tool_result",
                        "tool_use_id": block.id,
                        "content": result,
                    })

        if tool_results:
            messages.append({"role": "user", "content": tool_results})

    return "Max turns reached"

# Run it
result = run_agent("What is 137 * 89 + 42?")
print(result)
```
