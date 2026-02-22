---
title: Agent Framework Comparison
description: LangChain, CrewAI, AutoGen, and more — how to choose the right framework for your use case.
sidebar:
  order: 1
---

Choosing a framework shapes how you build, debug, and scale your agents. Here's an honest comparison.

## Quick Comparison

| Framework | Best For | Maturity | Abstraction |
|-----------|----------|----------|-------------|
| **LangChain** | General-purpose, large ecosystem | High | High |
| **CrewAI** | Multi-agent role-based systems | Medium | Medium |
| **AutoGen** | Conversational multi-agent | Medium | Medium |
| **Raw API** | Full control, production systems | N/A | None |

## When to Skip Frameworks

For production systems, frameworks often add more complexity than they solve. Direct API calls give you:
- Full control over prompts and error handling
- No hidden abstractions breaking between versions
- Better performance (no middleware overhead)
- Easier debugging

The 3-layer architecture in this guide (directives → orchestration → execution scripts) is an example of building without a framework.

## Detailed Pages

- [LangChain](/frameworks/langchain/)
- [CrewAI](/frameworks/crewai/)
- [AutoGen](/frameworks/autogen/)
