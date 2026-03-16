---
title: "Build Your Own MCP Server: A Python Tutorial"
description: "How to build a custom MCP server from scratch using the Python SDK. Covers tools, resources, error handling, and how to register your server with Claude Code and Claude Desktop."
sidebar:
  order: 4
head:
  - tag: script
    attrs:
      type: application/ld+json
    content: |
      {"@context":"https://schema.org","@type":"TechArticle","headline":"Build Your Own MCP Server: A Python Tutorial","description":"How to build a custom MCP server from scratch using the Python SDK. Covers tools, resources, error handling, and how to register your server with Claude Code and Claude Desktop.","url":"https://agentguides.dev/mcp/building-servers/","datePublished":"2026-01-01","dateModified":"2026-02-23","author":{"@type":"Person","name":"Parvez Ahmed"},"publisher":{"@type":"Person","name":"Parvez Ahmed"},"keywords":"build MCP server, MCP server tutorial, custom MCP server, Python MCP server, MCP server from scratch, Model Context Protocol development"}
  - tag: script
    attrs:
      type: application/ld+json
    content: |
      {"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://agentguides.dev/"},{"@type":"ListItem","position":2,"name":"MCP","item":"https://agentguides.dev/mcp/"},{"@type":"ListItem","position":3,"name":"Building MCP Servers","item":"https://agentguides.dev/mcp/building-servers/"}]}
---

Building your own MCP server lets you expose any data source or service to Claude and other MCP clients. This tutorial builds a complete server from scratch.

## What We're Building

A minimal MCP server that exposes two tools:
- `read_note(id)` — Read a note by ID
- `list_notes()` — List all notes

This is a toy example, but the structure is identical to what you'd use for real use cases: wrapping a database, an internal API, a custom data source, or any other service you want to expose to Claude.

## Install the SDK

```bash
pip install mcp
```

The `mcp` package provides the server framework, protocol types, and stdio/SSE transport implementations.

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

Let's walk through the key parts of this code.

The `Server("notes-server")` creates a server instance with the name "notes-server". This name is what MCP clients see when they connect.

The `@app.list_tools()` decorator registers an async function that the MCP SDK calls when a client asks "what tools does this server provide?" The function returns a list of `types.Tool` objects, each describing a tool with its name, a description the model uses to decide when to call it, and an input schema.

The tool descriptions are important. "Read a note by its ID" tells the model what the tool does. The input schema tells the model what arguments to provide. Write descriptions that are specific enough for the model to choose the right tool, but concise enough not to be confusing.

The `@app.call_tool()` decorator registers the function that handles actual tool calls. When the model calls `read_note` with `{"id": "1"}`, this function is invoked with `name="read_note"` and `arguments={"id": "1"}`. It looks up the note and returns a `TextContent` object with the result.

Tool handlers must return a list of content objects. The `types.TextContent` with `type="text"` is the simplest — it returns a plain string to the model. There are also content types for images and structured data.

The `main()` function starts the stdio server, which listens on stdin for incoming MCP protocol messages and writes responses to stdout. This is why you should never write diagnostic output to stdout in an MCP server — use stderr for logging.

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

Use an absolute path. Relative paths can break depending on what directory Claude Code is launched from.

## Test It

```bash
# Run the server directly to see what it exposes
python server.py
```

Or use the MCP inspector (official debugging tool):

```bash
npx @modelcontextprotocol/inspector python server.py
```

This opens a browser UI where you can call your tools manually. The inspector is invaluable for development — you can test every tool call interactively without needing to configure the server in Claude Desktop.

## Adding Resources

Resources expose data (not actions). The model can read them to get context without triggering side effects.

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

Resources are identified by URIs. The URI scheme (`notes://`) is defined by your server — choose something meaningful. When a client requests a resource by URI, your `read_resource` handler returns its contents as a string.

The distinction between tools and resources is meaningful: tools are for actions (write a file, send a message, run a query), resources are for data (read this document, get this database snapshot). Using the right type makes your server's intent clear to the model.

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

