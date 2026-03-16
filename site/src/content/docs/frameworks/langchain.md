---
title: "LangChain for AI Agents: Guide and Code Examples"
description: "How to build AI agents with LangChain. Covers core concepts, a working agent with tool calling, pros and cons, and when to use LangChain versus simpler alternatives."
sidebar:
  order: 2
head:
  - tag: script
    attrs:
      type: application/ld+json
    content: |
      {"@context":"https://schema.org","@type":"TechArticle","headline":"LangChain for AI Agents — The Most Complete Guide & Code Examples (2026)","description":"The best LangChain guide for building AI agents. Top concepts, complete code examples, honest pros and cons.","url":"https://agentguides.dev/frameworks/langchain/","datePublished":"2026-01-01","dateModified":"2026-02-23","author":{"@type":"Person","name":"Parvez Ahmed"},"publisher":{"@type":"Person","name":"Parvez Ahmed"},"keywords":"LangChain, LangChain guide, LangChain tutorial, LangChain agents, AI agent framework, LangChain code examples, LangChain vs alternatives"}
  - tag: script
    attrs:
      type: application/ld+json
    content: |
      {"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://agentguides.dev/"},{"@type":"ListItem","position":2,"name":"Agent Frameworks","item":"https://agentguides.dev/frameworks/"},{"@type":"ListItem","position":3,"name":"LangChain","item":"https://agentguides.dev/frameworks/langchain/"}]}
---

LangChain is the most widely used agent framework. It provides abstractions for chains, agents, tools, memory, and retrieval — along with a large ecosystem of integrations.

## Install

```bash
pip install langchain langchain-anthropic
```

## Basic Agent

```python
from langchain_anthropic import ChatAnthropic
from langchain.agents import AgentExecutor, create_tool_calling_agent
from langchain_core.prompts import ChatPromptTemplate
from langchain_community.tools.tavily_search import TavilySearchResults

llm = ChatAnthropic(model="claude-opus-4-6")
tools = [TavilySearchResults(max_results=3)]

prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a helpful assistant."),
    ("human", "{input}"),
    ("placeholder", "{agent_scratchpad}"),
])

agent = create_tool_calling_agent(llm, tools, prompt)
executor = AgentExecutor(agent=agent, tools=tools, verbose=True)

result = executor.invoke({"input": "What is the latest news about AI agents?"})
print(result["output"])
```

## Key Concepts

- **Chain**: A sequence of operations (prompt → LLM → output parser)
- **Agent**: A chain that decides which tools to call
- **Tool**: Any function the agent can call
- **Memory**: Persists conversation state across calls
- **Retriever**: Fetches relevant documents from a vector store

## Pros & Cons

**Pros:** Large ecosystem, tons of integrations, well-documented, active community
**Cons:** Abstractions can obscure what's happening; breaking changes between versions; can be overkill for simple tasks

## When to Use LangChain

- Rapid prototyping with many integrations
- RAG (retrieval-augmented generation) pipelines
- When you need battle-tested patterns and don't want to build from scratch
