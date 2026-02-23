---
title: "AI Agent Tools, Skills & Memory — How the Best Agents Remember & Act (2026)"
description: "The most complete guide to AI agent tools, skills, and memory systems. In-context, vector, key-value, and episodic memory explained with Python code. Build the most capable AI agents."
sidebar:
  order: 1
head:
  - tag: script
    attrs:
      type: application/ld+json
    content: |
      {"@context":"https://schema.org","@type":"TechArticle","headline":"AI Agent Tools, Skills & Memory — How the Best Agents Remember & Act (2026)","description":"The most complete guide to AI agent tools, skills, and memory systems. In-context, vector, key-value, and episodic memory explained with Python code.","url":"https://agentguides.dev/tools-memory/","datePublished":"2026-01-01","dateModified":"2026-02-23","author":{"@type":"Person","name":"Parvez Ahmed"},"publisher":{"@type":"Person","name":"Parvez Ahmed"},"keywords":"AI agent tools, AI agent memory, vector memory, episodic memory, AI skills, tool use, AI agent capabilities"}
  - tag: script
    attrs:
      type: application/ld+json
    content: |
      {"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://agentguides.dev/"},{"@type":"ListItem","position":2,"name":"Tools, Skills & Memory","item":"https://agentguides.dev/tools-memory/"}]}
---

## Tools

A **tool** is any function an agent can call. From the LLM's perspective, a tool has a name, description, and input schema — the LLM decides when and how to call it.

```python
import anthropic

client = anthropic.Anthropic()

tools = [
    {
        "name": "get_weather",
        "description": "Get the current weather for a city.",
        "input_schema": {
            "type": "object",
            "properties": {
                "city": {"type": "string", "description": "City name"},
            },
            "required": ["city"],
        },
    }
]

response = client.messages.create(
    model="claude-opus-4-6",
    max_tokens=1024,
    tools=tools,
    messages=[{"role": "user", "content": "What's the weather in Tokyo?"}],
)

# Check if the model wants to call a tool
if response.stop_reason == "tool_use":
    tool_call = next(b for b in response.content if b.type == "tool_use")
    print(f"Tool: {tool_call.name}, Input: {tool_call.input}")
```

## Skills

A **skill** is a higher-level, reusable capability — typically a prompt + a tool or set of tools packaged together. Skills make agents composable.

In this project's architecture, skills live as `.md` files in `directives/` — structured prompts that tell the agent what to do and which execution scripts to use.

## Memory Types

| Type | What it stores | Persistence |
|------|---------------|-------------|
| **In-context** | Recent conversation | Current session only |
| **External (vector)** | Semantic facts, documents | Permanent |
| **Key-value** | User preferences, state | Permanent |
| **Episodic** | Past task summaries | Permanent |

## Implementing Memory with a Vector Store

```python
# Simple in-memory vector store (use ChromaDB, Pinecone, etc. in production)
from anthropic import Anthropic

# Store memories as embeddings, retrieve by semantic similarity
# Example uses a simple list for illustration
memory_store = []

def remember(fact: str):
    memory_store.append(fact)

def recall(query: str, top_k: int = 3) -> list[str]:
    # In production: embed query, search vector store
    # Here: simple keyword match for illustration
    return [m for m in memory_store if any(w in m.lower() for w in query.lower().split())][:top_k]
```

## MCP and Tool Discovery

MCP (Model Context Protocol) standardizes how agents discover and use tools. Instead of hardcoding tool schemas, an MCP client queries a server for available tools at runtime. See the [MCP section](/mcp/) for the full guide.
