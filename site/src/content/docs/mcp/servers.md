---
title: Available MCP Servers
description: A guide to useful MCP servers for common development and productivity tasks.
---

# Available MCP Servers

A growing ecosystem of MCP servers exists for common tasks. Here’s a practical guide to the most useful ones.

## Official Servers (Anthropic / MCP Team)

The official servers are maintained at [github.com/modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers).

| Server | Purpose | Install |
|--------|---------|--------|
| `@modelcontextprotocol/server-filesystem` | Read/write local files | `npx @modelcontextprotocol/server-filesystem /path` |
| `@modelcontextprotocol/server-github` | GitHub: repos, PRs, issues | `npx @modelcontextprotocol/server-github` |
| `@modelcontextprotocol/server-postgres` | Query PostgreSQL | `npx @modelcontextprotocol/server-postgres postgres://...` |
| `@modelcontextprotocol/server-sqlite` | SQLite operations | `npx @modelcontextprotocol/server-sqlite /path/to/db` |
| `@modelcontextprotocol/server-fetch` | HTTP fetch requests | `npx @modelcontextprotocol/server-fetch` |
| `@modelcontextprotocol/server-memory` | Knowledge graph memory | `npx @modelcontextprotocol/server-memory` |
| `@modelcontextprotocol/server-puppeteer` | Browser automation | `npx @modelcontextprotocol/server-puppeteer` |

## Community Servers

### Search & Web
- **Brave Search**: `@modelcontextprotocol/server-brave-search`
- **Tavily**: Specialized AI search
- **Exa**: Semantic search

### Productivity
- **Google Drive**: Read/write Google Docs, Sheets, Drive files
- **Slack**: Send messages, read channels
- **Notion**: Read/write Notion pages and databases
- **Linear**: Create and update issues

### Development
- **Docker**: Manage containers
- **Kubernetes**: Manage k8s resources
- **AWS**: S3, Lambda, CloudFormation
- **Vercel**: Deploy projects

### Data
- **Snowflake**: Query Snowflake warehouses
- **BigQuery**: Run BigQuery jobs
- **MongoDB**: Query MongoDB collections

## Finding Servers

- [mcp.so](https://mcp.so) — Community directory
- [github.com/modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers) — Official list
- [glama.ai/mcp/servers](https://glama.ai/mcp/servers) — Searchable registry

## Building Your Own

Don’t see what you need? Build it. See [Building MCP Servers](/mcp/building-servers) for a step-by-step guide. An MCP server is ~50 lines of Python for a basic tool.
