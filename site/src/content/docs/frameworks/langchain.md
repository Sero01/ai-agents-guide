---
title: LangChain
description: LangChain framework for building AI agents and chains.
---

# LangChain

LangChain is the most widely used framework for building LLM applications. It provides abstractions for chains, agents, RAG pipelines, and more.

## Core Concepts

### Chains
Sequences of calls to LLMs and other components.

```python
from langchain_core.prompts import ChatPromptTemplate
from langchain_anthropic import ChatAnthropic

llm = ChatAnthropic(model="claude-sonnet-4-5")

prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a helpful assistant."),
    ("human", "{input}")
])

chain = prompt | llm
result = chain.invoke({"input": "What is an AI agent?"})
print(result.content)
```

### Agents
LangChain’s `create_react_agent` creates a ReAct-style agent:

```python
from langchain_anthropic import ChatAnthropic
from langchain_community.tools.tavily_search import TavilySearchResults
from langgraph.prebuilt import create_react_agent

llm = ChatAnthropic(model="claude-sonnet-4-5")
tools = [TavilySearchResults(max_results=3)]

agent = create_react_agent(llm, tools)

response = agent.invoke({
    "messages": [("user", "What happened at Google I/O this year?")]
})
print(response["messages"][-1].content)
```

### RAG (Retrieval-Augmented Generation)

```python
from langchain_community.vectorstores import Chroma
from langchain_openai import OpenAIEmbeddings
from langchain_core.runnables import RunnablePassthrough

vectorstore = Chroma.from_documents(documents, OpenAIEmbeddings())
retriever = vectorstore.as_retriever()

rag_chain = (
    {"context": retriever, "question": RunnablePassthrough()}
    | prompt
    | llm
)

result = rag_chain.invoke("What is MCP?")
```

## LangGraph

LangGraph is LangChain’s framework for stateful, multi-step workflows. It models workflows as graphs.

```python
from langgraph.graph import StateGraph, END
from typing import TypedDict

class AgentState(TypedDict):
    messages: list
    next: str

def agent_node(state: AgentState):
    # Call LLM, update state
    return {"messages": [...], "next": "tools"}

def tools_node(state: AgentState):
    # Execute tool calls
    return {"messages": [...], "next": "agent"}

graph = StateGraph(AgentState)
graph.add_node("agent", agent_node)
graph.add_node("tools", tools_node)
graph.add_edge("agent", "tools")
graph.add_conditional_edges("tools", lambda s: s["next"])
graph.set_entry_point("agent")

app = graph.compile()
```

## When to Use LangChain

**Strong fit:**
- RAG pipelines (document Q&A, knowledge bases)
- Complex multi-step chains
- When you need many integrations (100+ supported)
- LangGraph for stateful agent workflows

**Consider alternatives when:**
- You want a simple agent without abstraction overhead
- You need maximum performance (LangChain adds overhead)
- You’re building something LangChain doesn’t cover well

## LangSmith (Observability)

LangSmith is LangChain’s observability platform. Trace agent runs, debug failures, evaluate quality.

```bash
export LANGCHAIN_TRACING_V2=true
export LANGCHAIN_API_KEY=your_key
```

All LangChain/LangGraph runs are automatically traced when these env vars are set.
