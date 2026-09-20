# Weekly content + data run — 2026-09-20

Maintainer run for [agentguides.dev](https://agentguides.dev). Scope: refresh the models
leaderboard, publish one grounded article, verify the build, log the run.

## 1. Leaderboard delta (`site/src/data/models.json`)

- `last_updated`: `2026-09-13` → `2026-09-20`.
- Model count: 83 → 84 (one addition, none removed).

### Added: Atria Dawn Preview (`atria-dawn-preview`)

Open-weight 744B agentic mixture-of-experts from **Shanghai AI Lab**, post-trained on the
GLM-5.2 base (the same base GLM-5.3 is built on), released **2026-09-11** under the MIT license
with FP8 and BF16 checkpoints on Hugging Face / ModelScope. Released ~9 days ago and missing from
the table; it is the most notable single open-weight release of the period. Positioned for
long-horizon research and tool-use agents. Inserted in the open-weight cluster (near the DeepSeek
entries). 256K context, text-only, no first-party hosted API.

Per-field provenance for the new row:

| Field | Value | Source |
|---|---|---|
| context_window | 262,144 | Vendor-sourced (model card / press) |
| license | open (MIT) | Vendor-sourced |
| released | 2026-09-11 | Vendor-sourced (Shanghai AI Lab / AI Weekly) |
| **swe_bench_pro** | **59.6** | **Vendor-sourced** (Atria model card) |
| **terminal_bench_2_1** | **78.3** | **Vendor-sourced** (Atria model card) |
| swe_bench_verified | 78.0 | **Conservative estimate** — Pro runs ~20 pts below Verified; anchored to GLM-5.2 lineage. Not published by vendor. |
| gpqa_diamond | 90.0 | **Conservative estimate** — anchored to GLM-5.3 (est. 91.5) and DeepSeek V4 Pro (vendor 90.1). Not published by vendor. |
| hle | 58.0 | **Conservative estimate** — anchored below GLM-5.3's vendor 62.5. Not published by vendor. |
| pricing (input/output) | $0.9 / $2.9 per 1M | **Estimate** — no first-party API; typical third-party hosted rate for a 744B open MoE (OpenRouter/Together/Fireworks tier), following the table's open-weights convention. |
| max_output | 65,536 | Conservative estimate (not vendor-confirmed). |
| throughput | 40 tok/s | Conservative estimate for a freshly-released 744B open MoE on third-party infra. |

Note on scope: Atria led its launch with **agentic** benchmarks (DeepSearchQA 96.0, BrowseComp 92.5,
MLE-bench Lite 86.2, BFCL v4 77.0, AutomationBench 53.8, Workspace-Bench 65.0, JobBench 50.3,
CyberGym 86.5) rather than the standard reasoning/coding suite, so only SWE-bench Pro and
Terminal-Bench 2.1 map onto this board as measurements. With two vendor-scored cells it sits below
the leaderboard's 3-cell ranking floor (validator warning, non-fatal) — it appears on the
per-benchmark tables it has data for. None of Atria's vendor numbers has been independently
reproduced yet; the review flags this explicitly.

### Considered but NOT added

- **Fugu Max (Sakana AI, ~Sep 11)** — it is an *orchestrator* ("multi-agent system as a model"),
  not a single model. Its benchmark numbers are Sakana-internal and unreproduced, and folding an
  orchestrator's scores into a per-model benchmark table would misrepresent the board. Covered as
  context in the article instead of added as a row.
- Image models (GPT Image 2.5 Flare/Sunburst) and dev tools/agents released Sep 14–19
  (Aperant, agent-browser, OpenScience) — out of scope for a text-LLM leaderboard.

No existing models were removed. No flagship set change, so the `leaderboard.astro` keyword meta was
left unchanged (it already tracks the current benchmark set and auto-updates from `last_updated`).

### Stale-data check

Spot-checked recent open-weight peers (DeepSeek V4 Pro/V4.1 Flash, GLM-5.3, Kimi K3) — no pricing
corrections needed this week.

## 2. Article published

- **Title:** Atria Dawn Preview Review — An Open-Weight 744B Agentic MoE from Shanghai AI Lab
- **File:** `site/src/content/docs/reviews/atria-dawn-preview-review.mdx`
- **Live URL:** https://agentguides.dev/reviews/atria-dawn-preview-review/
- **Type:** model review (`reviews/`), matched to the existing review template (frontmatter,
  OG/Twitter/canonical tags, TechArticle + Review + BreadcrumbList + FAQPage JSON-LD, AuthorByline,
  provenance aside). Frontmatter title/description are factual (no superlative stacking); JSON-LD
  description kept in sync with the frontmatter description.
- **On-page SEO / internal linking:**
  - Sidebar entry added under **Reviews** in `site/astro.config.mjs`.
  - Linked from `reviews/deepseek-v4-1-flash-review.mdx` (Continue reading) and refreshed the
    `reviews/index.md` "All reviews" list (added DeepSeek V4.1 Flash + Atria Dawn Preview).
  - The article links out to the leaderboard, GLM-5.3 Flash, GLM-5.2, DeepSeek V4.1 Flash, Kimi K3,
    and the LLM Benchmark Comparison 2026.
  - Auto-added to the sitemap via `@astrojs/sitemap` at build.

## 3. Build result

- `npm ci` in `site/` (fresh checkout had no `node_modules`), then `npm run build` on Node v22.22.2.
- `prebuild` model validator: **PASS** — 84 models, 28 ranked, 0 errors, 19 warnings (non-fatal;
  includes the expected "below the 3-cell floor" note for Atria).
- Astro build: **PASS** — 52 pages built, sitemap generated, Pagefind index built. No errors.
- `models.json` parses; no duplicate ids (verified).
- Nothing needed fixing beyond installing dependencies.

## Manual indexing needed

These pages are new this run and must be submitted by hand via **Google Search Console → URL
Inspection → Request indexing** (no API or remote agent can request indexing from here):

- [ ] https://agentguides.dev/reviews/atria-dawn-preview-review/

The leaderboard page already exists; its content changed but its URL did not, so it does not need a
fresh indexing request (Google will re-crawl it from the updated sitemap `lastmod`):

- https://agentguides.dev/leaderboard/ (updated, not new — optional re-inspect)
