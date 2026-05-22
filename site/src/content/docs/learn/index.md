---
title: "Learn the Fundamentals — AI Agents, Workflows, MCP, Frameworks"
description: "Concept explanations for AI agents, agentic workflows, the Model Context Protocol, Python frameworks, prompt engineering, and the building blocks behind every modern agent stack."
author: Parvez Ahmed
lastUpdated: 2026-05-23
sidebar:
  order: 1
head:
  - tag: meta
    attrs:
      property: og:title
      content: "Learn the Fundamentals — AI Agents, Workflows, MCP, Frameworks"
  - tag: meta
    attrs:
      property: og:description
      content: "Concept pages for AI agents, agentic workflows, the Model Context Protocol, frameworks, and prompt engineering. The conceptual foundation of the site."
  - tag: meta
    attrs:
      property: og:url
      content: https://agentguides.dev/learn/
  - tag: meta
    attrs:
      property: og:image
      content: https://agentguides.dev/og-default.png
  - tag: meta
    attrs:
      name: twitter:title
      content: "Learn the Fundamentals — AI Agents and Agentic Workflows"
  - tag: meta
    attrs:
      name: twitter:description
      content: "Conceptual foundation for AI agents, workflows, MCP, and frameworks."
  - tag: meta
    attrs:
      name: twitter:image
      content: https://agentguides.dev/og-default.png
  - tag: link
    attrs:
      rel: canonical
      href: https://agentguides.dev/learn/
  - tag: script
    attrs:
      type: application/ld+json
    content: |
      {"@context":"https://schema.org","@graph":[
        {"@type":"CollectionPage","@id":"https://agentguides.dev/learn/#collection","name":"Learn the Fundamentals","headline":"Learn the Fundamentals — AI Agents, Workflows, MCP, Frameworks","description":"Concept explanations for AI agents, agentic workflows, MCP, frameworks, prompt engineering, and the building blocks behind every modern agent stack.","url":"https://agentguides.dev/learn/","inLanguage":"en-US","dateModified":"2026-05-23","author":{"@type":"Person","name":"Parvez Ahmed","url":"https://github.com/Sero01"},"publisher":{"@type":"Person","name":"Parvez Ahmed","url":"https://agentguides.dev/about/"}},
        {"@type":"ItemList","name":"Learn — concept pages","numberOfItems":13,"itemListElement":[
          {"@type":"ListItem","position":1,"url":"https://agentguides.dev/ai-agents/","name":"AI Agents — Concepts & Architecture"},
          {"@type":"ListItem","position":2,"url":"https://agentguides.dev/ai-agents/patterns/","name":"Agent Patterns"},
          {"@type":"ListItem","position":3,"url":"https://agentguides.dev/ai-agents/tokens-context/","name":"Tokens & Context"},
          {"@type":"ListItem","position":4,"url":"https://agentguides.dev/agentic-workflows/","name":"Agentic Workflows"},
          {"@type":"ListItem","position":5,"url":"https://agentguides.dev/agentic-workflows/multi-agent/","name":"Multi-Agent Pipelines"},
          {"@type":"ListItem","position":6,"url":"https://agentguides.dev/mcp/","name":"What is MCP?"},
          {"@type":"ListItem","position":7,"url":"https://agentguides.dev/mcp/setup/","name":"MCP Setup & Installation"},
          {"@type":"ListItem","position":8,"url":"https://agentguides.dev/mcp/servers/","name":"Available MCP Servers"},
          {"@type":"ListItem","position":9,"url":"https://agentguides.dev/mcp/building-servers/","name":"Building MCP Servers"},
          {"@type":"ListItem","position":10,"url":"https://agentguides.dev/frameworks/","name":"Framework Comparison"},
          {"@type":"ListItem","position":11,"url":"https://agentguides.dev/getting-started/","name":"Getting Started"},
          {"@type":"ListItem","position":12,"url":"https://agentguides.dev/prompt-engineering/","name":"Prompt Engineering for Agents"},
          {"@type":"ListItem","position":13,"url":"https://agentguides.dev/agent-instructions/","name":"Agent Instructions (CLAUDE.md / AgentMD)"}
        ]},
        {"@type":"BreadcrumbList","itemListElement":[
          {"@type":"ListItem","position":1,"name":"Home","item":"https://agentguides.dev/"},
          {"@type":"ListItem","position":2,"name":"Learn","item":"https://agentguides.dev/learn/"}
        ]}
      ]}
