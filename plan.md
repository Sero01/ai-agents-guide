# AdSense Approval Plan — agentguides.dev

## Rejection Reasons (from Google)

1. **Low value content** — pages are too thin, templated, and lack depth
2. **ads.txt not found** — missing required file at site root

---

## Current State

| Metric | Value |
|---|---|
| Total content pages | 17 (in `src/content/docs/`) + 1 landing page + 1 docs index |
| Total visible body words | ~3,500 (after removing frontmatter/JSON-LD) |
| Average visible words/page | ~200 |
| Pages with 0 code blocks | 2 (`frameworks/index.md`, `getting-started.md`) |
| Original images/diagrams | 0 (only ASCII art) |
| Privacy Policy page | Missing |
| About page | Missing |
| Contact / Terms page | Missing |
| ads.txt | Missing |
| Functional search on landing | No — redirects to `/getting-started/?q=...` which ignores the param |

### Per-Page Word Counts (visible body only, excluding frontmatter/JSON-LD)

| Page | Visible Words | Code Blocks | Status |
|---|---|---|---|
| `index.mdx` (docs splash) | ~50 | 0 | Navigation only |
| `getting-started.md` | ~120 | 0 | Table of contents only |
| `ai-agents/index.md` | ~200 | 3 | Thin |
| `ai-agents/patterns.md` | ~170 | 4 | Thin |
| `ai-agents/tokens-context.md` | ~200 | 4 | Thin |
| `agent-instructions/index.md` | ~200 | 1 | Thin |
| `agentic-workflows/index.md` | ~160 | 1 | Thin |
| `agentic-workflows/multi-agent.md` | ~200 | 5 | Thin |
| `code-examples/index.md` | ~150 + code | 2 | Moderate (good code) |
| `frameworks/index.md` | ~120 | 0 | Very thin — no code |
| `frameworks/langchain.md` | ~150 | 2 | Thin |
| `frameworks/crewai.md` | ~140 | 2 | Thin |
| `frameworks/autogen.md` | ~120 | 3 | Thinnest article |
| `mcp/index.md` | ~250 | 2 | Borderline |
| `mcp/setup.md` | ~280 | 8 | Borderline OK |
| `mcp/servers.md` | ~200 | 4 | Borderline |
| `mcp/building-servers.md` | ~300 + code | 10 | Best page |
| `prompt-engineering/index.md` | ~250 | 5 | Borderline |
| `tools-memory/index.md` | ~220 | 2 | Thin |

---

## Phase 1: Mandatory (AdSense Requirements)

### 1.1 Add `ads.txt`

Create `site/public/ads.txt`:
```
google.com, pub-7347042268747630, DIRECT, f08c47fec0942fa0
```

### 1.2 Add Privacy Policy page

Create `site/src/content/docs/privacy.md` (or a standalone page at `site/src/pages/privacy.astro`).
Must cover:
- What data is collected (Google Analytics if used, AdSense cookies)
- Use of cookies and third-party advertising
- User rights (GDPR/CCPA basics)
- Contact information

### 1.3 Add About page

Create a page explaining:
- Who runs the site (Parvez Ahmed — already in footer)
- Purpose of the guide
- Author credentials/background
- How content is maintained

### 1.4 Add Contact / Terms page

At minimum a contact email or form. Terms of Service is recommended.

### 1.5 Tone down superlative-stacked titles

Current titles use aggressive patterns Google flags:
- "The Most Complete Guide"
- "The Best Working Python Code"
- "#1 Free AI Guide"
- "Top Collection"

Change to factual, descriptive titles. Examples:
- `"What Are AI Agents? Concepts, Architecture & How They Work (2026)"` — this one is fine, keep it
- `"AI Agent Code Examples 2026 — The Best Working Python Code for Every Concept"` → `"AI Agent Code Examples — Python ReAct Agent, MCP Server & More"`
- `"LangChain for AI Agents — The Most Complete Guide & Code Examples (2026)"` → `"LangChain for AI Agents — Guide & Code Examples"`

Apply similar treatment to all `title` and `description` fields in frontmatter AND in `astro.config.mjs` meta tags.

---

## Phase 2: Content Expansion (Fixes "Low Value Content")

**Target: Every content page should have 800-1,500+ visible words of body text.**

### 2.1 Expand the 10 thinnest pages (under 200 visible words)

For each page, add:
- Deeper explanations of concepts (not just bullet points)
- Real-world use cases and examples
- Common mistakes / pitfalls section
- More substantial code examples with line-by-line explanations
- "When to use" and "when not to use" guidance
- Comparison with alternatives where relevant

