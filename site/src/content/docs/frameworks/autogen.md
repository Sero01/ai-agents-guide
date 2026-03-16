---
title: "AutoGen: Microsoft's Conversational Multi-Agent Framework"
description: "How to build multi-agent systems with Microsoft AutoGen. Covers two-agent conversations, GroupChat with multiple agents, code execution, and when to choose AutoGen over other frameworks."
sidebar:
  order: 4
head:
  - tag: script
    attrs:
      type: application/ld+json
    content: |
      {"@context":"https://schema.org","@type":"TechArticle","headline":"AutoGen: Microsoft's Conversational Multi-Agent Framework","description":"How to build multi-agent systems with Microsoft AutoGen. Covers two-agent conversations, GroupChat, code execution, and when to choose AutoGen.","url":"https://agentguides.dev/frameworks/autogen/","datePublished":"2026-01-01","dateModified":"2026-02-23","author":{"@type":"Person","name":"Parvez Ahmed"},"publisher":{"@type":"Person","name":"Parvez Ahmed"},"keywords":"AutoGen, Microsoft AutoGen, AutoGen tutorial, multi-agent framework, AI agent conversations, GroupChat, AutoGen guide"}
  - tag: script
    attrs:
      type: application/ld+json
    content: |
      {"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://agentguides.dev/"},{"@type":"ListItem","position":2,"name":"Agent Frameworks","item":"https://agentguides.dev/frameworks/"},{"@type":"ListItem","position":3,"name":"AutoGen","item":"https://agentguides.dev/frameworks/autogen/"}]}
---

AutoGen (by Microsoft Research) models agents as conversational participants. Agents talk to each other via a message-passing interface, making it natural to build systems where agents debate, critique, and collaborate through dialogue. Unlike frameworks that think in terms of tasks and pipelines, AutoGen thinks in terms of conversations and turns.

The core premise is that complex problems are often best solved through dialogue — back and forth between different perspectives. A coding assistant and a critic agent, for example, can iterate on a piece of code through conversation until both agree it's correct. This maps closely to how human experts collaborate.

## Install

```bash
pip install pyautogen
```

AutoGen requires a model configuration. It supports OpenAI-compatible APIs, which includes Claude via Anthropic's API.

## Two-Agent Conversation

The simplest AutoGen pattern: one AssistantAgent paired with one UserProxyAgent.

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

Here's what's happening in this code. The `AssistantAgent` is backed by an LLM and handles reasoning and generation. The `UserProxyAgent` represents the "user" in the conversation — it can execute code, provide feedback, and terminate the conversation.

The `human_input_mode="NEVER"` setting tells the UserProxyAgent to never pause and ask for human input — it runs autonomously. Setting it to `"TERMINATE"` or `"ALWAYS"` lets you add a human in the loop at different checkpoints.

The `code_execution_config={"work_dir": "coding"}` enables code execution in a sandboxed directory. When the assistant writes Python code in its response, the UserProxyAgent extracts and executes it, then feeds the output back as the next message in the conversation. This creates a tight loop where the assistant can see the results of its code and correct mistakes.

`max_consecutive_auto_reply=10` is a safety valve — the conversation terminates after 10 back-and-forth exchanges even if the task isn't complete. Without this, a stuck conversation could run indefinitely.

## GroupChat (Multiple Agents)

For more complex workflows, GroupChat coordinates multiple agents simultaneously:

```python
groupchat = autogen.GroupChat(
    agents=[user_proxy, researcher, coder, critic],
    messages=[],
    max_round=15,
)
manager = autogen.GroupChatManager(groupchat=groupchat, llm_config={"config_list": config_list})

user_proxy.initiate_chat(manager, message="Build and test a web scraper for HackerNews")
```

In a GroupChat, a `GroupChatManager` (itself an LLM) decides which agent should speak next based on the conversation so far. The agents take turns responding to each other, and the manager orchestrates turn order.

The advantage of GroupChat is that it allows genuinely multi-way conversations: the researcher can share a finding, the coder can write code based on it, and the critic can flag issues — all within the same conversation thread, without predefined handoff logic.

## Defining Specialized Agents

For GroupChat to work well, each agent needs a well-defined persona:

