# Weekly Run — 2026-09-06

Maintainer run for agentguides.dev. Covers the models leaderboard refresh, one new article, build verification, and manual-indexing follow-ups.

## 1. Leaderboard delta

`site/src/data/models.json` — `last_updated` bumped `2026-08-30` → `2026-09-06`. Model count 80 → **82**, no duplicate ids, JSON parses, prebuild validator (`scripts/validate-models.mjs`) reports **errors: 0** (19 warnings, all the pre-existing low-sourced-cell notes; the two new rows add one net warning each is expected since vendors led with off-suite evals).

Two frontier flagships shipped this window and were added. Both were inserted near the top of the array, directly after Claude Opus 5 (peer placement), so display order via the default SWE-bench Pro sort is unaffected.

### Added: GPT-6 Astra (`gpt-6-astra`)

OpenAI, released **2026-09-03**. New-generation flagship, successor to GPT-5.6 Sol; agentic / computer-use-first.

| Field | Value | Provenance |
|---|---|---|
| Context window | 1,050,000 (~922K input / 128K output) | **Vendor** (OpenAI launch materials) |
| Max output | 128,000 | **Vendor** |
| Modalities | text, vision | **Vendor** |
| License | closed | **Vendor** |
| Pricing | $10 in / $1 cached in / $50 out per 1M | **Vendor list price** — double GPT-5.6 Sol's $5/$30; now in the Fable tier. |
| Throughput | 75 tok/s | **Estimated** — no vendor tok/s published; flagship-tier estimate near Sol's 80. |

Benchmark cells:

| Cell | Value | Source |
|---|---|---|
| `gpqa_diamond` | 96.0 | **Vendor** — OpenAI launch card (ties frontier). |
| `swe_bench_verified` | 90.0 | **Estimate** — anchored to GPT-5.6 Sol's est 90.0; OpenAI led with DeepSWE v1.1 74.1, not a first-party Verified cell. |
| `swe_bench_pro` | 70.0 | **Estimate** — anchored to Sol's vendor 64.6, held below the confirmed coding leaders (Fable 5.1 81.2, Opus 5 79.2); no first-party Pro cell. |
| `terminal_bench_2_1` | 89.0 | **Estimate** — anchored to Sol's vendor 88.8; Astra is stronger on computer use (OSWorld 2.0 72.6 vendor) but published no TB 2.1 cell. |
| `hle` | 63.0 | **Estimate** — anchored to the frontier tools-enabled range (Opus 5 64.7 with tools); no HLE cell published. |

Vendor numbers reported at launch that do not map to a tracked column, recorded in the article rather than a cell: FrontierMath Tier 4 v2 97.6, ARC-AGI-3 99.9, DeepSWE v1.1 74.1, OSWorld 2.0 72.6, ExploitBench 100. Astra is OpenAI's first model at the "Critical" cybersecurity capability level.

### Added: Claude Fable 5.1 (`claude-fable-5-1`)

Anthropic, released **2026-09-01** (GA, alongside restricted-access Mythos 5.1).

