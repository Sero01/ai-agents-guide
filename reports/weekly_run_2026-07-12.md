# Weekly Run — 2026-07-12

Maintainer pass for agentguides.dev (Astro 5 + Starlight, deploys to Cloudflare Pages on push to `main`).

## 1. Leaderboard refresh (`site/src/data/models.json`)

- `last_updated` bumped **2026-07-05 → 2026-07-12**.
- Model count: **66 → 69** (no rows removed; no duplicate ids — validated by script; all rows carry the full 8-benchmark set).

### Added

**Grok 4.5** (`grok-4-5`, xAI, closed) — released **2026-07-08**. Inserted directly above the Grok 4.3 row as the new xAI flagship. Positioned as intelligence-per-dollar with a focus on agentic tool use.

| Field | Value | Source |
|---|---|---|
| Pricing (input / cached / output) | $2.00 / $0.50 / $6.00 per 1M (≤200K-token prompts) | **Vendor-confirmed.** A higher tier applies to prompts >200K ($4 / $1 / $12). The ≤200K standard tier is recorded as the durable rate. |
| context_window | 500,000 | **Vendor-confirmed** |
| max_output | 32,000 | **Estimated** (matches Grok 4.3 line) |
| modalities | text, vision | **Vendor-confirmed** (multimodal) |
| throughput | 130 | **Estimated** (matches Grok 4.3) |
| mmlu_pro | 88.0 | **Estimated** — anchored to Grok 4.3 (87.0), nudged up one notch |
| gpqa_diamond | 91.0 | **Estimated** — anchored to Grok 4.3 (90.0) |
| humaneval | 93.0 | **Estimated** — anchored to Grok 4.3 (92.0) |
| swe_bench | 78.0 | **Estimated** — no SWE-bench *Verified* published; anchored to Grok 4.3 (73.0) and lifted for confirmed agentic-coding strength (published SWE-bench *Pro* 64.7) |
| math_500 | 97.0 | **Estimated** — flat vs Grok 4.3 (97.0) |
| mmmu | 79.0 | **Estimated** — anchored to Grok 4.3 (78.0) |
| aider_polyglot | 82.0 | **Estimated** — anchored to Grok 4.3 (78.0), lifted on agentic-coding axis |
| tau_bench | 80.0 | **Estimated** — anchored to Grok 4.3 (74.0), lifted for #1 agentic-tool-use finish |

