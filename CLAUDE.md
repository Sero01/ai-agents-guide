# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> Mirrored across CLAUDE.md, AGENTS.md, and GEMINI.md — same instructions load in any AI environment.

## Session Start

Before doing anything else:
1. Read `tasks/lessons.md` — internalize all active rules before touching any code
2. Read the last 3 files in `memory/` — understand current project state and open questions
3. Read `user/preferences.md` — re-establish user context and working style
4. Summarize active context and open questions to yourself in 2–3 lines before proceeding

## Project Structure

- `memory/` — daily logs: decisions, bugs, learnings, open questions
- `user/` — user preferences and working style
- `skills/` — registry of reusable code and prompt patterns
- `tasks/` — lessons log (distilled rulebook) and task tracking
- `plans/` — implementation plans with checkable steps
- `.tmp/` — intermediate files, never committed, always regeneratable
- `.env` — environment variables and API keys

---

## Repository Purpose

Two concerns live here side by side:

1. **Documentation website** (`site/`) — Astro + Starlight docs site about AI agents and agentic workflows, live at [agentguides.dev](https://agentguides.dev)
2. **Orchestration system** (root) — A 3-layer AI workflow framework used to automate tasks (job scraping, repo management, etc.)

---

## Docs Website (`site/`)

Astro 5 + Starlight + @astrojs/sitemap. Deployed on Cloudflare Pages.

### Commands

```bash
cd site
npm run dev      # Dev server at localhost:4321
npm run build    # Build static output → site/dist/
npm run preview  # Preview the production build locally
```

Node 20+ required. System has v24 available.

### Key Files

| Path | Purpose |
|------|---------||
| `site/astro.config.mjs` | Sidebar structure, integrations, site URL, AdSense, JSON-LD schema |
| `site/src/content/docs/` | All documentation pages (`.md` / `.mdx`) |
| `site/src/pages/index.astro` | Marketing landing page (separate from Starlight layout) |
| `site/src/pages/privacy.astro` | Privacy policy (required for AdSense) |
| `site/src/pages/about.astro` | About page (required for AdSense) |
| `site/src/components/` | ThemeSelect override + monetization components |
| `site/src/styles/custom.css` | Brand colors and Starlight CSS overrides |
| `site/public/ads.txt` | AdSense ads.txt (required for approval) |

### Adding a Page

1. Create `.md` or `.mdx` in the appropriate `site/src/content/docs/` subdirectory
2. Required frontmatter: `title`, `description` (factual — no superlatives like "best", "most complete", "#1")
3. Add an entry to the `sidebar` array in `astro.config.mjs`

### SEO Rules

- **No superlative-stacked titles/descriptions.** Google flags "The most comprehensive", "The #1 guide", "The Best" as low-quality. Use factual descriptors instead.
- Pages with JSON-LD schemas: update both the frontmatter description AND the JSON-LD description
- Landing page meta tags are in `index.astro` `<head>`, separate from Starlight's config

### Monetization Components

| Component | Status |
|-----------|--------|
| `AdSlot.astro` | Defined, not yet used in content pages |
| `SponsorBanner.astro` | Defined, inactive (empty config) |
| `PremiumGate.astro` | Defined, not yet used |
| `AffiliateLink.astro` | Defined, not yet used |

### Deployment (Cloudflare Pages)

- Build command: `npm run build`
- Output directory: `dist`
- Root directory: `site`
- Node version: 20+

---

## The 3-Layer Architecture (root)

**Layer 1 — Directives** (`directives/`): SOPs in Markdown defining goals, inputs, tools, outputs, edge cases.

**Layer 2 — Orchestration** (Claude): Read directives, call execution scripts, handle errors, update directives with learnings.

**Layer 3 — Execution** (`execution/`): Deterministic Python scripts. All API calls, data processing, file operations.

### Operating Principles

1. Check `execution/` for existing tools before writing new scripts
2. Self-anneal: fix script → test → update directive with what you learned
3. Don't create/overwrite directives without asking

### Infrastructure

- **GitHub user**: `Sero01`, default branch: `main`
- **GitHub push**: Use MCP tools (`create_or_update_file` to seed, then `push_files`). Seed with one file first — empty repos reject `push_files`.
- **Google OAuth**: `/home/parvez/.config/gdrive-mcp/`
- **Deliverables** go to cloud services (Google Sheets, Slides). Local files are for intermediate processing only.
