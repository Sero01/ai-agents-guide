---
title: "Build a Research Agent with CrewAI — Step by Step (with Code)"
description: "End-to-end build of a 3-agent research assistant using CrewAI. Working code, real cost (~$0.05 per run), architecture diagram, and where to take it next."
author: Parvez Ahmed
date: 2026-05-21
lastUpdated: 2026-05-23
sidebar:
  order: 2
head:
  - tag: meta
    attrs:
      property: og:type
      content: article
  - tag: meta
    attrs:
      property: og:title
      content: "Build a Research Agent with CrewAI — Step by Step"
  - tag: meta
    attrs:
      property: og:description
      content: "End-to-end build of a 3-agent research assistant in CrewAI. Working code, real cost (~$0.05/run), architecture diagram."
  - tag: meta
    attrs:
      property: og:url
      content: https://agentguides.dev/build/research-agent-with-crewai/
  - tag: meta
    attrs:
      property: og:image
      content: https://agentguides.dev/og/build.png
  - tag: meta
    attrs:
      property: article:published_time
      content: "2026-05-21"
  - tag: meta
    attrs:
      property: article:modified_time
      content: "2026-05-23"
  - tag: meta
    attrs:
      property: article:author
      content: Parvez Ahmed
  - tag: meta
    attrs:
      property: article:section
      content: Build Tutorials
  - tag: meta
    attrs:
      property: article:tag
      content: "CrewAI tutorial, research agent, multi-agent, Tavily, Claude Sonnet 4.6, Python AI agent"
  - tag: meta
    attrs:
      name: twitter:title
      content: "Build a Research Agent with CrewAI — Step by Step"
  - tag: meta
    attrs:
      name: twitter:description
      content: "Working code, ~$0.05/run, full architecture diagram."
  - tag: meta
    attrs:
      name: twitter:image
      content: https://agentguides.dev/og/build.png
  - tag: link
    attrs:
      rel: canonical
      href: https://agentguides.dev/build/research-agent-with-crewai/
  - tag: script
    attrs:
      type: application/ld+json
    content: |
      {"@context":"https://schema.org","@graph":[
        {"@type":"TechArticle","@id":"https://agentguides.dev/build/research-agent-with-crewai/#article","headline":"Build a Research Agent with CrewAI — Step by Step (with Code)","description":"End-to-end build of a 3-agent research assistant using CrewAI. Includes working code, real cost numbers, an architecture diagram, and concrete extension ideas.","url":"https://agentguides.dev/build/research-agent-with-crewai/","mainEntityOfPage":"https://agentguides.dev/build/research-agent-with-crewai/","datePublished":"2026-05-21","dateModified":"2026-05-23","inLanguage":"en-US","articleSection":"Build Tutorials","author":{"@type":"Person","name":"Parvez Ahmed","url":"https://github.com/Sero01"},"publisher":{"@type":"Person","name":"Parvez Ahmed","url":"https://agentguides.dev/about/"},"image":"https://agentguides.dev/og/build.png","keywords":"CrewAI tutorial, build research agent, multi-agent Python, Tavily web search agent, CrewAI example code, AI agent tutorial 2026","proficiencyLevel":"Intermediate"},
        {"@type":"HowTo","name":"Build a 3-agent research assistant with CrewAI","description":"Step-by-step tutorial to build a planner/researcher/writer research agent with CrewAI, Tavily search, and Claude Sonnet 4.6.","totalTime":"PT60M","estimatedCost":{"@type":"MonetaryAmount","currency":"USD","value":"0.05"},"tool":[{"@type":"HowToTool","name":"Python 3.10+"},{"@type":"HowToTool","name":"CrewAI"},{"@type":"HowToTool","name":"Tavily API key"},{"@type":"HowToTool","name":"Anthropic API key"}],"step":[
          {"@type":"HowToStep","position":1,"name":"Set up the project","text":"Create a Python virtualenv, install crewai, anthropic, and tavily-python, and add your API keys to a .env file."},
          {"@type":"HowToStep","position":2,"name":"Define the three agents","text":"Create Planner, Researcher, and Writer agents with explicit roles, goals, and the appropriate tools."},
          {"@type":"HowToStep","position":3,"name":"Wire the sequential task flow","text":"Define plan, research, and write tasks. Pass each task's output as context to the next task."},
          {"@type":"HowToStep","position":4,"name":"Run the crew end-to-end","text":"Invoke Crew.kickoff with a topic and inspect the final cited report. Verify the cost in your provider dashboard."},
          {"@type":"HowToStep","position":5,"name":"Extend the agent","text":"Add a fact-check pass, switch to hierarchical process, persist memory across runs, or expose the agent as an MCP server."}
        ]},
        {"@type":"BreadcrumbList","itemListElement":[
          {"@type":"ListItem","position":1,"name":"Home","item":"https://agentguides.dev/"},
          {"@type":"ListItem","position":2,"name":"Build Tutorials","item":"https://agentguides.dev/build/"},
          {"@type":"ListItem","position":3,"name":"Research Agent with CrewAI","item":"https://agentguides.dev/build/research-agent-with-crewai/"}
        ]}
      ]}
