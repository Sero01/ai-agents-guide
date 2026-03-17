# AI Agents & Agentic Workflows Guide

The most comprehensive, beginner-friendly guide to AI agents, agentic workflows, MCP, and the top frameworks powering the latest AI automation. Free, practical, code-first. Updated 2026.

## Live Site

**[agentguides.dev](https://agentguides.dev)** — deployed on Cloudflare Pages.

## What's Inside

| Topic | Coverage |
|-------|----------|
| AI Agents | Concepts, architecture, ReAct loop, design patterns |
| Agentic Workflows | Multi-step pipelines, multi-agent systems |
| MCP | Model Context Protocol — setup, servers, building your own |
| Frameworks | LangChain vs CrewAI vs AutoGen — honest comparison |
| Tools & Memory | How agents use tools and persist knowledge |
| Prompt Engineering | Advanced strategies designed for agent systems |
| Agent Instructions | CLAUDE.md / AgentMD pattern |
| Code Examples | Working, runnable Python code for every concept |

## Repo Structure

```
└── site/                   # Astro + Starlight docs website
    ├── src/content/docs/   # All documentation pages (.md / .mdx)
    ├── src/pages/          # Marketing landing page
    ├── src/components/     # Monetization components (AdSlot, AffiliateLink, etc.)
    ├── src/styles/         # Brand colors and CSS overrides
    └── astro.config.mjs    # Sidebar, integrations, SEO config
```

## Running Locally

Requires Node 20+:

```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && nvm use 20
cd site
npm install
npm run dev      # Dev server at localhost:4321
npm run build    # Build static output → site/dist/
npm run preview  # Preview the production build locally
```

## Deploying to Cloudflare Pages

Connect this repo to Cloudflare Pages with these settings:

| Setting | Value |
|---------|-------|
| Build command | `npm run build` |
| Output directory | `dist` |
| Root directory | `site` |
| Environment variable | `NODE_VERSION=20` |

After deploy, add `agentguides.dev` as a custom domain in the Pages settings.

## Tech Stack

- [Astro 5](https://astro.build) + [@astrojs/starlight](https://starlight.astro.build) — static docs framework
- [@astrojs/sitemap](https://docs.astro.build/en/guides/integrations-guide/sitemap/) — auto-generated sitemap
- Cloudflare Pages — hosting
- Google AdSense — monetization

## Author

**Parvez Ahmed** — AI developer & technical writer
[LinkedIn](https://www.linkedin.com/in/parvez-ahmed-b47680124) · [GitHub](https://github.com/Sero01) · [Instagram](https://www.instagram.com/126parvez)
