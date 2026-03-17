---
title: "Build Your Own MCP Server — Python Tutorial from Scratch (2026)"
description: "Build a custom MCP server from scratch with Python. Complete, runnable code with step-by-step instructions. Beginner-friendly."
sidebar:
  order: 4
head:
  - tag: script
    attrs:
      type: application/ld+json
    content: |
      {"@context":"https://schema.org","@type":"TechArticle","headline":"Build Your Own MCP Server — Python Tutorial from Scratch (2026)","description":"Build a custom MCP server from scratch with Python. Complete, runnable code with step-by-step instructions.","url":"https://agentguides.dev/mcp/building-servers/","datePublished":"2026-01-01","dateModified":"2026-02-22","author":{"@type":"Person","name":"Parvez Ahmed"},"publisher":{"@type":"Person","name":"Parvez Ahmed"}}
---

Building your own MCP server lets you expose any data source or service to Claude and other MCP clients. This tutorial builds a complete server from scratch.

## What We're Building

A minimal MCP server that exposes two tools:
- `read_note(id)` — Read a note by ID
- `list_notes()` — List all notes

## Install the SDK

```bash
pip install mcp
```

## Complete Server (Python)

```python
# server.py — A complete MCP server in ~60 lines
import json
import asyncio
from pathlib import Path
from mcp.server import Server
from mcp.server.stdio import stdio_server
from mcp import types

# ── In-memory note store (replace with a real DB in production) ──────
NOTES: dict[str, str] = {
    "1": "MCP stands for Model Context Protocol.",
    "2": "MCP uses JSON-RPC 2.0 over stdio or SSE.",
    "3": "Tools are functions; Resources are data.",
}

# ── Server setup ──────────────────────────────────────────────────────
app = Server("notes-server")

@app.list_tools()
async def list_tools() -> list[types.Tool]:
    """Tell MCP clients what tools this server provides."""
    return [
        types.Tool(
            name="read_note",
            description="Read a note by its ID.",
            inputSchema={
                "type": "object",
                "properties": {
                    "id": {"type": "string", "description": "The note ID"}
                },
                "required": ["id"],
            },
        ),
        types.Tool(
            name="list_notes",
            description="List all available note IDs.",
            inputSchema={
                "type": "object",
                "properties": {},
            },
        ),
    ]

@app.call_tool()
async def call_tool(name: str, arguments: dict) -> list[types.TextContent]:
    """Handle tool calls from MCP clients."""
    if name == "read_note":
        note_id = arguments.get("id")
        note = NOTES.get(note_id)
        if note:
            return [types.TextContent(type="text", text=note)]
        else:
            return [types.TextContent(type="text", text=f"No note found with ID: {note_id}")]

    elif name == "list_notes":
        note_list = "\n".join(f"- {k}: {v[:50]}..." for k, v in NOTES.items())
        return [types.TextContent(type="text", text=f"Available notes:\n{note_list}")]

    else:
        raise ValueError(f"Unknown tool: {name}")

# ── Run the server ─────────────────────────────────────────────────────
async def main():
    async with stdio_server() as (read_stream, write_stream):
        await app.run(read_stream, write_stream, app.create_initialization_options())

if __name__ == "__main__":
    asyncio.run(main())
```

## Register with Claude Code

Add to your `.claude/settings.json` or `~/.claude/settings.json`:

```json
{
  "mcpServers": {
    "notes": {
      "command": "python",
      "args": ["/absolute/path/to/server.py"]
    }
  }
}
```

## Test It

```bash
# Run the server directly to see what it exposes
python server.py
```

Or use the MCP inspector (official debugging tool):

```bash
npx @modelcontextprotocol/inspector python server.py
```

This opens a browser UI where you can call your tools manually.

## Adding Resources

Resources expose data (not actions). The model can read them to get context.

```python
@app.list_resources()
async def list_resources() -> list[types.Resource]:
    return [
        types.Resource(
            uri="notes://all",
            name="All Notes",
            description="Complete notes database",
            mimeType="application/json",
        )
    ]

@app.read_resource()
async def read_resource(uri: str) -> str:
    if uri == "notes://all":
        return json.dumps(NOTES, indent=2)
    raise ValueError(f"Unknown resource: {uri}")
```

## Error Handling Best Practices

```python
@app.call_tool()
async def call_tool(name: str, arguments: dict) -> list[types.TextContent]:
    try:
        # ... your tool logic
        pass
    except KeyError as e:
        # Return a helpful error message (don't crash the server)
        return [types.TextContent(type="text", text=f"Missing required argument: {e}")]
    except Exception as e:
        return [types.TextContent(type="text", text=f"Tool error: {str(e)}")]
```

## Production Checklist

- [ ] Input validation (don't trust `arguments` blindly)
- [ ] Error handling (never crash the server process)
- [ ] Logging (write to stderr, not stdout — stdout is used by the protocol)
- [ ] Secrets via environment variables, not hardcoded
- [ ] Rate limiting if wrapping external APIs

## What's Next

- Browse [Available Servers](/mcp/servers/) to see patterns in real servers
- The [official MCP Python SDK](https://github.com/modelcontextprotocol/python-sdk) has more examples
