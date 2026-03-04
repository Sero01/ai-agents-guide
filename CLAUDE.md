# CLAUDE.md — Project Instructions

## Goal

This site (agentguides.dev) was rejected by Google AdSense for **low value content** and **missing ads.txt**. The goal is to fix all issues and get approved.

**Read `plan.md` at the repo root for the full implementation plan with phases, priorities, and per-page targets.**

## Implementation Order

Follow the phases in `plan.md`:

1. **Phase 1** — Mandatory fixes: ads.txt, privacy/about pages, tone down superlative titles
2. **Phase 2** — Expand all content pages to 800+ visible body words each
3. **Phase 3** — Add original diagrams, fix search, add new in-depth pages
4. **Phase 4** — Final checks against the pre-submission checklist

## Key Rules

- The site is built with **Astro + Starlight**. Source is in `site/`.
- Content pages are Markdown files in `site/src/content/docs/`.
- Config is `site/astro.config.mjs`.
- Landing page is `site/src/pages/index.astro`.
- **Every content page must have 800+ visible body words** (excluding frontmatter, JSON-LD, and code blocks).
- **No superlative-stacked titles** — no "Most Complete", "Best Working", "#1 Free", "Top Collection". Use factual, descriptive titles.
- **Do not remove existing code examples** — expand around them.
- **Keep all existing URLs/slugs intact** — do not break links.
- **Do not add emojis** unless already present in the page.

## Content Quality Standards

When expanding pages:
- Add real explanations, not filler. Every paragraph should teach something.
- Include practical examples, real-world use cases, and common pitfalls.
- Add line-by-line code explanations where code blocks exist.
- Vary page structure — don't follow the same template for every page.
- Write for developers who are learning to build AI agents.

## Review Process

After writing or expanding any content page, run a review check:

1. **Word count** — Verify the page has 800+ visible body words (exclude frontmatter/JSON-LD/code fences). Use: `sed '/^---$/,/^---$/d; /^<script/,/<\/script>/d; /^```/,/^```$/d' <file> | wc -w`
2. **Title check** — Confirm no superlative stacking in `title` or `description` frontmatter fields.
3. **Content depth** — Ensure the page has at least 3 substantive H2 sections with real explanatory prose (not just bullet lists).
4. **Code relevance** — Any code examples should have surrounding explanation of what they do and why.
5. **No broken links** — Internal links should point to existing pages.
6. **Build check** — Run `cd site && npm run build` periodically to confirm nothing is broken.

## Build & Test

```bash
cd site && npm install   # first time only
cd site && npm run build # full build — must pass
cd site && npm run dev   # local dev server at localhost:4321
```

## Repository Structure

```
plan.md              — Full implementation plan (READ THIS FIRST)
CLAUDE.md            — This file
site/
  astro.config.mjs   — Site config, nav, meta tags
  public/            — Static assets (ads.txt goes here)
  src/
    content/docs/    — All content pages (Markdown)
    pages/           — Standalone pages (index.astro, etc.)
```
