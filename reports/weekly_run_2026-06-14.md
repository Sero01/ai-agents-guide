# Weekly Content + Data Run — 2026-06-14

Maintainer run for [agentguides.dev](https://agentguides.dev). Previous leaderboard `last_updated`: 2026-06-10. This run covers the window **2026-06-10 → 2026-06-14**.

## 1. Leaderboard refresh (`site/src/data/models.json`)

- Bumped `last_updated` from `2026-06-10` → `2026-06-14`.
- Model count: 62 → **63** (added 1; removed none).
- Updated the `keywords` meta in `leaderboard.astro` to add "Kimi K2.7, open weights coding model".
- Refreshed the `methodology_note` to document the K2.7-Code estimation basis.

The only notable in-window release was Moonshot AI's **Kimi K2.7-Code**, which appeared on Hugging Face on **June 12, 2026**. It is a coding-specialized open-weights model. Nothing else frontier/widely-used landed between June 10 and June 14 (NVIDIA Nemotron 3 Ultra was June 4 — before the window; Microsoft MAI and others were already added last run). No still-in-use models were removed.

### Added: `kimi-k2-7-code` — Kimi K2.7-Code (Moonshot AI, open, 2026-06-12)

A 1T-parameter sparse MoE (~32B active, 384 experts), 256K context, **Modified MIT** license, aimed at long-horizon agentic software engineering.

**Data-integrity note:** Moonshot shipped K2.7-Code with **only its own proprietary benchmarks** (Kimi Code Bench v2, Program Bench, MLS Bench Lite) — no SWE-bench Verified, Aider, GPQA, or MMLU-Pro public numbers at launch. So **every standard-benchmark cell in this row is a conservative estimate**, anchored to the published **Kimi K2.6 predecessor** (SWE-bench Verified **80.2**, MMLU-Pro **87.1**, released 2026-04-20) and to peer open coders (DeepSeek V4 Pro, GLM-5). This is flagged in the row's methodology note and in the article.

| Field | Value | Source |
|---|---|---|
| context_window / max_output | 262144 / 16000 | **Vendor-sourced** context (256K / 262,144); max_output **estimated** |
| license | open (Modified MIT) | **Vendor-sourced** |
| modalities | text | **Vendor-sourced** (coding-specialized "Code" variant; multimodal handled by K2.6) |
| pricing input / output / cache_read | $0.95 / $4.00 / $0.19 per 1M | **Vendor-sourced** (official Moonshot/Kimi API rates: cache-miss input $0.95, cached input $0.19, output $4.00) |
| swe_bench (Verified) | 82.0 | **Estimated** — anchored to K2.6's confirmed 80.2; nudged up for a coding-focused refresh, held below closed frontier leaders |
| humaneval | 92.0 | **Estimated** — coding specialist, saturated band; above the original Kimi K2 (88.0) |
| aider_polyglot | 72.0 | **Estimated** — open coder anchor (DeepSeek V4 Pro 78.0, GLM-5 60.0); above original Kimi K2 (60.0) |
| math_500 | 92.0 | **Estimated** — Kimi-line anchor (~89–90), modest bump |
| mmlu_pro | 84.0 | **Estimated** — K2.6 anchor 87.1, marked down because a "Code" variant typically trades breadth for coding depth |
| gpqa_diamond | 78.0 | **Estimated** — conservative; K2.6 reported high GPQA but this is a coding variant, kept in line with DeepSeek V4 Pro (78.0) |
| tau_bench | 62.0 | **Estimated** — agentic-coding use; above original Kimi K2 (55.0) |
| mmmu | null | Text/code release (no multimodal score — correctly null) |
| throughput | 80 tok/s | **Estimated** — 32B-active MoE serving profile |

### Considered but NOT added

- **NVIDIA Nemotron 3 Ultra 550B (2026-06-04):** out of window (before the prior `last_updated`).
- **Kimi K2.6 (2026-04-20):** the real predecessor with strong public numbers, but out of window — not added this run; used only as the estimation anchor for K2.7-Code. (Candidate for a future backfill if the Kimi line warrants two rows.)

## 2. New article

- **Title:** Kimi K2.7-Code Review — Moonshot's Open-Weight Coding Model
- **Path:** `site/src/content/docs/reviews/kimi-k2-7-code-review.mdx`
- **Live URL:** https://agentguides.dev/reviews/kimi-k2-7-code-review/
- **Dir rationale:** model review → `reviews/`. Structure, frontmatter, head meta, and JSON-LD (TechArticle + Review + BreadcrumbList + FAQPage) modeled on the sibling `microsoft-mai-thinking-1-mai-code-1-flash-review.mdx`; frontmatter `description` and JSON-LD `description` kept in sync; OG/canonical/Twitter tags match siblings.
- **Factual title/description** — no superlative stacking. The article is explicit that all cross-vendor numbers are estimates until third-party benchmarks land.
- **SEO / on-page:**
  - Sidebar entry added under **Reviews** in `astro.config.mjs`.
  - Internal links **into** the new page from: `reviews/index.md` (list + ItemList schema bumped 5 → 6) and `reviews/microsoft-mai-thinking-1-mai-code-1-flash-review.mdx` ("Continue reading").
  - New page links **out** to leaderboard, MAI review, Claude Code vs Cursor vs Codex, LLM Benchmark Comparison 2026, and multi-agent pipelines.
  - Confirmed in build sitemap (`dist/sitemap-0.xml`) via @astrojs/sitemap.

## 3. Build / verification

- `cd site && npm run build` with **Node v22.22.2** (deps already present in checkout).
- **Result: PASS** — 38 pages built, no errors. New review page (`dist/reviews/kimi-k2-7-code-review/index.html`) and `/leaderboard/` both emitted; "Kimi K2.7-Code" present in the leaderboard payload; Pagefind index rebuilt (35 indexed pages).
- `models.json` validated via Node: parses, **63 models, no duplicate ids**; the K2.7-Code row exposes 7 numeric benchmarks (mmmu null).
- Nothing needed fixing.

## Manual indexing needed

These pages must be submitted by hand via **Google Search Console → URL Inspection → Request Indexing** (no API/remote agent can do this):

- [ ] https://agentguides.dev/reviews/kimi-k2-7-code-review/ — new page.
- [ ] https://agentguides.dev/leaderboard/ — content updated (1 new model, new `last_updated`); request re-crawl so the refreshed Dataset/FAQ structured data is re-indexed.
- [ ] https://agentguides.dev/reviews/ — index updated (new review listed; ItemList schema bumped to 6); optional re-crawl.
