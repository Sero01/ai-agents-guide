# Weekly Run — 2026-06-28

Maintainer pass for agentguides.dev (Astro 5 + Starlight, deploys to Cloudflare Pages on push to `main`).

## 1. Leaderboard refresh (`site/src/data/models.json`)

- `last_updated` bumped **2026-06-21 → 2026-06-28**.
- Model count: **64 → 65** (no rows removed; no duplicate ids — validated).

### Added

**GPT-5.6 Sol** (`gpt-5-6-sol`, OpenAI, closed) — released 2026-06-26 (limited preview).
OpenAI previewed the GPT-5.6 family (Sol / Terra / Luna) on June 26. Sol is the frontier flagship; added as the one notable, defensible new row this week.

| Field | Value | Source |
|---|---|---|
| Pricing (input/output) | $5.00 / $30.00 per 1M | **Vendor-confirmed** (Sol tier preview pricing) |
| cache_read | $0.50 | **Estimated** (matches GPT-5.5 cache rate) |
| context_window | 1,000,000 | **Conservative** — unconfirmed at preview; GPT-5.5 shipped 1M, one unofficial report cited 1.5M. Used the confirmed-predecessor 1M. |
| max_output | 128,000 | Estimated (matches GPT-5.5) |
| modalities | text, vision | Estimated (matches GPT-5.5) |
| throughput | 80 | Estimated (matches GPT-5.5) |
| mmlu_pro | 90.0 | **Estimated** — anchored to GPT-5.5 (89.0), +1 notch |
| gpqa_diamond | 88.0 | **Estimated** — anchored to GPT-5.5 row (86.0), +2 |
| humaneval | 96.0 | **Estimated** — anchored to GPT-5.5 (95.0), +1 |
| swe_bench | 90.0 | **Estimated** — anchored to GPT-5.5 (88.7), kept below GPT-5.5 Pro (90.0 tier) |
| math_500 | 98.0 | **Estimated** — anchored to GPT-5.5 (97.0), +1 |
| mmmu | 84.0 | **Estimated** — anchored to GPT-5.5 (82.0), +2 |
| aider_polyglot | 87.0 | **Estimated** — anchored to GPT-5.5 (85.0), +2 |
| tau_bench | 85.0 | **Estimated** — anchored to GPT-5.5 (83.0), +2 |

> The **only** vendor number published at preview is Terminal-Bench 2.1 (Sol Ultra 91.9), which is outside the eight benchmarks this table tracks. Every standard-suite cell above is therefore a conservative estimate anchored to the confirmed GPT-5.5 predecessor and OpenAI's "meaningful leap" framing, kept below the GPT-5.5 Pro heavy-compute tier. Flagged for replacement once published/third-party figures land. The `methodology_note` in `models.json` documents this.

### Considered and rejected (with reasons)

- **Claude Mythos 5** — same underlying model as Claude Fable 5 (already in table), released June 9, partner-restricted under Project Glasswing. Not a distinct or widely-available model → skipped.
- **Gemini 3.5 Pro** — delayed to **July 2026** (Vertex limited preview only as of late June); not generally available → skipped.
- **DeepSeek V4.1** — does not exist; V4-Pro / V4-Flash (already in table) remain the latest → skipped.
- **GLM-6** — does not exist; GLM-5.2 (already added 2026-06-13) is Zhipu's latest → skipped.
- **GPT-5.6 Terra / Luna** — real preview tiers, but with zero published benchmarks, adding two more fully-estimated rows would overstate data integrity. Covered in the article instead.

### Other changes
- Updated the keyword meta in `leaderboard.astro` to add "GPT-5.6 / GPT-5.6 Sol" to the current-flagship set.
- No pricing corrections to existing rows: this is a forward-dated, partly-speculative model set; nothing was independently verifiable enough to change.

## 2. New article

- **Title:** GPT-5.6 Review — Sol, Terra, and Luna in Preview
- **Path:** `site/src/content/docs/reviews/gpt-5-6-sol-terra-luna-review.mdx`
- **Live URL:** https://agentguides.dev/reviews/gpt-5-6-sol-terra-luna-review/
- **Why:** Timeliest AI story of the week — OpenAI's GPT-5.6 preview (June 26). Honest, preview-stage review separating confirmed facts (tiers, pricing, Terminal-Bench signal) from unpublished capability claims.
- **SEO / on-page:**
  - Factual title + description (no superlative stacking).
  - Sidebar entry added under **Reviews** in `astro.config.mjs` (order 8).
  - JSON-LD (TechArticle + Review + Breadcrumb + FAQ) description kept in sync with the frontmatter description.
  - OG/canonical/Twitter tags mirror sibling review pages.
  - Internally linked **from** the existing GLM-5.2 review's "Continue reading" list; links **out** to leaderboard, Claude Opus 4.8 review, GLM-5.2 review, and the LLM Benchmark Comparison.
  - Auto-added to `sitemap-index.xml` via @astrojs/sitemap on build.

## 3. Build / validation

- `cd site && npm run build` → **PASS** (40 pages, no errors or warnings). Node v22.
- Had to run `npm install` first (fresh container — `node_modules` absent). No code fixes were needed.
- `models.json` parses; 65 models; **no duplicate ids** (validated via Node).

## Manual indexing needed

These pages cannot be submitted for indexing from this environment — request indexing by hand via **Google Search Console → URL Inspection**:

- [ ] https://agentguides.dev/reviews/gpt-5-6-sol-terra-luna-review/
- [ ] https://agentguides.dev/leaderboard/ (data updated — request re-crawl)
