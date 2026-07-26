# Weekly Maintainer Run — 2026-07-26

Automated content + data maintenance pass for [agentguides.dev](https://agentguides.dev).

## 1. Leaderboard refresh (`site/src/data/models.json`)

- `last_updated` bumped `2026-07-22` → `2026-07-26`.
- Model count: 73 → **74** (1 added, 0 removed). JSON parses cleanly; no duplicate ids; validator (`scripts/validate-models.mjs`) passes with 0 errors.
- Status change: **Claude Opus 4.8** moved `current` → `superseded` (Opus 5 replaces it at the identical $5/$25 price point and beats it across the board). No models removed.

### Models added

**Claude Opus 5** (`claude-opus-5`, Anthropic, closed, released 2026-07-24)
- Inserted as the **top row** — it takes the #1 spot on the Artificial Analysis Intelligence Index (61), ahead of Claude Fable 5 (60) and GPT-5.6 Sol (59). 1M-token context, 128k max output, text+vision, $5 in / $25 out (same as Opus 4.8).
- **Vendor-sourced (Anthropic, scored):**
  - `swe_bench_verified` **96.0** — Anthropic-reported at launch.
  - `swe_bench_pro` **79.2** — Anthropic-reported; up ~10 pts from Opus 4.8's 69.2.
  - `hle` **64.7** (with tools) — Anthropic Opus 5 system card; 56.3 without tools recorded in the cell note.
  - Pricing ($5/$25, $6.25 cache write / $0.50 cache read), context window (1M), max output (128k), and release date are vendor-confirmed.
- **Conservatively estimated (not scored, excluded from ranking):**
  - `terminal_bench_2_1` **89.0** — anchored to Fable 5's vendor-published 88.0 and consistent with an independent Adaptive-Reasoning/max-effort measurement of ~89.1. Anthropic did not publish a first-party Terminal-Bench 2.1 cell, and the independent source is not redistributable, so this is flagged `estimate`.
  - `gpqa_diamond` **95.0** — anchored to Fable 5 (95.0) and Opus 4.8 (93.6); no standalone vendor cell.
  - Legacy columns anchored to Fable 5: `mmlu_pro` 90.0, `humaneval` 96.0, `math_500` 98.0, `mmmu` 84.0, `aider_polyglot` 88.0, `tau_bench` 86.0. All are retired/legacy columns, marked `estimate`, never scored.
  - `throughput` 82 tok/s is an in-family estimate (consistent with the table's methodology; Artificial Analysis measured ~52.8 tok/s at max effort, a heavier-reasoning metric not comparable to the table's values).

> Note on a blocked source: the Terminal-Bench 2.1 (89.1) and HLE-without-tools (56.3) figures are published by Artificial Analysis, whose registry entry is `redistributable: false`. The validator (correctly) blocked them from public display. HLE was re-sourced to the vendor with-tools figure (64.7, scored); Terminal-Bench was demoted to a conservative `estimate` anchored to a redistributable vendor number.

### Other leaderboard edits
- `leaderboard.astro` keyword meta updated to add **Claude Opus 5** as the new top flagship.
- No pricing corrections needed on existing rows this week.

## 2. New article

- **Title:** Claude Opus 5 Review — Benchmarks, Pricing, and What Changed From Opus 4.8
- **Path:** `site/src/content/docs/reviews/claude-opus-5-review.mdx`
- **Live URL:** https://agentguides.dev/reviews/claude-opus-5-review/
- **Type:** Model review (`reviews/`), mirroring the structure/length/tone of the existing Claude Opus 4.8 and Fable 5 reviews (disclaimer aside, TL;DR table, benchmark table with per-cell sourcing, pricing, who-should-upgrade, how-to-switch code sample, FAQ, continue-reading). Frontmatter `title`/`description` are factual (no superlative stacking); the JSON-LD `TechArticle`/`Review` descriptions are kept in sync with the frontmatter; OG/canonical/Twitter tags mirror sibling review pages.
- **SEO/linking:** sidebar entry added under **Reviews** in `astro.config.mjs` (order 12); the page is internally linked from the existing **Claude Opus 4.8 review** and **Claude Fable 5 review** "Continue reading" lists; the article itself links out to the leaderboard, Opus 4.8, Fable 5, Sonnet 5, GPT-5.6, and the benchmark-comparison pages. Auto-added to the sitemap via `@astrojs/sitemap` on build.

## 3. Build & validation

- `cd site && npm install && npm run build` (Node 22) → **PASS.** 44 pages built (was 43), no errors.
- Fixed one issue: the first build **failed** because two Opus 5 cells cited `artificial_analysis` (a `redistributable: false` source). Re-sourced HLE to the vendor with-tools figure and demoted Terminal-Bench to a conservative `estimate`; rebuild was clean.
- `models.json`: validated — parses, 74 models, no duplicate ids, Opus 5 carries 3 scored/redistributable cells (`swe_bench_verified`, `swe_bench_pro`, `hle`), meeting the `min_scored_cells: 3` policy.
- Confirmed in `dist/`: `reviews/claude-opus-5-review/index.html` exists and renders "Claude Opus 5"; leaderboard renders "74 AI models" and includes the Opus 5 row.

## Manual indexing needed

These pages are new this run and must be submitted by hand via Google Search Console → URL Inspection → Request Indexing (no API/remote agent can request indexing):

- [ ] https://agentguides.dev/reviews/claude-opus-5-review/

The models leaderboard (https://agentguides.dev/leaderboard/) changed content but is an existing URL; a re-inspection/re-index request there is optional but worthwhile since a new #1 frontier row was added and Opus 4.8 was demoted.
