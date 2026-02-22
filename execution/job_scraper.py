#!/usr/bin/env python3
"""
Layer 3 Execution Script: LinkedIn Job Scraper
Directive: directives/job_scraper.md
"""

import argparse
import time
from datetime import datetime

try:
    from linkedin_jobs_scraper import LinkedinScraper
    from linkedin_jobs_scraper.events import Events, EventData
    from linkedin_jobs_scraper.query import Query, QueryOptions, QueryFilters
    from linkedin_jobs_scraper.filters import RelevanceFilters, TimeFilters
except ImportError:
    print("ERROR: linkedin-jobs-scraper not installed. Run: pip install linkedin-jobs-scraper")
    exit(1)

try:
    from googleapiclient.discovery import build
    from google.oauth2.credentials import Credentials
    from google_auth_oauthlib.flow import InstalledAppFlow
    from google.auth.transport.requests import Request
except ImportError:
    print("ERROR: Google API packages not installed.")
    print("Run: pip install google-auth google-auth-oauthlib google-api-python-client")
    exit(1)

import os
import json

SCOPES = ["https://www.googleapis.com/auth/spreadsheets"]
CREDS_FILE = "/home/parvez/.config/gdrive-mcp/credentials.json"
TOKEN_FILE = "/home/parvez/.config/gdrive-mcp/token.json"


def get_sheets_service():
    """Authenticate and return Google Sheets service."""
    creds = None
    if os.path.exists(TOKEN_FILE):
        creds = Credentials.from_authorized_user_file(TOKEN_FILE, SCOPES)
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(CREDS_FILE, SCOPES)
            creds = flow.run_local_server(port=0)
        with open(TOKEN_FILE, "w") as token:
            token.write(creds.to_json())
    return build("sheets", "v4", credentials=creds)


def scrape_jobs(query: str, location: str, max_results: int = 25) -> list[dict]:
    """Scrape LinkedIn jobs for a query + location."""
    jobs = []

    def on_data(data: EventData):
        jobs.append({
            "title": data.title,
            "company": data.company,
            "location": data.location,
            "date": data.date,
            "url": data.link,
        })

    scraper = LinkedinScraper(
        chrome_executable_path=None,
        headless=True,
        max_workers=1,
        slow_mo=0.5,
    )
    scraper.on(Events.DATA, on_data)

    queries = [
        Query(
            query=query,
            options=QueryOptions(
                locations=[location],
                limit=max_results,
                filters=QueryFilters(
                    relevance=RelevanceFilters.RECENT,
                    time=TimeFilters.MONTH,
                )
            )
        )
    ]
    scraper.run(queries)
    return jobs


def write_to_sheet(service, sheet_id: str, tab_name: str, jobs: list[dict]) -> None:
    """Write job data to a Google Sheet tab."""
    # Ensure tab exists
    spreadsheet = service.spreadsheets().get(spreadsheetId=sheet_id).execute()
    existing_tabs = [s["properties"]["title"] for s in spreadsheet["sheets"]]

    if tab_name not in existing_tabs:
        body = {"requests": [{"addSheet": {"properties": {"title": tab_name}}}]}
        service.spreadsheets().batchUpdate(spreadsheetId=sheet_id, body=body).execute()

    # Write header + rows
    header = [["Title", "Company", "Location", "Date Posted", "Job URL"]]
    rows = [[j["title"], j["company"], j["location"], j["date"], j["url"]] for j in jobs]
    values = header + rows

    service.spreadsheets().values().update(
        spreadsheetId=sheet_id,
        range=f"{tab_name}!A1",
        valueInputOption="RAW",
        body={"values": values},
    ).execute()
    print(f"Written {len(jobs)} jobs to tab '{tab_name}'.")


def main():
    parser = argparse.ArgumentParser(description="Scrape LinkedIn jobs to Google Sheets")
    parser.add_argument("--query", required=True, help="Job search query")
    parser.add_argument("--sheet-id", required=True, help="Google Sheet ID")
    parser.add_argument("--max", type=int, default=25, help="Max results per location")
    args = parser.parse_args()

    service = get_sheets_service()
    locations = ["Bangalore, Karnataka, India", "Hyderabad, Telangana, India"]
    tab_names = ["Bangalore", "Hyderabad"]

    for location, tab in zip(locations, tab_names):
        print(f"Scraping {args.query} in {location}...")
        jobs = scrape_jobs(args.query, location, args.max)
        print(f"Found {len(jobs)} jobs.")
        write_to_sheet(service, args.sheet_id, tab, jobs)
        time.sleep(2)  # Be polite

    print("Done.")


if __name__ == "__main__":
    main()