---

The Learn section is the conceptual foundation of the site. The pages here explain how AI agents work, what agentic workflows actually are once you strip the marketing language, what the Model Context Protocol gives you that ad-hoc tool integrations do not, how the major Python frameworks differ in their design philosophy, and how token budgets and context windows shape every architectural decision you make. The intent is to give you a mental model strong enough that the [Reviews](/reviews/), [Best-Of](/best/), and [Build Tutorials](/build/) sections become navigable rather than overwhelming.

## A suggested reading path

The pages are short by design — most sit in the 1,000 to 1,800 word range — and they cross-link to one another aggressively. There is no required reading order, but a sensible progression for someone new to the space is: AI Agents (concepts), then Tokens & Context (the resource constraints that shape design), then Agent Patterns (the recurring shapes), then a framework page (LangChain, CrewAI, or AutoGen depending on your language preference), then Agentic Workflows for multi-step systems. From there, the MCP pages explain the protocol layer, and the Prompt Engineering page covers how to write instructions that produce stable behavior across model versions.

## Framework-neutral by design

These pages are deliberately framework-neutral where the topic allows it. The AI Agents page does not assume LangChain; the Agentic Workflows page does not assume CrewAI; the MCP pages explain the protocol regardless of which language you build in. We name specific tools when they illustrate a point well, but the intent is that the concepts here transfer to whichever stack you end up choosing.

## Revision policy

We update this section as the field moves. Significant changes are noted on the page they affect rather than buried in a changelog. The pages in Learn are the most stable on the site — concepts shift more slowly than products — but where they do shift, we revise rather than archive.

## Concepts & Architecture

- [AI Agents — Concepts & Architecture](/ai-agents/) — the minimum viable definition (model + loop + tools), the ReAct loop, and what separates an agent from a chatbot.
- [Agent Patterns](/ai-agents/patterns/) — recurring shapes: planner-executor, multi-agent, reflection, hierarchical, supervisor.
- [Tokens & Context](/ai-agents/tokens-context/) — how context windows fill, the worked example of a 50k-token session, and the common mistakes that blow up token bills.

## Agentic Workflows

- [Overview](/agentic-workflows/) — what differentiates a workflow from a single agent, and when to reach for which.
- [Multi-Agent Pipelines](/agentic-workflows/multi-agent/) — design principles for pipelines where multiple agents collaborate.

## Model Context Protocol

- [What is MCP?](/mcp/) — the protocol Anthropic published for connecting AI agents to tools and data sources.
- [Setup & Installation](/mcp/setup/) — getting MCP working in Claude Desktop and Claude Code.
- [Available Servers](/mcp/servers/) — what MCP servers exist today and what they expose.
- [Building MCP Servers](/mcp/building-servers/) — write your own MCP server end-to-end.

## Frameworks

- [Framework Comparison](/frameworks/) — design philosophy of each framework on a single page.
- [LangChain](/frameworks/langchain/) — explicit graphs, typed state, LangSmith tracing.
- [CrewAI](/frameworks/crewai/) — role and task abstraction, optimal for linear flows.
- [AutoGen](/frameworks/autogen/) — conversation-driven multi-agent.

## Foundations

- [Getting Started](/getting-started/) — virtualenvs, API keys, and the small amount of shell familiarity assumed across the tutorials.
- [Tools, Skills & Memory](/tools-memory/) — the building blocks an agent uses to affect the world.
- [Agent Instructions (CLAUDE.md / AgentMD)](/agent-instructions/) — the single highest-leverage prompt-engineering practice for working with AI coding tools.
- [Prompt Engineering for Agents](/prompt-engineering/) — patterns that produce stable behavior across model versions.
- [Code Examples](/code-examples/) — small reference snippets covering common agent operations.
