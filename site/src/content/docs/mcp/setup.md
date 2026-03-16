---
title: "MCP Setup and Installation: Claude Desktop and Claude Code"
description: "Step-by-step instructions for setting up MCP with Claude Desktop and Claude Code. Covers config file locations, adding servers, transport types, environment variables, and troubleshooting."
sidebar:
  order: 2
head:
  - tag: script
    attrs:
      type: application/ld+json
    content: |
      {"@context":"https://schema.org","@type":"TechArticle","headline":"MCP Setup and Installation: Claude Desktop and Claude Code","description":"Step-by-step instructions for setting up MCP with Claude Desktop and Claude Code. Covers config file locations, adding servers, transport types, environment variables, and troubleshooting.","url":"https://agentguides.dev/mcp/setup/","datePublished":"2026-01-01","dateModified":"2026-02-23","author":{"@type":"Person","name":"Parvez Ahmed"},"publisher":{"@type":"Person","name":"Parvez Ahmed"},"keywords":"MCP setup, MCP installation, Model Context Protocol setup, Claude Desktop MCP, Claude Code MCP, MCP tutorial, AI tools setup"}
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

Node.js is required for most official MCP servers, which are distributed as npm packages. Even if your own MCP servers are Python-based, you'll likely need Node.js for the official servers in the ecosystem.

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

If the file doesn't exist yet, create it. If the directory doesn't exist, create that too.

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

Replace `/Users/you/Documents` with the directory you want Claude to have access to. The filesystem server restricts access to the specified path — Claude won't be able to read or write files outside that directory.

The `command` and `args` array tells Claude Desktop how to start the server. Claude Desktop will run `npx -y @modelcontextprotocol/server-filesystem /Users/you/Documents` as a subprocess when you open a chat session.

### 4. Restart Claude Desktop

After saving the config, restart Claude Desktop. You'll see a tools icon (🔧) in the chat input — click it to verify your servers loaded.

If the tools icon doesn't appear, or if it shows fewer tools than expected, check the troubleshooting section below.

### 5. Verify the Setup

In a new chat session, ask Claude: "What tools do you have access to?" It should list the tools exposed by your configured servers. For the filesystem server, you should see tools like `read_file`, `write_file`, `list_directory`, and others.

## Option B: Claude Code CLI

Claude Code reads MCP config from `.claude/settings.json` in your project root, or from `~/.claude/settings.json` globally.

The project-level config applies only when you run Claude Code from within that project directory. The global config applies in all sessions. Most developers use the project-level config for project-specific tools (filesystem, project database) and the global config for universal tools (web search, memory).

### Project-level config

Create `.claude/settings.json` in your project root:

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

The `"."` path for the filesystem server grants access to the current directory (your project root). This is a common pattern for development workflows where Claude needs to read and write project files.

### Global config

Create `~/.claude/settings.json`:

```json
{
  "mcpServers": {
    "memory": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-memory"]
    }
  }
}
```

The memory server is a good candidate for global config because you generally want persistent memory available across all Claude Code sessions, not just in specific projects.

### Verify it's working

```bash
# List available MCP tools in the current project
claude mcp list
```

This command shows which servers are configured and which tools they expose in the current session.

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

The `command` and `args` fields are required for stdio transport. Claude Desktop or Claude Code will spawn this process when starting a session.

**SSE config** (remote HTTP):
```json
{
  "url": "http://localhost:8080/sse"
}
```

SSE transport is used for remote servers. Instead of spawning a subprocess, the MCP client connects to the specified URL. This is useful for server-side deployments where the MCP server is running independently.

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

The `env` field merges with the process environment. Variables you specify here are available to the server process as environment variables.

:::tip
Never hardcode secrets in your config files. Use environment variable references or a secrets manager in production.
:::

For local development, the `env` field in the config is convenient. For production or shared environments, use environment variables set in your shell or a secrets manager, and access them in the server code via `os.environ`.

## Configuring Multiple Servers

You can run multiple servers simultaneously:

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
      "env": { "GITHUB_TOKEN": "ghp_..." }
    },
    "database": {
      "command": "python",
      "args": ["db_server.py"],
      "env": { "DATABASE_URL": "postgresql://..." }
    }
  }
}
```

All servers in the config start when you open a Claude session. The model has access to all tools from all servers and decides which to call based on the task.

Keys in the `mcpServers` object are server names — they're used for display purposes and in logs. Choose names that identify the server's purpose clearly.

## Troubleshooting

**Server not appearing in Claude Desktop:**
- Check the config file is valid JSON: `python3 -m json.tool < config.json`
- Ensure the command is in your `PATH`: run `which npx` or `which python3`
- Check Claude Desktop logs: `~/Library/Logs/Claude/` (macOS) or `%APPDATA%\Claude\logs\` (Windows)

**Server crashes immediately:**
- Run the server command manually in your terminal to see error output
- Check the server's dependencies are installed (try `npm install` or `pip install`)
- Verify the arguments are correct — paths must exist, API keys must be valid

**Server loads but tools don't work:**
- Test the server directly with the MCP inspector: `npx @modelcontextprotocol/inspector <command> <args>`
- Check that the required environment variables are set
- Look at the server's logs (written to stderr by convention)

**`claude mcp list` shows no servers:**
- Check that `.claude/settings.json` exists and is valid JSON
- Verify you're running Claude Code from the correct project directory
- Try the global config at `~/.claude/settings.json` as a fallback

## Security Considerations

MCP servers can read files, query databases, make HTTP requests, and take other actions on your behalf. Before adding any MCP server, consider:

- **What can it access?** Check the server's documentation and source code to understand what data it can read.
- **What can it write?** Some servers can write or delete data. Understand the blast radius if the server behaves unexpectedly.
- **Where does the data go?** Does the server send data to external services? Is that appropriate for your data?
- **Who maintains it?** Official Anthropic servers are reviewed and maintained. Community servers vary. Review the source before adding.

The filesystem server is worth special attention: specify the minimum directory necessary, not your entire home directory. A server with access to `/` on your system can read any file you have access to.

## Next Steps

- [Available Servers](/mcp/servers/) — Pre-built servers for common services
- [Building MCP Servers](/mcp/building-servers/) — Create your own
