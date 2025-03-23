# IRONWOOD Git Workflow

This document outlines the recommended Git workflow for the IRONWOOD project, with specific attention to handling large files and maintaining a clean repository.

## Branch Strategy

IRONWOOD uses a feature-based branching strategy:

- `master` - Main stable branch, always deployable
- `feature/xxx` - Feature branches for new development
- `bugfix/xxx` - Branches for bug fixes
- `release/x.x.x` - Release branches when preparing a new version

## Working with Large Files

IRONWOOD uses Git LFS (Large File Storage) to manage large files. This keeps the repository manageable while still tracking large binary files.

### Setup Git LFS

If you haven't set up Git LFS:

```bash
# Install Git LFS
# macOS: brew install git-lfs
# Windows: download from https://git-lfs.github.com/
# Linux: apt install git-lfs

# Initialize Git LFS
git lfs install

# Verify installation
git lfs env
```

### Large File Types Already Tracked

IRONWOOD has configured LFS to track the following file types:

```
*.asar
*.node
*.dmg
**/Electron Framework
```

### Adding New File Types to LFS

If you need to add new file types to Git LFS:

```bash
git lfs track "*.your-extension"
git add .gitattributes
git commit -m "Track *.your-extension files using Git LFS"
```

### Pulling Large Files

When cloning or pulling from the repository:

```bash
# After regular git clone or pull
git lfs pull
```

## Commit Best Practices

### Commit Message Format

Use clear, descriptive commit messages:

```
[Component/Feature] Brief description of change

More detailed explanation if needed. Explain the problem this commit 
is solving. Focus on why you made the change, not just what the change is.
```

Examples:
- `[Dashboard] Add property analytics chart`
- `[API] Fix property data fetching performance issue`

### Commit Frequency

- Commit often, keeping changes focused and atomic
- Each commit should represent a single logical change
- Avoid mixing unrelated changes in a single commit

## Branch Workflow

### Starting a New Feature

```bash
# Make sure you're on master and up to date
git checkout master
git pull

# Create a new feature branch
git checkout -b feature/your-feature-name
```

### Making Changes

As you work:

```bash
# Stage your changes
git add .

# Commit regularly with descriptive messages
git commit -m "[Component] Description of changes"

# Push to the remote repository
git push -u origin feature/your-feature-name
```

### Updating Your Branch

Keep your branch updated with changes from master:

```bash
git checkout master
git pull
git checkout feature/your-feature-name
git merge master
# Resolve any conflicts
```

### Completing a Feature

When your feature is complete:

1. Create a pull request on GitHub
2. Request code review
3. Address any feedback
4. Once approved, merge into master

## Repository Maintenance

### Cleaning up Large Files

If the repository has tracked large files that should be using LFS:

```bash
# First, ensure they're tracked with LFS
git lfs track "*.large-file-type"

# Remove them from Git history
git filter-branch --force --index-filter \
  "git rm -r --cached --ignore-unmatch path/to/large-files" \
  --prune-empty --tag-name-filter cat -- --all

# Force push the cleaned history
git push origin --force
```

### Checking for Large Files

To find large files in the repository:

```bash
# Find files larger than 50MB
find . -type f -size +50M | grep -v node_modules | grep -v .git
```

## Git Hooks

IRONWOOD uses pre-commit hooks to ensure code quality. These are installed automatically when you run the setup script.

### Available Hooks

- Lint check - Verifies code style before commit
- Large file check - Warns about committing large files without LFS
- Dependency check - Ensures package.json is consistent

### Skipping Hooks (Rarely)

In rare cases where you need to bypass hooks:

```bash
git commit -m "Your message" --no-verify
```

**Note:** Only use this when absolutely necessary, as it bypasses important quality checks.

## Pull Request Guidelines

A good pull request should:

1. Have a clear, descriptive title
2. Include a detailed description of changes
3. Reference any related issues
4. Include screenshots for UI changes
5. Pass all CI checks
6. Be reviewed by at least one team member

By following these guidelines, we keep the IRONWOOD repository clean, efficient, and maintainable. 