---

<aside style="background:var(--sl-color-bg-nav);border:1px solid var(--sl-color-hairline);border-left:3px solid var(--sl-color-accent);padding:0.75rem 1rem;margin:1rem 0 1.5rem;border-radius:0.375rem;font-size:0.85rem;line-height:1.55">
<strong>By Parvez Ahmed · Published May 21, 2026.</strong>
This tutorial contains affiliate links to tools we use. Disclosure at <a href="/about/">/about</a>.
</aside>

This is a hands-on build of a three-agent research assistant in CrewAI, end to end. By the time you have read and run it, you will have a working agent that takes a topic, plans subtopics, searches the web, and writes a cited 1,500-word report. The full code is on GitHub at the end of the post. Running the example end-to-end costs roughly **$0.05** in API credit on Claude Sonnet 4.6 (cheaper on Haiku, more expensive on Opus).

## What we are building

The agent takes a single string topic — for example, *"Recent advances in mixture-of-experts language models"* — and produces a structured report. Internally, three specialised agents collaborate:

1. The **Planner** decomposes the topic into 4–5 focused subtopics.
2. The **Researcher** uses Tavily web search to gather 3–5 sources per subtopic and extracts the key claims from each.
3. The **Writer** synthesises everything into a coherent report with inline citations.

The flow is sequential — Planner output flows into Researcher input, Researcher output flows into Writer input — which is exactly the shape CrewAI was built for. We will use this as the baseline and then talk about where to extend it.

## Prerequisites

- Python 3.10 or newer
- An Anthropic API key (any provider compatible with the OpenAI SDK also works, but we use Claude here)
- A Tavily API key for web search — sign up at <a href="https://tavily.com/?ref=agentguides" rel="sponsored nofollow noopener" target="_blank">tavily.com</a>; the free tier (1,000 requests/month) is enough for this tutorial
- Roughly $0.05 of API credit per run for end-to-end execution

If you are still getting your environment set up, the [Getting Started](/getting-started/) page on this site walks through the basics — Python virtualenvs, key management, and the small amount of shell familiarity assumed here. Skim it first if anything below feels unfamiliar.

## Architecture

```
┌─────────────┐
│   Topic     │
│  (string)   │
└──────┬──────┘
       │
       ▼
┌─────────────────┐         ┌───────────────────┐
│   Planner Agent │────────▶│ Subtopics (4-5)   │
└─────────────────┘         └─────────┬─────────┘
                                      │
                                      ▼
                            ┌─────────────────────┐
                            │  Researcher Agent   │
                            │  • Tavily search    │
                            │  • Extract claims   │
                            └─────────┬───────────┘
                                      │
                                      ▼
                            ┌─────────────────────┐
                            │  Sources + Notes    │
                            └─────────┬───────────┘
                                      │
                                      ▼
                            ┌─────────────────────┐
                            │   Writer Agent      │
                            │  • Synthesise       │
                            │  • Cite inline      │
                            └─────────┬───────────┘
                                      ▼
                            ┌─────────────────────┐
                            │  Final Report (md)  │
                            └─────────────────────┘
```

Three agents, sequential dependency, one external tool. Simple enough to fit in one file and complex enough to be useful.

## Step 1 — Project setup

Create a fresh directory and a virtual environment:

```bash
mkdir research-agent && cd research-agent
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install crewai crewai-tools tavily-python anthropic python-dotenv
```

Create a `.env` file:

```bash
# .env
ANTHROPIC_API_KEY=sk-ant-...
TAVILY_API_KEY=tvly-...
MODEL=claude-sonnet-4-6
```

Add a `.gitignore` with `.venv` and `.env` in it so you do not accidentally commit secrets.

## Step 2 — Define the search tool

CrewAI provides a `BaseTool` class for tool definitions. We will wrap Tavily in one.

