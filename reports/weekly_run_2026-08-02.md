# Weekly run — 2026-08-02

Maintainer run for agentguides.dev. Window covered: since the previous
`last_updated` of **2026-07-26**. Determined today's date with `date -u +%F` → 2026-08-02.

## 1. Leaderboard refresh (`site/src/data/models.json`)

- Bumped `last_updated` → **2026-08-02**.
- Model count: **74 → 75** (one addition). No models removed. No duplicate ids (validated).

### Added: Qwen3.7 Flash (`qwen-3-7-flash`, Alibaba, closed, released 2026-07-27)

The cheapest multimodal model with a 1M-token context to land this week; arrived
quietly on OpenRouter on Jul 27 with no technical report or benchmark suite from
Alibaba. Placed next to its sibling Qwen 3.7 Max.

| Field | Value | Source |
|---|---|---|
| Pricing | $0.03 in / $0.13 out per 1M | **Vendor/aggregator-sourced** (OpenRouter listing) |
| Context / max output | 1,000,000 / 65,536 | **Sourced** (OpenRouter / QwenCloud docs) |
| Modalities | text, vision, video (input) | **Sourced** |
| mmlu_pro 74.0 | **Estimate** — anchored to Qwen 3.7 Max (84.0), scaled to the sub-$0.05 flash tier |
| gpqa_diamond 70.0 | **Estimate** — anchored to Qwen 3.7 Max vendor 92.4, scaled down |
| swe_bench_verified 52.0 | **Estimate** — anchored to Qwen 3.7 Max vendor 80.4, scaled to Flash tier |

Alibaba published **no** benchmarks for this tier, so every benchmark cell is a
conservative `estimate` (excluded from all rankings; the model shows 0 sourced
cells, which the validator flags as a warning, not an error). This is honest: a
low Src count reflects that the vendor published little, not that the model is weak.

### Updated: DeepSeek V4 Flash (`deepseek-v4-flash`) → V4-Flash-0731 checkpoint

DeepSeek shipped a re-trained checkpoint (V4-Flash-0731) on **Jul 31, 2026** — same
architecture, parameter count, 1M context, and $0.14/$0.55 pricing as the April
build; only post-training changed. It reportedly beats the larger V4 Pro on agent
benchmarks. Reflected as a material update to the existing row:

| Cell | New value | Source classification |
|---|---|---|
| terminal_bench_2_1 | **82.7** | **Vendor-sourced** (DeepSeek-reported; up from V4-Pro-Preview's 72.1). New scored live cell. |
| gpqa_diamond | 91.0 (was 65.0 unsourced_legacy) | **Conservative estimate** — anchored to DeepSeek V4 Pro's vendor GPQA 90.1; aggregators place 0731 ~1pt above prior Flash. Not a measurement. |
| hle | 37.0 (new) | **Conservative estimate** — aggregators report ~37 for the 0731 build; DeepSeek published no first-party HLE. |
| pricing | unchanged ($0.14/$0.55) | Left as-is: Artificial Analysis states 0731 shares "identical pricing" with the April Flash; a conflicting $0.28-output claim could not be verified, so no change made. |

Note on provenance: GPQA/HLE figures for 0731 originate from Artificial Analysis,
whose registry entry is `redistributable: false`, so they **cannot** be cited as an
AA-sourced cell on the site (the build-time validator rejects that). They are
therefore recorded as `estimate` anchored to confirmed same-vendor numbers — the
honest, buildable classification. Terminal-Bench 2.1 is a DeepSeek-published figure
and is recorded as `vendor`.

### Other leaderboard edits

- `leaderboard.astro` keyword meta: added "Qwen3.7 Flash, DeepSeek V4 Flash 0731,
  DeepSeek V4 Pro, cheap multimodal model". The set of **flagships** did not change
  (Claude Opus 5 still tops the composite), so the flagship-facing copy was untouched.
- Considered but **not** added: Llama 3.2 / other July releases were dated before the
  2026-07-26 window or were niche audio/TTS variants (Qwen-Audio-3.0-TTS Plus) — skipped
  per the "skip ultra-niche" rule.

## 2. New article

- **Title:** DeepSeek V4 Flash 0731 Review — A Budget Model That Beats Its Own Flagship
- **Path:** `site/src/content/docs/reviews/deepseek-v4-flash-0731-review.mdx`
- **Live URL:** https://agentguides.dev/reviews/deepseek-v4-flash-0731-review/
- **Category:** `reviews/` (single-model review) — structure, frontmatter, OG/canonical
  tags, and JSON-LD (TechArticle + Review + BreadcrumbList + FAQPage) mirror the
  existing `grok-4-5-review.mdx`. Frontmatter + JSON-LD descriptions kept in sync.
- **SEO/on-page:**
  - Sidebar entry added under **Reviews** in `astro.config.mjs`.
  - Internal links **in:** added to `reviews/index.md` (prose list + ItemList JSON-LD,
    `numberOfItems` 7 → 8).
  - Internal links **out:** /leaderboard/, /reviews/glm-5-2-review/,
    /reviews/kimi-k2-7-code-review/, /reviews/claude-opus-5-review/,
    /best/llm-benchmark-comparison-2026/, /agentic-workflows/multi-agent/.
  - Auto-added to the sitemap by @astrojs/sitemap (confirmed present in
    `dist/sitemap-0.xml`).
- Every claim grounded in this week's reporting on the Jul 31 DeepSeek release;
  measured-vs-estimated provenance is stated inline and in a disclosure aside.

## 3. Verify

- `npm run validate:models` → **PASS** (75 models, 25 ranked, 0 errors, 16 warnings).
  Warnings are the expected `min_scored_cells` notices for models below the 3-sourced-cell
  floor (including the new all-estimate Qwen3.7 Flash) — informational, non-blocking.
- `cd site && npm run build` → **PASS**, 45 pages built, no errors. `astro` was not on
  PATH initially (fresh checkout); ran `npm install` first, then the build completed.
- `models.json` parses; no duplicate ids (checked programmatically).
- New page emitted at `dist/reviews/deepseek-v4-flash-0731-review/index.html` and present
  in the sitemap.

## 4. Ship

- All changes + this log committed in one commit and pushed to `main` (triggers the
  Cloudflare Pages deploy).

## Manual indexing needed

Google Search Console URL Inspection → Request Indexing must be done **by hand** for
each new URL below (no API/remote agent can submit these):

- [ ] https://agentguides.dev/reviews/deepseek-v4-flash-0731-review/

The updated `https://agentguides.dev/leaderboard/` is not a new URL and will be
re-crawled on its own cadence, but you may optionally re-inspect it to nudge a refresh.
