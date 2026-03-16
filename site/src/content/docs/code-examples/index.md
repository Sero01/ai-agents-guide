---
title: "AI Agent Code Examples: Runnable Python Code for Every Concept"
description: "Complete, runnable Python code examples for AI agents: ReAct agents from scratch, parallel multi-agent patterns, MCP server implementations, and tool calling with the Claude API."
sidebar:
  order: 1
head:
  - tag: script
    attrs:
      type: application/ld+json
    content: |
      {"@context":"https://schema.org","@type":"TechArticle","headline":"AI Agent Code Examples: Runnable Python Code for Every Concept","description":"Complete, runnable Python code examples for AI agents: ReAct agents from scratch, parallel multi-agent patterns, MCP server implementations, and tool calling with the Claude API.","url":"https://agentguides.dev/code-examples/","datePublished":"2026-01-01","dateModified":"2026-02-23","author":{"@type":"Person","name":"Parvez Ahmed"},"publisher":{"@type":"Person","name":"Parvez Ahmed"},"keywords":"AI agent code examples, Python AI agent, ReAct agent code, multi-agent code, MCP server code, LangChain examples, CrewAI examples, AutoGen examples"}
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

This example builds a complete ReAct agent without any framework. It demonstrates the core agent loop: send a message, check if the model wants to call a tool, execute the tool, feed the result back, repeat.

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

Let's trace through what happens when you call `run_agent("What is 137 * 89 + 42?")`:

1. The initial message is added to `messages` and sent to Claude.
2. Claude sees the calculator tool available and decides to use it. It responds with `stop_reason="tool_use"` and includes a `tool_use` block in `response.content`.
3. The code appends Claude's response (including the tool call) to `messages` — this is important, the model needs to see its own tool calls in the conversation history.
4. The tool call is extracted, `calculator("137 * 89 + 42")` is executed, and the result is packaged as a `tool_result` message.
5. The `tool_result` is appended to `messages` and the loop continues.
6. On the next iteration, Claude receives the calculator result and generates a final answer. This time `stop_reason="end_turn"`, so the function returns the text response.

The `max_turns` guard prevents infinite loops in case the agent gets stuck. Ten turns is generous for most tasks; for simple tool-calling agents, you'll rarely need more than three.

## Agent with Multiple Tools

Extending the agent to handle multiple tools:

```python
import anthropic

client = anthropic.Anthropic()

TOOLS = [
    {
        "name": "calculator",
        "description": "Evaluate a math expression. Input should be a valid Python math expression.",
        "input_schema": {
            "type": "object",
            "properties": {
                "expression": {"type": "string"}
            },
            "required": ["expression"]
        }
    },
    {
        "name": "get_word_count",
        "description": "Count the words in a piece of text.",
        "input_schema": {
            "type": "object",
            "properties": {
                "text": {"type": "string"}
            },
            "required": ["text"]
        }
    },
    {
        "name": "reverse_string",
        "description": "Reverse a string.",
        "input_schema": {
            "type": "object",
            "properties": {
                "text": {"type": "string"}
            },
            "required": ["text"]
        }
    }
]

def execute_tool(name: str, args: dict) -> str:
    if name == "calculator":
        try:
            return str(eval(args["expression"], {"__builtins__": {}}))
        except Exception as e:
            return f"Error: {e}"
    elif name == "get_word_count":
        return str(len(args["text"].split()))
    elif name == "reverse_string":
        return args["text"][::-1]
    return f"Unknown tool: {name}"

def run_agent(user_message: str) -> str:
    messages = [{"role": "user", "content": user_message}]

    for _ in range(10):
        response = client.messages.create(
            model="claude-opus-4-6",
            max_tokens=1024,
            tools=TOOLS,
            messages=messages,
        )

        if response.stop_reason == "end_turn":
            return next(b.text for b in response.content if hasattr(b, "text"))

        messages.append({"role": "assistant", "content": response.content})
        tool_results = [
            {
                "type": "tool_result",
                "tool_use_id": block.id,
                "content": execute_tool(block.name, block.input),
            }
            for block in response.content
            if block.type == "tool_use"
        ]

        if tool_results:
            messages.append({"role": "user", "content": tool_results})

    return "Max turns reached"

print(run_agent("How many words is 'The quick brown fox'? Then reverse that sentence."))
```