Return errors as `TextContent` rather than raising exceptions. If the server crashes, the MCP client can't recover gracefully — it will report a connection error to the user. If you return an error as text, the model can read the error and decide how to respond: retry with different arguments, try a different approach, or inform the user.

The model can adapt to error messages that describe what went wrong. "No note found with ID: 99" is actionable — the model can try a different ID or ask the user for clarification. A server crash just terminates the connection.

## Wrapping a Real Database

Here's how the same pattern looks when wrapping a real SQLite database:

```python
import sqlite3
from mcp.server import Server
from mcp.server.stdio import stdio_server
from mcp import types
import asyncio

DB_PATH = "data.db"
app = Server("sqlite-notes")

def get_db():
    return sqlite3.connect(DB_PATH)

@app.list_tools()
async def list_tools() -> list[types.Tool]:
    return [
        types.Tool(
            name="query",
            description="Run a read-only SQL SELECT query against the database.",
            inputSchema={
                "type": "object",
                "properties": {
                    "sql": {"type": "string", "description": "SQL SELECT statement"},
                },
                "required": ["sql"],
            },
        ),
    ]

@app.call_tool()
async def call_tool(name: str, arguments: dict) -> list[types.TextContent]:
    if name == "query":
        sql = arguments.get("sql", "")

        # Basic safety check — only allow SELECT
        if not sql.strip().upper().startswith("SELECT"):
            return [types.TextContent(type="text", text="Error: Only SELECT queries are allowed.")]

        try:
            with get_db() as conn:
                cursor = conn.execute(sql)
                columns = [description[0] for description in cursor.description]
                rows = cursor.fetchall()

            if not rows:
                return [types.TextContent(type="text", text="Query returned no rows.")]

            # Format as a readable table
            result = " | ".join(columns) + "\n"
            result += "-" * len(result) + "\n"
            result += "\n".join(" | ".join(str(v) for v in row) for row in rows[:100])

            if len(rows) > 100:
                result += f"\n... and {len(rows) - 100} more rows"

            return [types.TextContent(type="text", text=result)]

        except Exception as e:
            return [types.TextContent(type="text", text=f"Query error: {str(e)}")]

    return [types.TextContent(type="text", text=f"Unknown tool: {name}")]

async def main():
    async with stdio_server() as (read_stream, write_stream):
        await app.run(read_stream, write_stream, app.create_initialization_options())

if __name__ == "__main__":
    asyncio.run(main())
```

A few things worth noting in this real-world example: the `SELECT`-only check prevents the model from accidentally (or via prompt injection) running `DELETE` or `UPDATE` queries. The row limit (100) prevents enormous result sets from filling the context window. Both are practical safety measures for database-facing tools.

## Production Checklist

- [ ] Input validation (don't trust `arguments` blindly)
- [ ] Error handling (never crash the server process)
- [ ] Logging (write to stderr, not stdout — stdout is used by the protocol)
- [ ] Secrets via environment variables, not hardcoded
- [ ] Rate limiting if wrapping external APIs
- [ ] Read-only mode where possible (minimize write access)
- [ ] Test with the MCP inspector before connecting to Claude

## Debugging Tips

MCP servers communicate over stdio, which means you can't use `print()` for debugging — it interferes with the protocol. Always use `sys.stderr` for any diagnostic output:

```python
import sys
sys.stderr.write(f"Debug: received arguments {arguments}\n")
sys.stderr.flush()
```

The MCP inspector (`npx @modelcontextprotocol/inspector`) is your primary debugging tool. It lets you connect to any MCP server and call its tools manually, inspect the schema it exposes, and see the raw protocol messages going back and forth.

For production servers, use Python's `logging` module with a handler that writes to stderr:

```python
import logging
import sys

logging.basicConfig(
    stream=sys.stderr,
    level=logging.INFO,
    format='%(asctime)s %(levelname)s %(message)s'
)
logger = logging.getLogger("my-server")
```

This gives you structured logs that appear in the MCP client's log files without interfering with the stdio protocol.

## What's Next

- Browse [Available Servers](/mcp/servers/) to see patterns in real servers
- The [official MCP Python SDK](https://github.com/modelcontextprotocol/python-sdk) has more examples
