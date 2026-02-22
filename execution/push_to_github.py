#!/usr/bin/env python3
"""
Create a GitHub repo and push local project files via the GitHub API.
HTTPS git push does not work in this environment — uses API calls instead.
See directives/push_to_github.md for full usage.

NOTE: This script is a reference/orchestration guide. In practice, the MCP
GitHub tools are called directly by the agent (Claude). This script documents
the exact sequence and handles the empty-repo bootstrapping problem.

Requires: GITHUB_TOKEN environment variable, or run via Claude with MCP access.
"""

import argparse
import base64
import json
import os
import sys
import urllib.request
import urllib.error

GITHUB_USER = "Sero01"
API_BASE = "https://api.github.com"

SKIP_PATTERNS = {
    "node_modules", ".git", "__pycache__", ".tmp",
    ".env", "credentials.json", "token.json", "cloudflared"
}
SKIP_EXTENSIONS = {".pyc", ".mp4", ".mkv", ".avi", ".mov"}


def gh_request(method, path, body=None, token=None):
    url = f"{API_BASE}{path}"
    data = json.dumps(body).encode() if body else None
    headers = {
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": GITHUB_USER,
    }
    if token:
        headers["Authorization"] = f"Bearer {token}"

    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req) as resp:
            return json.loads(resp.read())
    except urllib.error.HTTPError as e:
        body = e.read().decode()
        print(f"GitHub API error {e.code}: {body}", file=sys.stderr)
        sys.exit(1)


def collect_files(project_dir):
    """Walk the project directory and collect file paths + base64 content."""
    files = []
    for root, dirs, filenames in os.walk(project_dir):
        # Prune skip directories in-place
        dirs[:] = [d for d in dirs if d not in SKIP_PATTERNS]
        for fname in filenames:
            if fname in SKIP_PATTERNS:
                continue
            if any(fname.endswith(ext) for ext in SKIP_EXTENSIONS):
                continue
            abs_path = os.path.join(root, fname)
            rel_path = os.path.relpath(abs_path, project_dir)
            try:
                with open(abs_path, "rb") as f:
                    content_b64 = base64.b64encode(f.read()).decode()
                files.append({"path": rel_path, "content": content_b64})
            except (OSError, IOError) as e:
                print(f"  Skipping {rel_path}: {e}")
    return files


def main():
    parser = argparse.ArgumentParser(description="Push project to GitHub via API")
    parser.add_argument("--repo", required=True, help="Repository name")
    parser.add_argument("--description", default="", help="Repository description")
    parser.add_argument("--dir", required=True, help="Project directory to push")
    parser.add_argument("--private", action="store_true", help="Make repo private")
    args = parser.parse_args()

    token = os.environ.get("GITHUB_TOKEN")
    if not token:
        print("ERROR: GITHUB_TOKEN environment variable not set.", file=sys.stderr)
        print("In Claude sessions, use MCP tools directly instead of this script.", file=sys.stderr)
        sys.exit(1)

    project_dir = os.path.abspath(args.dir)

    # Step 1: Create the repo
    print(f"[1/3] Creating GitHub repo: {GITHUB_USER}/{args.repo}")
    repo = gh_request("POST", f"/user/repos", body={
        "name": args.repo,
        "description": args.description,
        "private": args.private,
        "auto_init": False,
    }, token=token)
    print(f"  Created: {repo['html_url']}")

    # Step 2: Collect files
    print(f"[2/3] Collecting files from {project_dir}")
    files = collect_files(project_dir)
    print(f"  Found {len(files)} files")

    if not files:
        print("ERROR: No files to push.", file=sys.stderr)
        sys.exit(1)

    # Step 3: Push files
    # IMPORTANT: push_files (Trees API batch) fails on empty repos.
    # Seed with first file via create/update, then batch the rest.
    print(f"[3/3] Pushing files to GitHub")

    # Seed the repo with the first file (creates the main branch)
    first = files[0]
    gh_request("PUT", f"/repos/{GITHUB_USER}/{args.repo}/contents/{first['path']}", body={
        "message": "Initial commit",
        "content": first["content"],
        "branch": "main",
    }, token=token)
    print(f"  Seeded: {first['path']}")

    # Push remaining files one by one
    for f in files[1:]:
        gh_request("PUT", f"/repos/{GITHUB_USER}/{args.repo}/contents/{f['path']}", body={
            "message": "Initial commit",
            "content": f["content"],
            "branch": "main",
        }, token=token)
        print(f"  Pushed: {f['path']}")

    print(f"\n✓ Done. Repo live at: https://github.com/{GITHUB_USER}/{args.repo}")


if __name__ == "__main__":
    main()
