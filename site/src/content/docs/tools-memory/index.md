---
title: "AI Agent Tools, Skills, and Memory Systems Explained"
description: "How tools, skills, and memory work in AI agent systems. Covers tool calling from the API, skill composition, in-context vs external memory types, and vector store integration."
sidebar:
  order: 1
head:
  - tag: script
    attrs:
      type: application/ld+json
    content: |
      {"@context":"https://schema.org","@type":"TechArticle","headline":"AI Agent Tools, Skills, and Memory Systems Explained","description":"How tools, skills, and memory work in AI agent systems. Covers tool calling from the API, skill composition, in-context vs external memory types, and vector store integration.","url":"https://agentguides.dev/tools-memory/","datePublished":"2026-01-01","dateModified":"2026-02-23","author":{"@type":"Person","name":"Parvez Ahmed"},"publisher":{"@type":"Person","name":"Parvez Ahmed"},"keywords":"AI agent tools, AI agent memory, vector memory, episodic memory, AI skills, tool use, AI agent capabilities"}
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

When the model decides to call a tool, it returns a `tool_use` block in its response content. The `tool_call.input` is a dictionary of arguments matching the `input_schema` you defined. Your code is responsible for executing the tool and returning the result.

### Writing Good Tool Descriptions

The `description` field directly affects how well the model uses the tool. A good description answers:
- What does this tool do?
- When should the model use it (vs. other tools or just reasoning)?
- What does it return?
- Any important limitations?

```python
# Weak description — the model may misuse this tool
{
    "name": "search",
    "description": "Search for information.",
    "input_schema": {
        "type": "object",
        "properties": {"query": {"type": "string"}},
        "required": ["query"]
    }
}

# Better description — the model understands when and how to use this
{
    "name": "web_search",
    "description": "Search the web for current information. Use this when the user asks about recent events, current prices, or any information that may have changed since your training cutoff. Returns a list of relevant web pages with titles, URLs, and snippets.",
    "input_schema": {
        "type": "object",
        "properties": {
            "query": {
                "type": "string",
                "description": "Search query. Be specific — narrow queries return better results than broad ones."
            }
        },
        "required": ["query"]
    }
}
```

### Tool Error Handling

Tools should return error information in a format the model can understand and respond to:

```python
def safe_web_search(query: str) -> str:
    try:
        results = search_api.search(query)
        if not results:
            return "No results found for this query. Try a different search term."
        return format_results(results)
    except RateLimitError:
        return "Search is temporarily unavailable due to rate limits. Try again in a moment."
    except Exception as e:
        return f"Search failed: {str(e)}"
```

Return error messages as strings rather than raising exceptions. The model can read an error string and decide how to recover — try a different query, use a different tool, or tell the user the tool is unavailable. An uncaught exception crashes the agent.

## Skills

A **skill** is a higher-level, reusable capability — typically a prompt + a tool or set of tools packaged together. Skills make agents composable.

In this project's architecture, skills live as `.md` files in `directives/` — structured prompts that tell the agent what to do and which execution scripts to use.

The skill concept generalizes the tool concept: where a tool is a single function call, a skill is a mini-workflow that might involve multiple tool calls, decision-making, and structured output.

```python
class ResearchSkill:
    """A skill that searches for information and structures it."""

    def __init__(self, client: anthropic.Anthropic):
        self.client = client
        self.tools = [search_tool, fetch_page_tool]
        self.system = """You are a research specialist. When asked to research a topic:
1. Search for recent, authoritative sources
2. Read the most relevant pages
3. Extract key facts and synthesize them
4. Structure the output as: Summary, Key Points, Sources"""

    def run(self, topic: str) -> str:
        messages = [{"role": "user", "content": f"Research: {topic}"}]
        # Run the agent loop within the skill
        return run_agent_loop(self.client, self.tools, self.system, messages)
```

Packaging capabilities as skills means you can reuse the same research logic across multiple agents without duplicating the prompt and tool configuration.

## Memory Types

| Type | What it stores | Persistence |
|------|---------------|-------------|
| **In-context** | Recent conversation | Current session only |
| **External (vector)** | Semantic facts, documents | Permanent |
| **Key-value** | User preferences, state | Permanent |
| **Episodic** | Past task summaries | Permanent |

Each memory type serves different needs. Understanding when to use which type is one of the more important architectural decisions in agent design.

### In-Context Memory