Priority order (thinnest first):
1. `frameworks/autogen.md` (~120 words) — add full working example, comparison with CrewAI, real use cases
2. `frameworks/index.md` (~120 words) — add code comparison showing same task in each framework
3. `getting-started.md` (~120 words) — expand into a real beginner guide with prerequisites, first steps
4. `frameworks/crewai.md` (~140 words) — add deeper explanation, multiple examples, deployment tips
5. `frameworks/langchain.md` (~150 words) — add LCEL examples, RAG pipeline, agent memory
6. `agentic-workflows/index.md` (~160 words) — add workflow patterns, decision trees, real examples
7. `ai-agents/patterns.md` (~170 words) — expand each pattern to a full section with code
8. `code-examples/index.md` (~150 words) — add more standalone examples, not just links
9. `ai-agents/index.md` (~200 words) — expand architecture section, add real-world agent examples
10. `agent-instructions/index.md` (~200 words) — add template variations, real CLAUDE.md examples

### 2.2 Expand the 5 borderline pages (200-300 visible words)

These need less work but should still reach 800+ words:
1. `mcp/index.md`
2. `mcp/setup.md`
3. `mcp/servers.md`
4. `prompt-engineering/index.md`
5. `tools-memory/index.md`

### 2.3 Expand the best page further

`mcp/building-servers.md` (~300 words + code) — already the strongest. Expand to 1,200+ words with SSE transport example, testing strategies, deployment guide.

---

## Phase 3: Originality & Depth Signals

### 3.1 Fix the landing page search bar

The search input on `src/pages/index.astro` currently redirects to `/getting-started/?q=...` which doesn't process the query. Either:
- Wire it to Starlight's Pagefind search (preferred)
- Remove it entirely

### 3.2 Add original images/diagrams

Create at least 5 diagrams for key pages. Priority:
- `ai-agents/index.md` — agent loop diagram (replace ASCII art)
- `mcp/index.md` — MCP architecture diagram
- `agentic-workflows/index.md` — workflow topology diagrams
- `ai-agents/patterns.md` — pattern comparison visual
- `frameworks/index.md` — framework decision tree

Options: SVG diagrams, Mermaid rendered to images, or simple hand-drawn style illustrations.

### 3.3 Vary page structure

Break the repetitive template pattern (intro → H2 → bullets → code → See Also). Add:
- Case studies / real-world examples
- "I built X with this" narratives
- Benchmark comparisons
- FAQ sections with real depth (not just for JSON-LD)
- Step-by-step tutorials with numbered instructions
- Comparison tables with analysis

### 3.4 Add 3-5 new in-depth pages

Suggested new content:
1. **End-to-end tutorial**: "Build a Research Agent from Scratch" (2,000+ words)
2. **Comparison**: "LangChain vs CrewAI vs AutoGen — Honest Comparison with Code" (1,500+ words)
3. **Practical guide**: "Deploying AI Agents to Production" (1,500+ words)
4. **Deep dive**: "Understanding Token Costs and Optimizing Agent Spend" (1,000+ words)
5. **Reference**: "Complete MCP Tool Schema Reference" (1,000+ words)

---

## Phase 4: Final Checks & Reapply

### 4.1 Pre-submission checklist

- [ ] `ads.txt` returns 200 at `https://agentguides.dev/ads.txt`
- [ ] Privacy Policy page exists and is linked from footer
- [ ] About page exists and is linked from footer
- [ ] No page has fewer than 800 visible words
- [ ] Total site word count exceeds 20,000 visible words
- [ ] At least 5 pages have original images/diagrams
- [ ] Titles are factual, not superlative-stacked
- [ ] Search bar on landing page works or is removed
- [ ] Site builds without errors
- [ ] All pages are in sitemap
- [ ] Light mode renders correctly (fixed in commit 505d66f)

### 4.2 Deploy and wait

- Push to main, deploy via Cloudflare Pages
- Wait 2-4 weeks for Google to re-crawl
- Resubmit AdSense application

---

## Files to Modify (Summary)

| File | Action |
|---|---|
| `site/public/ads.txt` | **Create** |
| `site/src/pages/privacy.astro` (or `src/content/docs/privacy.md`) | **Create** |
| `site/src/pages/about.astro` (or `src/content/docs/about.md`) | **Create** |
| `site/src/pages/index.astro` | Fix search bar |
| `site/astro.config.mjs` | Tone down meta tag titles/descriptions |
| `site/src/content/docs/*.md` (all 17 files) | Expand content, fix titles |
| `site/src/content/docs/` (new files) | Add 3-5 new in-depth pages |
| `site/public/` or `site/src/assets/` | Add diagram images |

---

## Success Criteria

| Metric | Current | Target |
|---|---|---|
| Visible body words (total) | ~3,500 | 20,000+ |
| Minimum words per page | ~50 | 800+ |
| Pages with original images | 0 | 5+ |
| Required legal pages | 0 | 2-3 |
| ads.txt | Missing | Present |
| Superlative-stacked titles | 15+ | 0 |
