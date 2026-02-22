---
title: Building MCP Servers
description: Step-by-step guide to building your own MCP server in Python.
---

# Building MCP Servers

Building an MCP server lets you expose any tool, data source, or capability to AI agents. Here’s a complete walkthrough.

## Prerequisites

```bash
pip install mcp
```

## Minimal Server

```python
# server.py
from mcp.server import Server
from mcp.server.stdio import stdio_server
from mcp import types
import asyncio

app = Server("my-server")

@app.list_tools()
async def list_tools() -> list[types.Tool]:
    return [
        types.Tool(
            name="greet",
            description="Generate a greeting for a name",
            inputSchema={
                "type": "object",
                "properties": {
                    "name": {"type": "string", "description": "Name to greet"}
                },
                "required": ["name"]
            }
        )
    ]

@app.call_tool()
async def call_tool(name: str, arguments: dict) -> list[types.TextContent]:
    if name == "greet":
        return [types.TextContent(type="text", text=f"Hello, {arguments['name']}!")]
    raise ValueError(f"Unknown tool: {name}")

async def main():
    async with stdio_server() as (read, write):
        await app.run(read, write, app.create_initialization_options())

if __name__ == "__main__":
    asyncio.run(main())
```

## Adding Resources

Resources expose data the AI can read:

```python
@app.list_resources()
async def list_resources() -> list[types.Resource]:
    return [
        types.Resource(
            uri="file:///config",
            name="Configuration",
            description="Current configuration",
            mimeType="application/json"
        )
    ]

@app.read_resource()
async def read_resource(uri: str) -> str:
    if uri == "file:///config":
        return '{"version": "1.0", "debug": false}'
    raise ValueError(f"Unknown resource: {uri}")
```

## Adding Prompts

Prompts are reusable message templates:

```python
@app.list_prompts()
async def list_prompts() -> list[types.Prompt]:
    return [
        types.Prompt(
            name="analyze",
            description="Analyze a piece of text",
            arguments=[
                types.PromptArgument(name="text", description="Text to analyze", required=True)
            ]
        )
    ]

@app.get_prompt()
async def get_prompt(name: str, arguments: dict) -> types.GetPromptResult:
    if name == "analyze":
        return types.GetPromptResult(
            description="Text analysis prompt",
            messages=[
                types.PromptMessage(
                    role="user",
                    content=types.TextContent(
                        type="text",
                        text=f"Please analyze this text: {arguments['text']}"
                    )
                )
            ]
        )
```

## Full Example: File System Server

```python
# fs_server.py
from mcp.server import Server
from mcp.server.stdio import stdio_server
from mcp import types
import asyncio
import os
from pathlib import Path

app = Server("filesystem")
ALLOWED_DIR = Path("/tmp/agent-workspace")
ALLOWED_DIR.mkdir(exist_ok=True)

def safe_path(filename: str) -> Path:
    path = (ALLOWED_DIR / filename).resolve()
    if not str(path).startswith(str(ALLOWED_DIR)):
        raise ValueError("Path traversal not allowed")
    return path

@app.list_tools()
async def list_tools() -> list[types.Tool]:
    return [
        types.Tool(
            name="read_file",
            description="Read a file from the workspace",
            inputSchema={"type": "object", "properties": {"filename": {"type": "string"}}, "required": ["filename"]}
        ),
        types.Tool(
            name="write_file",
            description="Write content to a file in the workspace",
            inputSchema={
                "type": "object",
                "properties": {
                    "filename": {"type": "string"},
                    "content": {"type": "string"}
                },
                "required": ["filename", "content"]
            }
        ),
        types.Tool(
            name="list_files",
            description="List files in the workspace",
            inputSchema={"type": "object", "properties": {}}
        )
    ]

@app.call_tool()
async def call_tool(name: str, arguments: dict) -> list[types.TextContent]:
    if name == "read_file":
        path = safe_path(arguments["filename"])
        content = path.read_text()
        return [types.TextContent(type="text", text=content)]
    
    elif name == "write_file":
        path = safe_path(arguments["filename"])
        path.write_text(arguments["content"])
        return [types.TextContent(type="text", text=f"Written to {arguments['filename']}")]
    
    elif name == "list_files":
        files = [f.name for f in ALLOWED_DIR.iterdir() if f.is_file()]
        return [types.TextContent(type="text", text="\n".join(files) or "(empty)")]
    
    raise ValueError(f"Unknown tool: {name}")

async def main():
    async with stdio_server() as (read, write):
        await app.run(read, write, app.create_initialization_options())

if __name__ == "__main__":
    asyncio.run(main())
```

## Testing Your Server

```bash
# Test with MCP inspector
npx @modelcontextprotocol/inspector python server.py

# Or call directly via stdio
echo '{"jsonrpc":"2.0","method":"tools/list","id":1}' | python server.py
```

## Connecting to Claude Desktop

Add to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "my-server": {
      "command": "python",
      "args": ["/path/to/server.py"]
    }
  }
}
```

## Deployment Options

- **stdio**: Simplest. Claude spawns the process directly. Good for local tools.
- **HTTP/SSE**: Deployable as a web service. Multiple clients can connect.
- **Docker**: Package with dependencies for reproducible deployment.
