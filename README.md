# AI Agents & Agentic Workflows Guide

A practical, code-first guide to AI agents, agentic workflows, MCP, and the tools powering the next era of AI.

## Live Site

[agentguide.dev](https://agentguide.dev) — deployed on Cloudflare Pages.

## What's Inside

| Topic | Coverage |
|-------|----------|
| AI Agents | Concepts, architecture, tokens, context |
| Agentic Workflows | Multi-step pipelines, multi-agent systems |
| MCP | Model Context Protocol — setup, servers, building your own |
| Frameworks | LangChain, CrewAI, AutoGen — honest comparison |
| Tools & Memory | How agents use tools and persist knowledge |
| Prompt Engineering | Strategies designed for agent systems |
| Agent Instructions | CLAUDE.md / AgentMD pattern |
| Code Examples | Working, runnable code for every concept |

## Repo Structure

```
└── site/                   # Astro + Starlight docs website
    ├── src/content/docs/   # All documentation pages
    ├── src/pages/          # Marketing landing page
    ├── src/components/     # Monetization components
    └── astro.config.mjs    # Sidebar, integrations, SEO config
```

## Running the Docs Site

Requires Node 20+:

```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && nvm use 20
cd site
npm install
npm run dev      # Dev server at localhost:4321
npm run build    # Build static output → site/dist/
```

## Deploying to Cloudflare Pages

Connect this repo to Cloudflare Pages:
- Build command: `npm run build`
- Output directory: `dist`
- Root directory: `site`
- Node version: `20`

## Author

**Parvez Ahmed** — AI developer & technical writer
[LinkedIn](https://www.linkedin.com/in/parvez-ahmed-b47680124) · [GitHub](https://github.com/Sero01) · [Instagram](https://www.instagram.com/126parvez)
