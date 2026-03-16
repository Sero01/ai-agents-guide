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
      {"@context":"https://schema.org","@type":"TechArticle","headline":"LangChain for AI Agents: Guide and Code Examples","description":"How to build AI agents with LangChain. Covers core concepts, a working agent with tool calling, pros and cons, and when to use LangChain versus simpler alternatives.","url":"https://agentguides.dev/frameworks/langchain/","datePublished":"2026-01-01","dateModified":"2026-02-23","author":{"@type":"Person","name":"Parvez Ahmed"},"publisher":{"@type":"Person","name":"Parvez Ahmed"},"keywords":"LangChain, LangChain guide, LangChain tutorial, LangChain agents, AI agent framework, LangChain code examples, LangChain vs alternatives"}
  - tag: script
    attrs:
      type: application/ld+json
    content: |
      {"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://agentguides.dev/"},{"@type":"ListItem","position":2,"name":"Agent Frameworks","item":"https://agentguides.dev/frameworks/"},{"@type":"ListItem","position":3,"name":"LangChain","item":"https://agentguides.dev/frameworks/langchain/"}]}
---

LangChain is the most widely used agent framework. It provides abstractions for chains, agents, tools, memory, and retrieval — along with a large ecosystem of integrations. If a tool, API, or service has an AI integration, there's probably a LangChain connector for it.

The framework has evolved considerably since its early versions. LangChain's current architecture uses `langchain-core` for base types, with provider-specific packages like `langchain-anthropic` for model integrations. This modular structure reduces dependency bloat compared to the older monolithic package.

## Install

```bash
pip install langchain langchain-anthropic
```

For web search in the example below, you'll also need:

```bash
pip install langchain-community
```

And a Tavily API key (free tier available) for the search tool.

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

Let's break down what each piece does. `ChatAnthropic` is the LangChain wrapper for the Claude API. It exposes Claude as a standard LangChain chat model, which means it works with any LangChain component that accepts a chat model.

`TavilySearchResults` is a pre-built tool that calls the Tavily search API. From LangChain's perspective, a tool is any callable that the agent can invoke by name with a string input. The `max_results=3` parameter limits how many search results come back in each call.

The `ChatPromptTemplate` defines the agent's system prompt and conversation structure. The `{agent_scratchpad}` placeholder is where LangChain injects the agent's intermediate reasoning and tool call results — it's the equivalent of the agent's working memory within a single turn.

`create_tool_calling_agent` wires the LLM, tools, and prompt together into an agent. This function produces an agent that uses the model's native tool-calling capability (structured function calls), which is more reliable than older ReAct-style agents that tried to parse tool calls from plain text.

`AgentExecutor` is the runtime that drives the agent loop: call the agent, execute tool calls, feed results back, repeat until done or max iterations reached.

## Key Concepts

Understanding these five concepts covers most of what LangChain does:

**Chain**: A sequence of operations. The simplest chain is: prompt → LLM → output parser. More complex chains string together multiple LLM calls, tools, or retrieval steps.

**Agent**: A special chain where the LLM decides which tool to call (and with what arguments) at each step. The agent loop runs until the model produces a final answer rather than a tool call.

**Tool**: Any function the agent can call. Tools have a name, description, and input schema. The description is crucial — it tells the LLM when and why to use the tool. A poorly written description leads to incorrect or missed tool usage.

**Memory**: Persists conversation state across calls. Without memory, each invocation starts from a blank slate. With memory, the agent can reference earlier exchanges in the same conversation.

**Retriever**: Fetches relevant documents from a vector store or other data source. Used in RAG (retrieval-augmented generation) pipelines where the agent needs access to a large corpus of documents that can't all fit in the context window.

## Building a Custom Tool

LangChain makes it straightforward to wrap any Python function as a tool:

```python
from langchain.tools import tool

@tool
def calculate_compound_interest(principal: float, rate: float, years: int) -> str:
    """Calculate compound interest.

    Args:
        principal: Initial investment amount in dollars
        rate: Annual interest rate as a decimal (e.g., 0.05 for 5%)
        years: Number of years to compound

    Returns:
        Final amount after compounding
    """
    amount = principal * (1 + rate) ** years
    return f"${amount:.2f}"
```

