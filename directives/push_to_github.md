# Push Project to GitHub

Creates a new GitHub repository under the `Sero01` account and pushes all project files to it.

## Inputs

- **repo_name**: GitHub repository name (e.g. `watchparty`)
- **description**: Short repo description
- **private**: `true` or `false` (default: `false`)
- **project_dir**: Local directory containing the committed git repo
- **files**: List of files to push (path + content)

## Outputs

- New repo created at `https://github.com/Sero01/<repo_name>`
- All files visible on GitHub

## Execution

```bash
python execution/push_to_github.py \
  --repo "my-project" \
  --description "What this project does" \
  --dir "/path/to/project"
```

## How It Works

HTTPS `git push` does NOT work in this environment (no credential store). Use the GitHub MCP tools instead:

### Step 1 — Create the repo
Use `mcp__github__create_repository` with `owner=Sero01`.

### Step 2 — Push files

**Critical:** GitHub's API rejects `push_files` on a brand-new empty repo. Work around:

1. Push the **first file** (e.g. `README.md`) using `mcp__github__create_or_update_file` — this initializes the repo and creates the `main` branch.
2. Push **remaining files** one at a time using `mcp__github__create_or_update_file`, or batch them with `mcp__github__push_files` once the branch exists.

For updates to existing files, `mcp__github__create_or_update_file` requires the current file `sha` (get it from a prior `get_file_contents` call).

### File content encoding

`mcp__github__create_or_update_file` requires content as **base64**. Encode before calling:
```python
import base64
content_b64 = base64.b64encode(file_content.encode()).decode()
```

## Notes

- GitHub username: `Sero01`
- Default branch: `main`
- Never commit: `.env`, `credentials.json`, `token.json`, `node_modules/`, `movies/`, large binaries
- `push_files` works fine for subsequent pushes once a branch exists — use it to batch multiple files efficiently
- Always add a `.gitignore` before the initial commit

## Edge Cases

- **Empty repo + push_files** → fails with `Conflict: Git Repository is empty`. Fix: seed with one file via `create_or_update_file` first.
- **HTTPS push** → fails silently with `No such device or address`. Always use MCP tools.
- **File not found on update** → need the file's `sha`. Call `get_file_contents` to retrieve it first.
