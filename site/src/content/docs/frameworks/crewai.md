---
title: CrewAI
description: CrewAI framework for building role-based multi-agent systems.
sidebar:
  order: 3
---

CrewAI structures agents as a "crew" — each agent has a role, goal, and backstory. Agents collaborate on tasks using a hierarchical or sequential process.

## Install

```bash
pip install crewai crewai-tools
```

## Basic Crew

```python
from crewai import Agent, Task, Crew, Process
from crewai_tools import SerperDevTool

search_tool = SerperDevTool()

# Define agents with roles
researcher = Agent(
    role="Senior Research Analyst",
    goal="Uncover cutting-edge developments in AI agents",
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

## When to Use CrewAI

- Role-based workflows where agent identity matters (researcher, writer, critic)
- When you want a structured team metaphor for your system
- Content generation pipelines with clear handoffs between roles
