---
description: Commit the current unstaged changes in the repository directly without needing confirmation.
---

Process the commit query or instruction provided:

$@

Perform the following direct commit strategy:

### Commit Strategy

1. **Analyze changes**: Analyze all current unstaged changes in the working directory using `git status` or `git diff`.
2. **Group changes**: Group the changes logically into separate, clean, scoped commits by function/feature (e.g. database service, UI component, API route, docs).
3. **Draft commit messages**: Write clear, descriptive commit messages following the project's conventional commit style.
4. **Direct commit**: For each logical scope, automatically stage the files and run the git commit command with the drafted conventional message. Do not ask for user approval; execute directly.

### CRITICAL POLICY & SAFETY RULES (MUST)

1. **One-time execution**: You are allowed to run git commit commands ONLY when this specific command (`commit-changes`) is invoked.
2. **No auto-commits**: For any subsequent turns, normal tasks, or other instructions, you MUST NEVER automatically stage or commit files, nor touch Git without the user's explicit permission. The user MUST review all changes first, and will explicitly request git actions when ready.
