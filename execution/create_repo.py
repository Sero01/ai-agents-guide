#!/usr/bin/env python3
"""
Layer 3 Execution Script: Create Local Git Repository
Directive: directives/create_repo.md
"""

import subprocess
import sys
import os
from pathlib import Path


def run(cmd: list[str], cwd: str = None) -> tuple[int, str, str]:
    """Run a shell command and return (returncode, stdout, stderr)."""
    result = subprocess.run(cmd, capture_output=True, text=True, cwd=cwd)
    return result.returncode, result.stdout.strip(), result.stderr.strip()


def create_repo(project_dir: str = ".", commit_message: str = "Initial commit") -> None:
    project_dir = str(Path(project_dir).resolve())
    print(f"Working in: {project_dir}")

    # Step 1: Check if already a git repo
    code, out, err = run(["git", "status"], cwd=project_dir)
    if code == 0:
        print("Already a git repository. Skipping init.")
    else:
        # Step 2: Initialize
        print("Initializing git repository...")
        run(["git", "init"], cwd=project_dir)
        run(["git", "branch", "-M", "main"], cwd=project_dir)
        print("Initialized with branch 'main'.")

    # Step 3: Ensure .gitignore entries
    gitignore_path = Path(project_dir) / ".gitignore"
    required_entries = [
        "node_modules/",
        "__pycache__/",
        "*.pyc",
        ".env",
        "credentials.json",
        "token.json",
        ".tmp/",
    ]
    existing = gitignore_path.read_text() if gitignore_path.exists() else ""
    missing = [e for e in required_entries if e not in existing]
    if missing:
        with gitignore_path.open("a") as f:
            f.write("\n".join(missing) + "\n")
        print(f"Added to .gitignore: {missing}")
    else:
        print(".gitignore is up to date.")

    # Step 4: Stage and commit
    run(["git", "add", "-A"], cwd=project_dir)
    code, out, err = run(["git", "commit", "-m", commit_message], cwd=project_dir)
    if code == 0:
        print(f"Committed: {commit_message}")
    else:
        print(f"Commit skipped or failed: {err}")


if __name__ == "__main__":
    project_dir = sys.argv[1] if len(sys.argv) > 1 else "."
    commit_msg = sys.argv[2] if len(sys.argv) > 2 else "Initial commit"
    create_repo(project_dir, commit_msg)
