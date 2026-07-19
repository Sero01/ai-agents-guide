# Weekly Maintainer Run — 2026-07-19

Automated content + data maintenance pass for [agentguides.dev](https://agentguides.dev).

## 1. Leaderboard refresh (`site/src/data/models.json`)

- `last_updated` bumped `2026-07-12` → `2026-07-19`.
- Model count: 69 → **71** (2 added, 0 removed). JSON parses cleanly; no duplicate ids; all rows carry the full 8-benchmark set.

### Models added

**Kimi K3** (`kimi-k3`, Moonshot AI, open weights, released 2026-07-16)
- 2.8T-parameter sparse MoE (~50B active, 896 experts), 1,048,576-token context, always-on thinking mode, text+vision. The largest open model shipped to date; #4 on the Artificial Analysis composite (Intelligence Index v4.1 = 57), second only to Claude Fable 5 and the top-ranked open model.
- **Vendor-sourced:** `gpqa_diamond` **93.5** (Moonshot-published). Context window (1M), pricing (**$3 in / $15 out, $0.30 cached**, flat across context), release date, and open-weights date (2026-07-27) are vendor-confirmed. Additional vendor evals recorded in the methodology note but *outside* the tracked 8-benchmark set: Terminal-Bench 2.1 88.3, FrontierSWE 81.2, Program Bench 77.8, DeepSWE 67.5, BrowseComp 91.2.
- **Conservatively estimated** (standard suite not published at launch): `mmlu_pro` 88.0, `humaneval` 95.0, `swe_bench` 81.0, `math_500` 97.0, `mmmu` 78.0, `aider_polyglot` 83.0, `tau_bench` 82.0. Anchored to the Kimi K2.7-Code predecessor and nudged up for confirmed frontier positioning + published GPQA/agentic gains, held at/below same-tier closed leaders. `max_output` 32000 and `throughput` 55 are estimates.

**Inkling** (`inkling`, Thinking Machines, open weights, released 2026-07-15)
- 975B-parameter MoE (41B active), 1M-token context, text+vision. Thinking Machines' (Mira Murati's lab) first release; positioned between Kimi K2.5 and K2.6, above Nvidia Nemotron 3 Ultra.
- **Vendor-sourced:** `swe_bench` **77.6** (SWE-bench Verified, vendor-published). Pricing **$1 in / $4.05 out** is the OpenRouter first-party rate; params, context, release date, license vendor-confirmed.
- **Derived from vendor number:** `mmmu` 78.0 estimated upward from the vendor-published **MMMU Pro 73.5** (MMMU is the easier variant).
- **Conservatively estimated:** `mmlu_pro` 84.0, `gpqa_diamond` 76.0, `humaneval` 92.0, `math_500` 93.0, `aider_polyglot` 70.0, `tau_bench` 64.0. `max_output` 32000 and `throughput` 90 are estimates.

### Other leaderboard edits
- Methodology note extended with full provenance paragraphs for Kimi K3 and Inkling (which cells are vendor vs estimated, and the anchors used).
- `leaderboard.astro` keyword meta updated to add current flagships: Kimi K3, Inkling, Thinking Machines.
- No pricing corrections needed on existing rows this week.

## 2. New article

- **Title:** Kimi K3 Review — Moonshot's 2.8T Open-Weight Frontier Model
- **Path:** `site/src/content/docs/reviews/kimi-k3-review.mdx`
- **Live URL:** https://agentguides.dev/reviews/kimi-k3-review/
- **Type:** Model review (`reviews/`), matching the structure/length/tone of the existing Kimi K2.7-Code and Grok 4.5 reviews (disclaimer aside, TL;DR table, launch-numbers table, pricing, comparison, who-should-care, FAQ, continue-reading). Frontmatter `title`/`description` are factual (no superlative stacking); JSON-LD `description` kept in sync with the frontmatter; OG/canonical tags mirror sibling review pages.
- **SEO/linking:** sidebar entry added under **Reviews** in `astro.config.mjs` (order 11); the page is internally linked from the existing Kimi K2.7-Code review's "Continue reading" list; the article itself links out to the leaderboard, K2.7-Code, GLM-5.2, Grok 4.5, Fable-5-vs-Opus, and the benchmark comparison pages. Auto-added to the sitemap via `@astrojs/sitemap` on build.

## 3. Build & validation

- `cd site && npm install && npm run build` → **PASS.** 43 pages built, no errors.
- Fixed one issue: the initial write of `kimi-k3-review.mdx` left three stray trailing lines that broke the MDX parser (`Unexpected closing slash`); removed them and the rebuild was clean.
- `models.json`: validated via Node — parses, 71 models, no duplicate ids, every row has 8 benchmark cells.
- Confirmed in `dist/`: `reviews/kimi-k3-review/index.html` exists; leaderboard renders "71 AI models" and includes both Kimi K3 and Inkling.

## Manual indexing needed

These pages are new this run and must be submitted by hand via Google Search Console → URL Inspection → Request Indexing (no API/remote agent can request indexing):

- [ ] https://agentguides.dev/reviews/kimi-k3-review/

The models leaderboard (https://agentguides.dev/leaderboard/) changed content but is an existing URL; a re-inspection/re-index request there is optional but worthwhile since two frontier rows were added.
</content>
