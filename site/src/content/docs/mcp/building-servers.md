---
title: "Build Your Own MCP Server: A Python Tutorial"
description: "How to build a custom MCP server with the Python SDK v2. Covers tools, resources, error handling, Streamable HTTP, and how to register your server with Claude Code and Claude Desktop."
sidebar:
  order: 4
head:
  - tag: script
    attrs:
      type: application/ld+json
    content: |
      {"@context":"https://schema.org","@type":"TechArticle","headline":"Build Your Own MCP Server: A Python Tutorial","description":"How to build a custom MCP server with the Python SDK v2. Covers tools, resources, error handling, Streamable HTTP, and how to register your server with Claude Code and Claude Desktop.","url":"https://agentguides.dev/mcp/building-servers/","datePublished":"2026-01-01","dateModified":"2026-11-03","author":{"@type":"Person","name":"Parvez Ahmed"},"publisher":{"@type":"Person","name":"Parvez Ahmed"},"keywords":"build MCP server, MCP server tutorial, custom MCP server, Python MCP server, MCP server from scratch, Model Context Protocol development"}
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

The code on this page was tested with version 2.3.0 of the [MCP Python SDK](https://github.com/modelcontextprotocol/python-sdk), which requires Python 3.11 or later.

```bash
pip install "mcp[cli]"
```

The `mcp` package provides the server framework, protocol types, and the stdio and Streamable HTTP transports. The `cli` extra adds the `mcp` command-line tool.

:::note[Coming from v1?]
SDK v2 renamed `FastMCP` to `MCPServer`, and importing from `mcp.server.fastmcp` now fails. The low-level `Server` class dropped its `@app.list_tools()` and `@app.call_tool()` decorators, so older tutorials that use them no longer run. See the [migration guide](https://py.sdk.modelcontextprotocol.io/migration/).
:::

## Complete Server (Python)

```python
# server.py: a complete MCP server
from mcp.server import MCPServer
from mcp.server.mcpserver.exceptions import ToolError

# In-memory note store (replace with a real DB in production)
NOTES: dict[str, str] = {
    "1": "MCP stands for Model Context Protocol.",
    "2": "MCP uses JSON-RPC 2.0 over stdio or Streamable HTTP.",
    "3": "Tools are functions; Resources are data.",
}

mcp = MCPServer("notes-server")


@mcp.tool()
def read_note(id: str) -> str:
    """Read a note by its ID."""
    note = NOTES.get(id)
    if note is None:
        raise ToolError(f"No note found with ID: {id}")
    return note


@mcp.tool()
def list_notes() -> str:
    """List all available note IDs."""
    return "\n".join(f"- {k}: {v[:50]}" for k, v in NOTES.items())


if __name__ == "__main__":
    mcp.run()
```

Let's walk through the key parts of this code.

`MCPServer("notes-server")` creates a server instance with the name "notes-server". This name is what MCP clients see when they connect.

The `@mcp.tool()` decorator registers a function as a tool. The SDK builds the tool definition from the function itself: the function name becomes the tool name, the docstring becomes the description the model uses to decide when to call it, and the type hints become the input schema.

The tool descriptions are important. "Read a note by its ID" tells the model what the tool does. The input schema tells the model what arguments to provide. Write descriptions that are specific enough for the model to choose the right tool, but concise enough not to be confusing.

When the model calls `read_note` with `{"id": "1"}`, the SDK validates the arguments and calls `read_note(id="1")`. A returned string reaches the model as text.

`mcp.run()` with no arguments starts the server on the stdio transport, which listens on stdin for incoming MCP protocol messages and writes responses to stdout. This is why you should never write diagnostic output to stdout in an MCP server — use stderr for logging.

## Register with Claude Code

Add the server with the `claude mcp add` command. Everything after `--` is the command that starts the server:

```bash
claude mcp add --transport stdio notes -- python /absolute/path/to/server.py
```

To share the server with your team, add `--scope project`, which writes it to a `.mcp.json` file in your project root that you can commit:

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

Use an absolute path. Relative paths can break depending on what directory Claude Code is launched from. If your dependencies live in a virtual environment, point `command` at that environment's Python.

For Claude Desktop, add the same `notes` block under `mcpServers` in `claude_desktop_config.json`. The [setup guide](/mcp/setup/) lists where that file lives.

## Test It

Use the MCP Inspector (official debugging tool):

```bash
npx @modelcontextprotocol/inspector python server.py
```

Or use the SDK's shortcut for the same tool:

```bash
mcp dev server.py
```

This opens a browser UI where you can call your tools manually. The inspector is invaluable for development — you can test every tool call interactively without needing to configure the server in Claude Desktop.

Running `python server.py` on its own prints nothing and appears to hang. That's expected: the server is waiting for protocol messages on stdin.

## Adding Resources

Resources expose data (not actions). Clients can read them to get context without triggering side effects. Add `import json` at the top of `server.py`, then register a resource above the `if __name__` line:

```python
@mcp.resource("notes://all", mime_type="application/json")
def all_notes() -> str:
    """Complete notes database."""
    return json.dumps(NOTES, indent=2)
```

Resources are identified by URIs. The URI scheme (`notes://`) is defined by your server — choose something meaningful. When a client requests a resource by URI, the SDK calls your function and returns its result.

The distinction between tools and resources is meaningful: tools are for actions (write a file, send a message, run a query), resources are for data (read this document, get this database snapshot). Using the right type makes your server's intent clear to the model.

## Error Handling Best Practices

Raise `ToolError` for failures the model can act on:

```python
from mcp.server.mcpserver.exceptions import ToolError

@mcp.tool()
def read_note(id: str) -> str:
    """Read a note by its ID."""
    note = NOTES.get(id)
    if note is None:
        raise ToolError(f"No note found with ID: {id}")
    return note
```

The SDK returns this to the model as an error result, with your message: `Error executing tool read_note: No note found with ID: 99`. The server keeps running.

Any other exception is also returned as an error result, but the model only sees `Error executing tool read_note`. The details go to your server's log. That keeps internal details from reaching the model, so catch the failures you expect and re-raise them as `ToolError` with a useful message.

The model can adapt to error messages that describe what went wrong. "No note found with ID: 99" is actionable — the model can try a different ID or ask the user for clarification. A generic error gives it nothing to work with.

## Wrapping a Real Database

Here's how the same pattern looks when wrapping a real SQLite database:

```python
import sqlite3

from mcp.server import MCPServer
from mcp.server.mcpserver.exceptions import ToolError

DB_PATH = "data.db"
MAX_ROWS = 100

mcp = MCPServer("sqlite-notes")


@mcp.tool()
def query(sql: str) -> str:
    """Run a read-only SQL query against the database."""
    # mode=ro makes SQLite reject writes, whatever the SQL says
    conn = sqlite3.connect(f"file:{DB_PATH}?mode=ro", uri=True)
    try:
        cursor = conn.execute(sql)
        if cursor.description is None:
            return "Query returned no rows."
        columns = [description[0] for description in cursor.description]
        rows = cursor.fetchmany(MAX_ROWS + 1)
    except sqlite3.Error as e:
        raise ToolError(f"Query error: {e}")
    finally:
        conn.close()

    if not rows:
        return "Query returned no rows."

    # Format as a readable table
    result = " | ".join(columns) + "\n"
    result += "-" * len(result) + "\n"
    result += "\n".join(" | ".join(str(v) for v in row) for row in rows[:MAX_ROWS])

    if len(rows) > MAX_ROWS:
        result += f"\n... more than {MAX_ROWS} rows, showing the first {MAX_ROWS}"

    return result


if __name__ == "__main__":
    mcp.run()
```

A few things worth noting in this real-world example: opening the connection read-only stops the model from accidentally (or via prompt injection) running `DELETE` or `UPDATE` queries, because SQLite refuses the write. That's stronger than checking whether the SQL starts with `SELECT`. The row limit prevents enormous result sets from filling the context window. Both are practical safety measures for database-facing tools.

The model can still read every table in the file, so don't point this at a database that holds anything it shouldn't see.

## Serving Over Streamable HTTP

Stdio works when the client can start your server as a local process. To run the server as a service that several people or machines connect to, use Streamable HTTP. Only the last line changes:

```python
if __name__ == "__main__":
    mcp.run(transport="streamable-http")
```

The server now listens at `http://127.0.0.1:8000/mcp`. Pass `host`, `port`, and `streamable_http_path` to `mcp.run()` to change that address. Connect Claude Code to it with:

```bash
claude mcp add --transport http notes http://127.0.0.1:8000/mcp
```

The default address only accepts connections from your own machine. A server that's exposed to a network needs authentication and TLS in front of it, because anyone who can reach it can call its tools.

The older HTTP+SSE transport is [deprecated](https://modelcontextprotocol.io/specification/2026-07-28/changelog). Don't build new servers on it.

## Production Checklist

- [ ] Input validation (type hints check types, not whether a value is safe)
- [ ] Error handling (raise `ToolError` with a message the model can act on)
- [ ] Logging (write to stderr, not stdout — on stdio, stdout is used by the protocol)
- [ ] Secrets via environment variables, not hardcoded
- [ ] Rate limiting if wrapping external APIs
- [ ] Read-only mode where possible (minimize write access)
- [ ] Authentication and TLS for anything served over HTTP
- [ ] Test with the MCP inspector before connecting to Claude
- [ ] Pin the SDK's major version (`mcp>=2,<3`) so an upgrade can't break your server

## Debugging Tips

Stdio servers communicate over stdin and stdout, which means you can't use `print()` for debugging — it interferes with the protocol. Always use `sys.stderr` for any diagnostic output:

```python
import sys
sys.stderr.write(f"Debug: received id {id}\n")
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