The docstring serves as the tool description that LangChain sends to the model. A well-written docstring with clear argument descriptions leads to more accurate tool usage. The type annotations on the function arguments are used to generate the JSON schema that the model uses to construct tool calls.

## Adding Memory

To give an agent conversation memory across multiple turns:

```python
from langchain.memory import ConversationBufferMemory
from langchain.agents import AgentExecutor, create_tool_calling_agent

memory = ConversationBufferMemory(memory_key="chat_history", return_messages=True)

prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a helpful assistant."),
    ("placeholder", "{chat_history}"),
    ("human", "{input}"),
    ("placeholder", "{agent_scratchpad}"),
])

agent = create_tool_calling_agent(llm, tools, prompt)
executor = AgentExecutor(agent=agent, tools=tools, memory=memory, verbose=True)

# These two calls share conversation context
response1 = executor.invoke({"input": "My name is Alex."})
response2 = executor.invoke({"input": "What's my name?"})  # Agent will say "Alex"
```

`ConversationBufferMemory` stores the full conversation history. For long conversations, `ConversationSummaryMemory` instead summarizes older messages to keep the context manageable.

## RAG Pipeline with LangChain

LangChain is particularly strong for retrieval-augmented generation:

```python
from langchain_anthropic import ChatAnthropic
from langchain_community.vectorstores import Chroma
from langchain_anthropic import AnthropicEmbeddings
from langchain.chains import RetrievalQA
from langchain.text_splitter import RecursiveCharacterTextSplitter

# Load and split documents
with open("my_docs.txt") as f:
    text = f.read()

splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
chunks = splitter.create_documents([text])

# Create a vector store
vectorstore = Chroma.from_documents(chunks, AnthropicEmbeddings())

# Build a RAG chain
chain = RetrievalQA.from_chain_type(
    llm=ChatAnthropic(model="claude-opus-4-6"),
    retriever=vectorstore.as_retriever(search_kwargs={"k": 4}),
)

answer = chain.invoke("What does the document say about token limits?")
```

The text splitter breaks documents into chunks with some overlap (to avoid cutting off context mid-sentence). Each chunk is embedded as a vector and stored in Chroma. When a question comes in, the retriever finds the 4 most semantically similar chunks, which are injected into the prompt before the model generates its answer.

## Pros and Cons

**Pros:**
- Massive ecosystem with integrations for hundreds of services
- Well-documented with a large community
- Battle-tested patterns for common tasks (RAG, tool calling, conversation memory)
- Strong support for structured output and output parsing
- LCEL (LangChain Expression Language) makes it easy to compose chains

**Cons:**
- Abstractions can obscure what's actually happening, making debugging harder
- Breaking API changes between versions are common
- The framework does a lot, which means it has a lot of surface area to understand
- For simple agents, LangChain adds complexity without clear benefit
- Dependency chain is heavy

## When to Use LangChain

Reach for LangChain when:

- **You need many integrations quickly**: LangChain has pre-built connectors for databases, vector stores, APIs, and document types that would take time to build from scratch.
- **You're building a RAG pipeline**: LangChain's document loaders, text splitters, and retrievers are well-designed for RAG use cases.
- **You're prototyping**: LangChain lets you assemble a working agent from pre-built pieces quickly. For prototypes, speed of iteration matters more than abstraction cost.
- **You need conversation memory across many turns**: LangChain's memory integrations cover most common patterns.

Skip LangChain when:

- **You have a simple, predictable workflow**: A direct API call plus a for loop is often cleaner and more maintainable than the LangChain equivalent.
- **You need precise control over every API call**: LangChain's abstractions make it hard to customize things like retry logic, streaming behavior, or error handling.
- **You're building something for production where debuggability matters**: The abstraction stack makes it harder to trace exactly what prompt was sent and what response came back.

## See Also

- [Framework Comparison](/frameworks/) — LangChain vs CrewAI vs AutoGen at a glance
- [Code Examples](/code-examples/) — Direct API examples without a framework
