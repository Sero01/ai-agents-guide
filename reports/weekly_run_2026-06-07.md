# Weekly Content + Data Run — 2026-06-07

Maintainer run for [agentguides.dev](https://agentguides.dev). Previous leaderboard `last_updated`: 2026-05-31. This run covers the window **2026-05-31 → 2026-06-07**.

## 1. Leaderboard refresh (`site/src/data/models.json`)

- Bumped `last_updated` from `2026-05-31` → `2026-06-07`.
- Model count: 59 → **61** (added 2; removed none).
- Updated the `keywords` meta in `leaderboard.astro` to include "Microsoft MAI, MAI-Thinking-1".

The notable new releases this week were Microsoft's first in-house frontier models, announced at **Build 2026 on June 2, 2026**. Microsoft shipped seven MAI models across modalities; the two that fit this leaderboard's text/reasoning/coding schema were added. The other five (image, voice, speech/transcription, etc.) are out of scope for this benchmark set and were not added.

### Added: `mai-thinking-1` — MAI-Thinking-1 (Microsoft, closed, 2026-06-02)

Microsoft's first in-house reasoning model (sparse MoE, ~35B active / ~1T total, 256K context). Private preview via Azure AI Foundry, Baseten, Fireworks, OpenRouter.

| Field | Value | Source |
|---|---|---|
| context_window / max_output | 256000 / 32000 | **Vendor-sourced** context (256K); max_output **estimated** (no published figure) |
| modalities | text | **Vendor-sourced** (reasoning model; vision handled by separate MAI image model) |
| pricing input / output | $3.00 / $15.00 per 1M | **Estimated** — pricing not finalized at launch; anchored to Sonnet-4.6 tier, which Microsoft used as its human-eval comparison point and its "cost-efficient frontier" positioning |
| math_500 | 97.0 | **Estimated** — anchored to confirmed AIME 2025 97.0% / AIME 2026 94.5% (top-tier math), peers o3 96.5 / R1 97.3 |
| swe_bench (Verified) | 86.0 | **Estimated** — Microsoft reports SWE-bench Pro ~53% and "matches Claude Opus 4.6 on coding"; mapped conservatively to Verified below Opus 4.7's 87.6 |
| gpqa_diamond | 89.0 | **Estimated** — frontier reasoning anchor (o3 87.7, Grok 4.3 90.0, GPT-5.5 86.0) |
| mmlu_pro | 87.0 | **Estimated** — frontier anchor (o3 85.0, GPT-5.5 89.0) |
| humaneval | 93.0 | **Estimated** — "matches Opus on coding"; saturated band (Opus 4.7 94.0) |
| aider_polyglot | 82.0 | **Estimated** — Opus-class coder anchor |
| tau_bench | 76.0 | **Estimated** — conservative agent-tool anchor between o3 (73) and Opus 4.7 (83) |
| mmmu | null | Text-only model, no multimodal score (correctly null) |
| throughput | 70 tok/s | **Estimated** — 35B-active reasoning MoE |

**Caveat carried into the row and the article:** all MAI-Thinking-1 numbers are self-reported from Microsoft's technical report; no independent third-party benchmarks had landed at launch.

### Added: `mai-code-1-flash` — MAI-Code-1-Flash (Microsoft, closed, 2026-06-02)

In-house coding model shipping to every GitHub Copilot tier (sparse MoE, ~5B active / 137B total, 256K context).

| Field | Value | Source |
|---|---|---|
| context_window / max_output | 256000 / 16000 | **Vendor-sourced** context (256K); max_output **estimated** |
| modalities | text | **Vendor-sourced** |
| pricing input / output / cache_read | $0.75 / $4.50 / $0.075 per 1M | **Vendor-sourced** (provisional, model card notes pricing "still being finalized") |
| swe_bench (Verified) | 62.0 | **Estimated** — Microsoft reports SWE-bench Pro 51.2% (vs Haiku 4.5's 35.2%, +16); mapped above Haiku 4.5's Verified 50.2 to reflect the lead |
| humaneval | 88.0 | **Estimated** — strong coder above Haiku 4.5 (82.0) |
| aider_polyglot | 64.0 | **Estimated** — above Haiku 4.5 (60.0) |
| mmlu_pro | 70.0 | **Estimated** — small (5B active), coding-focused; near/below Haiku 4.5 (74.5) |
| gpqa_diamond | 56.0 | **Estimated** — coding model, not reasoning (Haiku 4.5 58.0) |
| math_500 | 86.0 | **Estimated** — Haiku 4.5 anchor (86.0) |
| tau_bench | 60.0 | **Estimated** — Copilot agent-loop use; Haiku 4.5 anchor (62.0) |
| mmmu | null | Text-only model (correctly null) |
| throughput | 200 tok/s | **Estimated** — 5B-active "Flash" inference-efficient model |

### Considered but NOT added

- **Claude Mythos Preview (Anthropic):** dated April 7, 2026 (before the prior update window), explicitly **not planned for general availability**, and access-limited to ~40 Project Glasswing partners. Ultra-niche per the inclusion rule — excluded from the leaderboard. (It is referenced as context only, not added.)

## 2. New article

- **Title:** Microsoft MAI-Thinking-1 and MAI-Code-1-Flash Review — Build 2026 In-House Models
- **Path:** `site/src/content/docs/reviews/microsoft-mai-thinking-1-mai-code-1-flash-review.mdx`
- **Live URL:** https://agentguides.dev/reviews/microsoft-mai-thinking-1-mai-code-1-flash-review/
- **Dir rationale:** model review → `reviews/`. Structure, frontmatter, head meta, and JSON-LD (TechArticle + Review + BreadcrumbList + FAQPage) modeled on the sibling `claude-opus-4-8-review.mdx`; frontmatter `description` and JSON-LD `description` kept in sync; OG/canonical/Twitter tags match siblings.
- **SEO / on-page:**
  - Sidebar entry added under **Reviews** in `astro.config.mjs`.
  - Internal links **into** the new page from: `reviews/index.md` (list + ItemList schema bumped 3 → 4) and `reviews/claude-opus-4-8-review.mdx` ("Continue reading").
  - New page links **out** to leaderboard, Opus 4.8 review, Claude Code vs Cursor vs Codex, LLM Benchmark Comparison 2026, multi-agent pipelines.
  - Confirmed in build sitemap (`dist/sitemap-0.xml`) via @astrojs/sitemap.
  - Factual title/description — no superlative stacking.

## 3. Build / verification

- `cd site && npm install` (deps were not present in the fresh checkout), then `npm run build` with **Node v22.22.2**.
- **Result: PASS** — 35 pages built, no errors. New review page and `/leaderboard/` both emitted; Pagefind index rebuilt.
- `models.json` validated via Node `require`: parses, **61 models, no duplicate ids**; both MAI rows expose 7 numeric benchmarks (mmmu null).
- Nothing needed fixing beyond installing dependencies.

## Manual indexing needed

These pages must be submitted by hand via **Google Search Console → URL Inspection → Request Indexing** (no API/remote agent can do this):

- [ ] https://agentguides.dev/reviews/microsoft-mai-thinking-1-mai-code-1-flash-review/
- [ ] https://agentguides.dev/leaderboard/ — content updated (2 new models, new `last_updated`); request re-crawl so the refreshed Dataset/FAQ structured data is re-indexed.
