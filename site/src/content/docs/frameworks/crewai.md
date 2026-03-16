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
      {"@context":"https://schema.org","@type":"TechArticle","headline":"CrewAI Tutorial 2026 — The Best Framework for Multi-Agent AI Systems","description":"The most complete CrewAI tutorial. Learn the top framework for role-based multi-agent systems with step-by-step installation and code examples.","url":"https://agentguides.dev/frameworks/crewai/","datePublished":"2026-01-01","dateModified":"2026-02-23","author":{"@type":"Person","name":"Parvez Ahmed"},"publisher":{"@type":"Person","name":"Parvez Ahmed"},"keywords":"CrewAI, CrewAI tutorial, CrewAI guide, multi-agent AI, role-based agents, CrewAI framework, AI agent teams"}
  - tag: script
    attrs:
      type: application/ld+json
    content: |
      {"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://agentguides.dev/"},{"@type":"ListItem","position":2,"name":"Agent Frameworks","item":"https://agentguides.dev/frameworks/"},{"@type":"ListItem","position":3,"name":"CrewAI","item":"https://agentguides.dev/frameworks/crewai/"}]}
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
