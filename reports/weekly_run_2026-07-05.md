# Weekly Run — 2026-07-05

Maintainer pass for agentguides.dev (Astro 5 + Starlight, deploys to Cloudflare Pages on push to `main`).

## 1. Leaderboard refresh (`site/src/data/models.json`)

- `last_updated` bumped **2026-06-28 → 2026-07-05**.
- Model count: **65 → 66** (no rows removed; no duplicate ids — validated by script).

### Added

**Claude Sonnet 5** (`claude-sonnet-5`, Anthropic, closed) — released **2026-06-30**.
Anthropic's new mid-tier flagship, positioned as a cheaper way to run agents at scale. Unlike the GPT-5.6 / Gemini 3.5 Pro previews, Sonnet 5 shipped with a full public benchmark card, so most cells are vendor-grounded rather than estimated. Inserted directly above the Sonnet 4.6 row (new Sonnet flagship, superseding 4.6 in the line).

| Field | Value | Source |
|---|---|---|
| Pricing (input/output) | $3.00 / $15.00 per 1M | **Vendor-confirmed standard rate** — recorded as the durable rate. An introductory promo of **$2/$10** runs through 2026-08-31, reverting to standard on 2026-09-01. |
| cache_write / cache_read | $3.75 / $0.30 | **Estimated** (matches Sonnet 4.6 cache tiers) |
| context_window | 1,000,000 | **Vendor-confirmed** |
| max_output | 128,000 | **Vendor-confirmed** (raisable to 300k via batch-API beta header) |
| modalities | text, vision | **Vendor-confirmed** |
| throughput | 92 | **Estimated** (between Sonnet 4.6 = 95 and Opus 4.8 = 85) |
| swe_bench | 72.7 | **Vendor-sourced** — published SWE-bench Verified |
| gpqa_diamond | 91.1 | **Vendor/aggregator-sourced** — reported GPQA Diamond |
| mmlu_pro | 86.0 | **Estimated** — between Sonnet 4.6 (82.0) and Opus 4.8 (88.5) |
| humaneval | 92.5 | **Estimated** — between Sonnet 4.6 (89.5) and Opus 4.8 (94.5) |
| math_500 | 95.0 | **Estimated** — between Sonnet 4.6 (92.0) and Opus 4.8 (96.8) |
| mmmu | 77.0 | **Estimated** — between Sonnet 4.6 (72.1) and Opus 4.8 (81.0) |
| aider_polyglot | 81.0 | **Estimated** — between Sonnet 4.6 (76.0) and Opus 4.8 (85.0) |
| tau_bench | 80.0 | **Estimated** — between Sonnet 4.6 (74.5) and Opus 4.8 (84.0) |

> **Vendor-sourced cells:** `swe_bench` (72.7, SWE-bench Verified) and `gpqa_diamond` (91.1). Also vendor-confirmed: pricing, context window, max output, modalities. **Estimated cells:** `mmlu_pro`, `humaneval`, `math_500`, `mmmu`, `aider_polyglot`, `tau_bench`, plus cache tiers and throughput — each positioned conservatively between the confirmed Sonnet 4.6 predecessor and the Opus 4.8 sibling, and kept consistent with the published SWE-bench/GPQA gains. The `methodology_note` in `models.json` documents all of this and the promo-vs-standard pricing choice.

### Considered and rejected (with reasons)

- **Gemini 3.5 Pro** — announced at Google I/O (May 19) with a 2M-token context and "Deep Think" mode, but **still in limited Vertex preview as of July 5** with no confirmed GA date and no published pricing or benchmark card. Adding a fully-estimated frontier row would overstate data integrity → skipped again (as in the 2026-06-28 run). Covered as the pending story in the article and leaderboard context. Revisit once it reaches GA.
- **GPT-5.6 Terra / Luna** — real preview tiers, still no published standard-suite benchmarks → not added (Sol already in table from the prior run).
- **Alibaba "Happy Horse 1.0" / Meta "Muse Spark"** — surfaced as multimodal chatter with no verifiable vendor benchmark cards or pricing → skipped as unconfirmed/ultra-niche.

### Other changes
- Added **"Claude Sonnet 5"** to the keyword meta in `leaderboard.astro` (current-flagship set).
- No pricing corrections to existing rows were independently verifiable enough to change this week.

## 2. New article

- **Title:** Claude Sonnet 5 Review — Benchmarks, Pricing, and the Agent Angle
- **Path:** `site/src/content/docs/reviews/claude-sonnet-5-review.mdx`
- **Live URL:** https://agentguides.dev/reviews/claude-sonnet-5-review/
- **Why:** Timeliest AI story of the week — Anthropic's June 30 Sonnet 5 release. Unlike recent previews, it shipped with real published numbers, so the review works from measured data: the jump over Sonnet 4.6, the introductory-vs-standard pricing, the new tokenizer (1.0–1.35× token inflation), and where it lands against Opus 4.8.
- **SEO / on-page:**
  - Factual title + description (no superlative stacking).
  - Sidebar entry added under **Reviews** in `astro.config.mjs` (order 9), after the GPT-5.6 review.
  - JSON-LD (TechArticle + Review + Breadcrumb + FAQ) description kept in sync with the frontmatter description.
  - OG/canonical/Twitter tags mirror sibling review pages (`/og/reviews.png`, canonical to self).
  - Internally linked **from** the Claude Opus 4.8 review's "Continue reading" list; links **out** to leaderboard, Opus 4.8 review, GLM-5.2 review, GPT-5.6 review, LLM Benchmark Comparison, and Multi-Agent Pipelines.
  - Auto-added to `sitemap-index.xml` / `sitemap-0.xml` via @astrojs/sitemap on build (verified present).

## 3. Build / validation

- `npm install` (deps were not present in the fresh checkout) → OK.
- `cd site && npm run build` → **PASS**. 41 pages built, no errors. New page `/reviews/claude-sonnet-5-review/index.html` built; Pagefind index and sitemap regenerated.
- `models.json`: parses cleanly, **66 models, zero duplicate ids** (validated by script). New row has all 8 benchmark keys.
- Verified "Claude Sonnet 5" renders on the built leaderboard page and the review URL is present in the sitemap.
- Nothing needed fixing beyond the initial dependency install.

## Manual indexing needed

These pages are new this run and must be submitted by hand via **Google Search Console → URL Inspection → Request Indexing** (no API or remote agent can request indexing):

- [ ] https://agentguides.dev/reviews/claude-sonnet-5-review/

(The models leaderboard at https://agentguides.dev/leaderboard/ was updated, not newly created — it is already indexed and will be recrawled; no manual submission required, though a re-inspection can speed up the refresh.)
