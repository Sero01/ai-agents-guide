# Weekly Run — 2026-08-23

Maintainer pass for [agentguides.dev](https://agentguides.dev). Refreshed the models leaderboard, published one new review, verified the build, and logged everything below.

## 1. Leaderboard delta

`site/src/data/models.json` — `last_updated` bumped `2026-08-16` → `2026-08-23`. Model count 78 → **79**. No models removed. No duplicate ids (verified via `node` parse). JSON parses cleanly.

### Models added

**Grok 4.6** (`grok-4-6`, xAI, closed, released **2026-08-12**) — inserted at the top of the xAI cluster, just above Grok 4.5. This is a **catch-up add**: Grok 4.6 shipped on Aug 12, a few days before last week's 2026-08-16 refresh, but was not picked up then. It is xAI's current flagship, trades leads with GPT-5.6 Sol, and was conspicuously the only frontier-tier model missing from the board, so it was added this pass with transparent provenance. The entry `note` records the pre-refresh release date.

| Field | Value | Provenance |
|---|---|---|
| GPQA Diamond | 94.9 | **Vendor-sourced** (xAI-reported at launch; ties for the top of the GPQA board). Up from Grok 4.5's estimated 91.0. |
| Terminal-Bench 2.1 | 88.0 | **Vendor-sourced** (xAI-reported, up from Grok 4.5's 83.3; level with GPT-5.6 Sol 88.8 / Fable 5 88.0). |
| SWE-bench Pro | 66.0 | **Conservatively estimated** — anchored to Grok 4.5's vendor 64.7, nudged up only slightly. xAI published no SWE-bench Pro cell; independent write-ups note Grok 4.6's software-engineering components trail its knowledge scores, and the widely-cited 95.6 "SWE-bench (Vals)" number is a different harness than SWE-bench Verified/Pro, so it was NOT used. |
| Context / max output | 500,000 / 32,000 | Vendor (unchanged from Grok 4.5) |
| Pricing (input/output/cache per 1M) | $2.00 / $6.00 / $0.50 | **Vendor** — flat vs Grok 4.5. Base rate covers prompts ≤200K tokens; xAI doubles it to $4/$12 in the long-context band above 200K. Noted in the entry. |
| Throughput | 130 tok/s | **Estimated** (carried from Grok 4.5's tier; xAI did not publish a 4.6 figure). |
| AA Intelligence Index | 61 (context only, not a stored cell) | Independent (Artificial Analysis); ties GPT-5.6 Sol, two behind Opus 5. No model in the dataset carries an `aa_intelligence_index` cell, so this was left out of the row to match peers and only cited in the entry note + article. |

Cell shape follows the modern sparse convention (like Gemini 3.7 Flash / GLM-5.3): only the live, scored benchmarks that could be sourced or conservatively anchored are populated. HLE and MMMU-Pro were **omitted** rather than fabricated — xAI published no first-party 4.6 figure for either and there was no clean same-model anchor.

### Status changes
- **Grok 4.5**: `current` → `superseded` (replaced by Grok 4.6). Also refreshed a stale "65+ models" phrase in its review's Continue-reading list to "78 other models".

### Considered but NOT added
- **Qwen3.8-Max** (Alibaba, released 2026-08-03) — a notable 2.4T-parameter multimodal flagship, but Alibaba published **zero official benchmarks on our tracked set** (only OSWorld-Verified and PaperBench, neither of which we score). Adding it would have meant estimating every tracked cell from a weak anchor. Skipped per the data-integrity policy, same rationale used for ByteDance Seed 2.1 Turbo last month. Worth revisiting once independent GPQA/SWE-bench/Terminal-Bench numbers land.
- **Ornith-1.5** (Ornith, released 2026-08-19, MIT, the only strictly in-window release) — an open self-improving family (397B / 35B-A3B / 9B). All figures are self-reported on Ornith's own evals, there is **no prior Ornith model in the dataset to anchor** estimates, and a hands-on local test flagged a wide gap between its published numbers and real-world agentic usability. Skipped as unverifiable; will reconsider if independent boards corroborate it.
- **"GLM-5.2 Turbo" (dated 2026-08-17)** — surfaced only on blocked/low-quality aggregator hosts and is internally contradictory (a "5.2 Turbo" dated *after* the already-shipped GLM-5.3). Treated as noise, not added.

### Other edits
- `site/src/pages/leaderboard.astro` — added "Grok 4.6" to the `keywords` meta tag (line 134); the current flagship set changed this week.

## 2. Article published

- **Title:** Grok 4.6 Review — xAI's Intelligence-per-Dollar Play
- **File:** `site/src/content/docs/reviews/grok-4-6-review.mdx`
- **Live URL:** https://agentguides.dev/reviews/grok-4-6-review/
- **Type:** Model review (placed in `reviews/`), matching the structure/tone/length of the existing Gemini 3.7 Flash and GPT-5.6 reviews (TechArticle + Review + BreadcrumbList + FAQPage JSON-LD, AuthorByline, caveat aside, TL;DR table, benchmark table, cost-efficiency section, pricing-band section, comparison, who-should-care, FAQ, Continue-reading links).
- **Frontmatter:** factual `title`/`description`, no superlative stacking. OG/canonical/Twitter tags mirror sibling reviews; JSON-LD description kept in sync with the frontmatter description.
- **SEO/internal linking:**
  - Sidebar entry added under **Reviews** in `site/astro.config.mjs` (after Gemini 3.7 Flash).
  - Outbound internal links to `/leaderboard/`, `/reviews/grok-4-5-review/`, `/reviews/claude-opus-5-review/`, `/reviews/gpt-5-6-sol-terra-luna-review/`, `/reviews/kimi-k3-review/`, `/best/llm-benchmark-comparison-2026/`, `/agentic-workflows/multi-agent/`.
  - **Inbound** internal link added from `/reviews/grok-4-5-review/` ("Continue reading") so the new page is not an orphan.
  - Auto-added to the sitemap via `@astrojs/sitemap` (confirmed present in `dist/sitemap-0.xml`).

## 3. Build result

- `cd site && npm run build` (Node v22.22.2) — **PASS**. 48 pages built (up from 47), no errors.
- Had to run `npm install` first (fresh checkout had no `node_modules`); no code changes were needed to fix the build.
- Verified: `dist/reviews/grok-4-6-review/index.html` exists, "Grok 4.6" renders on the built `/leaderboard/` (3 occurrences), `grok-4-6-review` is in `dist/sitemap-0.xml`, and `models.json` parses with no duplicate ids (79 models).

## Manual indexing needed

The following new page must be submitted by hand via Google Search Console → URL Inspection → Request Indexing (no API or remote agent can request indexing):

- [ ] https://agentguides.dev/reviews/grok-4-6-review/

The leaderboard page (https://agentguides.dev/leaderboard/) was updated in place, not newly created — worth a re-crawl request but not required.