This version uses a single `execute_tool` dispatcher instead of if/else chains in the main loop. As the number of tools grows, centralizing dispatch logic keeps the agent loop clean.

Note that Claude may call multiple tools in a single response — the list comprehension in `tool_results` handles this by iterating over all `tool_use` blocks in `response.content`. This is important: only processing the first tool call would break agents that batch tool calls.

## Streaming Agent Responses

For real-time display of agent output:

```python
import anthropic

client = anthropic.Anthropic()

with client.messages.stream(
    model="claude-opus-4-6",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Explain how tool calling works in AI agents."}],
) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)
print()  # newline at end
```

Streaming is useful in chat interfaces where you want the response to appear word-by-word rather than all at once after a delay. The `text_stream` attribute yields individual text chunks as they arrive from the API.

For agents with tool calls, streaming is more complex because you need to accumulate the full tool call before executing it. The Anthropic SDK's streaming API provides events you can listen to for this purpose.

## Token Counting Before Sending

```python
import anthropic

client = anthropic.Anthropic()

messages = [{"role": "user", "content": "Explain the ReAct pattern for AI agents."}]

# Count tokens without sending
token_count = client.messages.count_tokens(
    model="claude-opus-4-6",
    messages=messages,
)
print(f"This request will use ~{token_count.input_tokens} input tokens")

# Proceed only if within budget
if token_count.input_tokens < 10_000:
    response = client.messages.create(
        model="claude-opus-4-6",
        max_tokens=1024,
        messages=messages,
    )
    print(response.content[0].text)
```

Counting tokens before sending is useful in agents that accumulate long conversation histories. You can check the token count before each API call and trigger context management (summarization, sliding window) when approaching the model's limit.

## Common Patterns Summary

Looking across these examples, a few patterns repeat consistently:

**The message accumulation pattern**: Every example builds up a `messages` list that grows with each turn. The critical rule is that the model's response — including tool calls — must be appended to `messages` before the tool results. Skipping this step breaks the conversation structure and causes errors.

**The tool dispatcher pattern**: As tools increase, routing tool calls through a single dispatcher function (rather than nested if/else blocks in the main loop) keeps the agent loop clean. The dispatcher maps tool names to Python functions and handles unknown tools gracefully.

**The turn limit**: Every agent loop should have a maximum turn count. An agent that loops indefinitely due to a stuck state or a misunderstood task will accumulate costs and never return. Ten turns is a reasonable default for most tasks; increase it only when you have a concrete reason.

**Returning errors as strings**: When a tool fails, return the error as a text string rather than raising an exception. The model can read an error message and adapt — retry with different arguments, explain to the user, or try a different approach. An unhandled exception crashes the loop.

**Structured output for validation**: When you need the model to produce machine-readable output, request JSON and validate it. Structured output reduces the chance of format errors in downstream processing and makes it easier to extract specific values from responses.

**Idempotent tool implementations**: Write tools so that calling them twice with the same arguments produces the same result (or at least doesn't cause harm). Agents sometimes retry tool calls when results are ambiguous, so tools that have destructive side effects on repeated calls are dangerous. A tool that reads data is naturally idempotent. A tool that sends an email is not — guard it carefully.

These patterns apply whether you're building a simple calculator agent or a complex multi-step research pipeline. Getting comfortable with them before adding framework abstractions makes the frameworks much easier to understand and debug.

## See Also

- [AI Agents: Concepts & Architecture](/ai-agents/) — Understanding the agent loop
- [Multi-Agent Pipelines](/agentic-workflows/multi-agent/) — Parallel agents with asyncio
- [Tokens & Context](/ai-agents/tokens-context/) — Managing context in long-running agents
- [MCP: Building Servers](/mcp/building-servers/) — Complete MCP server code
