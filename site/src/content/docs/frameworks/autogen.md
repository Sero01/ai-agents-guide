---
title: AutoGen
description: Microsoft AutoGen framework for building multi-agent AI systems.
---

# AutoGen

AutoGen is Microsoft’s open-source framework for building multi-agent AI systems. Its core innovation is treating agents as conversational entities that communicate with each other.

## Core Concept

In AutoGen, everything is a conversation between agents. You define agents with roles and have them talk to each other to complete tasks.

```python
import autogen

config_list = [{"model": "gpt-4o", "api_key": "YOUR_KEY"}]

assistant = autogen.AssistantAgent(
    name="assistant",
    llm_config={"config_list": config_list}
)

user_proxy = autogen.UserProxyAgent(
    name="user_proxy",
    human_input_mode="NEVER",  # Fully automated
    code_execution_config={"work_dir": "workspace"}
)

user_proxy.initiate_chat(
    assistant,
    message="Write a Python script to scrape HN headlines and save to a CSV"
)
```

## Agent Types

### AssistantAgent
An AI-powered agent that reasons and generates responses. Backed by an LLM.

### UserProxyAgent
Simulates a user. Can:
- Execute code automatically
- Pass human input when configured
- Act as orchestrator

### GroupChat + GroupChatManager
Coordinates multiple agents in a shared conversation.

```python
researcher = autogen.AssistantAgent(name="researcher", ...)
writer = autogen.AssistantAgent(name="writer", ...)
reviewer = autogen.AssistantAgent(name="reviewer", ...)

groupchat = autogen.GroupChat(
    agents=[user_proxy, researcher, writer, reviewer],
    messages=[],
    max_round=12
)
manager = autogen.GroupChatManager(groupchat=groupchat, llm_config={...})

user_proxy.initiate_chat(manager, message="Write a market analysis report")
```

## AutoGen Studio

AutoGen Studio is a no-code UI for building and testing AutoGen workflows. Run locally:

```bash
pip install autogenstudio
autogenstudio ui --port 8081
```

## AutoGen v0.4+ (AgentChat)

AutoGen v0.4 introduced a redesigned API:

```python
import asyncio
from autogen_agentchat.agents import AssistantAgent
from autogen_agentchat.teams import RoundRobinGroupChat
from autogen_ext.models.openai import OpenAIChatCompletionClient

async def main():
    model_client = OpenAIChatCompletionClient(model="gpt-4o")
    
    agent1 = AssistantAgent("agent1", model_client=model_client)
    agent2 = AssistantAgent("agent2", model_client=model_client)
    
    team = RoundRobinGroupChat([agent1, agent2], max_turns=4)
    result = await team.run(task="Explain the ReAct pattern")
    print(result)

asyncio.run(main())
```

## When to Use AutoGen

**Strong fit:**
- Multi-agent conversational workflows
- Code generation with automatic execution
- Research tasks requiring multiple specialized agents
- Scenarios where agents need to debate or review each other’s work

**Consider alternatives when:**
- You need a simple single-agent setup
- You want tight control over agent behavior
- You’re not using OpenAI-compatible models
- Production reliability is critical (AutoGen is research-oriented)
