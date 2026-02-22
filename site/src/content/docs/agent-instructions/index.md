---
title: Agent Instructions (CLAUDE.md)
description: How to use CLAUDE.md and similar files to give persistent instructions to AI coding agents.
---

# Agent Instructions: CLAUDE.md Pattern

AI coding agents like Claude Code, Cursor, and GitHub Copilot Workspace support a special file — `CLAUDE.md`, `AGENTS.md`, or `.cursorrules` — that loads as persistent context whenever the agent starts.

This pattern lets you encode your project conventions, architecture, and operating rules once, rather than repeating them in every prompt.

## What is CLAUDE.md?

`CLAUDE.md` is a Markdown file checked into the root of your repository. When Claude Code starts, it automatically reads this file and follows the instructions inside.

Key uses:
- Define the codebase architecture so the agent understands context
- Specify coding conventions and style preferences
- List tools and scripts the agent should use (instead of doing things manually)
- Set operating principles (e.g., “don’t modify X without asking”)
- Provide environment specifics (API keys location, auth setup, etc.)

## The AgentMD Pattern

For maximum portability across AI tools, mirror the same instructions across three files:

| File | Read by |
|------|---------|
| `CLAUDE.md` | Claude Code |
| `AGENTS.md` | OpenAI Codex, other tools |
| `GEMINI.md` | Google Gemini CLI |

This ensures any AI coding assistant that opens your repo gets the same context.

## Structure

A good agent instructions file covers:

1. **Repository purpose** — What is this project?
2. **Architecture** — How is it structured? What’s in each directory?
3. **Operating principles** — How should the agent behave?
4. **Available tools** — What scripts exist? When should the agent use them?
5. **Infrastructure specifics** — Credentials, endpoints, quirks

## Example Structure

```markdown
# CLAUDE.md

## Repository Purpose
This is a ...

## Architecture
- `src/` — Application source
- `scripts/` — Automation scripts
- `tests/` — Test suite

## Operating Principles
1. Always run tests before committing
2. Use existing scripts in `scripts/` rather than writing new ones
3. Ask before modifying database schema

## Available Tools
| Script | Purpose |
|--------|---------|
| `scripts/deploy.sh` | Deploy to production |
| `scripts/seed_db.py` | Seed the database |
```

## Best Practices

- **Keep it focused**: Include what the agent needs to operate, not a full README
- **Update it as you learn**: When an agent makes a mistake, add a note to prevent recurrence
- **Be specific about tools**: "Use `scripts/build.py` to build" beats "run the build script"
- **Include edge cases**: Warn about common gotchas ("HTTPS git push doesn’t work here, use MCP tools")

## The 3-Layer Architecture

This repo uses agent instructions to implement a 3-layer workflow:

1. **Directives** (`directives/`) — Natural language SOPs
2. **Orchestration** (the AI agent) — Reads directives, routes to scripts
3. **Execution** (`execution/`) — Deterministic Python scripts

This separation keeps the AI in a coordination role, not an execution role, which dramatically improves reliability.
