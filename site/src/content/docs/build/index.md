---
title: "Build Tutorials — AI Agents, Workflows, and MCP, End-to-End"
description: "Step-by-step build tutorials for AI agents, agentic workflows, and MCP servers. Every tutorial includes working code, an architecture diagram, and the real cost to run it."
author: Parvez Ahmed
lastUpdated: 2026-05-23
sidebar:
  order: 1
head:
  - tag: meta
    attrs:
      property: og:title
      content: "Build Tutorials — AI Agents, Workflows, and MCP, End-to-End"
  - tag: meta
    attrs:
      property: og:description
      content: "Step-by-step tutorials with working code, real cost numbers, and architecture diagrams. Build AI agents, agentic workflows, and MCP servers."
  - tag: meta
    attrs:
      property: og:url
      content: https://agentguides.dev/build/
  - tag: meta
    attrs:
      property: og:image
      content: https://agentguides.dev/og/build.png
  - tag: meta
    attrs:
      name: twitter:title
      content: "Build Tutorials — AI Agents and Agentic Workflows"
  - tag: meta
    attrs:
      name: twitter:description
      content: "Working code, real cost, architecture diagrams. Build AI agents end-to-end."
  - tag: meta
    attrs:
      name: twitter:image
      content: https://agentguides.dev/og/build.png
  - tag: link
    attrs:
      rel: canonical
      href: https://agentguides.dev/build/
  - tag: script
    attrs:
      type: application/ld+json
    content: |
      {"@context":"https://schema.org","@graph":[
        {"@type":"CollectionPage","@id":"https://agentguides.dev/build/#collection","name":"Build Tutorials","headline":"Build Tutorials — AI Agents, Workflows, and MCP, End-to-End","description":"Step-by-step build tutorials for AI agents, agentic workflows, and MCP servers, with working code and real cost numbers.","url":"https://agentguides.dev/build/","inLanguage":"en-US","dateModified":"2026-05-23","author":{"@type":"Person","name":"Parvez Ahmed","url":"https://github.com/Sero01"},"publisher":{"@type":"Person","name":"Parvez Ahmed","url":"https://agentguides.dev/about/"},"image":"https://agentguides.dev/og/build.png"},
        {"@type":"ItemList","name":"All Build Tutorials","numberOfItems":1,"itemListElement":[
          {"@type":"ListItem","position":1,"url":"https://agentguides.dev/build/research-agent-with-crewai/","name":"Build a Research Agent with CrewAI"}
        ]},
        {"@type":"BreadcrumbList","itemListElement":[
          {"@type":"ListItem","position":1,"name":"Home","item":"https://agentguides.dev/"},
          {"@type":"ListItem","position":2,"name":"Build Tutorials","item":"https://agentguides.dev/build/"}
        ]}
      ]}
---

This section is for readers who learn by building. Every tutorial here ships with a working repository, end-to-end code that runs on a free-tier API key, an architecture diagram that matches the code, and a real cost number — how much it actually costs to run the example once. We do not publish tutorials that have been smoke-tested only on a happy path. Each one was executed from a clean environment by us before publication, with the failures and their fixes recorded in the post.

## Prerequisites for every tutorial

The tutorials assume Python 3.10 or newer (a few use TypeScript), a small amount of command-line familiarity, and an API key from one of the major providers — Anthropic, OpenAI, Google, or any provider compatible with the OpenAI SDK. We avoid tutorials that require a paid plan or a particular cloud account; if a step costs money, the post says so up front and gives a free-tier alternative wherever possible.

## What we cover

Topics covered include: building a research agent with CrewAI, wiring a multi-agent pipeline with LangGraph, writing your own MCP server in TypeScript, building a code-review agent using the Anthropic Claude Agent SDK, integrating Tavily and web search into an agent loop, adding persistent memory with Postgres or SQLite, deploying an agent backend to Cloudflare Workers, and instrumenting an agent with Helicone or Langfuse for observability. Each post explains not just how to wire it, but why each step is structured the way it is, and what changes if your goal is different from the reference scenario.

## How tutorials extend

Every build tutorial includes a "where to take it next" section at the end with three or four directions you could extend the project. These are not vague gestures — they are specific changes with the rough effort estimate next to them. The intent is that the tutorial is the starting point of a real project for you, not a one-off exercise you abandon as soon as it runs.

## All tutorials

- [Build a Research Agent with CrewAI](/build/research-agent-with-crewai/) — three-agent pipeline using planner, researcher, and writer roles with Tavily search and Claude Sonnet 4.6. ~$0.05 per run.

## Upcoming tutorials

Tutorials ship every one to two weeks. The next ones cover building an MCP server in TypeScript from scratch, writing a code-review agent with the Claude Agent SDK, deploying a long-running agent to Cloudflare Workers plus Durable Objects, wiring a typed agent flow with PydanticAI, and adding LangSmith / Langfuse tracing to an existing CrewAI deployment.

## Support and versioning

If you run into trouble executing a tutorial — a dependency conflict, an API behavior change, a cloud setup quirk — open an issue on the [companion repo](https://github.com/Sero01/ai-agents-guide) and we will fix the post. Tutorials are versioned to specific library releases and we update them when the underlying library ships a breaking change.

## Related on this site

- [Reviews](/reviews/) — pick the framework before you build with it.
- [Best-Of Guides](/best/) — shortlists for the supporting stack (observability, routers, vector DBs).
- [AI Models Leaderboard](/leaderboard/) — choose the model that hits your latency, cost, and capability targets.
- [Learn](/learn/) — concept pages on AI agents, agentic workflows, MCP, and prompt engineering.
