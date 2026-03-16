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
      {"@context":"https://schema.org","@type":"TechArticle","headline":"What is MCP? A Developer's Guide to Model Context Protocol","description":"An explanation of Model Context Protocol (MCP) — the open standard for connecting AI agents to tools and data sources. Covers architecture, core concepts, and why it matters for agent development.","url":"https://agentguides.dev/mcp/","datePublished":"2026-01-01","dateModified":"2026-02-23","author":{"@type":"Person","name":"Parvez Ahmed"},"publisher":{"@type":"Person","name":"Parvez Ahmed"},"keywords":"MCP, Model Context Protocol, what is MCP, MCP guide, AI tools protocol, MCP Anthropic, AI agent tools, MCP tutorial"}
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

This fragmentation was a real problem. Companies maintaining AI systems were often running three or four different versions of the same integration, one for each model provider they supported. When a new model came out, they had to build a new integration from scratch.

**MCP makes integrations portable.** Build once, use with any MCP-compatible model.

The protocol also separates concerns cleanly. Your application code handles the AI model interaction. MCP servers handle specific capabilities (database access, file operations, web search). Each server is independently deployable, testable, and shareable.

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

Your AI application embeds an MCP client. When the model wants to use a capability (say, read a file), it calls the tool. The MCP client routes that call to the appropriate MCP server. The server executes the operation and returns the result. The result flows back to the model.

MCP servers are separate processes. They communicate with the MCP client over standard I/O (stdio) for local servers, or over Server-Sent Events (SSE) for remote servers. This process isolation means a buggy or compromised server can't directly affect your main application.

## Key Concepts

### Tools

Functions the AI can call. Like function calling, but standardized across all MCP servers and clients.

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

When the model calls `read_file`, the MCP client sends the call to the server that exposes this tool. The server reads the file and returns its contents. The model never directly accesses the filesystem — everything goes through the server's interface.

Tool schemas in MCP follow the same JSON Schema format as function calling in the Claude API. If you're familiar with writing tool schemas for the Claude API, you'll find MCP tool definitions immediately familiar.

### Resources

Static or dynamic data the AI can access (files, database records, API responses). Unlike tools, resources are data — not actions. The distinction matters: tools do things and may have side effects; resources just provide information.

A file on disk is a resource. A list of items from a database is a resource. A web page is a resource. Resources can be read by the model to gather context without triggering an action.

### Prompts

Reusable prompt templates the server can expose to clients. Useful for standardizing complex multi-step prompts that work well for specific tasks. For example, a code review server might expose a structured code review prompt that the user can invoke with a single command.

## The Transport Layer

MCP supports two transport mechanisms, which determines how the MCP client and server communicate:

**stdio (Standard I/O)**: The server runs as a local subprocess. The MCP client communicates with it via stdin/stdout. This is the most common setup for local MCP servers and is the transport used in Claude Desktop and Claude Code configurations.

**SSE (Server-Sent Events)**: The server runs as an HTTP server. The MCP client connects to it over HTTP. This is used for remote servers — for example, a company-hosted MCP server that multiple users connect to.

For development and local use, stdio is simpler — you just specify the command to start the server in your config file. For sharing servers across a team or building a service, SSE is appropriate.

## Why Developers Use MCP

**Portability**: Write one MCP server, use it with Claude, Claude Code, Cursor, Windsurf, and any future MCP-compatible client. The ecosystem is growing, so servers you build today will become accessible to more tools over time.

**Security**: Servers run in separate processes. You control what data each server exposes. A server for reading your documents doesn't have to have access to your database. Fine-grained isolation means you can give agents access to what they need without exposing everything.

**Composability**: Use multiple MCP servers simultaneously. One session can have a GitHub server (for code operations), a filesystem server (for file access), and a database server (for data access) all active at once. The model decides which tool from which server to use for each task.

**Ecosystem**: Hundreds of pre-built servers exist for common services. Before building a custom server, check if one already exists for your use case.

## MCP vs. Direct Tool Calling

You can build tool-calling agents without MCP — just define tool schemas and call them directly in your code. So why use MCP?

The answer is reuse and standardization. A custom tool you write for Claude only works in your specific application. An MCP server you build can be used by Claude Desktop, Claude Code, Cursor, and any other MCP-compatible tool. It can be shared with the community and used by other developers.

For internal-only tools that are application-specific, direct tool calling is simpler. For capabilities you want to be reusable or shareable, MCP is the better choice.

## What's Next

- [Setup & Installation](/mcp/setup/) — Get your first MCP server running in 5 minutes
- [Available Servers](/mcp/servers/) — Browse the pre-built server ecosystem
- [Building MCP Servers](/mcp/building-servers/) — Create your own custom server
