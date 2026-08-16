# Weekly Run — 2026-08-16

Maintainer pass for [agentguides.dev](https://agentguides.dev). Refreshed the models leaderboard, published one new review, verified the build, and logged everything below.

## 1. Leaderboard delta

`site/src/data/models.json` — `last_updated` bumped `2026-08-09` → `2026-08-16`. Model count 76 → **78**. No models removed. No duplicate ids (verified). Model validator: **0 errors**, 17 (pre-existing) warnings, PASS.

### Models added

**Gemini 3.7 Flash** (`gemini-3-7-flash`, Google, closed, released 2026-08-13) — inserted at the top of the Google cluster, just above Gemini 3.6 Flash.

| Field | Value | Provenance |
|---|---|---|
| GPQA Diamond | 90.4 | **Vendor-sourced** (Google-reported) |
| Terminal-Bench 2.1 | 85.8 | **Vendor-sourced** (Google-reported, up from 3.6 Flash's 78.0) |
| MMMU-Pro | 81.2 | **Vendor-sourced** (Google-reported) |
| SWE-bench Pro | 62.0 | **Conservatively estimated** — anchored to Gemini 3.6 Flash's vendor 58.7 + Google's reported coding gains (TB 2.1 78.0→85.8, DeepSWE v1.1 48.6→65.3). Google published no SWE-bench Pro cell. |
| Context / max output | 1,048,576 / 65,536 | Vendor |
| Pricing (input/output per 1M) | $0.75 / $3.75 | **Vendor** — introductory rate through 2026-12-31; scheduled to rise to $1.50 / $7.50 on 2027-01-01 (noted in the entry). |
| Throughput | 190 tok/s | Estimated (Flash-tier peer range) |

**GLM-5.3** (`glm-5-3`, Zhipu AI, open, released 2026-08-14) — inserted above GLM-5.2. Post-trained on the same 743B base as GLM-5.2; open weights are staged for release ~2 weeks after launch.

| Field | Value | Provenance |
|---|---|---|
| HLE (with tools) | 62.5 | **Vendor-sourced** (Z.ai-reported, up from GLM-5.2's 54.7) |
| GPQA Diamond | 91.5 | **Conservatively estimated** — anchored to GLM-5.2's vendor 91.2 (shared base). No standalone 5.3 GPQA cell published. |
| SWE-bench Pro | 65.0 | **Conservatively estimated** — anchored to GLM-5.2's vendor 62.1 + reported post-training coding gains (DeepSWE v1.1 66.9). Z.ai published Terminal-Bench 3.0 / DeepSWE but no SWE-bench Pro cell. |
| Context / max output | 1,000,000 / 131,072 | Vendor (same base as 5.2) |
| Pricing (input/output/cache per 1M) | $1.40 / $4.40 / $0.26 | **Carried from GLM-5.2's published API rate** — Z.ai has not published a separate 5.3 rate; noted in the entry. |

### Status changes
- **Gemini 3.6 Flash**: `current` → `superseded` (replaced by 3.7 Flash).
- **GLM-5.2**: `current` → `superseded` (replaced by GLM-5.3).

### Considered but NOT added
- **ByteDance Seed 2.1 Turbo** — no benchmark scores published for the tracked set (Terminal-Bench 2.1 / SWE-bench Pro / GPQA / HLE / MMMU-Pro), no prior Seed model in the dataset to anchor estimates against, and a murky/conflicting release date. Adding it would have required fabricating every cell with no anchor, so it was skipped per the data-integrity policy.

### Other edits
- `site/src/pages/leaderboard.astro` — added "Gemini 3.7 Flash" and "GLM-5.3" to the keyword meta tag; the flagship set changed this week.

## 2. Article published

- **Title:** Gemini 3.7 Flash Review — Google's Cheap Agent Workhorse
- **File:** `site/src/content/docs/reviews/gemini-3-7-flash-review.mdx`
- **Live URL:** https://agentguides.dev/reviews/gemini-3-7-flash-review/
- **Type:** Model review (placed in `reviews/`), matching the structure/tone/length of the existing Meta Muse and GPT-5.6 reviews (TechArticle + Review + BreadcrumbList + FAQPage JSON-LD, AuthorByline, caveat aside, TL;DR table, benchmark table, FAQ, Continue-reading links).
- **Frontmatter:** factual `title`/`description`, no superlative stacking. OG/canonical/Twitter tags mirror sibling reviews; JSON-LD description kept in sync with the frontmatter description.
- **SEO/internal linking:**
  - Sidebar entry added under **Reviews** in `site/astro.config.mjs`.
  - Outbound internal links to `/leaderboard/`, `/best/llm-benchmark-comparison-2026/`, `/reviews/gpt-5-6-sol-terra-luna-review/`, `/reviews/meta-muse-code-muse-spark-1-2-review/`, `/agentic-workflows/multi-agent/`.
  - **Inbound** internal link added from `/reviews/meta-muse-code-muse-spark-1-2-review/` ("Continue reading") so the new page is not an orphan.
  - Auto-added to the sitemap via `@astrojs/sitemap` (confirmed present in `dist/sitemap-0.xml`).

## 3. Build result

- `cd site && npm run build` (Node v22.22.2) — **PASS**. 47 pages built, no errors.
- Had to run `npm install` first (fresh checkout had no `node_modules`, so `astro` was missing); no code changes were needed to fix the build.
- Verified: `dist/reviews/gemini-3-7-flash-review/index.html` exists, "Gemini 3.7 Flash" renders on the built `/leaderboard/`, and `models.json` parses with no duplicate ids.

## Manual indexing needed

The following new page must be submitted by hand via Google Search Console → URL Inspection → Request Indexing (no API or remote agent can request indexing):

- [ ] https://agentguides.dev/reviews/gemini-3-7-flash-review/

The leaderboard page (https://agentguides.dev/leaderboard/) was updated in place, not newly created — worth a re-crawl request but not required.
