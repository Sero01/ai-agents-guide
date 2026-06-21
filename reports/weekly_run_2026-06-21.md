# Weekly Content + Data Run — 2026-06-21

Maintainer run for [agentguides.dev](https://agentguides.dev). Previous leaderboard `last_updated`: 2026-06-14. This run covers the window **2026-06-14 → 2026-06-21**.

## 1. Leaderboard refresh (`site/src/data/models.json`)

- Bumped `last_updated` from `2026-06-14` → `2026-06-21`.
- Model count: 63 → **64** (added 1; removed none).
- Updated the `keywords` meta in `leaderboard.astro` to add "GLM-5.2".
- Refreshed the `methodology_note` to document the GLM-5.2 estimation basis.

The standout in-window release was Zhipu AI's **GLM-5.2** (weights June 13, benchmark card June 17). Several other names surfaced in roundups but did not qualify for a row this week (see "Considered but NOT added" below). No still-in-use models were removed.

### Added: `glm-5-2` — GLM-5.2 (Zhipu AI, open, 2026-06-13)

A ~753B-total / ~40B-active sparse MoE, **1M context**, up to **131,072 output**, unrestricted **MIT** license, aimed at long-horizon agentic software engineering. Positioned in source order with the GLM family (immediately above `glm-5-1`); the leaderboard page sorts by composite at build time.

**Data-integrity note:** Zhipu's launch card published **long-horizon coding/agentic** benchmarks — SWE-bench Pro 62.1, FrontierSWE 74.4, MCP-Atlas 77.0 — but **not** the standard public set (MMLU-Pro, GPQA Diamond, Aider Polyglot, tau-bench). The `swe_bench` cell therefore carries the vendor's published **SWE-bench Pro 62.1**, matching how the **GLM-5.1 predecessor row** was already recorded (its `swe_bench` = 58.4 is the published SWE-bench Pro figure, not Verified). Remaining cells are **conservative estimates anchored to GLM-5.1**, nudged up on coding/agentic axes consistent with a coding-first refresh and held flat-to-modest on breadth.

| Field | Value | Source |
|---|---|---|
| context_window / max_output | 1000000 / 131072 | **Vendor-sourced** (1M context; up to 131,072 output) |
| license | open (MIT, unrestricted) | **Vendor-sourced** (weights on Hugging Face) |
| modalities | text | **Vendor-sourced** (text/code release) |
| pricing input / output / cache_read | $1.40 / $4.40 / $0.26 per 1M | **Vendor-sourced** (Z.ai metered API; flat GLM Coding Plan from ~$18/mo not modeled) |
| swe_bench | 62.1 | **Vendor-sourced** — published SWE-bench Pro 62.1; recorded to match the GLM-5.1 row's Pro convention |
| humaneval | 92.0 | **Estimated** — coding-first refresh; +2 over GLM-5.1 (90.0) |
| aider_polyglot | 70.0 | **Estimated** — +6 over GLM-5.1 (64.0); beats GPT-5.5 on published long-horizon coding |
| math_500 | 93.0 | **Estimated** — +1 over GLM-5.1 (92.0) |
| mmlu_pro | 83.0 | **Estimated** — +1 over GLM-5.1 (82.0); breadth held conservative for a coding-first model |
| gpqa_diamond | 74.0 | **Estimated** — +2 over GLM-5.1 (72.0) |
| tau_bench | 62.0 | **Estimated** — +6 over GLM-5.1 (56.0); strong published MCP-Atlas agentic result |
| mmmu | null | Text/code release (no multimodal score — correctly null) |
| throughput | 70 tok/s | **Estimated** — same ~40B-active MoE serving profile as the GLM-5 line |

### Considered but NOT added

- **Claude Mythos 5 (Anthropic):** the safeguards-lifted sibling of the already-listed Claude Fable 5. It is a **restricted, limited-access program** (vetted infrastructure providers and cybersecurity researchers) and was placed under a US export-control directive on June 13. Not a generally-available, publicly-priced API model → **excluded** as a standard leaderboard row. Fable 5 already represents this Mythos-class tier in the table.
- **GPT-5.6 (OpenAI):** **not officially released** as of 2026-06-21 — release candidate only, with no published system card, pricing, or benchmarks (market consensus pointed to a June 22–28 launch). Adding it would require fabricating numbers → **excluded** until the system card ships.
- **Gemini 3.2 Flash (Google):** out of window (revealed ~May 20 at I/O 2026) and pricing remains leaked-only. The 3.x Flash branch is already represented by `gemini-3-5-flash`. → **excluded**.
- **DeepSeek "V4.1":** no such release exists — V4-Pro and V4-Flash (both already listed) remain DeepSeek's latest. The roundup mention was speculative. → **excluded**.
- **Qwen 3.7 / Hunyuan Large 3 / ERNIE 5.1 / Doubao Pro:** surfaced in a two-week roundup but without confirmable in-window release dates and published standard benchmarks; Qwen 3.7 Max is already listed (2026-05-19). → **deferred** pending firmer data.

### Pricing note (not changed)

One aggregator listed DeepSeek V4-Pro at ~$0.435 in / $0.87 out vs the table's $0.50 / $2.20. Sources conflicted, so the existing row was **left unchanged** this run rather than churned on a single unconfirmed figure; flagged here for a future verification pass.

## 2. New article

- **Title:** GLM-5.2 Review — Zhipu's Open-Weight Coding Flagship
- **Path:** `site/src/content/docs/reviews/glm-5-2-review.mdx`
- **Live URL:** https://agentguides.dev/reviews/glm-5-2-review/
- **Dir rationale:** model review → `reviews/`. Structure, frontmatter, head meta, and JSON-LD (TechArticle + Review + BreadcrumbList + FAQPage) modeled on the sibling `kimi-k2-7-code-review.mdx`; frontmatter `description` and JSON-LD `description` kept in sync; OG/canonical/Twitter tags match siblings.
- **Factual title/description** — no superlative stacking. The article is explicit that the cross-vendor coding numbers are vendor-published (pending third-party confirmation) and that broad-reasoning placements are estimates.
- **SEO / on-page:**
  - Sidebar entry added under **Reviews** in `astro.config.mjs`.
  - Internal links **into** the new page from: `reviews/index.md` (list + ItemList schema bumped 6 → 7) and `reviews/kimi-k2-7-code-review.mdx` ("How it compares" + "Continue reading").
  - New page links **out** to leaderboard, Kimi K2.7-Code review, Claude Opus 4.8 review, Claude Fable 5 review, Claude Code vs Cursor vs Codex, LLM Benchmark Comparison 2026, and multi-agent pipelines.
  - Confirmed in build sitemap (`dist/sitemap-0.xml`) via @astrojs/sitemap.

## 3. Build / verification

- `cd site && npm run build` with **Node v22.22.2** (ran `npm install` first — deps were not present in the fresh checkout).
- **Result: PASS** — 39 pages built (38 → 39), no errors. New review page (`dist/reviews/glm-5-2-review/index.html`) and `/leaderboard/` both emitted; "GLM-5.2" present in the leaderboard payload; Pagefind index rebuilt (36 indexed pages).
- **One fix required:** the first build failed on an MDX parse error — stray `</content>`/`</invoke>` tags had leaked into the end of `glm-5-2-review.mdx` during authoring. Removed them; rebuild passed clean.
- `models.json` validated via Node: parses, **64 models, no duplicate ids**; the GLM-5.2 row exposes 7 numeric benchmarks (mmmu null).

## Manual indexing needed

These pages must be submitted by hand via **Google Search Console → URL Inspection → Request Indexing** (no API/remote agent can do this):

- [ ] https://agentguides.dev/reviews/glm-5-2-review/ — new page.
- [ ] https://agentguides.dev/leaderboard/ — content updated (1 new model, new `last_updated`); request re-crawl so the refreshed Dataset/FAQ structured data is re-indexed.
- [ ] https://agentguides.dev/reviews/ — index updated (new review listed; ItemList schema bumped to 7); optional re-crawl.
</content>