| Field | Value | Provenance |
|---|---|---|
| Context window | 1,000,000 · 128K max output | **Vendor** |
| Modalities | text, vision | **Vendor** |
| License | closed | **Vendor** |
| Pricing | $10 in / $50 out / $0.25 cached read (cache reads cut 75% vs Fable 5's $1.00) / $12.50 cache write | **Vendor** (input/output/cached-read confirmed; cache_write carried from Fable 5). |
| Throughput | 72 tok/s | **Estimated** — carried from Fable 5; no separate 5.1 tok/s published. |

Benchmark cells:

| Cell | Value | Source |
|---|---|---|
| `swe_bench_pro` | 81.2 | **Vendor** — Fable 5.1 system card; up from Fable 5's 80.3 and the **highest sourced SWE-bench Pro figure on the table**. |
| `gpqa_diamond` | 95.0 | **Estimate** — carried from Fable 5; no standalone 5.1 GPQA cell. |
| `swe_bench_verified` | 91.0 | **Estimate** — carried from Fable 5; 5.1 card led with Pro / Multilingual / Multimodal, not a first-party Verified cell. |
| `terminal_bench_2_1` | 88.5 | **Estimate** — anchored to Fable 5's vendor 88.0. Anthropic's headline agentic gain was on Terminal-Bench-Science 0.1 (24.7 → 52.6), a harder variant that does not map to this column. |
| `hle` | 59.0 | **Estimate** — carried from Fable 5's vendor 59.0 (without tools); no standalone 5.1 HLE cell. |

### Status changes (no rows removed)
- `gpt-5-6-sol` `current` → **`superseded`** (GPT-6 Astra is its direct successor).
- `claude-fable-5` `current` → **`superseded`** (Fable 5.1 supersedes it).
- GPT-5.6 Terra and Luna left `current` — cheaper tiers not superseded by a flagship.

`leaderboard.astro` keyword meta updated to add "GPT-6 Astra" and "Claude Fable 5.1".

### Considered and not added
- **Gemini 3.8 Flash / Gemini 3.8 Flash Cyber (Google), Muse Spark 1.3 (Meta), Qwen3.8-Max-0902 / Qwen3.8-Flash-Next (Alibaba), Claude Mythos 5.1 (Anthropic)** — all surfaced in this week's release trackers. Incremental Flash/mid-tier refreshes or restricted-access variants; held for a future run to keep this week's additions to the two clearly frontier flagships with clean vendor sourcing (quality over volume). Mythos 5.1 is a restricted-access sibling of Fable 5.1 with no public first-party API, consistent with prior handling of Mythos-class rows.

## 2. Article published

- **Title:** GPT-6 Astra Review — OpenAI's Agentic Flagship at $10/$50
- **File:** `site/src/content/docs/reviews/gpt-6-astra-review.mdx`
- **Live URL:** https://agentguides.dev/reviews/gpt-6-astra-review/
- **Type/dir:** model review → `reviews/` (matched `gpt-5-6-sol-terra-luna-review.mdx` structure: byline, provenance aside, TL;DR table, what-it-is, launch-card table, pricing table, comparison, who-should-care, FAQ, continue-reading).
- **Frontmatter:** factual `title`/`description`, no superlative stacking. OG/canonical/Twitter tags mirror sibling reviews. JSON-LD (`TechArticle` + `Review` + `BreadcrumbList` + `FAQPage`) description kept in sync with the frontmatter description.
- **Sidebar:** added to the Reviews group in `astro.config.mjs` (newest entry, `order: 19`).
- **Internal linking:** the new page links out to the leaderboard, GPT-5.6 Sol/Terra/Luna, Claude Opus 5, Claude Fable 5, Kimi K3, GLM-5.3 Flash, multi-agent pipelines, and the benchmark comparison; and it is linked **in** from the existing `gpt-5-6-sol-terra-luna-review.mdx` "Continue reading" list. Auto-added to the sitemap via `@astrojs/sitemap` (confirmed present in `dist/sitemap-0.xml`).

## 3. Build result

`cd site && npm run build` (Node v22.22.2) — **PASS**. Ran `npm install` first (node_modules absent in the fresh checkout). Prebuild model validator PASS (errors: 0). **50 pages built, no errors** (was 49). New page confirmed at `dist/reviews/gpt-6-astra-review/index.html`; leaderboard rebuilt with the GPT-6 Astra and Claude Fable 5.1 rows. No fixes required beyond the dependency install.

## Manual indexing needed

These pages cannot be submitted to Google Search Console from this environment (no API, no remote agent). Submit each by hand via **GSC → URL Inspection → Request Indexing**:

- [ ] https://agentguides.dev/reviews/gpt-6-astra-review/ — new article (GPT-6 Astra review)
- [ ] https://agentguides.dev/leaderboard/ — updated (new GPT-6 Astra + Claude Fable 5.1 rows, Sol/Fable 5 marked superseded, `last_updated` 2026-09-06); request re-crawl
