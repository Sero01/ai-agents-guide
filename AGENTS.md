# Agent Instructions

> This file is mirrored across CLAUDE.md, AGENTS.md, and GEMINI.md so the same instructions load in any AI environment.

---

## Repository Purpose

Two concerns live here side by side:

1. **Orchestration system** (root) — A 3-layer AI workflow framework used to automate tasks (job scraping, repo management, etc.)
2. **Documentation website** (`site/`) — Astro + Starlight docs site about AI agents and agentic workflows

---

## The 3-Layer Architecture (root)

**Layer 1 — Directives** (`directives/`)
SOPs in Markdown. Define the goal, inputs, tools/scripts to use, outputs, and edge cases. Natural language, like instructions for a mid-level employee.

**Layer 2 — Orchestration** (you)
Read directives, call execution scripts in the right order, handle errors, ask for clarification, update directives with learnings. Don’t do the work yourself — route it to deterministic scripts.

**Layer 3 — Execution** (`execution/`)
Deterministic Python scripts. All API calls, data processing, and file operations happen here.

**Why:** If the LLM does everything, errors compound. 90% accuracy per step = 59% success over 5 steps. Deterministic code fixes this.

### Operating Principles

1. **Check for existing tools** before writing a new script — look in `execution/` first
2. **Self-anneal**: fix the script → test → update the directive with what you learned
3. **Update directives as you learn** — don’t create/overwrite directives without asking unless told to

### Root File Organization

| Path | Purpose |
|------|---------|
| `directives/` | SOPs / instruction set |
| `execution/` | Python scripts (deterministic tools) |
| `.env` | API keys and environment variables |
| `.tmp/` | Intermediates — never commit, always regeneratable |
| `credentials.json`, `token.json` | Google OAuth (in `.gitignore`) |

**Deliverables** go to cloud services (Google Sheets, Slides). Local files are for intermediate processing only.

### Existing Directives

| Directive | What it does |
|-----------|--------------|
| `directives/create_repo.md` | Initialize a local git repo with `.gitignore` and initial commit |
| `directives/job_scraper.md` | Scrape LinkedIn jobs (Bangalore/Hyderabad) → Google Sheet |
| `directives/push_to_github.md` | Push project to GitHub via MCP tools (not `git push` — HTTPS doesn’t work here) |

### Infrastructure Specifics

- **GitHub user**: `Sero01` (default for all repos)
- **Default branch**: `main`
- **Google OAuth credentials**: `/home/parvez/.config/gdrive-mcp/` (no `.env` needed for GSheets)
- **GitHub push**: Use MCP tools (`create_or_update_file` to seed, then `push_files`). Seed with one file first — empty repos reject `push_files`.

---

## Docs Website (`site/`)

Astro + Starlight documentation site. Tech: Astro 5, `@astrojs/starlight`, `@astrojs/sitemap`.

### Commands

> **Requires Node 20+** (system has 18.19.1 — use nvm):
> ```bash
> export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && nvm use 20
> ```

```bash
cd site
npm run dev      # Dev server at localhost:4321
npm run build    # Build static output → site/dist/
npm run preview  # Preview the production build locally
```

### Architecture

| Path | Purpose |
|------|---------|
| `site/astro.config.mjs` | Sidebar structure, integrations, site URL, AdSense head tag |
| `site/src/content/docs/` | All documentation pages (`.md` / `.mdx`) |
| `site/src/pages/index.astro` | Marketing landing page (separate from `/docs/` Starlight layout) |
| `site/src/components/` | Monetization components |
| `site/src/styles/custom.css` | Brand colors and Starlight CSS overrides |
| `site/public/robots.txt` | SEO: points to sitemap |

### Content Structure

```
site/src/content/docs/
├── index.mdx                  ← Docs homepage (Starlight splash template)
├── getting-started.md
├── ai-agents/                 ← Concepts, patterns, tokens/context
├── agentic-workflows/         ← Overview, multi-agent pipelines
├── mcp/                       ← What is MCP, setup, servers, building servers (full example)
├── frameworks/                ← Comparison, LangChain, CrewAI, AutoGen
├── tools-memory/
├── agent-instructions/        ← CLAUDE.md / AgentMD pattern
├── prompt-engineering/
└── code-examples/
```

**Adding a page:** Create `.md` or `.mdx` in the appropriate subdirectory. Required frontmatter: `title`, `description`. Then add an entry to the `sidebar` array in `astro.config.mjs`.

### Monetization Components

| Component | Usage |
|-----------|-------|
| `AdSlot.astro` | `<AdSlot slot="ca-pub-XXX/YYY" position="in-content" />` — wraps AdSense unit |
| `SponsorBanner.astro` | Edit `SPONSOR` config at the top of the file to activate |
| `PremiumGate.astro` | Blurs slot content; unlocks via `localStorage.premium_unlocked = true` |
| `AffiliateLink.astro` | `<AffiliateLink href="..." campaign="mcp-page">text</AffiliateLink>` |

### Deployment (Cloudflare Pages)

Static output — no adapter needed. Connect your GitHub repo to Cloudflare Pages:
- Build command: `npm run build`
- Output directory: `dist`
- Root directory: `site`
- Node version: 20

Config file: `site/.cloudflare/deploy.toml`

**Before deploying:** Update `site: 'https://agentworkflows.dev'` in `astro.config.mjs` with your actual domain, and replace `ca-pub-REPLACE_ME` in the AdSense script tag.
