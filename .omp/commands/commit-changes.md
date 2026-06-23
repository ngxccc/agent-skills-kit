---
description: Commit the current unstaged changes in the repository using a conversational, scope-by-scope commit flow.
---

Process the commit query or instruction provided:

$@

Perform the following conversational, scope-by-scope commit strategy:

### Commit Strategy

1. **Analyze changes**: Analyze all current unstaged changes in the working directory using `git status` or `git diff`.
2. **Group changes**: Group the changes logically into separate, clean, scoped commits by function/feature (e.g. database service, UI component, API route, docs).
3. **Draft commit messages**: Write clear, descriptive commit messages following the project's conventional commit style.
4. **Conversational approval**: For each logical scope, propose the files to stage and the conventional commit message to the user, and ask for explicit approval before running the commit commands. Do not commit all scopes at once without individual confirmation.

### CRITICAL POLICY & SAFETY RULES (MUST)

1. **One-time execution**: You are allowed to run git commit commands ONLY when this specific command (`commit-changes`) is invoked.
2. **No auto-commits**: For any subsequent turns, normal tasks, or other instructions, you MUST NEVER automatically stage or commit files, nor touch Git without the user's explicit permission. The user MUST review all changes first, and will explicitly request git actions when ready.
