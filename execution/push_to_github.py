#!/usr/bin/env python3
"""
Layer 3 Execution Script: Push to GitHub
Directive: directives/push_to_github.md

NOTE: This script is a reference implementation.
In practice, use MCP tools directly from the orchestration layer.
MCP tools handle auth automatically and avoid HTTPS credential issues.
"""

import subprocess
import sys
from pathlib import Path


def push_via_mcp_instructions():
    """
    Print instructions for pushing via MCP tools.
    This is the recommended approach in this environment.
    """
    print("""
To push to GitHub, use MCP tools from the orchestration layer:

1. Create repository (if needed):
   mcp__github__create_repository(name=REPO_NAME, private=false, auto_init=false)

2. Seed with one file (required for empty repos):
   mcp__github__create_or_update_file(
     owner="Sero01",
     repo=REPO_NAME,
     path="README.md",
     content="# REPO_NAME",
     message="Initial commit"
   )

3. Push all files in batches of ~25:
   mcp__github__push_files(
     owner="Sero01",
     repo=REPO_NAME,
     branch="main",
     message="Add project files",
     files=[{"path": ..., "content": ...}, ...]
   )

Note: push_files will fail on an empty repo. Always seed first.
    """)


if __name__ == "__main__":
    push_via_mcp_instructions()
