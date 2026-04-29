---
title: "CrewAI Tutorial: Role-Based Multi-Agent AI Systems"
description: "How to build multi-agent systems with CrewAI. Covers agents, tasks, crews, process types, and practical examples of role-based agent workflows."
sidebar:
  order: 3
head:
  - tag: script
    attrs:
      type: application/ld+json
    content: |
      {"@context":"https://schema.org","@type":"TechArticle","headline":"CrewAI Tutorial: Role-Based Multi-Agent AI Systems","description":"How to build multi-agent systems with CrewAI. Covers agents, tasks, crews, process types, and practical examples of role-based agent workflows.","url":"https://agentguides.dev/frameworks/crewai/","datePublished":"2026-01-01","dateModified":"2026-02-23","author":{"@type":"Person","name":"Parvez Ahmed"},"publisher":{"@type":"Person","name":"Parvez Ahmed"},"keywords":"CrewAI, CrewAI tutorial, CrewAI guide, multi-agent AI, role-based agents, CrewAI framework, AI agent teams"}
  - tag: script
    attrs:
      type: application/ld+json
    content: |
      {"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://agentguides.dev/"},{"@type":"ListItem","position":2,"name":"Agent Frameworks","item":"https://agentguides.dev/frameworks/"},{"@type":"ListItem","position":3,"name":"CrewAI","item":"https://agentguides.dev/frameworks/crewai/"}]}
---

CrewAI structures agents as a "crew" — each agent has a role, goal, and backstory. Agents collaborate on tasks using a hierarchical or sequential process. The role-based metaphor maps well to real-world team structures: a researcher who gathers information, a writer who turns it into prose, an editor who revises, a critic who checks for errors.

The key insight of CrewAI is that giving an agent an explicit role and backstory shapes its behavior, even with the same underlying model. A "Senior Research Analyst" persona tends to produce more thorough and citation-aware responses than a generic agent asked to do research.

## Install

```bash
pip install crewai crewai-tools
```

You'll also need an API key for your chosen LLM. CrewAI supports Claude, OpenAI, and others through LangChain's model integrations.

## Core Concepts

Before diving into code, it helps to understand how CrewAI's four main objects fit together:

