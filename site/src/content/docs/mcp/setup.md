---
title: "MCP Setup & Installation — Complete Guide for Claude Desktop & Claude Code (2026)"
description: "The most complete step-by-step MCP setup guide for Claude Desktop and Claude Code. Install Model Context Protocol on macOS, Linux, and Windows. Best practices and top troubleshooting tips."
sidebar:
  order: 2
head:
  - tag: script
    attrs:
      type: application/ld+json
    content: |
      {"@context":"https://schema.org","@type":"TechArticle","headline":"MCP Setup & Installation — Complete Guide for Claude Desktop & Claude Code (2026)","description":"The most complete step-by-step MCP setup guide for Claude Desktop and Claude Code. Install Model Context Protocol on macOS, Linux, and Windows.","url":"https://agentguides.dev/mcp/setup/","datePublished":"2026-01-01","dateModified":"2026-02-23","author":{"@type":"Person","name":"Parvez Ahmed"},"publisher":{"@type":"Person","name":"Parvez Ahmed"},"keywords":"MCP setup, MCP installation, Model Context Protocol setup, Claude Desktop MCP, Claude Code MCP, MCP tutorial, AI tools setup"}
  - tag: script
    attrs:
      type: application/ld+json
    content: |
      {"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://agentguides.dev/"},{"@type":"ListItem","position":2,"name":"MCP","item":"https://agentguides.dev/mcp/"},{"@type":"ListItem","position":3,"name":"Setup & Installation","item":"https://agentguides.dev/mcp/setup/"}]}
---

This tutorial gets you from zero to a working MCP setup in under 10 minutes.

## Prerequisites

- Node.js 18+ or Python 3.10+
- Claude Desktop (for local testing) or Claude Code CLI

## Option A: Claude Desktop (GUI)

### 1. Install Claude Desktop

Download and install Claude Desktop from the Anthropic website.

### 2. Configure MCP Servers

Claude Desktop reads MCP configuration from a JSON file:

**macOS/Linux:**
```bash
~/.config/claude/claude_desktop_config.json
```

**Windows:**
```
%APPDATA%\Claude\claude_desktop_config.json
```

### 3. Add a Server

Here's an example adding the official filesystem MCP server:

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/Users/you/Documents"
      ]
    }
  }
}
```

### 4. Restart Claude Desktop

After saving the config, restart Claude Desktop. You'll see a tools icon (🔧) in the chat input — click it to verify your servers loaded.

## Option B: Claude Code CLI

Claude Code reads MCP config from `.claude/settings.json` in your project root, or from `~/.claude/settings.json` globally.

### Project-level config

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "."]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "your-github-token"
      }
    }
  }
}
```

### Verify it's working

```bash
# List available MCP tools in the current project
claude mcp list
```

## Transport Types

MCP supports two transport mechanisms:

| Transport | Use Case |
|-----------|----------|
| **stdio** | Local servers (most common) — server runs as a subprocess |
| **SSE** | Remote servers — server runs as an HTTP service |

**stdio config** (local subprocess):
```json
{
  "command": "python",
  "args": ["my_server.py"]
}
```

**SSE config** (remote HTTP):
```json
{
  "url": "http://localhost:8080/sse"
}
```

## Adding Environment Variables

Pass API keys and config to MCP servers via the `env` field:

```json
{
  "mcpServers": {
    "my-server": {
      "command": "python",
      "args": ["server.py"],
      "env": {
        "API_KEY": "sk-...",
        "DATABASE_URL": "postgresql://..."
      }
    }
  }
}
```

:::tip
Never hardcode secrets in your config files. Use environment variable references or a secrets manager in production.
:::

## Troubleshooting

**Server not appearing in Claude Desktop:**
- Check the config file is valid JSON (`json.tool < config.json`)
- Ensure the command is in your `PATH`
- Check Claude Desktop logs: `~/Library/Logs/Claude/` (macOS)

**Server crashes immediately:**
- Run the server command manually in your terminal to see error output
- Check the server's dependencies are installed

## Next Steps

- [Available Servers](/mcp/servers/) — Pre-built servers for common services
- [Building MCP Servers](/mcp/building-servers/) — Create your own
