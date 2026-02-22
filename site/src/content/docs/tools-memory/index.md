---
title: Tools & Memory
description: How AI agents use tools and memory to act in the world and maintain context.
---

# Tools & Memory

Tools and memory are what transform a language model into an agent. Tools let the model act; memory lets it persist context.

## Tools

A **tool** is a function the AI can call. The model decides when to call it, with what arguments, and how to interpret the result.

### Types of Tools

**Read tools**: Retrieve information
- Web search
- File read
- Database query
- API call (GET)

**Write tools**: Modify the world
- File write
- Database insert/update
- API call (POST/PUT)
- Send email/message

**Compute tools**: Execute logic
- Code execution
- Calculator
- Data transformation

### Designing Good Tools

Tools should be:

**Atomic**: Do one thing. A tool that does multiple things is harder for the model to reason about.

```python
# Bad: too many responsibilities
def search_and_summarize(query, max_results, format):
    ...

# Better: separate concerns
def search(query, max_results=5): ...
def summarize(text, format="bullets"): ...
```

**Clear descriptions**: The description is how the model decides whether to use the tool.

```python
# Bad description:
{"name": "get_data", "description": "Gets data"}

# Good description:
{
  "name": "get_stock_price",
  "description": "Get the current stock price for a ticker symbol. Returns price in USD as of market close or last available quote."
}
```

**Explicit schemas**: Define inputs precisely.

```json
{
  "input_schema": {
    "type": "object",
    "properties": {
      "ticker": {
        "type": "string",
        "description": "Stock ticker symbol, e.g. 'AAPL', 'MSFT'"
      }
    },
    "required": ["ticker"]
  }
}
```

**Safe by default**: Write tools should be hard to call accidentally.

```python
# Require explicit confirmation parameter for destructive actions
def delete_file(path: str, confirm: bool = False):
    if not confirm:
        return "Set confirm=True to delete this file."
    ...
```

## Memory

**Memory** is how agents persist and retrieve context beyond the current context window.

### Types of Memory

#### In-Context Memory
The conversation history in the current prompt. Simple, but limited by context window size.

```
[System prompt]
[Turn 1]
[Turn 2]
[Turn N]  ← All of this is "in-context memory"
```

#### External Storage
Structured data outside the model: databases, files, key-value stores.

```python
# Storing
memory_db["user_preference"] = "prefers metric units"

# Retrieving
pref = memory_db.get("user_preference", "unknown")
```

#### Vector Memory
Semantic search over past interactions. Good for "what did I do last time that was similar?"

```python
from sentence_transformers import SentenceTransformer
import numpy as np

# Store a memory
embedding = model.encode("User prefers concise answers")
vector_db.store(embedding, text="User prefers concise answers")

# Retrieve relevant memories
query_embedding = model.encode(current_task)
related = vector_db.search(query_embedding, top_k=3)
```

#### Episodic Memory
Record of past actions and outcomes. Used to improve future decisions.

```json
{
  "task": "search for AI papers",
  "approach": "arxiv search + semantic scholar",
  "outcome": "success",
  "notes": "semantic scholar gave better results for applied AI"
}
```

### Memory Patterns

**Summarize-and-compress**: When context gets long, summarize earlier history.

**Selective retrieval**: Don’t inject all memory — retrieve only what’s relevant to the current task.

**Write-back**: After completing a task, store learnings for next time.
