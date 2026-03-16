---
title: "Tokens and Context Windows: Managing AI Agent Memory"
description: "How tokens and context windows work in AI agents, why they matter for long-running tasks, and practical strategies for managing context: summarization, sliding windows, and external memory."
sidebar:
  order: 3
head:
  - tag: script
    attrs:
      type: application/ld+json
    content: |
      {"@context":"https://schema.org","@type":"TechArticle","headline":"Tokens and Context Windows: Managing AI Agent Memory","description":"How tokens and context windows work in AI agents, why they matter for long-running tasks, and practical strategies for managing context: summarization, sliding windows, and external memory.","url":"https://agentguides.dev/ai-agents/tokens-context/","datePublished":"2026-01-01","dateModified":"2026-02-23","author":{"@type":"Person","name":"Parvez Ahmed"},"publisher":{"@type":"Person","name":"Parvez Ahmed"},"keywords":"tokens, context windows, AI agent memory, token budgets, Claude context, GPT-4o context, Gemini context, LLM context management"}
  - tag: script
    attrs:
      type: application/ld+json
    content: |
      {"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://agentguides.dev/"},{"@type":"ListItem","position":2,"name":"AI Agents","item":"https://agentguides.dev/ai-agents/"},{"@type":"ListItem","position":3,"name":"Tokens & Context","item":"https://agentguides.dev/ai-agents/tokens-context/"}]}
---

## What Are Tokens?

Tokens are the units LLMs process. Roughly: 1 token ≈ 0.75 words (English). Models have a fixed **context window** — the maximum number of tokens they can process in a single call.

More precisely, a token is a chunk of text that the model's tokenizer splits input into. Common English words are often single tokens. Longer words may be two or three tokens. Code tends to tokenize at about 1 token per 4–5 characters. Different languages tokenize at different rates — tokenizers are optimized for English, so other languages often use more tokens per word.

| Model | Context Window |
|-------|---------------|
| Claude Opus 4.6 | 200K tokens |
| GPT-4o | 128K tokens |
| Gemini 1.5 Pro | 1M tokens |

200K tokens is roughly 150,000 words or about 500 pages of text. That sounds enormous, but in a long-running agent session with many tool calls, it's possible to fill that context — especially if tool results are verbose (database query results, long web pages, extensive code files).

## Why Context Windows Matter for Agents

In a long-running agent loop, the conversation history grows with every tool call. Eventually you'll hit the context limit.

**The compounding problem:**
- Each tool call adds an observation to context
- Long tasks accumulate thousands of tokens in history
- At limit: errors, truncation, or degraded reasoning

Here's the growth pattern in a typical agent session:

```
Turn 1: User message (50 tokens) + response (200 tokens) = 250 total
Turn 3: + 2 tool calls with results (500 tokens each) = 1,500 total
Turn 10: + more tool calls = potentially 5,000+ tokens
Turn 50: + many more calls = potentially 50,000+ tokens
```

This growth is manageable for short tasks, but agents doing research, code generation, or multi-step analysis can generate tens of thousands of tokens per session. Planning for context growth is essential for production agents.

There's also a quality degradation effect. Studies and empirical observation both suggest that models pay less attention to content in the middle of a very long context. The beginning (system prompt and initial goal) and the end (recent turns) tend to have the most influence on responses. Important instructions or context that gets pushed into the middle of a very long conversation may be partially ignored.

## Context Management Strategies

### 1. Summarization

Periodically summarize older context and replace it with the summary.

```python
import anthropic

client = anthropic.Anthropic()

def count_tokens(messages: list[dict]) -> int:
    """Estimate token count for a message list."""
    result = client.messages.count_tokens(
        model="claude-opus-4-6",
        messages=messages,
    )
    return result.input_tokens

def summarize_messages(messages: list[dict]) -> str:
    """Summarize a list of messages into a compact form."""
    formatted = "\n".join(
        f"{m['role'].upper()}: {m['content'] if isinstance(m['content'], str) else '[tool calls]'}"
        for m in messages
    )
    response = client.messages.create(
        model="claude-opus-4-6",
        max_tokens=512,
        messages=[{
            "role": "user",
            "content": f"Summarize this conversation, preserving key facts and decisions:\n\n{formatted}"
        }]
    )
    return response.content[0].text

THRESHOLD = 50_000  # tokens

def maybe_compress_context(messages: list[dict]) -> list[dict]:
    """Compress the context if it exceeds the threshold."""
    if count_tokens(messages) < THRESHOLD:
        return messages

    # Keep the system message and last 5 turns; summarize the rest
    to_summarize = messages[:-10]  # everything except recent turns
    recent = messages[-10:]

    summary = summarize_messages(to_summarize)
    summary_message = {
        "role": "user",
        "content": f"[Previous conversation summary]: {summary}"
    }

    return [summary_message] + recent
```

