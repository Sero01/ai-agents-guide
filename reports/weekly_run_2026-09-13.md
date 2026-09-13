# Weekly Run — 2026-09-13

Maintainer run for agentguides.dev. Covers the models leaderboard refresh, one new article, build verification, and manual-indexing follow-ups.

## 1. Leaderboard delta

`site/src/data/models.json` — `last_updated` bumped `2026-09-06` → `2026-09-13`. Model count 82 → **83**, no duplicate ids, JSON parses, prebuild validator (`scripts/validate-models.mjs`) reports **errors: 0** (18 warnings, down from 19 — all pre-existing low-sourced-cell notes; superseding V4 Flash dropped one ranked-row warning, and the new row carries 3 scored vendor cells so it does not add a floor warning).

One genuinely new model shipped this window and was added. Two others surfaced in the trackers (Fugu Ultra v2.0, Gemini 3.8 Flash) and are documented under "Considered and not added" below. Release window checked: models dated **after 2026-09-06**. Gemini 3.8 Flash / Muse Spark 1.3 (both Sep 2) and GPT-6 Astra / Claude Fable 5.1 (added last run) predate the window.

### Added: DeepSeek V4.1 Flash (`deepseek-v4-1-flash`)

DeepSeek, released **2026-09-10**. Open-weight sparse mixture-of-experts model on DeepSeek's Causal Encoder-Decoder (CED) architecture — ~8B active on input / 16B on output from a 552B-parameter backbone. Inserted directly after `deepseek-v4-flash` (peer placement among the cheap open-weight tier, not near the frontier flagships).

| Field | Value | Provenance |
|---|---|---|
| Context window | 1,048,576 | **Vendor** (DeepSeek launch / aggregator-confirmed) |
| Max output | 384,000 | **Vendor** |
| Modalities | text | **Vendor** (text-only, consistent with the V4 Flash line) |
| License | open | **Vendor** |
| Pricing | $0.15 in / $0.60 out / $0.003 cache-hit input per 1M (off-peak) | **Vendor** — off-peak first-party rate, matching the sibling V4 Flash convention ($0.14/$0.55). Peak ~$0.30/$1.20 noted in the article, not the cell. |
| Throughput | 190 tok/s | **Estimated** — no vendor tok/s published; anchored to V4 Flash's 130 and raised for the 8–16B active-parameter MoE. |

Benchmark cells:

| Cell | Value | Source |
|---|---|---|
| `gpqa_diamond` | 90.9 | **Vendor** — DeepSeek launch; essentially flat vs the V4 Flash 0731 checkpoint (~91). |
| `terminal_bench_2_1` | 90.6 | **Vendor** — DeepSeek launch; up from the 0731 checkpoint's 82.7. |
| `hle` | 63.9 | **Vendor** — DeepSeek launch, with tools enabled; up from the 0731 checkpoint's ~37. |
| `swe_bench_verified` | 72.0 | **Estimate** — anchored to DeepSeek's vendor DeepSWE v1.1 of 74.2, held a couple of points below; no first-party Verified cell. |
| `swe_bench_pro` | 58.0 | **Estimate** — anchored to V4 Pro's vendor 55.4, nudged for V4.1's agentic gains, held below the coding leaders (Fable 5.1 81.2, Opus 5 79.2); no first-party Pro cell. |
| `mmlu_pro` | 84.0 | **Estimate** — between V4 Flash's 78 and V4 Pro's vendor 87.5. Legacy column, never scored. |
| `humaneval` | 92.0 | **Estimate** — anchored to V4 Pro's 93.5; saturated. Legacy column, never scored. |
| `math_500` | 95.0 | **Estimate** — between V4 Pro's 96.0 and V4 Flash's 91.0. Retired legacy column. |
| `aider_polyglot` | 71.0 | **Estimate** — between V4 Flash's 65 and V4 Pro's 78. Unmaintained legacy column. |
| `tau_bench` | 66.0 | **Estimate** — between V4 Flash's 58 and V4 Pro's 70. Retired legacy column. |

Scored cells: the three vendor cells (`gpqa_diamond`, `terminal_bench_2_1`, `hle`) are all live/scoreable, meeting the `min_scored_cells: 3` floor, so the row ranks with no floor warning. All estimate cells carry `source: "estimate"` and never contribute to the composite.

Vendor numbers reported at launch that do not map to a tracked column, recorded here rather than a cell: DeepSWE v1.1 74.2, Codeforces rating 3,471, CyberGym 88.1, NL2Repo-Bench 65.4.

