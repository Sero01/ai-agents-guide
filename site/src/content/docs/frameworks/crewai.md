---
title: CrewAI
description: CrewAI framework for building role-based multi-agent AI systems.
---

# CrewAI

CrewAI is a Python framework for building multi-agent systems organized around **roles, tasks, and crews**. It’s designed to feel like managing a team of specialized employees.

## Core Concepts

### Agent
An AI worker with a specific role, goal, and backstory.

```python
from crewai import Agent

researcher = Agent(
    role='Senior Research Analyst',
    goal='Uncover cutting-edge developments in AI',
    backstory='You work at a leading tech think tank. Your expertise lies in identifying emerging trends.',
    verbose=True,
    allow_delegation=False
)
```

### Task
A specific piece of work assigned to an agent.

```python
from crewai import Task

research_task = Task(
    description='Research the latest developments in MCP (Model Context Protocol)',
    expected_output='A 3-paragraph summary of key developments',
    agent=researcher
)
```

### Crew
A team of agents working together on a set of tasks.

```python
from crewai import Crew, Process

crew = Crew(
    agents=[researcher, writer],
    tasks=[research_task, write_task],
    process=Process.sequential  # or Process.hierarchical
)

result = crew.kickoff()
print(result)
```

## Processes

**Sequential**: Tasks run in order. Output of one task passes to the next.

**Hierarchical**: A manager agent delegates tasks to worker agents and reviews output.

```python
crew = Crew(
    agents=[manager, researcher, writer],
    tasks=[...],
    process=Process.hierarchical,
    manager_llm=ChatOpenAI(model="gpt-4o")
)
```

## Tools

CrewAI integrates with LangChain tools and has its own tool system:

```python
from crewai_tools import SerperDevTool, WebsiteSearchTool

search_tool = SerperDevTool()
web_tool = WebsiteSearchTool()

researcher = Agent(
    role='Researcher',
    goal='Find accurate information',
    tools=[search_tool, web_tool],
    ...
)
```

## YAML Configuration

CrewAI supports defining agents and tasks in YAML:

```yaml
# agents.yaml
researcher:
  role: Research Analyst
  goal: Find comprehensive information on {topic}
  backstory: Expert researcher with 10 years experience

# tasks.yaml
research_task:
  description: Research {topic} thoroughly
  expected_output: Detailed research report
  agent: researcher
```

## When to Use CrewAI

**Strong fit:**
- Tasks that map naturally to a team of specialists
- Content creation pipelines (research → write → review)
- When you want role-based agent design
- Rapid prototyping of multi-agent workflows

**Consider alternatives when:**
- You need fine-grained control over agent behavior
- Production reliability is critical (evaluate carefully)
- You want to avoid framework abstraction
- Your workflow doesn’t map to a “crew” metaphor
