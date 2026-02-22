# Directive: LinkedIn Job Scraper

## Goal
Scrape job postings from LinkedIn for specified locations and save to Google Sheets.

## Inputs
- Search query (e.g., "AI Engineer", "ML Engineer")
- Locations: Bangalore, Hyderabad
- Max results per location (default: 25)
- Google Sheet ID (from URL)

## Tools / Scripts
- `execution/job_scraper.py` — main scraping script

## Steps

### 1. Verify environment
Check that required packages are available:
```bash
pip show linkedin-jobs-scraper requests google-auth google-auth-oauthlib google-api-python-client
```
Install missing packages if needed.

### 2. Run the scraper
```bash
python execution/job_scraper.py --query "AI Engineer" --sheet-id YOUR_SHEET_ID
```

### 3. Verify output
Check the Google Sheet to confirm data was written.

## Outputs
- Google Sheet with columns: Title, Company, Location, Date Posted, Job URL
- Each location gets its own tab ("Bangalore", "Hyderabad")

## Edge Cases
- **Rate limiting**: LinkedIn may block rapid requests. Add delay between requests if needed.
- **Auth errors**: Google OAuth token may need refresh. Delete `token.json` and re-run.
- **No results**: Try broader search terms or check if LinkedIn is blocking the IP.

## Learnings
- LinkedIn scraping is fragile. Use `linkedin-jobs-scraper` package which handles browser automation.
- Google Sheets API v4 required; service account OR OAuth both work.
