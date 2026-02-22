#!/usr/bin/env python3
"""
Initialize a local git repository with a .gitignore and initial commit.
See directives/create_repo.md for full usage.
"""

import argparse
import os
import subprocess
import sys

GITHUB_USER = "Sero01"
GITHUB_EMAIL = "sero01@users.noreply.github.com"

DEFAULT_GITIGNORE = """\
node_modules/
__pycache__/
*.pyc
.env
credentials.json
token.json
.tmp/
"""

def run(cmd, cwd):
    result = subprocess.run(cmd, cwd=cwd, capture_output=True, text=True)
    if result.returncode != 0:
        print(f"ERROR: {' '.join(cmd)}\n{result.stderr.strip()}", file=sys.stderr)
        sys.exit(1)
    return result.stdout.strip()

def main():
    parser = argparse.ArgumentParser(description="Initialize a local git repo")
    parser.add_argument("--dir", required=True, help="Project directory path")
    parser.add_argument("--message", default="Initial commit", help="Commit message")
    parser.add_argument("--gitignore-extras", nargs="*", default=[], help="Extra .gitignore patterns")
    args = parser.parse_args()

    project_dir = os.path.abspath(args.dir)
    if not os.path.isdir(project_dir):
        print(f"ERROR: Directory not found: {project_dir}", file=sys.stderr)
        sys.exit(1)

    # Write .gitignore
    gitignore_path = os.path.join(project_dir, ".gitignore")
    if not os.path.exists(gitignore_path):
        extra = "\n".join(args.gitignore_extras)
        with open(gitignore_path, "w") as f:
            f.write(DEFAULT_GITIGNORE)
            if extra:
                f.write("\n# Project-specific\n" + extra + "\n")
        print(f"  Created .gitignore")
    else:
        print(f"  .gitignore already exists, skipping")

    # Init repo if needed
    git_dir = os.path.join(project_dir, ".git")
    if not os.path.isdir(git_dir):
        run(["git", "init"], cwd=project_dir)
        print(f"  Initialized git repo")
    else:
        print(f"  Git repo already exists, skipping init")

    # Set local identity (global not configured in this environment)
    run(["git", "config", "user.name", GITHUB_USER], cwd=project_dir)
    run(["git", "config", "user.email", GITHUB_EMAIL], cwd=project_dir)

    # Ensure we're on main
    run(["git", "branch", "-M", "main"], cwd=project_dir)

    # Stage and commit
    run(["git", "add", "."], cwd=project_dir)

    # Check if there's anything to commit
    status = subprocess.run(
        ["git", "status", "--porcelain"],
        cwd=project_dir, capture_output=True, text=True
    )
    if not status.stdout.strip():
        print("  Nothing to commit — working tree clean")
    else:
        run(["git", "commit", "-m", args.message], cwd=project_dir)
        print(f"  Committed: {args.message}")

    print(f"\n✓ Repo ready at: {project_dir}")
    print(f"  Next: run push_to_github.py to create the GitHub repo and push")

if __name__ == "__main__":
    main()
