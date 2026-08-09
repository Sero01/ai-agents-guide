# Weekly Content + Data Run — 2026-08-09

Maintainer run for [agentguides.dev](https://agentguides.dev). Previous `last_updated` on the leaderboard was **2026-08-02**; this run covers the 2026-08-02 → 2026-08-09 window.

## 1. Leaderboard delta (`site/src/data/models.json`)

`last_updated` bumped **2026-08-02 → 2026-08-09**. One model added; no models removed. Total models **75 → 76**.

### Added: Meta Muse Spark 1.2 (`muse-spark-1-2`)

Meta Superintelligence Labs shipped **Muse Spark 1.2** (coding-focused reasoning model) alongside the **Muse Code** terminal agent on **2026-08-05**. It is Meta's first fully closed-weight model in this line. Inserted into the Meta vendor block, status `current`.

Field-by-field provenance:

| Field | Value | Source |
|---|---|---|
| license | closed | **Vendor-sourced** (Meta launch coverage; no downloadable weights / self-hosting / fine-tuning) |
| released | 2026-08-05 | **Vendor-sourced** |
| context_window | 1,048,576 | **Vendor-sourced** (published spec) |
| max_output | 131,072 | **Vendor-sourced** (~131K published) |
| modalities | text, vision, audio (input); text output | **Vendor-sourced** |
| pricing.input | $1.25 / 1M | **Vendor-sourced** (Standard tier) |
| pricing.output | $4.25 / 1M | **Vendor-sourced** (Standard tier) |
| throughput | 165 tok/s | **Vendor/aggregator-sourced** (Artificial Analysis, xhigh setting) |

Benchmark cells:

| Benchmark | Value | Source classification |
|---|---|---|
| terminal_bench_2_1 | 82.9 | **Vendor-sourced** (Meta-reported at launch, running inside Muse Code). Cell note flags it is **not** on the public Terminal-Bench 2.1 verified leaderboard as of 2026-08-07, and that Muse Spark 1.1's independently-verified score is 76.2. |
| gpqa_diamond | 90.4 | **Conservatively estimated** — reported by Artificial Analysis (xhigh), not a first-party Meta model card. Marked `estimate` (not scored) because AA's source is flagged non-redistributable in our schema and Meta published no standalone GPQA cell. |
| swe_bench_verified | 73.0 | **Conservatively estimated** — anchored to Muse Spark 1.1's verified Terminal-Bench (76.2), Meta's DeepSWE v1.1 (59.3) / internal coding eval (70.6), and same-tier peers. Meta published no SWE-bench Verified figure. |
| swe_bench_pro | 55.0 | **Conservatively estimated** — SWE-bench Pro runs ~20 pts below Verified; anchored to same-price peers (Gemini 3.6 Flash 58.7, GPT-5.6 Luna 62.7). No vendor figure published. |

Only `terminal_bench_2_1` is a scored (rankable) cell; the rest are `estimate` and are displayed but excluded from all rankings — consistent with how the schema treats peers like Gemini 3.6 Flash (which also carries fewer than the 3-cell scoring floor). Benchmarks Meta did not run in a comparable form (HLE, MMMU-Pro, τ³-Banking, and the retired legacy columns) were left absent rather than fabricated.

Also updated: the flagship keyword meta in `site/src/pages/leaderboard.astro` now includes "Meta Muse Spark 1.2, Muse Code".

**Note on the window:** no *other* genuinely new, notable frontier or widely-used model was released in the 2026-08-02 → 2026-08-09 window. The GPT-5.6 line, Claude Opus 5 / Fable 5 / Sonnet 5, Grok 4.5, Gemini 3.6 Flash, Kimi K3, DeepSeek V4 Flash 0731 etc. were all already present. Muse Spark 1.2 was the one addition worth making.

## 2. New article

- **Title:** Meta Muse Code and Muse Spark 1.2 Review — Meta's First Closed Coding Agent
- **File:** `site/src/content/docs/reviews/meta-muse-code-muse-spark-1-2-review.mdx`
- **Live URL:** https://agentguides.dev/reviews/meta-muse-code-muse-spark-1-2-review/
- **Type/dir:** model + tool review → `reviews/` (structure, frontmatter, head tags, and JSON-LD `TechArticle` + `Review` + `BreadcrumbList` + `FAQPage` mirror the existing Microsoft MAI review; description is factual, no superlative stacking).
- **SEO/on-page:**
  - Sidebar entry added in `astro.config.mjs` (Reviews group, order 15).
  - Inbound internal links added from `reviews/index.md` (visible "All reviews" list + JSON-LD `ItemList`, `numberOfItems` 8 → 9).
  - Article internally links out to `/leaderboard/`, `/reviews/claude-code-vs-cursor-vs-codex/`, `/reviews/microsoft-mai-thinking-1-mai-code-1-flash-review/`, `/reviews/claude-opus-5-review/`, `/best/llm-benchmark-comparison-2026/`, `/agentic-workflows/multi-agent/`, `/reviews/`.
  - Canonical + OG/Twitter tags match sibling review pages; frontmatter description and JSON-LD description kept in sync.
  - Auto-added to `sitemap-0.xml` via @astrojs/sitemap (verified present in build output).

## 3. Verify

- `node scripts/validate-models.mjs` → **PASS** (76 models, 26 ranked, 0 errors, 17 warnings). Warnings are pre-existing "below the 3-cell scoring floor" notices, now including Muse Spark 1.2 (1 scored cell) — same class of warning several existing current models carry; not build-blocking.
- `models.json` parses as valid JSON; **no duplicate ids** (76 unique).
- `cd site && npm run build` → **PASS**, 46 pages built, 0 errors. (Had to run `npm install` first — dependencies were not present in the fresh checkout; no other fixes needed.)
- Confirmed the new review page and the `muse-spark-1-2` row are present in the built `dist/` output and the new URL is in the sitemap.

## Manual indexing needed

The following new page must be submitted by hand via Google Search Console → URL Inspection → Request Indexing (no API / remote agent can do this):

- [ ] https://agentguides.dev/reviews/meta-muse-code-muse-spark-1-2-review/

Worth re-inspecting after deploy (content changed, not new — lower priority):

- [ ] https://agentguides.dev/leaderboard/ (added Muse Spark 1.2, `last_updated` 2026-08-09)
- [ ] https://agentguides.dev/reviews/ (index updated with the new review)