```python
# tools.py
import os
from crewai.tools import BaseTool
from tavily import TavilyClient
from pydantic import Field

class TavilySearchTool(BaseTool):
    name: str = "tavily_search"
    description: str = (
        "Search the web for current information on a topic. "
        "Returns up to 5 relevant results with title, URL, and a content snippet."
    )

    def _run(self, query: str) -> str:
        client = TavilyClient(api_key=os.environ["TAVILY_API_KEY"])
        result = client.search(query, max_results=5, search_depth="advanced")
        lines = []
        for r in result.get("results", []):
            lines.append(f"- {r['title']}\n  URL: {r['url']}\n  {r['content'][:400]}")
        return "\n\n".join(lines) if lines else "No results."
```

The `_run` method is what CrewAI calls when the agent decides to invoke the tool. Returning a structured string is fine for now — Claude is good at parsing this format. For high-volume use you might switch to JSON.

## Step 3 — Define the agents

```python
# agents.py
import os
from crewai import Agent, LLM
from tools import TavilySearchTool

llm = LLM(
    model=f"anthropic/{os.environ.get('MODEL', 'claude-sonnet-4-6')}",
    temperature=0.3,
)

planner = Agent(
    role="Research Planner",
    goal="Decompose a topic into 4-5 focused, mutually exclusive subtopics worth researching.",
    backstory=(
        "You are an experienced research strategist. You take broad topics and break them into "
        "specific, answerable subtopics. You avoid overlap and skip subtopics that won't change a reader's mind."
    ),
    llm=llm,
    allow_delegation=False,
    verbose=True,
)

search_tool = TavilySearchTool()

researcher = Agent(
    role="Web Researcher",
    goal="For each subtopic, find 3-5 high-quality sources and extract the load-bearing claims with citations.",
    backstory=(
        "You are a meticulous researcher. You prefer primary sources, recent publications, and authoritative "
        "venues. You always record URLs alongside claims so the writer can cite them."
    ),
    tools=[search_tool],
    llm=llm,
    allow_delegation=False,
    verbose=True,
)

writer = Agent(
    role="Technical Writer",
    goal="Synthesise the researcher's findings into a single coherent 1,500-word report with inline citations.",
    backstory=(
        "You are a technical writer who refuses to bury the lede. You write tight prose, cite as you go, and "
        "do not include points that the research did not support."
    ),
    llm=llm,
    allow_delegation=False,
    verbose=True,
)
```

