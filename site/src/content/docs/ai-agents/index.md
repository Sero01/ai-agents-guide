---
title: "What Are AI Agents? Concepts, Architecture, and How They Work"
description: "A developer-focused explanation of AI agents: what they are, how the ReAct loop works, and the core architecture behind agent systems. Includes code and diagrams."
sidebar:
  order: 1
head:
  - tag: script
    attrs:
      type: application/ld+json
    content: |
      {"@context":"https://schema.org","@type":"TechArticle","headline":"What Are AI Agents? Concepts, Architecture, and How They Work","description":"A developer-focused explanation of AI agents: what they are, how the ReAct loop works, and the core architecture behind agent systems.","url":"https://agentguides.dev/ai-agents/","datePublished":"2026-01-01","dateModified":"2026-02-23","author":{"@type":"Person","name":"Parvez Ahmed"},"publisher":{"@type":"Person","name":"Parvez Ahmed"},"keywords":"AI agents, what are AI agents, AI agent architecture, ReAct loop, AI agent concepts, how AI agents work, artificial intelligence agents"}
  - tag: script
    attrs:
      type: application/ld+json
    content: |
      {"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://agentguides.dev/"},{"@type":"ListItem","position":2,"name":"AI Agents","item":"https://agentguides.dev/ai-agents/"}]}
  - tag: script
    attrs:
      type: application/ld+json
    content: |
      {"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"What makes something an AI agent vs a chatbot?","acceptedAnswer":{"@type":"Answer","text":"The key difference is autonomy and persistence. A chatbot handles single-turn requests. An AI agent persists across turns, maintains state, uses tools to affect the world, and runs in a loop: observe → think → act → observe. The minimal definition is a model + a loop + tools."}},{"@type":"Question","name":"What is the ReAct loop in AI agents?","acceptedAnswer":{"@type":"Answer","text":"The ReAct (Reason + Act) loop is the core pattern behind most AI agents. It has four steps: 1) Observe — receive input, 2) Think — reason about what to do next, 3) Act — call a tool or produce output, 4) Observe — receive the result and loop again. This continues until the task is complete."}},{"@type":"Question","name":"What tools do AI agents use?","acceptedAnswer":{"@type":"Answer","text":"AI agents can use any function exposed as a tool: web search, code execution, file system access, database queries, API calls, browser automation, and more. MCP (Model Context Protocol) standardizes how agents discover and use tools across different AI models."}}]}
---

An AI agent is a system that perceives its environment, reasons about it, and takes actions to achieve a goal — repeatedly, in a loop.

## What Makes Something an "Agent"?

The minimal definition: **a model + a loop + tools**.

```
while not done:
    observation → LLM → action → execute → observation
```

Most LLM chat interfaces are not agents — they're single-turn request/response. An agent persists across turns, maintains state, and uses tools to affect the world.

This distinction matters more than it might seem. A chatbot that answers questions about your database schema is useful. An agent that connects to your database, runs queries, finds anomalies, and sends a Slack notification is doing something fundamentally different — it's operating autonomously in the world rather than just producing text in response to a question.

The key properties that distinguish an agent from a chatbot are:

**Autonomy**: The agent decides what actions to take next, not the user. The user sets a goal; the agent figures out how to reach it.

**Tool use**: Agents can call functions that affect the external world — run code, search the web, read files, post to APIs. Without tools, a model can only produce text.

**Persistence**: Agents maintain state across multiple steps. Each action produces an observation that becomes context for the next decision.

**Loops**: Agents run in a cycle until a task is complete or they hit a stopping condition. A single model call is not an agent.

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

The "Reason" in ReAct refers to the model generating a thought before deciding what action to take. This explicit reasoning step — which might look like "I need to find the current price of AAPL. I should search for it." — is what separates ReAct from blind tool invocation. The model explains its reasoning before acting, which makes the behavior more interpretable and generally more accurate.

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

The LLM is the brain — it reads the current context (conversation history, tool results, system instructions) and decides what to do next. It either calls a tool or produces a final answer.

The tool dispatcher receives the model's tool call (a structured function call with a name and arguments) and routes it to the appropriate handler. The handler executes the function and returns a result.

Memory and state store everything the agent has observed across its execution: the initial user request, the sequence of tool calls, every result received. This accumulated context is what allows the agent to maintain coherent behavior across many steps.

## A Minimal Working Agent

Here's a complete, working agent in about 30 lines:

```python
import anthropic

client = anthropic.Anthropic()

TOOLS = [{
    "name": "web_search",
    "description": "Search the web for current information.",
    "input_schema": {
        "type": "object",
        "properties": {
            "query": {"type": "string", "description": "Search query"}
        },
        "required": ["query"]
    }
}]

def web_search(query: str) -> str:
    # In a real agent, this would call a search API
    return f"Search results for: {query} — [results would appear here]"

def run_agent(task: str) -> str:
    messages = [{"role": "user", "content": task}]

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
        results = []
        for block in response.content:
            if block.type == "tool_use":
                result = web_search(**block.input)
                results.append({
                    "type": "tool_result",
                    "tool_use_id": block.id,
                    "content": result,
                })
        if results:
            messages.append({"role": "user", "content": results})

    return "Max turns reached"
```

This demonstrates every essential component of an agent:
- The tools list tells the model what it can do
- The agent loop runs until `stop_reason == "end_turn"`
- Tool calls are detected in `response.content`
- Results feed back into the conversation as `tool_result` messages
- A turn limit prevents infinite loops

## What Agents Can and Can't Do

Agents are powerful for tasks that require multiple steps, require accessing external information or systems, or where the approach isn't fully determined in advance. Research tasks, coding tasks, data analysis, and complex workflows are natural fits.

Agents are not magic. They're limited by the quality of the underlying model, the tools they have access to, and the quality of their instructions. Common failure modes:

- **Tool misuse**: Calling the wrong tool, or calling a tool with incorrect arguments
- **Context degradation**: In very long runs, the model may lose track of earlier context or contradict earlier decisions
- **Looping**: Getting stuck in a loop if the task is unclear or a tool keeps returning unhelpful results
- **Hallucination**: Fabricating tool results rather than actually calling the tool (rare with well-designed tool schemas)

Designing agents well means anticipating these failure modes: clear tool descriptions, explicit stopping conditions, turn limits, and human-in-the-loop checkpoints for high-stakes actions.

## See Also

- [Agent Patterns](/ai-agents/patterns/) — Common design patterns for agent systems
- [Tokens & Context](/ai-agents/tokens-context/) — Managing context windows effectively
- [Code Examples](/code-examples/) — Complete runnable agent code
