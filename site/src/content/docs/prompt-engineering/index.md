---
title: Prompt Engineering for Agents
description: Practical prompt engineering techniques specifically for agent systems, not just single-turn chat.
---

Prompt engineering for agents is different from single-turn chat. You're designing for a loop, not a response.

## System Prompt Structure for Agents

A good agent system prompt answers three questions:
1. **Who are you?** — Role, persona, constraints
2. **What do you have?** — Available tools and what each does
3. **How should you work?** — Decision-making process, output format, edge cases

```
You are a research assistant with access to web search and a Python code executor.

## Tools available
- `search(query)`: Web search. Use for facts, news, current data.
- `execute_python(code)`: Run Python code. Use for calculations, data processing, formatting.

## How to work
1. Think step-by-step before acting
2. Use tools when needed, not reflexively
3. If uncertain, ask before taking irreversible actions
4. Always cite your sources

## Constraints
- Do not access external APIs beyond the provided tools
- Do not store or transmit personal information
```

## Chain-of-Thought for Agents

Encourage explicit reasoning before tool calls. This reduces errors and makes debugging easier.

```
Bad:  "Search for X"  → calls search immediately
Good: "I need X to answer this. Let me search for it." → calls search
```

Use XML tags to separate reasoning from actions:

```
<thinking>
The user wants the latest AAPL price. I should search for this rather than
use potentially outdated training data.
</thinking>
<action>search("AAPL stock price today")</action>
```

## Few-Shot Examples in Agent Prompts

Show the agent example interactions to establish behavior patterns:

```
## Example interaction

User: What is 2+2?
Assistant: 4.
(Note: No tools needed for simple arithmetic. Answer directly.)

User: Who won the 2024 US election?
Assistant: <thinking>This is recent news, I should search.</thinking>
[calls search("2024 US election results")]
Based on the search results, ...
```

## Reducing Hallucination in Agents

- **Ground with tools**: If the agent has a search tool, instruct it to always search for factual claims
- **Explicit uncertainty**: Prompt the agent to say "I don't know" rather than guess
- **Output schemas**: Request structured output (JSON) to make validation easier

```python
# Request structured output to reduce hallucination
response = client.messages.create(
    model="claude-opus-4-6",
    system="Always respond in valid JSON matching the provided schema.",
    messages=[{"role": "user", "content": f"Schema: {schema}\n\nTask: {task}"}],
)
```

## Common Pitfalls

- **Over-prompting**: Too many instructions degrade performance. Keep prompts focused.
- **Conflicting instructions**: Contradictions confuse the model. Audit your system prompt regularly.
- **Prompt injection**: User input can manipulate agent behavior. Sanitize inputs and use separate context slots.
