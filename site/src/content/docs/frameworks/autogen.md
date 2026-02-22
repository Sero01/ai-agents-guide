---
title: "AutoGen Guide 2026 — Microsoft's Most Advanced Multi-Agent AI Framework"
description: "Build the most powerful conversational multi-agent systems with Microsoft AutoGen. The best tutorial with complete code for agent conversations, GroupChat, and research workflows."
sidebar:
  order: 4
---

AutoGen (by Microsoft Research) models agents as conversational participants. Agents talk to each other via a message-passing interface, making it natural to build systems where agents debate, critique, and collaborate through dialogue.

## Install

```bash
pip install pyautogen
```

## Two-Agent Conversation

```python
import autogen

config_list = [{"model": "claude-opus-4-6", "api_key": "YOUR_KEY", "api_type": "anthropic"}]

# Assistant that can write and execute code
assistant = autogen.AssistantAgent(
    name="assistant",
    llm_config={"config_list": config_list},
)

# Human proxy that can execute code
user_proxy = autogen.UserProxyAgent(
    name="user_proxy",
    human_input_mode="NEVER",
    max_consecutive_auto_reply=10,
    code_execution_config={"work_dir": "coding"},
)

# Initiate a task
user_proxy.initiate_chat(
    assistant,
    message="Write a Python script that fetches the top 5 AI papers from arXiv today.",
)
```

## GroupChat (Multiple Agents)

```python
groupchat = autogen.GroupChat(
    agents=[user_proxy, researcher, coder, critic],
    messages=[],
    max_round=15,
)
manager = autogen.GroupChatManager(groupchat=groupchat, llm_config={"config_list": config_list})

user_proxy.initiate_chat(manager, message="Build and test a web scraper for HackerNews")
```

## When to Use AutoGen

- Tasks that benefit from agent debate and iteration (code review, problem solving)
- When you want automatic code execution in the loop
- Research workflows where the "conversation" format adds clarity