> **Vendor/aggregator-sourced (outside this table's tracked columns, used only as anchors):** SWE-bench Pro 64.7, Terminal-Bench 2.1 83.3, Artificial Analysis Intelligence Index 54 (#4 overall, #1 agentic tool use). Also vendor-confirmed: pricing, context window, modalities. **Estimated cells:** all 8 tracked benchmarks + max_output + throughput. xAI published no standard public-suite numbers, so every tracked cell is a conservative estimate anchored to Grok 4.3.

**GPT-5.6 Terra** (`gpt-5-6-terra`, OpenAI, closed) — released **2026-07-09** (GA). Balanced middle tier of the GPT-5.6 family. Inserted directly after the existing GPT-5.6 Sol row.

| Field | Value | Source |
|---|---|---|
| Pricing (input / output / cached) | $2.50 / $15.00 / $0.25 per 1M | **Vendor-confirmed** (cache tier estimated) |
| context_window / max_output | 1,000,000 / 128,000 | **Vendor-confirmed** context; max_output matches family |
| modalities | text, vision | **Vendor-confirmed** |
| throughput | 110 | **Estimated** (faster/cheaper than Sol = 80) |
| All 8 benchmarks | mmlu_pro 89.5, gpqa 87.0, humaneval 95.5, swe_bench 89.0, math_500 97.5, mmmu 83.0, aider 86.0, tau_bench 84.0 | **Estimated** — positioned between GPT-5.5 and GPT-5.6 Sol, just below Sol, consistent with published Terminal-Bench 2.1 87.4 / SWE-bench Pro 63.4 (both just under Sol) |

**GPT-5.6 Luna** (`gpt-5-6-luna`, OpenAI, closed) — released **2026-07-09** (GA). Fast/cheap tier of the GPT-5.6 family. Inserted after the Terra row.

| Field | Value | Source |
|---|---|---|
| Pricing (input / output / cached) | $1.00 / $6.00 / $0.10 per 1M | **Vendor-confirmed** (cache tier estimated) |
| context_window / max_output | 1,000,000 / 128,000 | **Vendor-confirmed** context (~1.05M reported; recorded as 1M for table consistency) |
| modalities | text, vision | **Vendor-confirmed** |
| throughput | 135 | **Estimated** (fastest tier) |
| All 8 benchmarks | mmlu_pro 88.0, gpqa 85.0, humaneval 94.0, swe_bench 87.0, math_500 96.5, mmmu 81.0, aider 84.0, tau_bench 82.0 | **Estimated** — a notch below Terra, consistent with published Terminal-Bench 2.1 84.7 / SWE-bench Pro 62.7 |

> The full ordering Sol > Terra > Luna in the estimated cells mirrors OpenAI's published Terminal-Bench 2.1 (88.8 / 87.4 / 84.7) and SWE-bench Pro (64.6 / 63.4 / 62.7) — both outside this table's tracked set but used to rank the estimates. No standard public-suite figures were published for any GPT-5.6 tier.

### Considered and rejected (with reasons)

- **Gemini 3.5 Pro** — GA slipped again; as of July 7 the public Gemini API still lists `gemini-3.5-flash` and `gemini-3.1-pro-preview`, not a GA `gemini-3.5-pro` id, and Google has published **no official model card, pricing, or benchmarks** (all figures circulating are reporting, and reports flagged reasoning/coding/token-efficiency struggles). Adding a fully-estimated frontier row would overstate data integrity → skipped again (as in the 2026-06-28 and 2026-07-05 runs). Revisit at GA.
- **Meta "Muse Spark 1.1"** — surfaced on release trackers (July 9) but with no verifiable vendor benchmark card or pricing → skipped as unconfirmed.
- **GPT-5.6 Sol** — already in the table from the preview run; GA (July 9) confirmed its pricing/context, and its published GA numbers (Terminal-Bench 88.8, SWE-bench Pro 64.6) are outside this table's tracked columns, so no tracked cell changed. Left as-is.

### Other changes
- Updated the keyword meta in `leaderboard.astro`: added **Grok 4.5, GPT-5.6 Terra, GPT-5.6 Luna**; the stale **Grok 4.3** flagship keyword was kept alongside the new one.
- Extended the `methodology_note` to document the sourcing for all three new rows (vendor-confirmed pricing/context vs estimated benchmark cells, with the agentic anchors named).
- No pricing corrections to existing rows were independently verifiable enough to change this week.

## 2. New article

- **Title:** Grok 4.5 Review — Benchmarks, Pricing, and the Agentic Angle
- **Path:** `site/src/content/docs/reviews/grok-4-5-review.mdx`
- **Live URL:** https://agentguides.dev/reviews/grok-4-5-review/
- **Why:** The timeliest AI story of the week — xAI's July 8 Grok 4.5 release, which led with agentic tool-use and coding benchmarks rather than academic leaderboards. It had no existing page (unlike GPT-5.6, which already has a review that this run updated). The review works from the model's *published* agentic numbers (SWE-bench Pro 64.7, Terminal-Bench 2.1 83.3, AA Intelligence Index 54 / #4) and is explicit about which leaderboard cells are estimated vs measured.
- **SEO / on-page:**
  - Factual title + description (no superlative stacking).
  - Sidebar entry added under **Reviews** in `astro.config.mjs` (order 10), after the Claude Sonnet 5 review.
  - JSON-LD (TechArticle + Review + Breadcrumb + FAQ) description kept in sync with the frontmatter description.
  - OG/canonical/Twitter tags mirror sibling review pages (`/og/reviews.png`, canonical to self).
  - Internally linked **from** the GPT-5.6 review's "Continue reading" list; links **out** to leaderboard, GPT-5.6 review, GLM-5.2 review, Claude Opus 4.8 review, Kimi K2.7-Code review, LLM Benchmark Comparison, and Multi-Agent Pipelines.
  - Auto-added to `sitemap-0.xml` via @astrojs/sitemap on build (verified present).

## 3. Build / validation

- `npm install` (deps were not present in the fresh checkout) → OK. Node v22.22.2 (≥20 required).
- `cd site && npm run build` → **PASS**. 42 pages built (was 41), no errors. New page `/reviews/grok-4-5-review/index.html` built; Pagefind index and sitemap regenerated.
- `models.json`: parses cleanly, **69 models, zero duplicate ids** (validated by script). All rows carry the full 8-benchmark set.
- Verified "Grok 4.5", "GPT-5.6 Terra", and "GPT-5.6 Luna" render on the built leaderboard page (shows "69 AI models") and the new review URL is present in the sitemap.
- Nothing needed fixing beyond the initial dependency install.

## Manual indexing needed

These pages are new this run and must be submitted by hand via **Google Search Console → URL Inspection → Request Indexing** (no API or remote agent can request indexing):

- [ ] https://agentguides.dev/reviews/grok-4-5-review/

(The models leaderboard at https://agentguides.dev/leaderboard/ was updated, not newly created — it is already indexed and will be recrawled; no manual submission required, though a re-inspection can speed up the refresh. The GPT-5.6 review at https://agentguides.dev/reviews/gpt-5-6-sol-terra-luna-review/ gained an internal link but is also already indexed.)