**Agent** — The individual worker. An agent has a `role` (what kind of specialist it is), a `goal` (what it's trying to accomplish), and a `backstory` (context that shapes its personality and approach). Optionally, agents receive `tools` they can call.

**Task** — A unit of work assigned to an agent. A task has a `description` (what needs to be done) and an `expected_output` (what a completed task looks like). Tasks can be sequential or parallel.

**Crew** — The team. A crew holds a list of agents and tasks, and defines a `process` (how tasks are coordinated). The two main process types are sequential and hierarchical.

**Process** — The execution strategy. `Process.sequential` runs tasks one after another, passing each task's output as context to the next. `Process.hierarchical` assigns a manager agent to delegate tasks to the other agents based on their roles.

## Basic Crew

```python
from crewai import Agent, Task, Crew, Process
from crewai_tools import SerperDevTool

search_tool = SerperDevTool()

# Define agents with roles
researcher = Agent(
    role="Senior Research Analyst",
    goal="Identify recent developments in AI agents",
    backstory="You are an expert at analyzing AI research papers and trends.",
    tools=[search_tool],
    verbose=True,
)

writer = Agent(
    role="Tech Content Writer",
    goal="Write clear, engaging technical content",
    backstory="You transform complex technical research into readable summaries.",
    verbose=True,
)

# Define tasks
research_task = Task(
    description="Research the latest advances in MCP (Model Context Protocol)",
    expected_output="A bullet-point summary of key advances with sources",
    agent=researcher,
)

write_task = Task(
    description="Write a 500-word blog post based on the research",
    expected_output="A well-structured blog post in Markdown format",
    agent=writer,
)

# Assemble and run the crew
crew = Crew(
    agents=[researcher, writer],
    tasks=[research_task, write_task],
    process=Process.sequential,
    verbose=True,
)

result = crew.kickoff()
print(result)
```

Let's walk through what's happening here. The `researcher` agent is equipped with a web search tool (`SerperDevTool`) that calls the Serper API to perform Google searches. Without a tool, the agent can only reason using its training data — tools are what let it access current information.

The `research_task` is assigned to the researcher and specifies both what to do and what a good result looks like. The `expected_output` field is important: it tells the agent and the crew when a task is complete, which prevents the agent from iterating indefinitely.

With `Process.sequential`, the research task runs first. Its output is automatically passed to the writer as context. The writer then generates the blog post without needing to do any research itself — it works from the researcher's output.

## Process Types Compared

**Sequential** (`Process.sequential`): Tasks run one after another in the order they're listed. Each task's output is available as context to subsequent tasks. Use this when tasks have a natural dependency order: gather data, then analyze, then write.

**Hierarchical** (`Process.hierarchical`): A manager agent is created automatically (or you can specify one). The manager reads all the tasks and agents, then delegates tasks to the appropriate agents. Agents report back, and the manager synthesizes the final result. This is more flexible but harder to debug because the delegation decisions are made by an LLM.

```python
# Hierarchical example
crew = Crew(
    agents=[researcher, analyst, writer],
    tasks=[complex_task],  # A single high-level task
    process=Process.hierarchical,
    manager_llm=ChatAnthropic(model="claude-opus-4-6"),
    verbose=True,
)
```

In the hierarchical process, the manager LLM breaks the complex task into subtasks and decides which agent handles each one. This works well when you don't know in advance exactly how to decompose the work.

## Adding Memory

CrewAI supports optional memory that persists across tasks within a run:

```python
crew = Crew(
    agents=[researcher, writer],
    tasks=[research_task, write_task],
    process=Process.sequential,
    memory=True,  # Enable short-term and long-term memory
    verbose=True,
)
```

With memory enabled, agents can reference earlier observations from the same crew run. This is useful in longer workflows where an agent in step 5 might need context established in step 2.

## Custom Tools

You can create custom tools for agents using the `@tool` decorator:

```python
from crewai.tools import tool

@tool("Word Counter")
def count_words(text: str) -> str:
    """Count the number of words in a piece of text."""
    count = len(text.split())
    return f"The text contains {count} words."

editor = Agent(
    role="Content Editor",
    goal="Review and improve written content",
    backstory="You are meticulous about word count and clarity.",
    tools=[count_words],
)
```

The docstring on the tool function is used by the agent to understand when and how to call it. Write clear, specific docstrings — they directly influence tool usage.

## When to Use CrewAI

CrewAI is a strong choice when:

- **The workflow maps to human team roles**: If you naturally think "a researcher, a writer, and an editor should handle this," CrewAI's abstractions match that mental model.
- **You have a repeatable multi-step pipeline**: Research → draft → review → publish is exactly the kind of workflow CrewAI excels at.
- **You want task-level orchestration with clear handoffs**: The `expected_output` field on tasks creates natural checkpoints.
- **Content generation is a primary use case**: Blog posts, reports, summaries, and similar content workflows are where CrewAI shines.

CrewAI is less suited for:

- **Real-time or event-driven systems**: CrewAI is designed for batch-style workflows, not reactive agents that respond to streams of events.
- **Extremely long-running tasks**: Very long agent runs can hit token limits and become expensive to operate.
- **Cases where you need direct API access**: CrewAI adds abstraction on top of the LLM. If you need precise control over every API call (streaming, fine-grained error handling, custom retry logic), the raw API gives you more control.

## Common Pitfalls

**Over-relying on verbose backstories**: Long backstories consume tokens without always improving behavior. Keep backstories concise and focused on the specific behaviors you want to shape.

**Assigning tools to agents that don't need them**: Every available tool increases the LLM's decision surface. Only give an agent the tools it actually needs for its tasks.

**Forgetting `expected_output`**: Without a clear expected output, agents may produce inconsistent results or run longer than necessary. Always describe what done looks like.

**Not testing individual agents first**: Before assembling a full crew, test each agent individually on a representative task. This makes it much easier to identify which agent is causing issues in a pipeline.

## See Also

- [Framework Comparison](/frameworks/) — How CrewAI compares to LangChain and AutoGen
- [Multi-Agent Pipelines](/agentic-workflows/multi-agent/) — Lower-level multi-agent patterns without a framework
