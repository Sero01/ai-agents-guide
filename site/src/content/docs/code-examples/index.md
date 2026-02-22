---
title: Code Examples
description: Practical code examples for building AI agents and agentic workflows.
---

# Code Examples

Practical, copy-paste-ready examples for common agent patterns.

## Minimal Tool-Using Agent (Python + Claude)

```python
import anthropic

client = anthropic.Anthropic()

tools = [
    {
        "name": "get_weather",
        "description": "Get current weather for a city",
        "input_schema": {
            "type": "object",
            "properties": {
                "city": {"type": "string", "description": "City name"}
            },
            "required": ["city"]
        }
    }
]

def get_weather(city: str) -> str:
    # Replace with real weather API
    return f"It's 22°C and sunny in {city}"

def run_agent(user_message: str) -> str:
    messages = [{"role": "user", "content": user_message}]
    
    while True:
        response = client.messages.create(
            model="claude-sonnet-4-5",
            max_tokens=1024,
            tools=tools,
            messages=messages
        )
        
        if response.stop_reason == "end_turn":
            return response.content[0].text
        
        # Handle tool calls
        tool_calls = [b for b in response.content if b.type == "tool_use"]
        if not tool_calls:
            return response.content[0].text
        
        messages.append({"role": "assistant", "content": response.content})
        
        tool_results = []
        for tool_call in tool_calls:
            if tool_call.name == "get_weather":
                result = get_weather(**tool_call.input)
            else:
                result = f"Unknown tool: {tool_call.name}"
            
            tool_results.append({
                "type": "tool_result",
                "tool_use_id": tool_call.id,
                "content": result
            })
        
        messages.append({"role": "user", "content": tool_results})

print(run_agent("What's the weather in Tokyo?"))
```

## Simple ReAct Agent Loop

```python
import anthropic
import json

client = anthropic.Anthropic()

def run_react_agent(goal: str, tools: list, tool_fns: dict, max_steps: int = 10) -> str:
    """
    Minimal ReAct loop.
    - tools: list of tool definitions for the API
    - tool_fns: dict mapping tool name -> callable
    """
    messages = [{"role": "user", "content": goal}]
    
    for step in range(max_steps):
        response = client.messages.create(
            model="claude-sonnet-4-5",
            max_tokens=2048,
            tools=tools,
            messages=messages
        )
        
        print(f"Step {step + 1}: stop_reason={response.stop_reason}")
        
        if response.stop_reason == "end_turn":
            text_blocks = [b for b in response.content if hasattr(b, 'text')]
            return text_blocks[-1].text if text_blocks else "Done"
        
        messages.append({"role": "assistant", "content": response.content})
        
        tool_results = []
        for block in response.content:
            if block.type == "tool_use":
                fn = tool_fns.get(block.name)
                result = fn(**block.input) if fn else f"Tool {block.name} not found"
                print(f"  Tool: {block.name}({block.input}) -> {result}")
                tool_results.append({
                    "type": "tool_result",
                    "tool_use_id": block.id,
                    "content": str(result)
                })
        
        if tool_results:
            messages.append({"role": "user", "content": tool_results})
    
    return "Max steps reached"
```

## MCP Client (Python)

```python
import asyncio
from anthropic import Anthropic
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client

async def run_with_mcp(server_script: str, user_query: str):
    server_params = StdioServerParameters(
        command="python", args=[server_script]
    )
    
    async with stdio_client(server_params) as (read, write):
        async with ClientSession(read, write) as session:
            await session.initialize()
            
            # Get available tools from MCP server
            tools_response = await session.list_tools()
            tools = [
                {
                    "name": t.name,
                    "description": t.description,
                    "input_schema": t.inputSchema
                }
                for t in tools_response.tools
            ]
            
            client = Anthropic()
            messages = [{"role": "user", "content": user_query}]
            
            while True:
                response = client.messages.create(
                    model="claude-sonnet-4-5",
                    max_tokens=1024,
                    tools=tools,
                    messages=messages
                )
                
                if response.stop_reason == "end_turn":
                    return response.content[0].text
                
                messages.append({"role": "assistant", "content": response.content})
                tool_results = []
                
                for block in response.content:
                    if block.type == "tool_use":
                        result = await session.call_tool(block.name, block.input)
                        tool_results.append({
                            "type": "tool_result",
                            "tool_use_id": block.id,
                            "content": result.content[0].text
                        })
                
                messages.append({"role": "user", "content": tool_results})

asyncio.run(run_with_mcp("my_server.py", "What tools do you have?"))
```

## 3-Layer Architecture Example

See the root of this repo for a full implementation:
- `directives/` — SOPs in Markdown
- `execution/` — Python scripts
- `CLAUDE.md` — Agent instructions

The pattern: AI orchestrates, Python executes.