The key insight here is what to keep versus summarize. You generally want to keep:
- The system prompt and initial user goal (establishes task context)
- Recent turns (most relevant to the next decision)
- Key tool results that haven't been fully processed yet

What you can safely summarize:
- Early tool calls whose results have already been incorporated into later reasoning
- Intermediate steps in a completed sub-task
- Verbose tool outputs that were already quoted/referenced

### 2. Sliding Window

Keep only the N most recent messages, always discarding the oldest.

```python
MAX_MESSAGES = 20

def sliding_window(messages: list[dict], max_messages: int = MAX_MESSAGES) -> list[dict]:
    """Keep only the most recent messages."""
    if len(messages) <= max_messages:
        return messages

    # Always preserve the first message (usually the user's initial task)
    initial = messages[:1]
    recent = messages[-(max_messages - 1):]
    return initial + recent
```

Sliding window is simpler than summarization but loses information. If an important fact was established in turn 5 and the window is now at turn 25, that fact is gone. Use sliding window when:
- The task is relatively self-contained in recent turns
- Tool results are ephemeral (their value is captured in subsequent reasoning)
- Losing early context is acceptable for your use case

### 3. External Memory

Store facts in a vector database; retrieve only what's relevant to the current step.

```python
# Store
memory.add({"fact": result, "timestamp": now()})

# Retrieve
relevant = memory.search(current_query, top_k=5)
context.inject(relevant)
```

External memory completely sidesteps the context window problem by keeping most information outside the context. Only relevant information (retrieved via semantic search) is injected into the current context window.

This approach requires more infrastructure (a vector store like ChromaDB or Pinecone, an embedding model to create vectors for new memories), but it scales to arbitrarily large knowledge bases. It's the right approach for agents that need to draw on a large corpus of facts or past experiences.

The semantic search step is both a feature and a limitation: you only get the facts that are semantically similar to the current query. If the agent needs a fact that doesn't match the current query well, it may not be retrieved. Good retrieval requires well-formed queries, which may require an extra LLM call to generate.

### 4. Task Decomposition

Break long tasks into smaller chunks, each with a clean context.

Rather than running one agent for 50 turns, run five agents for 10 turns each, passing only the key results (not the full history) from one to the next.

```python
def decomposed_research(topic: str) -> str:
    # Agent 1: Gather raw data (new context)
    raw_data = research_agent(topic)

    # Agent 2: Analyze (new context, receives only the output)
    analysis = analysis_agent(topic, raw_data)

    # Agent 3: Synthesize (new context, receives key outputs)
    synthesis = synthesis_agent(topic, analysis)

    return synthesis
```

Each agent starts fresh. The only information carried between agents is the intentionally selected output of the previous stage — not the entire conversation history. This keeps each agent's context lean and focused.

Task decomposition is often the most effective context management strategy for complex tasks because it also naturally structures the work. The parallel with human team workflows is intentional: you don't have one person do all 50 steps of a complex research project — you break it into phases, each handled by someone fresh to that stage.

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

Counting tokens before sending is useful in agents that accumulate long conversation histories. You can check the token count before each API call and trigger context management (summarization, sliding window) when approaching the model's limit.

At 200K tokens for Claude, a reasonable threshold to start managing context is around 150K — giving yourself 50K tokens of headroom for the next few turns of conversation.

## Cost Implications

Token count directly affects API costs. Both input and output tokens are billed, though typically at different rates.

For agents running many iterations:
- Verbose tool results (returning more data than needed) add up quickly
- Large system prompts run on every API call — keep them concise
- Long conversation histories are re-sent with every API call
- Summarization itself costs tokens, but the savings usually outweigh the cost

A practical approach is to track cumulative token usage in long-running agent sessions:

```python
total_input_tokens = 0
total_output_tokens = 0

for _ in range(max_turns):
    response = client.messages.create(...)
    total_input_tokens += response.usage.input_tokens
    total_output_tokens += response.usage.output_tokens

    if total_input_tokens + total_output_tokens > MAX_TOKENS:
        break  # Stop before costs become excessive
```

## See Also

- [Tools, Skills & Memory](/tools-memory/) — External memory with vector stores
- [Agentic Workflows](/agentic-workflows/) — Task decomposition for long workflows
- [Code Examples](/code-examples/) — Token counting in practice
