# Job Listings Scraper

Scrapes LinkedIn for software/tech jobs in Bangalore & Hyderabad filtered by entry-level experience (1-2 years), and saves results to a new Google Sheet.

## Inputs

- **Keywords**: Search queries (default: "software developer", "AI automation engineer", "machine learning engineer")
- **Locations**: Cities to search (default: Bangalore + Hyderabad)
- **Max Pages**: Pages per query, 25 results/page (default: 3 → up to 75 jobs/query)
- **Experience Filter**: LinkedIn filter `f_E` (default: `2,3` = Entry Level + Associate)

## Execution Tools

### Run Scraper
```bash
python execution/job_scraper.py
```

Uses LinkedIn guest API (no login, no Apify cost). Creates a new Google Sheet named `Job Listings — Bangalore/Hyderabad (YYYY-MM-DD)` with formatted output.

To customize search queries or locations, edit `SEARCH_QUERIES` and `PAGES_PER_QUERY` at the top of `execution/job_scraper.py`.

## Output

New Google Sheet (URL printed at end of run) with columns:

| Column | Description |
|--------|-------------|
| Company | Employer name |
| Job Title | Role title |
| Location | City |
| Salary | If listed |
| Experience Required | Extracted from description (e.g. "1-2 years") |
| Key Skills | Up to 10 skills found in description |
| Apply Link | Direct LinkedIn job listing URL |
| Job Description (preview) | First 500 chars |
| Date Scraped | Timestamp |

## Edge Cases

- **Rate limited by LinkedIn**: Script uses 1.5s delay between detail fetches and 0.8s between search pages. If blocked, wait 15-30 minutes and retry.
- **No jobs found**: LinkedIn guest API may return 0 results for certain queries. Broaden keywords or try different location strings (e.g. "Bengaluru" instead of "Bangalore").
- **OAuth token expired**: Script auto-refreshes token using `CREDS_FILE` and `KEYS_FILE` paths (hardcoded in script, no `.env` needed).
- **Empty experience field**: Regex extraction only works if job description explicitly states years. Many postings omit this — use Job Title + Skills columns to judge seniority.

## Learnings

- Credentials are at `/home/parvez/.config/gdrive-mcp/` — no `.env` setup required.
- LinkedIn guest API endpoint: `jobs-guest/jobs/api/seeMoreJobPostings/search` with `f_E=2,3` for entry/associate level.
- Script deduplicates across all query+location combos automatically.
- `uv run execution/job_scraper.py` works (inline script dependencies declared at top of file).
- Typical runtime: 3-5 minutes for ~200-400 unique job IDs across 6 search queries.
