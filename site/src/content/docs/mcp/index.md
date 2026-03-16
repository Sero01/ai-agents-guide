---
title: "What is MCP? A Developer's Guide to Model Context Protocol"
description: "An explanation of Model Context Protocol (MCP) — the open standard for connecting AI agents to tools and data sources. Covers architecture, core concepts, and why it matters for agent development."
sidebar:
  order: 1
  badge:
    text: Hot
    variant: tip
head:
  - tag: script
    attrs:
      type: application/ld+json
    content: |
      {"@context":"https://schema.org","@type":"TechArticle","headline":"What is MCP? The Complete Model Context Protocol Guide 2026","description":"The #1 guide to Model Context Protocol (MCP) — the latest open standard for connecting AI agents to tools and data.","url":"https://agentguides.dev/mcp/","datePublished":"2026-01-01","dateModified":"2026-02-23","author":{"@type":"Person","name":"Parvez Ahmed"},"publisher":{"@type":"Person","name":"Parvez Ahmed"},"keywords":"MCP, Model Context Protocol, what is MCP, MCP guide, AI tools protocol, MCP Anthropic, AI agent tools, MCP tutorial"}
  - tag: script
    attrs:
      type: application/ld+json
    content: |
      {"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://agentguides.dev/"},{"@type":"ListItem","position":2,"name":"MCP","item":"https://agentguides.dev/mcp/"}]}
  - tag: script
    attrs:
      type: application/ld+json
    content: |
      {"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"What is MCP (Model Context Protocol)?","acceptedAnswer":{"@type":"Answer","text":"MCP is an open standard created by Anthropic that defines how AI models connect to external tools, data sources, and services. Think of it as USB-C for AI agents — one universal interface, endless compatible devices. Build an integration once, use it with any MCP-compatible model."}},{"@type":"Question","name":"How does MCP work?","acceptedAnswer":{"@type":"Answer","text":"MCP uses a client-server architecture. Your AI application contains an MCP client that communicates with MCP servers. Each server exposes tools, resources, and prompts. The AI model (like Claude) decides when to call tools, and the MCP client handles the communication with servers."}},{"@type":"Question","name":"What AI models support MCP?","acceptedAnswer":{"@type":"Answer","text":"MCP is supported by Claude (via Claude Desktop and Claude Code), and the ecosystem is growing rapidly. Because MCP is an open standard, any AI model or application can implement MCP client support to connect to the hundreds of available MCP servers."}}]}
---

**MCP (Model Context Protocol)** is an open standard created by Anthropic that defines how AI models connect to external tools, data sources, and services. Think of it as USB-C for AI agents — one universal interface, endless compatible devices.

## The Problem MCP Solves

Before MCP, every AI integration was bespoke:

- Claude needs a web search tool → write custom tool schema
- GPT-4 needs the same tool → write it again, differently
- You switch models → rewrite all your integrations

**MCP makes integrations portable.** Build once, use with any MCP-compatible model.

## How MCP Works

MCP uses a client-server architecture:

```
┌──────────────────────────────────────────────┐
│                 AI Application               │
│                                              │
│  ┌──────────────┐    ┌────────────────────┐  │
│  │  MCP Client  │◄──►│   Claude / LLM     │  │
│  │  (in your    │    │   (decides when    │  │
│  │   app)       │    │    to call tools)  │  │
│  └──────┬───────┘    └────────────────────┘  │
└─────────┼────────────────────────────────────┘
          │  MCP Protocol (JSON-RPC over stdio/SSE)
          │
┌─────────▼────────────────────────────────────┐
│              MCP Server                       │
│  (exposes tools, resources, prompts)          │
│                                              │
│  Tools:      search(), read_file(), query_db()│
│  Resources:  files, databases, APIs           │
│  Prompts:    reusable prompt templates        │
└──────────────────────────────────────────────┘
```

## Key Concepts

### Tools
Functions the AI can call. Like function calling, but standardized.

```json
{
  "name": "read_file",
  "description": "Read the contents of a file",
  "inputSchema": {
    "type": "object",
    "properties": {
      "path": {"type": "string"}
    }
  }
}
```

### Resources
Static or dynamic data the AI can access (files, database records, API responses). Unlike tools, resources are data — not actions.

### Prompts
Reusable prompt templates the server can expose to clients. Useful for standardizing complex multi-step prompts.

## Why Developers Love MCP

- **Portable**: Write one MCP server, use with Claude, Claude Code, Cursor, Windsurf, and any future MCP-compatible client
- **Secure**: Servers run in separate processes; you control what data they expose
- **Composable**: Use multiple MCP servers simultaneously
- **Ecosystem**: Hundreds of pre-built servers for common services

## What's Next

- [Setup & Installation](/mcp/setup/) — Get your first MCP server running in 5 minutes
- [Available Servers](/mcp/servers/) — Browse the pre-built server ecosystem
- [Building MCP Servers](/mcp/building-servers/) — Create your own custom server
