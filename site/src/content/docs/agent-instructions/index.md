---
title: "Configuring AI Agents with CLAUDE.md and the AgentMD Pattern"
description: "How to use CLAUDE.md and the AgentMD pattern to configure AI agents with project-specific instructions. Covers format, what to include, and how system prompts differ from CLAUDE.md."
sidebar:
  order: 1
head:
  - tag: script
    attrs:
      type: application/ld+json
    content: |
      {"@context":"https://schema.org","@type":"TechArticle","headline":"Configuring AI Agents with CLAUDE.md and the AgentMD Pattern","description":"How to use CLAUDE.md and the AgentMD pattern to configure AI agents with project-specific instructions. Covers format, what to include, and how system prompts differ from CLAUDE.md.","url":"https://agentguides.dev/agent-instructions/","datePublished":"2026-01-01","dateModified":"2026-02-23","author":{"@type":"Person","name":"Parvez Ahmed"},"publisher":{"@type":"Person","name":"Parvez Ahmed"},"keywords":"CLAUDE.md, AgentMD, agent instructions, AI agent configuration, system prompts, Claude instructions, AI agent setup"}
  - tag: script
    attrs:
      type: application/ld+json
    content: |
      {"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://agentguides.dev/"},{"@type":"ListItem","position":2,"name":"Agent Instructions","item":"https://agentguides.dev/agent-instructions/"}]}
---

## What is AgentMD?

AgentMD is a convention: place a `CLAUDE.md` (or `AGENTS.md`, `GEMINI.md`) file in your project root. AI coding assistants automatically load it as context — your agent gets project-specific instructions on every invocation.

It's a `README.md` for your AI agent.

The core insight is that AI coding assistants operate better with explicit project context. Without a CLAUDE.md file, the agent must infer your conventions, architecture, and constraints by reading the code — which is slow and error-prone. With a CLAUDE.md file, the agent immediately knows what matters.

CLAUDE.md files are loaded automatically by Claude Code, GitHub Copilot (with appropriate plugins), and other AI coding tools that support the convention. The agent reads the file before every session, so changes to CLAUDE.md take effect immediately without any configuration.

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

The goal is to give the AI agent the information it would need to operate effectively — information that isn't obvious from reading the code and that matters for making correct decisions.

For example, if your project uses a specific Python version for compatibility reasons, or if tests must always be run against a real database rather than mocks, or if there are files that should never be modified — these are exactly the kinds of things that belong in CLAUDE.md.

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

This three-section structure works well for most projects. The Commands section prevents the agent from guessing how to run things. Architecture summarizes decisions that would take a long time to reverse-engineer from the code. Conventions flag the non-obvious rules that the agent needs to follow.

## Writing Effective CLAUDE.md Files

**Be specific about commands**: Don't just say "run the tests." Say `pytest tests/ -v --no-header` or whatever the actual command is. Agents can't guess at incantations.

**Explain the why, not just the what**: "Don't use `asyncio.run()` in tests — we use `pytest-asyncio` for async test fixtures" is much more useful than just "don't use asyncio.run() in tests." Knowing the reason helps the agent apply the rule correctly in edge cases.

**Document the gotchas**: What are the things that trip up new contributors? What are the non-obvious constraints that experts know but aren't written anywhere? Those belong in CLAUDE.md.

**Keep it current**: An outdated CLAUDE.md is worse than none at all — it teaches the agent wrong things. Review and update it when project conventions change.

## The 3-Layer Pattern

This project uses a 3-layer architecture that CLAUDE.md encodes:

1. **Directives** (`directives/*.md`) — Plain-English SOPs. What to do and why.
2. **Orchestration** — The AI agent reads directives and decides what to run.
3. **Execution** (`execution/*.py`) — Deterministic Python scripts that do the work.

The CLAUDE.md explains this pattern so any AI agent can immediately operate within it.

This architecture separates concerns: directives encode business logic in human-readable form, execution scripts contain the deterministic code, and the orchestration layer (the AI) handles the decision-making between them. Encoding this in CLAUDE.md means any AI agent that reads the file understands the convention immediately.

