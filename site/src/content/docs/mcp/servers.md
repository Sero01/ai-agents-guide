---
title: "Best MCP Servers 2026 — Top 20+ Pre-Built Servers for AI Agents"
description: "The most comprehensive list of the best MCP servers for AI agents. Top picks: GitHub, PostgreSQL, Filesystem, Slack, Puppeteer, Brave Search, and 15+ more official and community servers."
sidebar:
  order: 3
head:
  - tag: script
    attrs:
      type: application/ld+json
    content: |
      {"@context":"https://schema.org","@type":"TechArticle","headline":"Best MCP Servers 2026 — Top 20+ Pre-Built Servers for AI Agents","description":"The most comprehensive list of the best MCP servers for AI agents. GitHub, PostgreSQL, Filesystem, Slack, Puppeteer, Brave Search, and more.","url":"https://agentguides.dev/mcp/servers/","datePublished":"2026-01-01","dateModified":"2026-02-23","author":{"@type":"Person","name":"Parvez Ahmed"},"publisher":{"@type":"Person","name":"Parvez Ahmed"},"keywords":"MCP servers, best MCP servers, Model Context Protocol servers, AI agent tools, MCP GitHub, MCP PostgreSQL, MCP Slack, MCP Puppeteer"}
  - tag: script
    attrs:
      type: application/ld+json
    content: |
      {"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://agentguides.dev/"},{"@type":"ListItem","position":2,"name":"MCP","item":"https://agentguides.dev/mcp/"},{"@type":"ListItem","position":3,"name":"Available Servers","item":"https://agentguides.dev/mcp/servers/"}]}
---

The MCP ecosystem has hundreds of pre-built servers. Here are the most useful ones, organized by category.

## Official Servers (by Anthropic)

These are maintained by Anthropic and are production-ready.

| Server | Package | What it does |
|--------|---------|______________|
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

## Community Servers

| Server | What it does |
|--------|______________|
| **Playwright** | Browser automation (alternative to Puppeteer) |
| **Linear** | Project management (issues, cycles, projects) |
| **Jira** | Jira issue tracking |
| **Notion** | Read/write Notion pages and databases |
| **Stripe** | Payment information and transactions |
| **Cloudflare** | Workers, KV, D1, R2 management |
| **AWS** | S3, Lambda, EC2 operations |
| **Docker** | Container management |
| **kubectl** | Kubernetes cluster management |

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

## Config Examples

### Full Development Setup

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

### Data Analysis Setup

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

## Finding More Servers

- **Official registry**: The MCP GitHub organization lists maintained servers
- **Community**: Search npm for `mcp-server-*` and PyPI for `mcp-server-*`
- **Build your own**: See [Building MCP Servers](/mcp/building-servers/)
