---
title: Available MCP Servers
description: A curated list of pre-built MCP servers for common tools, databases, APIs, and services.
sidebar:
  order: 3
---

The MCP ecosystem has hundreds of pre-built servers. Here are the most useful ones, organized by category.

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
