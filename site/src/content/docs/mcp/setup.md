---
title: MCP Setup & Configuration
description: How to set up MCP with Claude Desktop, Claude Code, and other clients.
---

# MCP Setup & Configuration

How to install and configure MCP servers for use with Claude Desktop and Claude Code.

## Claude Desktop

### Config File Location

| OS | Path |
|----|------|
| macOS | `~/Library/Application Support/Claude/claude_desktop_config.json` |
| Windows | `%APPDATA%\Claude\claude_desktop_config.json` |

### Basic Configuration

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/Users/you/Documents"]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_..."
      }
    }
  }
}
```

After editing, restart Claude Desktop.

### Verifying It Works

Open Claude Desktop and look for the tools icon (hammer). If your server loaded correctly, you’ll see its tools listed.

## Claude Code

Claude Code supports MCP via the `claude mcp` command:

```bash
# Add a server
claude mcp add filesystem -- npx -y @modelcontextprotocol/server-filesystem /tmp

# List configured servers
claude mcp list

# Remove a server
claude mcp remove filesystem
```

Servers are stored in `~/.claude/claude_desktop_config.json` (same format as Claude Desktop).

## Python MCP Client

For programmatic use:

```python
import asyncio
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client

async def connect_to_server(script_path: str):
    server_params = StdioServerParameters(
        command="python",
        args=[script_path]
    )
    
    async with stdio_client(server_params) as (read, write):
        async with ClientSession(read, write) as session:
            await session.initialize()
            
            # List available tools
            tools = await session.list_tools()
            for tool in tools.tools:
                print(f"Tool: {tool.name} - {tool.description}")
            
            # Call a tool
            result = await session.call_tool("greet", {"name": "World"})
            print(result.content[0].text)

asyncio.run(connect_to_server("server.py"))
```

## Environment Variables

Many MCP servers need API keys. Pass them via `env` in the config:

```json
{
  "mcpServers": {
    "brave-search": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-brave-search"],
      "env": {
        "BRAVE_API_KEY": "your-key-here"
      }
    }
  }
}
```

## Troubleshooting

**Server not appearing in Claude Desktop:**
1. Check JSON syntax in config file (use a JSON validator)
2. Make sure `npx` is in your PATH (`which npx`)
3. Check Claude Desktop logs: `~/Library/Logs/Claude/` (macOS)

**Server crashes on startup:**
1. Test the server command manually in terminal
2. Check server logs
3. Verify environment variables are set

**Tool calls failing:**
1. Check server is still running (Claude may show a disconnected indicator)
2. Verify tool input matches the server’s input schema
3. Check for permission issues (file servers need access to specified directories)
