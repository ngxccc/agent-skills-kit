---
name: ag-git-commit
description: Use this skill to commit changes incrementally in logical parts with conventional commit messages. Do not change code during commit, do not push to remote, and stop on logical errors.
metadata:
  author: agent-skills
  version: "1.0.0"
---

# ag-git-commit

Commit workspace changes incrementally in logical parts following the Conventional Commits specification.

## When to Apply

- Use this skill when you have completed a feature, bug fix, or documentation update and want to commit the changes.
- Apply when you need to stage and commit modified/untracked files into isolated, clean commits without pushing them to the remote repository.
- Use when preparing commits locally before submitting a pull request or finishing a task phase.

## How to Use

To stage and commit your changes, follow these steps:

### Step 1: Inspect Changes

1. Run `git status` to identify modified and untracked files.
2. Review the diffs for each file using `git diff <file>` to verify what changes have been made.

### Step 2: Validate Code (Pre-Commit Checks)

3. Run tests and type checks (e.g. `bun test` or relevant test suite) before staging.
4. **STOP if any test or check fails.** Report the logical error immediately and do not commit.

### Step 3: Group and Stage Logical Units

5. Group changed files into logical batches. For example:
   - Batch 1: Schema updates and migration files.
   - Batch 2: Core service implementation or logic changes.
   - Batch 3: Test cases and verification suites.
   - Batch 4: Process rules, second brain markdown notes, and plans.
6. Stage only the files in the first logical batch:
   ```bash
   git add <files_in_batch>
   ```

### Step 4: Commit with Conventional Message

7. Commit the staged batch using a concise, descriptive conventional message:
   ```bash
   git commit -m "feat(database): add totalSalesCache to products schema and migration"
   ```
8. Repeat Step 3 and 4 for each remaining logical batch.

### Step 5: Verify Final Status

9. Verify that `git status` shows a clean worktree.
10. **Do NOT run `git push`.** Report the final commit log and status to the user.

## Conventional Commits Convention

Use the standard prefix format:

- `feat(scope): <description>` - for new features or schemas
- `fix(scope): <description>` - for bug fixes (e.g. transaction fixes)
- `refactor(scope): <description>` - for restructuring code without behavioral changes
- `test(scope): <description>` - for adding or modifying tests
- `docs(scope): <description>` - for updating documentation, rules, or process plans
- `chore(scope): <description>` - for metadata, build scripts, or packages configurations

## References

- [Conventional Commits Specification](https://www.conventionalcommits.org/)
- [Git Documentation](https://git-scm.com/doc)
