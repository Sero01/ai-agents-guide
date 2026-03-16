---
title: "About This Guide"
description: "About agentguides.dev — a developer-focused reference for building AI agents, agentic workflows, and AI-powered automation systems."
sidebar:
  order: 2
---

## What This Site Is

agentguides.dev is a free, code-first reference for developers building AI agents and agentic systems. It covers the concepts, tools, frameworks, and design patterns you need to go from "I've used ChatGPT" to "I can build production AI agents."

The content is deliberately technical. Every page assumes you can read and write Python. Most examples are runnable with minimal setup — install a package, set an API key, run the script. If you're looking for hype or high-level overviews, you'll probably find it thin. If you're trying to understand how something actually works and see working code, you're in the right place.

## What's Covered

The guide is organized around the layers of building an AI agent system:

**Foundations** — What an AI agent actually is, the ReAct loop, how the agent loop works mechanically, and the difference between a chatbot and an agent. This section assumes no prior agent experience but does assume software engineering background.

**Agentic Workflows** — How to structure multi-step AI automation pipelines, when to use a single agent versus a coordinated pipeline, how to design for failure, and how to add human-in-the-loop checkpoints. The distinction between a "workflow" and an "agent" matters in production and this section explains why.

**Model Context Protocol (MCP)** — MCP is an open standard from Anthropic for connecting AI models to external tools and data sources. The guide covers what MCP is, how to set it up with Claude Desktop and Claude Code, which pre-built servers are available, and how to build your own server from scratch. MCP is increasingly important for building composable agent systems.

**Agent Frameworks** — Honest comparisons of LangChain, CrewAI, and AutoGen, with complete code for each. The guide also covers when to skip frameworks entirely and use the raw API, which is often the right call for production systems.

**Tools, Skills, and Memory** — The mechanics of tool calling from an LLM's perspective, different memory architectures (in-context, vector, key-value, episodic), and how to build agents that can remember and act across sessions.

**Agent Instructions** — The CLAUDE.md / AgentMD pattern: placing structured instruction files in your project so AI coding assistants can immediately operate within your codebase conventions. This is one of the highest-leverage techniques for AI-assisted development.

**Prompt Engineering** — Writing system prompts designed for agent loops rather than single-turn chat. Covers chain-of-thought prompting, few-shot examples, anti-hallucination strategies, and common pitfalls.

**Code Examples** — A reference collection of complete, runnable Python examples including a from-scratch ReAct agent, parallel agent patterns with asyncio, and MCP server implementations.

## Who Maintains This

This guide is maintained by Parvez Ahmed, a software developer interested in practical applications of large language models. The source code for the site is publicly available at https://github.com/Sero01/ai-agents-guide.

The site is built with [Astro](https://astro.build) and [Starlight](https://starlight.astro.build), a documentation framework for Astro. Pages are written in Markdown. If you find an error, outdated information, or a missing topic, you can open an issue or pull request on GitHub.

## Why This Exists

The AI agent ecosystem moves quickly. New frameworks appear, protocols get standardized, and best practices evolve. Most available resources fall into one of two buckets: marketing copy that tells you AI agents will change everything but doesn't explain how, or vendor documentation that focuses on a specific tool without covering the broader picture.

This guide tries to sit in the middle: practical enough to give you working code, broad enough to explain the landscape, and honest enough to tell you when a tool or pattern isn't worth using.

A secondary motivation was learning. Writing clear technical explanations forces you to understand something well enough to teach it. The process of building this guide clarified a lot about how these systems fit together.

## Technical Decisions

**Framework**: Astro + Starlight. Astro generates a static site, which means fast page loads and easy hosting. Starlight provides the documentation structure, sidebar navigation, and search functionality. The stack is simple enough to contribute to without needing a complex local development environment.

**No JavaScript agents section**: The examples here use Python because most of the mature agent tooling (LangChain, CrewAI, AutoGen, the MCP SDK) has its most complete implementation in Python. That said, the concepts are language-agnostic, and the Claude API and MCP protocol work equally well from TypeScript or any other language.

**Raw API examples**: Many examples use the Anthropic Claude API directly rather than going through a framework. This is intentional. Frameworks add abstraction, and abstraction can obscure what's actually happening. Once you understand how tool calling works at the API level, the frameworks make more sense — and you'll know when to reach for them and when to go without.

**No affiliate links**: There are no affiliate or referral links on this site. Links to tools and libraries go directly to the project's official documentation or GitHub repository.

## How to Use This Guide

If you're new to AI agents, start with the [Getting Started](/getting-started/) page and follow the recommended reading order from there. If you're looking for something specific — how to set up MCP, how CrewAI's task system works, what the ReAct pattern is — use the sidebar navigation to jump directly to the relevant section.

Most pages include working code. The code is meant to be copied and run. If an example doesn't work, that's a bug — please open an issue on GitHub.

## Contributing

Contributions are welcome. If you spot an error, want to add an example, or think a topic is missing, open an issue or pull request at https://github.com/Sero01/ai-agents-guide.

For significant changes (new pages, major rewrites), opening an issue to discuss the approach first is appreciated before investing time in a pull request.

The content style is code-first and practical. New contributions should include at least one working code example and explain what the code does and why. Generic tutorials that could apply to any topic and don't teach anything specific to AI agents are not a good fit.
