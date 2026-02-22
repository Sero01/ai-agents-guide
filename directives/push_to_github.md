# Directive: Push Project to GitHub

## Goal
Push the current local project to a GitHub repository using MCP tools.

## Why MCP tools (not `git push`)
HTTPS git push requires a Personal Access Token in the remote URL, which is cumbersome to set up in this environment. MCP tools (`mcp__github__push_files`) handle auth automatically.

## Inputs
- GitHub username: `Sero01`
- Repository name
- Branch: `main`
- Files to push (path + content pairs)

## Steps

### 1. Ensure repository exists
If the repo doesn’t exist yet, create it:
```
mcp__github__create_repository(name=REPO_NAME, private=false, auto_init=false)
```

### 2. Seed the repo (if empty)
Empty repos reject `push_files`. Create one file first:
```
mcp__github__create_or_update_file(
  owner="Sero01",
  repo=REPO_NAME,
  path="README.md",
  content="# " + REPO_NAME,
  message="Initial commit"
)
```

### 3. Push all files in batches
Max ~30 files per batch to avoid payload limits:
```
mcp__github__push_files(
  owner="Sero01",
  repo=REPO_NAME,
  branch="main",
  message="Add project files",
  files=[{path: ..., content: ...}, ...]
)
```

## Outputs
- All project files pushed to `github.com/Sero01/REPO_NAME`
- Files accessible at `https://github.com/Sero01/REPO_NAME`

## Edge Cases
- **Empty repo rejects push_files**: Always seed with `create_or_update_file` first
- **Payload too large**: Split into batches of 20–30 files
- **File not found locally**: Skip silently and log which files were skipped
- **Binary files**: Skip binary files (images, etc.) unless explicitly needed
