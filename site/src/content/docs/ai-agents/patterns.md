---
title: Agent Patterns
description: Common architectural patterns for building AI agents.
---

# Agent Patterns

Agent patterns are reusable architectural approaches for building reliable, capable AI agents. Rather than building from scratch, you combine these patterns to fit your use case.

## ReAct (Reason + Act)

The most widely used pattern. The agent alternates between reasoning steps and action steps.

**Flow:**
```
Thought: I need to find the current price of X
Action: search("current price of X")
Observation: Price is $Y
Thought: Now I have the price, I can calculate...
Action: calculate(Y * 1.2)
Observation: Result is $Z
Final Answer: The price with markup is $Z
```

**When to use:** General-purpose agents that need to use tools and reason about results.

**Frameworks:** LangChain’s `create_react_agent`, most default agent implementations.

---

## Plan-and-Execute

The agent creates a full plan first, then executes each step.

**Flow:**
```
1. Plan: ["Search for X", "Extract Y from results", "Calculate Z", "Write report"]
2. Execute step 1 → Observe
3. Execute step 2 → Observe
4. Execute step 3 → Observe
5. Execute step 4 → Final output
```

**When to use:** Tasks with a knowable sequence of steps. More predictable than ReAct.

**Tradeoff:** Less adaptive. If step 2 fails, the plan may not adjust well.

---

## Reflection / Self-Critique

After producing output, the agent evaluates its own work and revises.

**Flow:**
```
Generate → Critique ("Is this correct? What’s missing?") → Revise → Final
```

**When to use:** Quality-sensitive outputs (code, writing, analysis). When you need the agent to catch its own errors.

**Tradeoff:** Uses more tokens. May over-revise on good outputs.

---

## Tool-Augmented Generation

The simplest agent pattern: give the model tools and let it decide when to use them.

```
User: What’s the weather in Tokyo?
Agent: [calls weather_api("Tokyo")] → "It’s 22°C and sunny"
```

**When to use:** When you need to extend model knowledge with live data or external APIs.

**Frameworks:** OpenAI function calling, Claude tool use, LangChain tools.

---

## Memory-Augmented Agent

The agent retrieves relevant past context before responding.

**Flow:**
```
Query → Retrieve relevant memories → Augment prompt → Respond → Store new memory
```

**Types of memory:**
- **In-context**: Conversation history in the prompt (limited by context window)
- **Vector memory**: Semantic search over past interactions
- **External DB**: Structured storage queried by the agent

**When to use:** Long-running agents, personalization, agents that need to learn over time.

---

## Hierarchical Agents (Orchestrator + Workers)

An orchestrator delegates to specialized worker agents.

```
Orchestrator (high-level planning)
  ├── Research Agent (web search, summarization)
  ├── Code Agent (write and execute code)
  └── Writer Agent (produce final output)
```

**When to use:** Complex tasks requiring specialized capabilities. Reduces context bloat in any single agent.

**Challenge:** Coordinating results from workers. Orchestrator needs clear interfaces with each worker.

---

## Choosing a Pattern

| Pattern | Best for | Complexity |
|---------|----------|------------|
| ReAct | General tool use | Low |
| Plan-and-Execute | Structured tasks | Medium |
| Reflection | Quality-sensitive output | Medium |
| Tool-Augmented | Simple tool integration | Low |
| Memory-Augmented | Long-running, personalized | High |
| Hierarchical | Complex, multi-capability | High |

Start with the simplest pattern that works. Add complexity only when the simpler approach fails.
