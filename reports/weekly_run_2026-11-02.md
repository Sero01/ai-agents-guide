# Leaderboard refresh and accuracy pass — 2026-11-02

First run since 2026-09-20. Scope: refresh the models leaderboard, check existing rows against
vendor sources, and rewrite the `/leaderboard/` and `/mcp/` titles. No new article this run.

## 1. Leaderboard delta (`site/src/data/models.json`)

- `last_updated`: `2026-09-20` → `2026-11-02`.
- Model count: 84 → 102 (18 added, none removed). Current rows: 28 → 30.
- New rows carry no estimated cells. Gaps stay blank where a vendor published nothing.

### New benchmark columns

Added `terminal_bench_4_0` and `deepswe_1_1` as live columns, because most new releases no longer
report Terminal-Bench 2.1. The default sort moved from SWE-bench Pro to Terminal-Bench 4.0, which now
has sourced scores on 12 current rows against 7 for SWE-bench Pro.

### Added

| Model | Released | Price in/out | Notes |
|---|---|---|---|
| Claude Opus 5.5 | 2026-09-22 | $4/$20 | |
| Claude Sonnet 5.5 | 2026-09-28 | $2/$10 | |
| Claude Haiku 5.5 | 2026-10-07 | $0.10/$0.50 | $0.50/$2.50 over 100K tokens |
| GPT-6 Sol | 2026-09-22 | $2/$10 | Superseded by GPT-6.1 Sol |
| GPT-6.1 Sol | 2026-09-29 | $2/$10 | DeepSWE 75.2 is derived from OpenAI's "+6.4 points" statement |
| GPT-6.1 Terra | 2026-10-26 | $1/$5 | |
| GPT-6 Luna | 2026-09-22 | $0.10/$0.50 | |
| Gemini 3.8 Flash | 2026-09-02 | $0.75/$3.75 | Rises to $1.50/$7.50 on 2027-01-01 |
| Gemini 4 Argon | 2026-10-13 | $2/$10 | Rises to $4/$20 on 2026-12-01 |
| Gemini 4 Carbon | 2026-10-28 | none | Unreleased: limited access, no public API |
| Grok 4.7 | 2026-09-21 | $2/$6 | No benchmark figures in readable page text |
| Kimi K3.1 Pro | 2026-10-24 | $2/$10 | Listed closed until weights ship (promised by 2026-11-04) |
| MiniMax M3.1 Flash | 2026-10-19 | $0.15/$0.60 | |
| DeepSeek V4.1 Flash 1017 | 2026-10-17 | $0.15/$0.60 | Off-peak price |
| Mistral Large 4 | 2026-10-06 | $0.70/$2.10 | Weights released 2026-10-29 |
| Muse Spark Open | 2026-10-15 | none published | Table read directly from the Hugging Face card |
| Qwen3.8 27B | 2026-08-14 | none published | Date from a third-party tracker; HF repo created 2026-08-05 |
| MAI-Code-1.1-Flash | 2026-10-07 | none published | Microsoft states only "a quarter of the price of 1.0" |

### Corrected on existing rows

