---
title: What is MCP?
description: Model Context Protocol explained - what it is, why it exists, and how it works.
---

# What is MCP?

**MCP (Model Context Protocol)** is an open standard for connecting AI models to external tools and data sources. It defines how a model talks to a "server" that provides capabilities — tools to call, data to read, prompts to use.

Anthropic created MCP and released it as an open standard in 2024.

## The Problem MCP Solves

Before MCP, every AI tool integration was custom:
- OpenAI function calling uses one format
- Anthropic tool use uses another
- Each tool vendor builds its own connector
- You can’t reuse a tool built for one AI with another

MCP standardizes this. An MCP server works with any MCP-compatible client, regardless of which AI model powers it.

## The Architecture

```
┌───────────────┐    MCP     ┌───────────────┐
│  MCP Client    │ ◄──────► │  MCP Server   │
│ (Claude, etc) │ Protocol │ (your tools)  │
└───────────────┘          └───────────────┘
```

**MCP Client**: An AI application (Claude Desktop, Claude Code, any app using the MCP client SDK)

**MCP Server**: A process that exposes tools, resources, or prompts via the MCP protocol

## What MCP Servers Can Expose

### Tools
Functions the AI can call. Like function calling, but standardized.

```json
{
  "name": "search_web",
  "description": "Search the web and return results",
  "inputSchema": {
    "type": "object",
    "properties": {
      "query": {"type": "string"}
    }
  }
}
```

### Resources
Data the AI can read. Files, database records, API responses.

```
file:///documents/report.pdf
postgres://db/table/row
https://api.example.com/data
```

### Prompts
Reusable message templates with parameters.

## Transport Layers

MCP supports two transports:

- **stdio**: Server runs as a subprocess. Client communicates via stdin/stdout. Simple, local.
- **HTTP + SSE**: Server runs as a web service. Multiple clients, remote deployment.

## Why MCP Matters

1. **Reusability**: Build a tool once, use it with any MCP client
2. **Ecosystem**: Growing library of open-source MCP servers for common services
3. **Standardization**: One protocol to learn, not one per AI vendor
4. **Security**: Servers run in separate processes; clear permission model

## Quick Example

Here’s what using an MCP tool looks like from the model’s perspective:

1. Client connects to MCP server
2. Client asks: "What tools do you have?"
3. Server responds: "I have `read_file`, `write_file`, `list_files`"
4. User asks Claude: "What’s in my README?"
5. Claude calls `read_file({"filename": "README.md"})`
6. Server reads the file, returns content
7. Claude answers the user

See [Setup & Configuration](/mcp/setup) to get started.