```python
researcher = autogen.AssistantAgent(
    name="researcher",
    llm_config={"config_list": config_list},
    system_message="""You are a research specialist. Your job is to find accurate
    information and cite sources. When asked a question that requires current data,
    say so explicitly and propose a search strategy.""",
)

coder = autogen.AssistantAgent(
    name="coder",
    llm_config={"config_list": config_list},
    system_message="""You are a Python expert. You write clean, well-commented code.
    When you write code, always include error handling and a brief explanation
    of what the code does. Never write code without testing it mentally first.""",
)

critic = autogen.AssistantAgent(
    name="critic",
    llm_config={"config_list": config_list},
    system_message="""You are a code reviewer and quality checker. Your job is to
    find problems in code and arguments before they cause issues in production.
    Be specific about what's wrong and suggest concrete fixes.""",
)
```

The system message for each agent shapes how it participates in conversations. A researcher with an explicit instruction to cite sources produces more verifiable output. A critic explicitly told to find problems before they become issues in production will be more aggressive about pointing out flaws.

## Termination Conditions

AutoGen conversations need a way to end. You can specify a termination condition via a function:

```python
def is_termination_msg(msg):
    return "TASK_COMPLETE" in msg.get("content", "")

user_proxy = autogen.UserProxyAgent(
    name="user_proxy",
    is_termination_msg=is_termination_msg,
    human_input_mode="NEVER",
    max_consecutive_auto_reply=15,
)
```

The assistant is typically instructed in its system prompt to say "TASK_COMPLETE" when it's done. The `is_termination_msg` function checks for this signal and ends the conversation. Without a termination condition, you rely on `max_consecutive_auto_reply` alone.

## Code Execution Security

AutoGen's code execution feature is powerful but requires care. By default, it executes code in a subprocess on your local machine. For untrusted workloads, use Docker:

```python
user_proxy = autogen.UserProxyAgent(
    name="user_proxy",
    human_input_mode="NEVER",
    code_execution_config={
        "work_dir": "coding",
        "use_docker": "python:3.11",  # Run code in a Docker container
    },
)
```

Running code in Docker provides isolation — the agent's code can't access your host system's files or environment. This is important in any context where the agent might generate unexpected or malicious code.

## When to Use AutoGen

AutoGen works well for:

- **Iterative code generation**: The write-execute-fix loop is AutoGen's killer feature. Tasks that require writing code, testing it, and debugging based on output are a natural fit.
- **Agent debate workflows**: Problems where you want multiple perspectives to argue toward a solution — scientific reasoning, code review, decision analysis.
- **Research workflows**: A researcher agent gathering information, a synthesizer distilling it, a fact-checker reviewing it — all through structured conversation.
- **Tasks with fuzzy completion criteria**: Because AutoGen uses conversational termination rather than predefined task completion, it handles tasks where you don't know in advance how many steps are needed.

AutoGen is less suited for:

- **Simple, deterministic pipelines**: If you have a clear sequence of steps with defined inputs and outputs, CrewAI's task-based model or direct API calls are simpler.
- **Latency-sensitive applications**: Multi-turn agent conversations incur multiple LLM calls. For applications where response time matters, the conversational overhead adds up.
- **When you need predictable control flow**: GroupChat's LLM-driven turn selection makes the conversation path hard to predict or audit. If you need reproducible, auditable workflows, sequential pipelines are more suitable.

## Differences from CrewAI

The conceptual difference between AutoGen and CrewAI is worth understanding clearly:

CrewAI thinks in **tasks**: define what needs to be done, assign it to an agent, specify what done looks like. The workflow is a sequence (or hierarchy) of tasks with clear inputs and outputs.

AutoGen thinks in **conversations**: agents talk to each other, and the "task" emerges from the dialogue. There's less pre-planning about exactly how the work gets done.

In practice, CrewAI is often easier to understand and debug because the workflow is more explicit. AutoGen is more flexible for tasks where the right approach isn't clear in advance.

## See Also

- [Framework Comparison](/frameworks/) — How AutoGen compares to LangChain and CrewAI
- [Multi-Agent Pipelines](/agentic-workflows/multi-agent/) — Building multi-agent systems without a framework
