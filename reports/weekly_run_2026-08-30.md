# Weekly Run — 2026-08-30

Maintainer run for agentguides.dev. Covers the models leaderboard refresh, one new article, build verification, and manual-indexing follow-ups.

## 1. Leaderboard delta

`site/src/data/models.json` — `last_updated` bumped `2026-08-23` → `2026-08-30`. Model count 79 → **80**, no duplicate ids, JSON parses, prebuild validator (`scripts/validate-models.mjs`) reports **errors: 0** (18 pre-existing warnings, none on the new row).

### Added: GLM-5.3 Flash (`glm-5-3-flash`)

Zhipu AI (Z.ai), released **2026-08-26**. Inserted directly after the full `glm-5-3` row (peer placement). The first natively multimodal model in the GLM-5 line.

| Field | Value | Provenance |
|---|---|---|
| Architecture | 320B total / 18B active MoE | **Vendor** (Z.ai / MarkTechPost launch coverage) |
| Modalities | text, image, video input | **Vendor** |
| Context window | 1,048,576 | **Vendor** (published 1M-token / 1,048,576 figure) |
| Max output | 131,072 | **Vendor** (matches GLM-5.3) |
| License | open (MIT, weights on Hugging Face) | **Vendor** |
| Pricing | $0.15 in / $0.50 out / $0.03 cached per 1M | **Vendor list price**; cache_read estimated proportionally from GLM-5.3's 0.26@1.40. Note records the 50%-off launch promo ($0.075/$0.25 through 2026-09-09). |
| Throughput | 130 tok/s | **Estimated** — no vendor tok/s published; flash-tier estimate above the full GLM-5.3's 70. |
| AA Intelligence Index 57 / DeepSWE 63.4 | recorded in the row `note` | **Vendor / independent** (AA Index is independent; DeepSWE vendor-reported, up from GLM-5.2's 46.2). Neither maps to a tracked table column, so they live in the note, not a benchmark cell. |

Benchmark cells (all **conservatively estimated** — Z.ai published an index score + DeepSWE at launch, not the standard suite this table tracks; mirrors how `glm-5-3` itself was recorded):

| Cell | Value | Basis |
|---|---|---|
| `gpqa_diamond` | 88.0 (est) | Anchored to GLM-5.3 91.5 / GLM-5.2 vendor 91.2, discounted for the smaller Flash active-parameter budget. |
| `swe_bench_pro` | 58.0 (est) | Anchored to GLM-5.2 vendor 62.1 and GLM-5.3 est 65.0, discounted for the Flash tier. |
| `hle` | 50.0 (est) | Anchored to GLM-5.3 vendor 62.5 / GLM-5.2 54.7 (both with tools), discounted for the Flash tier. |

No existing models were removed or renumbered. `leaderboard.astro` keyword meta updated to add "GLM-5.3 Flash".

### Considered and rejected
- **Claude Mythos 5** — surfaced on an Aug 28 leaderboard, but it is a June 9 2026 restricted-access (trusted-access-program) variant of Fable 5, not a release since the last cutoff. Skipped.
- **DeepSeek V4 Flash Vision Exp (Aug 21)**, **Gemini 3.7 Flash (Aug 13)** — both pre-date the `2026-08-23` cutoff and/or are already represented in the data. Skipped.
- **Nemotron 3 Nano Omni** — throughput leader mention only; no clear release date or frontier relevance this week. Skipped.

## 2. Article published

- **Title:** GLM-5.3 Flash Review — Zhipu's First Multimodal GLM at Flash Prices
- **File:** `site/src/content/docs/reviews/glm-5-3-flash-review.mdx`
- **Live URL:** https://agentguides.dev/reviews/glm-5-3-flash-review/
- **Type/dir:** model review → `reviews/` (matched `glm-5-2-review.mdx` structure: byline, provenance aside, TL;DR table, architecture, launch numbers, pricing, comparison, who-should-care, FAQ, continue-reading).
- **Frontmatter:** factual `title`/`description`, no superlative stacking. OG/canonical/Twitter tags mirror sibling reviews. JSON-LD (`TechArticle` + `Review` + `BreadcrumbList` + `FAQPage`) description kept in sync with the frontmatter description.
- **Sidebar:** added to the Reviews group in `astro.config.mjs` (`order: 18`, newest).
- **Internal linking:** the new page links out to the leaderboard, GLM-5.2, Gemini 3.7 Flash, DeepSeek V4 Flash, and the benchmark comparison; and it is linked *in* from the existing `glm-5-2-review.mdx` "Continue reading" list. Auto-added to the sitemap via `@astrojs/sitemap` (confirmed present in `dist/sitemap-0.xml`).

## 3. Build result

`cd site && npm run build` (Node v22.22.2) — **PASS**. Ran `npm install` first (node_modules was absent in a fresh checkout). Prebuild model validator PASS. **49 pages built, no errors.** New page confirmed at `dist/reviews/glm-5-3-flash-review/index.html`. No fixes required beyond the dependency install.

## Manual indexing needed

These pages cannot be submitted to Google Search Console from this environment (no API, no remote agent). Submit each by hand via **GSC → URL Inspection → Request Indexing**:

- [ ] https://agentguides.dev/reviews/glm-5-3-flash-review/ — new article (GLM-5.3 Flash review)
- [ ] https://agentguides.dev/leaderboard/ — updated (new GLM-5.3 Flash row, `last_updated` 2026-08-30); request re-crawl
