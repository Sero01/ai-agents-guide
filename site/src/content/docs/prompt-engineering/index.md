---
title: Prompt Engineering for Agents
description: How to write effective prompts specifically for AI agents and agentic workflows.
---

# Prompt Engineering for Agents

Prompting agents is different from prompting for a single response. Agents run in loops, make decisions, and can compound errors — which changes what makes a good prompt.

## Core Principles

### 1. Define the Role Clearly

Agents perform better with a clear role definition:

```
You are a research agent. Your job is to find accurate, up-to-date information 
using the tools available to you. You do not summarize from memory — you always 
verify claims by searching.
```

Vague roles lead to inconsistent behavior. Be specific.

### 2. Define the Goal, Not the Path

Tell the agent what to achieve, not every step. Agents are good at figuring out how; be clear on what and why.

```
# Too prescriptive:
First search for X, then read the page, then extract Y, then format as Z

# Better:
Find the current price of X from a reliable source and return it in JSON format
```

### 3. Define What "Done" Looks Like

Agents need a clear stopping condition. Without one, they loop unnecessarily or stop too early.

```
You are done when you have:
- Found a price from at least one authoritative source
- Verified it is current (within 24 hours)
- Returned it in the format: {"price": number, "currency": string, "source": string}
```

### 4. Handle Uncertainty Explicitly

Tell the agent what to do when it can’t complete the task:

```
If you cannot find the information after 3 search attempts, return:
{"error": "not_found", "attempts": [list of searches tried]}

Do not make up information.
```

## Tool Use Prompting

### Be explicit about when to use tools

```
Always use the search tool to verify facts. Do not answer from memory for 
any factual claim that could have changed in the last year.
```

### Specify tool use constraints

```
You may call the database tool at most 5 times per request.
Batch related queries when possible.
```

### Handle tool errors

```
If a tool call returns an error:
1. Log the error in your reasoning
2. Try an alternative approach
3. If 3 attempts fail, report the error to the user
```

## Multi-Agent Prompting

### Orchestrator prompts

Orchestrators need a clear picture of available workers:

```
You coordinate a team of agents:
- research_agent: web search and fact-checking
- writer_agent: content generation
- reviewer_agent: quality review

Break the user’s task into subtasks and assign each to the appropriate agent.
Wait for each agent’s response before proceeding.
```

### Worker prompts

Workers need narrow, well-defined roles:

```
You are a specialized writer agent. You receive a research brief and produce 
well-structured content. You do not do research yourself — if you need 
additional information, request it explicitly.
```

## Common Mistakes

### Over-specifying the path
Telling the agent every step removes its ability to adapt. Define outcome, not procedure.

### Under-specifying the format
If you need structured output, specify it exactly. "Return JSON" isn’t enough — show the schema.

### No stopping condition
Without a clear end state, agents loop or stop arbitrarily.

### Ignoring error cases
Agents will encounter errors. If you don’t say what to do, they’ll improvise — often badly.

### Making the system prompt too long
Every token in the system prompt is paid for every call. Keep it to what the agent actually needs.

## System Prompt Template

```markdown
## Role
[What this agent is and does]

## Goal
[What it’s trying to achieve]

## Tools
[List of available tools and when to use each]

## Output Format
[Exactly what the output should look like]

## Stopping Conditions
[When the task is complete]

## Error Handling
[What to do when things go wrong]

## Constraints
[Any hard limits: max calls, forbidden actions, etc.]
```