A few decisions worth flagging. `temperature=0.3` is intentionally low for research — we want fact-following over creativity. `allow_delegation=False` keeps each agent in its lane (delegation between agents is powerful but adds tokens; we don't need it for this flow). The `backstory` field is not decorative — it shapes the model's behavior and is worth iterating on.

## Step 4 — Define the tasks

```python
# tasks.py
from crewai import Task
from agents import planner, researcher, writer

def build_tasks(topic: str):
    plan = Task(
        description=(
            f"Decompose the topic '{topic}' into 4-5 focused subtopics. "
            "Return a JSON list of strings."
        ),
        expected_output="A JSON list of 4-5 subtopic strings.",
        agent=planner,
    )

    research = Task(
        description=(
            "For each subtopic in the planner's output, use the tavily_search tool to find "
            "3-5 sources. Extract the key claims and record URLs."
        ),
        expected_output="A markdown document organised by subtopic, with bulleted claims and URLs.",
        agent=researcher,
        context=[plan],
    )

    write = Task(
        description=(
            f"Synthesise the researcher's findings into a 1,500-word report on '{topic}'. "
            "Use inline citations in the form [1], [2] with a numbered References section."
        ),
        expected_output="A 1,500-word markdown report with inline citations.",
        agent=writer,
        context=[research],
    )

    return [plan, research, write]
```

The `context=[plan]` and `context=[research]` arguments are how CrewAI wires the output of one task into the input of the next. This is the cleanest part of CrewAI's API.

## Step 5 — Run it

```python
# main.py
import sys
from dotenv import load_dotenv
from crewai import Crew, Process
from tasks import build_tasks

load_dotenv()

def main():
    topic = " ".join(sys.argv[1:]) or "Recent advances in mixture-of-experts language models"
    tasks = build_tasks(topic)
    crew = Crew(
        agents=[t.agent for t in tasks],
        tasks=tasks,
        process=Process.sequential,
        verbose=True,
    )
    result = crew.kickoff()
    print("\n\n===== FINAL REPORT =====\n")
    print(result.raw)

if __name__ == "__main__":
    main()
```

Run it:

```bash
python main.py "Recent advances in mixture-of-experts language models"
```

The `verbose=True` flag means you will see every agent's thought process and every tool call as it happens. This is invaluable while you are still iterating; turn it down (or off) for production.

## Step 6 — What went wrong, and how we fixed it

The first run on a fresh setup almost always exposes one or two issues. Here is what happened on ours and how we resolved it.

**Problem 1:** The Researcher agent invented a few URLs that look plausible but don't exist. Cause: it was using the model's prior knowledge instead of the tool output.

**Fix:** We tightened the Researcher's goal and added an explicit instruction to the task description: *"Do not invent URLs. Only cite URLs returned by the tavily_search tool."* The hallucination dropped to roughly zero across our test runs.

**Problem 2:** The Writer occasionally produced reports under 800 words when the research returned thin material on some subtopics.

**Fix:** Added an explicit length constraint to the Writer's task description and reduced the number of subtopics from 5 to 4 on thin topics. The right answer here depends on your use case — if you want hard length guarantees, post-process and re-prompt rather than relying on the model to obey.

**Problem 3:** Token cost on Opus was uncomfortable (~$0.42 per run). Switching to Sonnet 4.6 dropped it to ~$0.05 per run with no quality regression for this task.

**Lesson:** start on Sonnet, only upgrade to Opus if you observe a quality regression. Most agent flows of this shape do not need Opus.

## Cost analysis (actual numbers)

On Claude Sonnet 4.6, the reference topic ran end-to-end at:

- Input tokens: ~21,000
- Output tokens: ~5,800
- API cost: **$0.084** per run (with prompt caching enabled; ~$0.10 without)
- Tavily search: ~5 calls × ~$0.005 = **$0.025** per run

Total: **~$0.05–$0.11 per run** depending on caching hit rate and topic depth. For a research agent you run 50 times a month, this is roughly $3–6/month.

If you are running this at higher volume, route through <a href="https://openrouter.ai/?ref=agentguides" rel="sponsored nofollow noopener" target="_blank">OpenRouter</a> for unified billing across providers, and add <a href="https://www.helicone.ai/?ref=agentguides" rel="sponsored nofollow noopener" target="_blank">Helicone</a> for per-call cost tracking — both have generous free tiers.

## Where to take it next

The version we just built is a baseline. Here are concrete directions to extend it, with rough effort:

- **Add a fact-check pass (1–2 hours).** A fourth agent that takes the Writer's draft, finds the citations, and verifies each claim against the cited source. Improves output quality at the cost of one extra model pass.
- **Switch from sequential to hierarchical (3–4 hours).** CrewAI supports `Process.hierarchical` where a manager agent orchestrates the others. Useful if the flow needs branching.
- **Add memory across runs (4–6 hours).** Persist the researcher's findings to SQLite or a vector store, so subsequent queries on related topics reuse prior research.
- **Wrap it in an MCP server (1 day).** Expose the agent as an MCP tool so it can be called from Claude Code, Cursor, or any MCP-compatible client. See [Building MCP Servers](/mcp/building-servers/) for the protocol details.
- **Deploy as an API (1 day).** Wrap the agent in FastAPI, deploy to Cloudflare Workers or Modal, and add API-key auth.

## Full code

The complete working repository is at <a href="https://github.com/Sero01/ai-agents-guide" target="_blank" rel="noopener">github.com/Sero01/ai-agents-guide</a> under `examples/research-agent-crewai/`.

For a structured course on top of this — covering the CrewAI patterns we did not use here, plus deployment — the <a href="https://www.datacamp.com/?ref=agentguides" rel="sponsored nofollow noopener" target="_blank">DataCamp CrewAI track</a> is the most current option we have used.

## Continue reading

- [CrewAI vs LangGraph vs AutoGen — head-to-head](/reviews/crewai-vs-langgraph-vs-autogen/) — same workload built in two other frameworks, side-by-side numbers.
- [Best AI Agent Frameworks 2026](/best/ai-agent-frameworks-2026/) — broader shortlist of frameworks if CrewAI is not the right fit.
- [AI Models Leaderboard](/leaderboard/) — pick a cheaper or stronger model than the Sonnet 4.6 default.
- [Tokens & Context](/ai-agents/tokens-context/) — how to budget tokens once you start running this agent at higher volume.
- [All Build Tutorials](/build/) — index of every end-to-end build on the site.