## Hierarchical CLAUDE.md Files

Larger projects can have multiple CLAUDE.md files at different directory levels:

```
project/
├── CLAUDE.md           # Root: project-wide conventions
├── backend/
│   └── CLAUDE.md       # Backend-specific: API patterns, DB conventions
├── frontend/
│   └── CLAUDE.md       # Frontend-specific: component patterns, styling rules
└── scripts/
    └── CLAUDE.md       # Scripts: how automation scripts are structured
```

The AI agent reads all applicable CLAUDE.md files — root plus any in the current working directory. This lets you have project-wide conventions at the root and more specific conventions closer to the code they apply to.

Be careful with conflicting instructions across levels. If the root CLAUDE.md says one thing and a subdirectory CLAUDE.md says another, the agent may not know which to follow. Prefer additive (more specific) subdirectory files over ones that override the root.

## System Prompts vs. CLAUDE.md

| CLAUDE.md | System Prompt |
|-----------|---------------|
| Checked into the repo | Sent via API |
| Persistent across sessions | Per-request |
| Editable by anyone on the team | Controlled by the app |
| Ideal for dev environments | Ideal for production agents |

For production agents, encode your instructions as system prompts. For development/coding agents, use CLAUDE.md.

The distinction matters because CLAUDE.md is a source-controlled file — it's visible to the whole team, it's versioned with the code, and anyone can edit it. System prompts are typically controlled by the application developer and sent with each API call. A production customer-facing agent should not have its behavior dictated by a file in the repository that developers can arbitrarily change.

## When CLAUDE.md Changes Behavior Most

The effect of CLAUDE.md is largest when:

- **The codebase has unusual conventions**: If you use an uncommon testing pattern, a non-standard file organization, or a custom deployment process, CLAUDE.md can prevent the agent from defaulting to standard conventions that don't apply.

- **The agent makes irreversible changes**: When the agent modifies infrastructure, sends external notifications, or modifies a production database, constraints in CLAUDE.md are critical guardrails.

- **Multiple people use the same AI agent setup**: CLAUDE.md lets the team agree on how the AI agent should behave, rather than each person having to remember to instruct the agent the same way in every session.

- **The project has security or compliance requirements**: Constraints like "never log personally identifiable information" or "always use parameterized queries" belong in CLAUDE.md where they're enforced consistently.

## Practical Example: A Real CLAUDE.md

Here's a realistic CLAUDE.md for a Python API project:

```markdown
# CLAUDE.md

## Development Commands
python -m pytest tests/ -v           # Run all tests
python -m pytest tests/unit/ -v      # Unit tests only (fast)
uvicorn app.main:app --reload        # Start dev server (port 8000)
alembic upgrade head                  # Apply pending DB migrations

## Architecture
- FastAPI application with PostgreSQL (via SQLAlchemy async)
- All DB access goes through repositories in app/repositories/
- Never call the DB directly from route handlers
- Business logic goes in services (app/services/), not routes

## Testing
- Use pytest-asyncio for async tests; never use asyncio.run() in tests
- Tests use a test database; fixtures are in tests/conftest.py
- All tests must pass before committing (CI enforces this)

## Conventions
- Type hints are required on all function signatures
- Use Pydantic models for all request/response types (in app/schemas/)
- Environment variables are accessed via app/config.py Settings — never os.environ directly
- Secrets must never be committed; use .env files (gitignored)

## Do Not
- Modify alembic versions/ directly — generate migrations with `alembic revision --autogenerate`
- Add new dependencies without updating requirements.txt and requirements-dev.txt
- Deploy to production without running tests first
```

This CLAUDE.md tells the agent everything it needs to operate effectively: how to run things, where code belongs, what the testing setup is, and the specific constraints that trip up developers who are new to the project.

## See Also

- [Prompt Engineering for Agents](/prompt-engineering/) — Writing system prompts for production agents
- [Getting Started](/getting-started/) — How this guide is structured and what to read first
