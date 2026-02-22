---
title: Tokens & Context Windows
description: How tokens and context windows affect AI agent design and performance.
---

# Tokens & Context Windows

Tokens and context windows are fundamental constraints in AI agent design. Understanding them helps you build agents that are faster, cheaper, and more reliable.

## What is a Token?

A **token** is the basic unit of text that an AI model processes. Roughly:
- 1 token ≈ 4 characters in English
- 1 token ≈ ¾ of a word
- 100 tokens ≈ 75 words

Models have a maximum number of tokens they can process in a single call. This is the **context window**.

## Context Window Sizes (2024-2025)

| Model | Context Window |
|-------|----------------|
| Claude 3.5 Sonnet | 200K tokens |
| Claude 3 Opus | 200K tokens |
| GPT-4o | 128K tokens |
| Gemini 1.5 Pro | 1M tokens |
| Llama 3.1 405B | 128K tokens |

200K tokens is roughly 150,000 words — about 2-3 full novels. This is enough for most tasks.

## Context Window vs. Working Memory

The context window includes **everything** the model sees:
- System prompt
- Conversation history
- Tool call results
- Documents you’ve injected
- The model’s own previous responses

This is fundamentally different from human working memory. The model doesn’t “remember” outside the context window — it only knows what’s currently in it.

## Impact on Agent Design

### Problem: Context Accumulation

In long-running agent loops, context grows with every tool call:

```
Turn 1: [system prompt] + [task] = 2K tokens
Turn 3: + [tool calls + results] = 8K tokens
Turn 10: + [more tool calls] = 40K tokens
Turn 20: + [more history] = 100K tokens
```

At some point, the context fills up and the agent can’t continue.

### Solutions

**Summarization**: Periodically summarize earlier parts of the conversation, replacing verbose history with a compact summary.

**Context pruning**: Remove old, irrelevant tool results that are no longer needed.

**Handoff**: When context approaches the limit, hand off to a fresh agent instance with only the essential context.

**Selective inclusion**: Don’t include all history by default — only include what’s relevant to the current step.

## Token Costs

Tokens have direct cost implications:

- Input tokens (prompt) are cheaper than output tokens (response)
- Agent loops can generate 10-100x more tokens than a simple call
- Cached prompt tokens (unchanged system prompt) are discounted by most providers

### Rough cost example (Claude Sonnet 3.5):
- Simple QA: 1K tokens, ~$0.003
- Agent loop (20 steps): ~50K tokens, ~$0.15
- Long agent run (100 steps): ~500K tokens, ~$1.50

## Latency

Larger contexts = slower responses:
- Prefill (processing input tokens) scales linearly with context size
- First token latency increases with context
- Use streaming to reduce perceived latency

## Best Practices

1. **Keep system prompts tight** — every token in the system prompt is paid for on every call
2. **Prune tool results** — truncate or summarize large tool outputs before adding to context
3. **Use caching** — prefix caching for repeated system prompts saves cost
4. **Monitor token usage** — log tokens per step to catch runaway agents
5. **Design for context limits** — assume your agent will hit the limit; plan for graceful handoff