| Row | Field | Was | Now | Source |
|---|---|---|---|---|
| Claude Sonnet 5 | price | $3/$15 | $2/$10 | Anthropic pricing page: rise cancelled |
| GPT-5.6 Sol | price | $5/$30 | $4/$20 | OpenAI pricing page (promotional, through at least 2026-11-21) |
| GPT-5.6 Terra | price | $2.50/$15 | $2/$12 | OpenAI pricing page |
| GPT-5.6 Luna | price | $1/$6 | $0.20/$1.20 | OpenAI pricing page |
| DeepSeek V4 Pro | price | $0.50/$2.20 | $0.66/$1.98 | DeepSeek pricing page (off-peak) |
| GPT-6 Astra | HLE | ~63 estimate | 57.2 | OpenAI GPT-6 Astra post |
| Claude Fable 5.1 | GPQA, HLE | ~95, ~59 estimates | 93.7, 65.0 | OpenAI comparison table (not Anthropic's own page) |
| Claude Opus 5 | GPQA | ~95 estimate | 93.7 | OpenAI comparison table (not Anthropic's own page) |
| GPT-5.6 Sol | GPQA | ~88 estimate | 94.6 | OpenAI GPT-6 Astra post |
| Mistral Medium 3.5 | release date, context | 2026-03-15, 128K | 2026-04-28, 256K | Mistral docs |
| Gemini 3.5 Flash-Lite | context | blank | 1,048,576 | Google docs |

Marked superseded: Claude Opus 5, Sonnet 5, Haiku 4.5; GPT-5.6 Terra, GPT-5.6 Luna; Gemini 3.7 Flash
(deprecated, routed to 3.8 Flash), Gemini 3.1 Pro; Grok 4.6; Kimi K3; MiniMax M2.7; DeepSeek V4.1
Flash; Mistral Medium 3.5, Mistral Large 3 (both deprecated 2026-10-31); MAI-Code-1-Flash.

### Spot-checks

Confirmed against the vendor page: GPT-6 Astra GPQA 96; DeepSeek V4.1 Flash GPQA 90.9, TB 2.1 90.6,
HLE 63.9; Gemini 3.7 Flash TB 2.1 85.8; GLM-5.3 and GLM-5.3 Flash prices; Kimi K3 price; Grok 4.6
price; Opus 5 price.

### Could not confirm (left unchanged)

- **Figures inside chart images, not page text:** Opus 5 SWE-bench Verified 96, SWE-bench Pro 79.2,
  HLE 64.7 (OpenAI's table lists Opus 5 HLE at 63.6); Sonnet 5 SWE-bench Pro 63.2, TB 2.1 80.4,
  HLE 57.4; Gemini 3.7 Flash GPQA 90.4, MMMU-Pro 81.2; Grok 4.6 GPQA 94.9, TB 2.1 88.
- **Fable 5.1 SWE-bench Pro 81.2:** the expected Anthropic URL returned 404.
- **Prices with no published first-party figure:** Qwen 3.7 Max, Qwen3.7 Flash, Inkling, MAI-Thinking-1,
  Muse Spark 1.2, MiniMax M2.7, Mistral Medium 3.5, Mistral Large 3.
- **MAI-Thinking-1 date:** table says 2026-06-02; Microsoft's post is dated 2026-08-12.
- **Homepage-only source links** remain on vendor cells for GPT-5.6 Terra, GPT-5.6 Luna, Gemini 3.1
  Pro, Gemini 3.5 Flash-Lite, GLM-5.3, and Kimi K3.

### Considered but not added

- **No primary source readable:** DeepSeek V4.1 Flash Cyber, Qwen3.6 27B, MiMo V2.6 Pro and Flash,
  Step 5 Preview, GLM-5.3 Fast and FlashX, Ling 3.1 Flash, Muse Wonder 1.0, Microsoft-Decision-1.
- **MiniMax M3:** vendor page gives no release date, and `released` is required.
- **Nemotron 3.5 Super VL:** no context, price, or benchmark figures published.

## 2. Titles and page accuracy

### `/leaderboard/` (average position 6.4, 6.6K impressions, 1 click over 28 days)

- Title: `AI Model Leaderboard: LLM Benchmarks and API Pricing (Nov 2026)`. Month is derived from
  `last_updated`.
- Description rewritten. The old one advertised retired benchmarks (MMLU-Pro, MATH-500, Aider,
  tau-bench).
- Fixed the methodology line claiming every price was taken from a first-party API on the update
  date, and the notice example about which labs publish GPQA, which had stopped being true.
- Hovering a model name now shows its price or availability caveat.

### `/mcp/` (average position 76.7, 1.86K impressions, 0 clicks over 28 days)

- Title: `What Is MCP? Model Context Protocol and MCP Servers Explained`.
- At position 77 the title is not the constraint. The goal here was accuracy.
- Corrected: HTTP+SSE recommended as the remote transport (deprecated; now Streamable HTTP), governance
  (Agentic AI Foundation since December 2025), client support, server count, and the claim that a
  compromised server can't affect the application. Architecture diagram labels updated to match.

### Other

- `reviews/claude-sonnet-5-review.mdx`: removed the claim that the price rises to $3/$15.
- Homepage meta: "50 models" → "100+ models".

## 3. Open items

- `mcp/setup.mdx` and `mcp/building-servers.md` still teach the deprecated SSE transport.
- `leaderboard.astro` "Picking a model for production" still names Claude Sonnet 4.6, DeepSeek V3.1,
  and o3 as the author's defaults and claims 12 months of testing. Left for the author to update.
- Flip Kimi K3.1 Pro to `open` once weights ship (promised by 2026-11-04).
- Gemini 4 Argon rises to $4/$20 on 2026-12-01, and GPT-5.6 Sol's promotion runs through at least
  2026-11-21. Both rows need rechecking then.
- Reviews still need a "superseded" pointer: Opus 5, Sonnet 5, Grok 4.6, Kimi K3.

## Manual indexing needed

No new URLs. Both pages changed in place; optionally re-inspect in Search Console:

- https://agentguides.dev/leaderboard/
- https://agentguides.dev/mcp/
