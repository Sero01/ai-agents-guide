---
title: Tokens & Context Windows
description: Understanding token budgets, context limits, and strategies for managing them in agent systems.
sidebar:
  order: 3
---

## What Are Tokens?

Tokens are the units LLMs process. Roughly: 1 token ≈ 0.75 words (English). Models have a fixed **context window** — the maximum number of tokens they can process in a single call.

| Model | Context Window |
|-------|---------------|
| Claude Opus 4.6 | 200K tokens |
| GPT-4o | 128K tokens |
| Gemini 1.5 Pro | 1M tokens |

## Why Context Windows Matter for Agents

In a long-running agent loop, the conversation history grows with every tool call. Eventually you'll hit the context limit.

**The compounding problem:**
- Each tool call adds an observation to context
- Long tasks accumulate thousands of tokens in history
- At limit: errors, truncation, or degraded reasoning

## Context Management Strategies

### 1. Summarization

Periodically summarize older context and replace it with the summary.

```python
if token_count(context) > THRESHOLD:
    summary = llm.summarize(context.oldest_messages())
    context.replace_old_with(summary)
```

### 2. Sliding Window

Keep only the N most recent messages, always discarding the oldest.

```python
MAX_MESSAGES = 20
context = context[-MAX_MESSAGES:]
```

### 3. External Memory

Store facts in a vector database; retrieve only what's relevant to the current step.

```python
# Store
memory.add({"fact": result, "timestamp": now()})

# Retrieve
relevant = memory.search(current_query, top_k=5)
context.inject(relevant)
```

### 4. Task Decomposition

Break long tasks into smaller chunks, each with a clean context.

## Estimating Token Usage

```python
import anthropic

client = anthropic.Anthropic()

# Count tokens before sending
token_count = client.messages.count_tokens(
    model="claude-opus-4-6",
    messages=[{"role": "user", "content": your_message}]
)
print(f"This request will use ~{token_count.input_tokens} input tokens")
```
