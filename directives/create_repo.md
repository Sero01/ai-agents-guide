# Directive: Create Local Git Repository

## Goal
Initialize a new local git repository for this project with proper configuration.

## Inputs
- Project directory path (default: current working directory)
- Repository name
- Initial commit message (default: "Initial commit")

## Steps

### 1. Check if git is already initialized
```bash
git status
```
If already a git repo, skip to step 4.

### 2. Initialize the repository
```bash
git init
git branch -M main
```

### 3. Create .gitignore
Ensure these entries are present:
```
node_modules/
__pycache__/
*.pyc
.env
credentials.json
token.json
.tmp/
```

### 4. Stage and commit
```bash
git add -A
git commit -m "Initial commit"
```

## Outputs
- Initialized git repository with `main` branch
- `.gitignore` with standard exclusions
- Initial commit containing all non-ignored files

## Edge Cases
- **Already initialized**: Check with `git status` first; skip `git init` if already a repo
- **Empty directory**: Still initialize; make an empty initial commit if no files exist
- **Existing .gitignore**: Append missing entries rather than overwriting