### Status changes (no rows removed)
- `deepseek-v4-flash` `current` → **`superseded`** (DeepSeek V4.1 Flash is its direct generational successor — new MoE base, not a checkpoint re-training). Row retained for reference per the demote-don't-delete convention.

`leaderboard.astro` keyword meta updated to add "DeepSeek V4.1 Flash" ahead of the existing DeepSeek entries. The current-flagship set did not change (GPT-6 Astra / Claude Fable 5.1 remain the frontier flagships), so the flagship-specific copy was left as-is.

### Considered and not added
- **Fugu Ultra v2.0 (Sakana AI, 2026-09-11)** — a "multi-agent system delivered as one model": it dynamically routes each request across a proprietary pool of open-weight/specialist models behind one endpoint rather than being a single trained network. Its published results are on non-standard suites (Chartography, GDP.pdf, DeepSWE, Toolathon, SWEFish) that do not map to any tracked column, so populating the standard benchmark cells would require near-total estimation — inconsistent with the data-integrity bar. Strong candidate for a future *article* (it is squarely on-theme for an agents site), but not a clean leaderboard row this week.
- **Gemini 3.8 Flash / Gemini 3.8 Flash Cyber (Google, 2026-09-02)** and **Muse Spark 1.3 (Meta, 2026-09-02)** — both shipped before this run's `last_updated` (2026-09-06) and were already in last week's "considered" list. Mid-tier Flash refreshes; deferred again to keep the addition focused on the one clearly-new, cleanly-sourced model (quality over volume).
- **DeepSeek V4.1 Flash peak pricing** — recorded off-peak ($0.15/$0.60) in the cell to match the sibling V4 Flash convention; peak (~$0.30/$1.20) is noted in the article body only.

## 2. Article published

- **Title:** DeepSeek V4.1 Flash Review — Frontier Agentic Scores at Flash Pricing
- **File:** `site/src/content/docs/reviews/deepseek-v4-1-flash-review.mdx`
- **Live URL:** https://agentguides.dev/reviews/deepseek-v4-1-flash-review/
- **Type/dir:** model review → `reviews/` (matched `deepseek-v4-flash-0731-review.mdx` structure: byline, provenance aside, TL;DR table, what-changed/architecture, what-the-numbers-say provenance table, pricing, comparison, who-should-care, FAQ, continue-reading).
- **Frontmatter:** factual `title`/`description`, no superlative stacking. OG/canonical/Twitter tags mirror sibling reviews (confirmed canonical `https://agentguides.dev/reviews/deepseek-v4-1-flash-review/` in the built HTML). JSON-LD (`TechArticle` + `Review` + `BreadcrumbList` + `FAQPage`) description kept in sync with the frontmatter description.
- **Sidebar:** added to the Reviews group in `astro.config.mjs` (newest entry, after GPT-6 Astra, `order: 20`).
- **Internal linking:** the new page links out to the leaderboard (×3), the DeepSeek V4 Flash 0731 review, DeepSeek V4 Pro, Claude Opus 5, GPT-6 Astra, Claude Fable 5, GLM-5.3 Flash, Kimi K2.7-Code, multi-agent pipelines, and the benchmark comparison; and it is linked **in** from the existing `deepseek-v4-flash-0731-review.mdx` "Continue reading" list (top entry). Auto-added to the sitemap via `@astrojs/sitemap` (confirmed present in `dist/sitemap-0.xml`).

## 3. Build result

`cd site && npm run build` (Node v22.22.2) — **PASS**. Ran `npm install` first (node_modules absent in the fresh checkout). Prebuild model validator PASS (errors: 0, 18 warnings). **51 pages built, no errors** (was 50). New page confirmed at `dist/reviews/deepseek-v4-1-flash-review/index.html`; leaderboard rebuilt with the DeepSeek V4.1 Flash row (3 occurrences of the name in `dist/leaderboard/index.html`). No fixes required beyond the dependency install.

Data integrity: `models.json` parses, 83 models, no duplicate ids (asserted in the edit script and re-checked post-write).

## Manual indexing needed

These pages cannot be submitted to Google Search Console from this environment (no API, no remote agent). Submit each by hand via **GSC → URL Inspection → Request Indexing**:

- [ ] https://agentguides.dev/reviews/deepseek-v4-1-flash-review/ — new article (DeepSeek V4.1 Flash review)
- [ ] https://agentguides.dev/leaderboard/ — updated (new DeepSeek V4.1 Flash row, V4 Flash marked superseded, `last_updated` 2026-09-13); request re-crawl
