---
title: "CLAUDE.md & Agent Instructions — The Best Way to Configure AI Agents (2026)"
description: "Master the AgentMD pattern and CLAUDE.md format. The top method for writing the most effective AI agent instructions for Claude, GPT-4o, and other advanced LLMs. Production-proven."
sidebar:
  order: 1
---

## What is AgentMD?

AgentMD is a convention: place a `CLAUDE.md` (or `AGENTS.md`, `GEMINI.md`) file in your project root. AI coding assistants automatically load it as context — your agent gets project-specific instructions on every invocation.

It's a `README.md` for your AI agent.

## What to Put in CLAUDE.md

**High-value content:**
- Build and test commands (what you'd tell a new dev on their first day)
- Architectural decisions and why they were made
- Non-obvious patterns and conventions
- Project-specific constraints and guardrails

**Skip:**
- Obvious instructions ("write good code")
- Information already discoverable from reading the codebase
- Generic best practices

## Template

```markdown
# CLAUDE.md

## Commands
npm run dev      # Start dev server
npm run build    # Build for production
npm test         # Run tests

## Architecture
Brief description of the system's architecture. Focus on
decisions that require reading multiple files to understand.

## Conventions
- Specific patterns you use that deviate from defaults
- Non-obvious naming conventions
- Anything that would confuse a new contributor
```

## The 3-Layer Pattern

This project uses a 3-layer architecture that CLAUDE.md encodes:

1. **Directives** (`directives/*.md`) — Plain-English SOPs. What to do and why.
2. **Orchestration** — The AI agent reads directives and decides what to run.
3. **Execution** (`execution/*.py`) — Deterministic Python scripts that do the work.

The CLAUDE.md explains this pattern so any AI agent can immediately operate within it.

## System Prompts vs. CLAUDE.md

| CLAUDE.md | System Prompt |
|-----------|______________|
| Checked into the repo | Sent via API |
| Persistent across sessions | Per-request |
| Editable by anyone on the team | Controlled by the app |
| Ideal for dev environments | Ideal for production agents |

For production agents, encode your instructions as system prompts. For development/coding agents, use CLAUDE.md.
