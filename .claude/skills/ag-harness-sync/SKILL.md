---
name: ag-harness-sync
description: Use this skill to sync and manage agent harness versions. Supports pulling updates from the remote kit repo (ag-update logic) and publishing local improvements to the remote kit repo (ag-publish logic).
metadata:
  author: agent-skills
  version: "2.0.0"
---

# Harness Sync & Version Management (ag-harness-sync)

Use this skill to sync the agent harness layer. It supports two flows:
1. **Pulling Updates (Update Flow):** For users to update their local project's harness from the remote kit repository.
2. **Publishing Improvements (Publish Flow):** For maintainers to publish local harness changes back to the remote kit repository.

## When to Apply

- When pulling latest harness improvements into your project.
- When publishing your local changes to the shared remote kit repo.

## How to Use

### Workflow 1: Pulling Updates (Update Flow)

Follow these steps exactly. Do NOT skip the dry-run or confirmation step.

#### Step 1: Check Worktree Status

Run `git status --porcelain` in the project root.
- If output is non-empty: **warn** the user that they have uncommitted changes and suggest `git stash` or committing first. **Do not block** -- continue after warning.
- If output is empty: proceed silently.

#### Step 2: Read Current Version

Read the file `.ag-version` in the project root.
- If it exists: store its contents as `currentVersion` (a semver string like `2.0.4`).
- If it does not exist: set `currentVersion` to `"0.0.0"` (treat as first update).

#### Step 3: Clone Remote Repository

```bash
TMPDIR="/tmp/ag-update-$(date +%s)"
git clone --depth 1 https://github.com/ngxccc/agent-skills-kit.git "$TMPDIR"
```

If the clone fails (network error, auth error, repo not found):
- Print the error message.
- Clean up the temp directory if it was partially created.
- **Stop.** Do not proceed.

#### Step 4: Resolve Remote Manifest

Run the resolver script from the cloned repo:
```bash
node "$TMPDIR/resolve-manifest.mjs" --root "$TMPDIR" --json
```

Parse the JSON output to extract:
- `files` (string[]) -- resolved managed file paths
- `merge` (string[]) -- files where user customizations are preserved (not overwritten)
- `copyIfMissing` (string[]) -- files only installed if they don't already exist locally
- `strip` (string[]) -- files needing content stripping (informational)
- `symlinks` (object) -- symlink path -> target mappings

Extract the remote version from the manifest:
```bash
node -e "console.log(JSON.parse(require('fs').readFileSync('$TMPDIR/ag-manifest.json','utf8')).version)"
```

#### Step 5: Compare Versions

Compare the remote manifest `version` against `currentVersion`.
- If they are equal: report **"Already up to date (vX.Y.Z)"** and clean up `$TMPDIR`. **Stop.**
- If remote is newer (or currentVersion is `0.0.0`): continue to diff.

#### Step 6: Read Local Snapshot and Compute Diff

Read `.ag-installed-files` from the project root. If missing, build a synthetic snapshot. Compute additions, removals, modifications, merge files, and copy-if-missing files.

#### Step 7: Check Symlinks

Verify symlink mappings match expectation.

#### Step 8: Print Dry-Run Summary

Print a dry-run summary with all additions, removals, modifications, merge files, and symlink statuses.

#### Step 9: Wait for Confirmation

**STOP HERE.** Tell the user:
> "This is a dry-run summary. Type **apply** to proceed with the update, or **abort** to cancel. The temp clone will be cleaned up either way."

Do NOT proceed until the user explicitly says "apply" (or a clear affirmative).

#### Step 10: Apply Changes

On user confirmation, apply additions, modifications, removals, and symlinks. Write the resolved files to `.ag-installed-files` and version to `.ag-version`. Clean up `$TMPDIR`.

#### Step 11: Print Applied Changes Summary

Print a summary showing how many files were modified, added, removed, or symlinks fixed.

---

### Workflow 2: Publishing Improvements (Publish Flow)

This is the **maintainer** counterpart to Workflow 1.
- Local checkout of the kit repo required.
- `.ag-publish-config` file in the current repo root (JSON `{ "kitRepoPath": "/path/to/agent-skills-kit" }`).

#### Step 1: Load Configuration

Read `.ag-publish-config`. Ask user if missing, verify path exists and kit worktree is clean.

#### Step 2: Read Manifest

Read `ag-manifest.json` from the kit repo checkout to extract the current `version`.

#### Step 3: Resolve Both File Sets

Run the resolver script against the **kit repo** and the **dev repo** to resolve their managed files.

#### Step 4: Compute Diff

Compare resolved file sets to compute new, removed, modified, and merge files.

#### Step 5: Print Diff Summary

Print a summary table of changes.

#### Step 6: STOP -- Confirm Publish

**STOP** and ask the user to confirm, choose version bump type (**patch**, **minor**, or **major**), and optionally provide release notes.

#### Step 7: Apply Changes

Copy modified/new files, delete removed files, and apply **CLAUDE.md and AGENTS.md stripping** to remove project-specific details. Update `ag-manifest.json` version.

#### Step 8: Leak Detection

Verify no project-specific content leaked into the kit repo by scanning the text surfaces for brand names and absolute paths.

#### Step 9: Commit and Tag

Commit and tag the release in the kit repo:
```bash
cd <kitRepoPath>
git add -A
git commit -m "Release vX.Y.Z"
git tag vX.Y.Z
```

#### Step 10: Push

Push commits and tags to the remote repository.

#### Step 11: Create GitHub Release

Create a GitHub release using the `gh` tool.

#### Step 12: Print Summary

Print publish summary containing the new version, files changed, remote repository URL, tag, and release link.

---

## References

- [ag-update Reference Document](references/ag-update.md)
- [ag-publish Reference Document](references/ag-publish.md)
