# Create Git Repository

Initializes a local git repository in a given project directory, creates a `.gitignore`, and makes an initial commit.

## Inputs

- **project_dir**: Absolute path to the project directory
- **commit_message**: Initial commit message (default: `"Initial commit"`)
- **gitignore_extras**: Additional patterns to append to `.gitignore` (optional)

## Outputs

- Local git repo initialized on `main` branch
- `.gitignore` created
- Initial commit made, ready to push

## Execution

```bash
python execution/create_repo.py \
  --dir "/path/to/project" \
  --message "Initial commit: my project"
```

## Notes

- Git global identity is not set in this environment. The script sets identity locally per-repo using `git config` (not `--global`).
- Default identity used: `name = Sero01`, `email = sero01@users.noreply.github.com`
- Always branch to `main` (not `master`) via `git branch -m main`
- Standard `.gitignore` includes: `node_modules/`, `__pycache__/`, `*.pyc`, `.env`, `*.json` (credentials), `.tmp/`
- Do NOT include `movies/`, large binaries, or credential files in the commit

## Edge Cases

- If the directory already has a `.git/` folder, skip `git init`
- If port or process conflicts arise during testing, check with `lsof -ti:<port>` first
