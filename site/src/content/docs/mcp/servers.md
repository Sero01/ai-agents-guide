---
title: "MCP Servers: 20+ Pre-Built Servers for AI Agents"
description: "A reference of pre-built MCP servers organized by category. Covers official Anthropic servers (GitHub, PostgreSQL, Filesystem, Slack) and community servers, with config examples."
sidebar:
  order: 3
head:
  - tag: script
    attrs:
      type: application/ld+json
    content: |
      {"@context":"https://schema.org","@type":"TechArticle","headline":"MCP Servers: 20+ Pre-Built Servers for AI Agents","description":"A reference of pre-built MCP servers organized by category. Covers official Anthropic servers and community servers, with complete config examples.","url":"https://agentguides.dev/mcp/servers/","datePublished":"2026-01-01","dateModified":"2026-02-23","author":{"@type":"Person","name":"Parvez Ahmed"},"publisher":{"@type":"Person","name":"Parvez Ahmed"},"keywords":"MCP servers, Model Context Protocol servers, AI agent tools, MCP GitHub, MCP PostgreSQL, MCP Slack, MCP Puppeteer"}
  - tag: script
    attrs:
      type: application/ld+json
    content: |
      {"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://agentguides.dev/"},{"@type":"ListItem","position":2,"name":"MCP","item":"https://agentguides.dev/mcp/"},{"@type":"ListItem","position":3,"name":"Available Servers","item":"https://agentguides.dev/mcp/servers/"}]}
---

The MCP ecosystem has hundreds of pre-built servers. Here are the most useful ones, organized by category. All official servers are maintained by Anthropic and are production-ready. Community servers vary in maturity but cover many specialized use cases.

## Official Servers (by Anthropic)

These are maintained by Anthropic and are production-ready.

| Server | Package | What it does |
|--------|---------|--------------|
| **Filesystem** | `@modelcontextprotocol/server-filesystem` | Read/write local files |
| **GitHub** | `@modelcontextprotocol/server-github` | Repos, issues, PRs, commits |
| **PostgreSQL** | `@modelcontextprotocol/server-postgres` | Query PostgreSQL databases |
| **SQLite** | `@modelcontextprotocol/server-sqlite` | Query SQLite databases |
| **Brave Search** | `@modelcontextprotocol/server-brave-search` | Web search via Brave API |
| **Fetch** | `@modelcontextprotocol/server-fetch` | HTTP requests / web scraping |
| **Memory** | `@modelcontextprotocol/server-memory` | Persistent key-value memory |
| **Puppeteer** | `@modelcontextprotocol/server-puppeteer` | Browser automation |
| **Slack** | `@modelcontextprotocol/server-slack` | Read/post Slack messages |
| **Google Drive** | `@modelcontextprotocol/server-gdrive` | Access Google Drive files |
| **Google Maps** | `@modelcontextprotocol/server-google-maps` | Maps, directions, places |

### Filesystem Server

The filesystem server is the most commonly used server for development workflows. It allows Claude to read, write, and navigate files within a specified directory.

You control what the server can access by specifying allowed directories in the config:

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/Users/you/projects/my-project"
      ]
    }
  }
}
```

The path argument restricts the server to that directory and its subdirectories. The model can't access files outside the allowed path, which is an important security property.

### GitHub Server

The GitHub server connects Claude to GitHub's API. Useful for code review workflows, issue management, and repository exploration.

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": { "GITHUB_TOKEN": "ghp_your_token_here" }
    }
  }
}
```

The `GITHUB_TOKEN` should be a fine-grained personal access token with only the permissions your workflow needs. For read-only workflows, grant only read access to repositories and issues. Don't use a token with write access to all repositories if you only need to read from one.

### PostgreSQL Server

Connects Claude to a PostgreSQL database for natural language queries and data exploration.

```json
{
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "POSTGRES_URL": "postgresql://user:password@localhost:5432/mydb"
      }
    }
  }
}
```

For production databases, use a read-only database user for the MCP server connection. This prevents accidental data modification through the AI interface. Never give the MCP server credentials with administrative privileges.

### Memory Server

The memory server provides persistent key-value storage across sessions. Unlike conversation history (which is session-scoped), memory server data persists indefinitely.

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

Claude can store and retrieve facts using this server. Useful for workflows where the agent needs to remember context from previous sessions — user preferences, project-specific facts, or ongoing task state.

## Community Servers

| Server | What it does |
|--------|--------------|
| **Playwright** | Browser automation (alternative to Puppeteer) |
| **Linear** | Project management (issues, cycles, projects) |
| **Jira** | Jira issue tracking |
| **Notion** | Read/write Notion pages and databases |
| **Stripe** | Payment information and transactions |
| **Cloudflare** | Workers, KV, D1, R2 management |
| **AWS** | S3, Lambda, EC2 operations |
| **Docker** | Container management |
| **kubectl** | Kubernetes cluster management |

Community servers vary in quality and maintenance status. Before adding a community server to a production workflow, review its source code (it will have access to your data and credentials), check when it was last updated, and verify it handles errors gracefully.

## Installing a Server

All Node.js-based servers can be run with `npx` (no installation required):

```bash
# Test a server directly
npx -y @modelcontextprotocol/server-filesystem /tmp
```

For Python-based servers:

```bash
pip install mcp-server-name
python -m mcp_server_name
```

The `npx -y` flag installs the package temporarily and runs it without prompting. This is convenient for trying servers out, but for production environments you may want to pin to a specific version:

```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-filesystem@0.6.0", "/path/to/dir"]
}
```

Pinning versions prevents unexpected behavior changes when a server package updates.

## Config Examples

### Full Development Setup

A config that provides filesystem access, GitHub integration, persistent memory, and web search:

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
    "memory": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-memory"]
    },
    "brave-search": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-brave-search"],
      "env": { "BRAVE_API_KEY": "BSA..." }
    }
  }
}
```

This setup gives Claude access to the current directory's files, GitHub, persistent memory, and web search — a comprehensive toolkit for software development tasks.

### Data Analysis Setup

Focused on data exploration with SQLite and filesystem access:

```json
{
  "mcpServers": {
    "sqlite": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-sqlite", "data.db"]
    },
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "./data"]
    }
  }
}
```

The filesystem server is restricted to the `./data` directory, and the SQLite server connects to `data.db`. Claude can explore the data files and query the database to answer analytical questions.

### Minimal Research Setup

Just web search for research-focused workflows:

```json
{
  "mcpServers": {
    "brave-search": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-brave-search"],
      "env": { "BRAVE_API_KEY": "your-key" }
    },
    "fetch": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-fetch"]
    }
  }
}
```

`brave-search` finds relevant pages, `fetch` reads the full content of those pages. Together they give Claude the ability to research topics by finding and reading web content.

## Choosing Which Servers to Add

More servers means more tools available to the model, which can sometimes lead to tool selection confusion — the model may pick the wrong tool for a task when many similar tools are available. Add servers based on what the workflow actually needs, not speculatively.

For each server you add, consider:
- **What does this enable?** Be specific about the workflows that benefit.
- **What are the security implications?** Every server you add is another attack surface for prompt injection.
- **Does it need to be always-on?** Some servers are useful occasionally but don't need to be in your default config.

## Finding More Servers

- **Official registry**: The MCP GitHub organization lists maintained servers
- **Community**: Search npm for `mcp-server-*` and PyPI for `mcp-server-*`
- **Build your own**: See [Building MCP Servers](/mcp/building-servers/)