The simplest form of memory: the conversation history in the messages array. Everything the agent has observed in the current session is in context.

The limitation is the context window. For long-running agents, the conversation history grows with every tool call. Eventually you hit the model's token limit, and earlier context gets truncated or you start getting errors.

Strategies for managing in-context memory:
- **Sliding window**: Keep only the N most recent messages
- **Summarization**: Periodically compress older messages into a summary
- **Selective retention**: Keep the initial user goal, discard intermediate tool results once they've been processed

### External (Vector) Memory

Vector memory stores information as embeddings (dense numerical representations). When you need information, you search the vector store for semantically similar content and inject the results into your current context.

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

In production, replace the list with a real vector store like ChromaDB (local) or Pinecone (cloud). The vector store embeds your query and finds the k most similar stored memories, measured by cosine similarity.

Vector memory is powerful for agents that need to recall facts from large knowledge bases — previous conversations, documentation, domain knowledge — without fitting everything in the context window at once.

### Key-Value Memory

Simple key-value stores work well for structured state: user preferences, configuration, task progress, counters.

```python
import json
from pathlib import Path

class KeyValueMemory:
    def __init__(self, path: str = "agent_memory.json"):
        self.path = Path(path)
        self.data = json.loads(self.path.read_text()) if self.path.exists() else {}

    def set(self, key: str, value):
        self.data[key] = value
        self.path.write_text(json.dumps(self.data, indent=2))

    def get(self, key: str, default=None):
        return self.data.get(key, default)

# Usage
memory = KeyValueMemory()
memory.set("user_timezone", "America/New_York")
memory.set("preferred_format", "markdown")
tz = memory.get("user_timezone")
```

Key-value memory is persistent across sessions, predictable, and cheap to operate. Use it for any structured state that needs to persist beyond a single session.

### Episodic Memory

Episodic memory stores summaries of past sessions or tasks, allowing the agent to learn from experience without needing to replay entire conversation histories.

```python
def summarize_session(messages: list[dict], outcome: str) -> str:
    """Create an episodic memory entry from a completed session."""
    response = client.messages.create(
        model="claude-opus-4-6",
        max_tokens=256,
        messages=[{
            "role": "user",
            "content": f"Summarize what happened in this session in 2-3 sentences, focusing on what was accomplished and any important decisions made:\n\n{format_messages(messages)}\n\nOutcome: {outcome}"
        }]
    )
    return response.content[0].text

# At the end of each session
summary = summarize_session(session_messages, outcome="User's report was generated successfully")
episodic_store.append({
    "timestamp": now(),
    "summary": summary,
    "outcome": outcome,
})
```

Episodic memories can be retrieved and included in future sessions to give the agent context about how similar tasks have been handled before.

## Choosing the Right Memory Type

The four memory types are not mutually exclusive. Most production agents use a combination, with each type serving a different role.

In-context memory handles the immediate conversation — what was just said, what tools were just called, the current task state. It's always present and always fast, but it's temporary and space-limited.

Key-value memory handles structured, permanent state: user preferences, configuration, API keys, progress through a long workflow. It's cheap to read and write and persists across sessions, but it doesn't support semantic search.

Vector memory handles knowledge retrieval at scale: past conversations, documentation, domain knowledge. It can search across millions of stored items by semantic similarity, which makes it invaluable when the agent needs to draw on a large knowledge base. The cost is infrastructure complexity (you need an embedding model and a vector store).

Episodic memory bridges in-context and vector memory: it stores summaries of past sessions (rather than raw facts), which gives the agent a sense of history without requiring it to re-read entire past conversations.

A practical starting point: use in-context memory for everything until you hit context limits, then add key-value memory for persistent state, then add vector memory if you need to query a large knowledge base.

## MCP and Tool Discovery

MCP (Model Context Protocol) standardizes how agents discover and use tools. Instead of hardcoding tool schemas, an MCP client queries a server for available tools at runtime. See the [MCP section](/mcp/) for the full guide.

The key advantage of MCP over hand-coded tools is portability: an MCP server can be used by Claude, Claude Code, Cursor, or any other MCP-compatible client. You write the integration once and it works everywhere.

## See Also

- [AI Agent Concepts](/ai-agents/) — The agent loop and how tool calling fits in
- [MCP Overview](/mcp/) — Standard protocol for tool discovery and use
- [Tokens & Context](/ai-agents/tokens-context/) — Managing the context window as memory grows
