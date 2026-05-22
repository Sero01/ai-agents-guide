# Search Console Report — agentguides.dev
**Retrieved:** 2026-04-29  
**Period:** Last 28 days

---

## Indexing Status

| URL | Verdict | Coverage | Last Crawled |
|-----|---------|----------|--------------|
| https://agentguides.dev/ | PASS | Submitted and indexed | 2026-04-19 |
| https://agentguides.dev/ai-agents/ | NEUTRAL | URL is unknown to Google | never |
| https://agentguides.dev/agentic-workflows/ | NEUTRAL | URL is unknown to Google | never |
| https://agentguides.dev/mcp/ | NEUTRAL | URL is unknown to Google | never |

---

## Sitemaps

None submitted.

---

## Top Pages by Clicks (Last 28 Days)

| URL | Clicks | Impressions | CTR | Avg Position |
|-----|--------|-------------|-----|--------------|
| / | 1 | 13 | 7.7% | 4.5 |
| /about/ | 0 | 4 | 0.0% | 5.5 |
| /ai-agents/tokens-context/ | 0 | 63 | 0.0% | 8.7 |
| /code-examples/ | 0 | 13 | 0.0% | 12.3 |
| /getting-started/ | 0 | 8 | 0.0% | 5.8 |
| /prompt-engineering/ | 0 | 121 | 0.0% | 49.6 |
| /tools-memory/ | 0 | 59 | 0.0% | 17.2 |

---

## Non-Indexed URLs (Manual Findings)

| URL | Reason |
|-----|--------|
| https://agentguides.dev/ai-agents/tokens-context/ | Crawled — currently not indexed |
| http://agentguides.dev/ | Page with redirect |

- `tokens-context/` was crawled but Google chose not to index it — typically caused by thin content, duplicate content, or low quality signals.
- The HTTP (non-HTTPS) homepage redirects to HTTPS; Google follows the redirect but does not index the HTTP URL itself.

---

## Key Findings

- Only the HTTPS homepage is indexed; 3 of 4 key content pages are unknown to Google.
- No sitemap has been submitted — Google cannot discover subpages.
- `/ai-agents/tokens-context/` was crawled but not indexed despite ranking at position 8.7 with 63 impressions.
- `/prompt-engineering/` has the most impressions (121) but ranks at position 49 — not yet on page 1.
- HTTP homepage (`http://agentguides.dev/`) is excluded from index due to redirect to HTTPS — expected behavior, no action needed.

## Recommended Actions

1. Submit sitemap to Search Console: `https://agentguides.dev/sitemap-index.xml`
2. Improve content quality on `/ai-agents/tokens-context/` to get it indexed — it already has search visibility
3. Request indexing for `/ai-agents/`, `/agentic-workflows/`, `/mcp/` via URL Inspection tool
4. Improve content on `/prompt-engineering/` to push from position 49 toward page 1
