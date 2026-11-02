---
title: "What Is MCP? Model Context Protocol and MCP Servers Explained"
description: "Model Context Protocol (MCP) is an open standard connecting AI apps to tools and data. How MCP clients and servers work, current transports, and client support."
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
      {"@context":"https://schema.org","@type":"TechArticle","headline":"What Is MCP? Model Context Protocol and MCP Servers Explained","description":"Model Context Protocol (MCP) is an open standard connecting AI apps to tools and data. How MCP clients and servers work, current transports, and client support.","url":"https://agentguides.dev/mcp/","datePublished":"2026-01-01","dateModified":"2026-11-02","author":{"@type":"Person","name":"Parvez Ahmed"},"publisher":{"@type":"Person","name":"Parvez Ahmed"},"keywords":"MCP, Model Context Protocol, what is MCP, MCP guide, AI tools protocol, MCP Anthropic, AI agent tools, MCP tutorial"}
  - tag: script
    attrs:
      type: application/ld+json
    content: |
      {"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://agentguides.dev/"},{"@type":"ListItem","position":2,"name":"MCP","item":"https://agentguides.dev/mcp/"}]}
  - tag: script
    attrs:
      type: application/ld+json
    content: |
      {"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"What is MCP (Model Context Protocol)?","acceptedAnswer":{"@type":"Answer","text":"MCP is an open standard that defines how AI applications connect to external tools, data sources, and services. Anthropic created it and in December 2025 donated it to the Agentic AI Foundation, a directed fund under the Linux Foundation. Think of it as USB-C for AI agents — one universal interface, endless compatible devices. Build an integration once, use it with any MCP-compatible client."}},{"@type":"Question","name":"How does MCP work?","acceptedAnswer":{"@type":"Answer","text":"MCP uses a client-server architecture. Your AI application contains an MCP client that communicates with MCP servers. Each server exposes tools, resources, and prompts. The AI model (like Claude) decides when to call tools, and the MCP client handles the communication with servers."}},{"@type":"Question","name":"What AI models support MCP?","acceptedAnswer":{"@type":"Answer","text":"MCP support lives in the client application rather than the model. Clients with MCP support include Claude, ChatGPT, Gemini, Microsoft Copilot, Visual Studio Code, and Cursor. Because MCP is an open standard, any AI application can implement a client and connect to any MCP server."}}]}
---

**MCP (Model Context Protocol)** is an open standard that defines how AI applications connect to external tools, data sources, and services. Think of it as USB-C for AI agents — one universal interface, endless compatible devices.

Anthropic created MCP and in December 2025 [donated it to the Agentic AI Foundation](https://blog.modelcontextprotocol.io/posts/2025-12-09-mcp-joins-agentic-ai-foundation/), a directed fund under the Linux Foundation. The current specification is version [2026-07-28](https://modelcontextprotocol.io/specification/2026-07-28/changelog).

## The Problem MCP Solves

Before MCP, every AI integration was bespoke:

- Claude needs a web search tool → write custom tool schema
- A GPT model needs the same tool → write it again, differently
- You switch models → rewrite all your integrations

This fragmentation was a real problem. Companies maintaining AI systems were often running three or four different versions of the same integration, one for each model provider they supported. When a new model came out, they had to build a new integration from scratch.

**MCP makes integrations portable.** Build once, use with any MCP-compatible model.

The protocol also separates concerns cleanly. Your application code handles the AI model interaction. MCP servers handle specific capabilities (database access, file operations, web search). Each server is independently deployable, testable, and shareable.

## How MCP Works

MCP uses a client-server architecture:

![MCP Client-Server Architecture — how AI applications connect to tools through the Model Context Protocol](/diagrams/mcp-architecture.svg)

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
          │  MCP Protocol (JSON-RPC over stdio/HTTP)
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

MCP servers are separate processes. They communicate with the MCP client over standard I/O (stdio) for local servers, or over Streamable HTTP for remote servers. This separation limits what a buggy server can touch in your main application, but it doesn't make a server safe to trust: whatever a server returns reaches the model, so a malicious server can attempt prompt injection.

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

MCP defines two standard transports, which determine how the MCP client and server communicate:

**stdio (Standard I/O)**: The server runs as a local subprocess. The MCP client communicates with it via stdin/stdout. This is the most common setup for local MCP servers and is the transport used in Claude Desktop and Claude Code configurations.

**Streamable HTTP**: The server runs as an HTTP service and the MCP client connects to it over HTTP. This is used for remote servers — for example, a company-hosted MCP server that multiple users connect to.

For development and local use, stdio is simpler — you just specify the command to start the server in your config file. For sharing servers across a team or building a service, use Streamable HTTP.

The older HTTP+SSE transport is [deprecated](https://modelcontextprotocol.io/specification/2026-07-28/changelog). Existing servers still using it should migrate to Streamable HTTP.

## Why Developers Use MCP

**Portability**: Write one MCP server and use it with any MCP-compatible client, including [Claude, ChatGPT, Gemini, Microsoft Copilot, Visual Studio Code, and Cursor](https://blog.modelcontextprotocol.io/posts/2025-12-09-mcp-joins-agentic-ai-foundation/).

**Security**: Servers run in separate processes. You control what data each server exposes. A server for reading your documents doesn't have to have access to your database, so you can give agents access to what they need without exposing everything. Only connect servers you trust, since their output reaches the model.

**Composability**: Use multiple MCP servers simultaneously. One session can have a GitHub server (for code operations), a filesystem server (for file access), and a database server (for data access) all active at once. The model decides which tool from which server to use for each task.

**Ecosystem**: The MCP project reported more than 10,000 active servers in December 2025, and there is an [official registry](https://registry.modelcontextprotocol.io/). Before building a custom server, check if one already exists for your use case.

## MCP vs. Direct Tool Calling

You can build tool-calling agents without MCP — just define tool schemas and call them directly in your code. So why use MCP?

The answer is reuse and standardization. A custom tool you write for Claude only works in your specific application. An MCP server you build can be used by Claude, ChatGPT, Cursor, and any other MCP-compatible tool. It can be shared with the community and used by other developers.

For internal-only tools that are application-specific, direct tool calling is simpler. For capabilities you want to be reusable or shareable, MCP is the better choice.

## Continue reading

- **[MCP Setup and Installation: Claude Desktop and Claude Code](/mcp/setup/)** — Step-by-step instructions for setting up MCP with Claude Desktop and Claude Code. Covers config file locations, adding servers, transport types, environment variables, and troubleshooting.
- **[MCP Servers: 20+ Pre-Built Servers for AI Agents](/mcp/servers/)** — A reference of pre-built MCP servers organized by category. Covers official Anthropic servers (GitHub, PostgreSQL, Filesystem, Slack) and community servers, with config examples.
- **[Build Your Own MCP Server: A Python Tutorial](/mcp/building-servers/)** — How to build a custom MCP server from scratch using the Python SDK. Covers tools, resources, error handling, and how to register your server with Claude Code and Claude Desktop.
