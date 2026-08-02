---
name: ag-git-flow
description: "Trigger keywords: git flow, branch management, rebase, merge request, commit convention, release flow. Skill for managing branch creation, conventional commit formatting, feature branching, and clean pull request workflows."
license: MIT
argument-hint: "[branch-or-flow-command]"
metadata:
  author: ngxc
  version: "1.0.0"
---

# Git Flow & Branch Management Protocol (`ag-git-flow`)

## When to Apply

This skill is designed for the agent to reference when:
- The user or agent needs to perform branch operations (creating feature branches, rebasing, squashing).
- Enforcing Conventional Commits formatting (`feat:`, `fix:`, `refactor:`, `docs:`, `test:`).
- Triggered by explicit keywords: `git flow`, `branch management`, `rebase`, `merge request`, `commit convention`.

---

## How to Use

### 1. Step-by-Step Instructions

1. **Check Working Directory Status:** Run `git status` to verify clean state before branching or rebasing.
2. **Format Conventional Commits:** Ensure all commit messages strictly follow `<type>(<scope>): <short summary>`.
3. **Execute Clean Feature Branching:**
   - Feature branch pattern: `feature/<kebab-case-name>`
   - Bugfix branch pattern: `fix/<kebab-case-name>`
   - Hotfix branch pattern: `hotfix/<kebab-case-name>`
4. **Prepare Pull Request Handoff:** Ensure commits are scoped logically before creating PRs.

### 2. Examples

#### Example 1: Creating a Feature Branch
- **Context:** User wants to start a new feature for payment webhooks.
- **User prompt:** "Start a new git branch for payment webhook integration."
- **Action/Result:** Agent checks git status, creates branch `feature/payment-webhook-integration`, and confirms clean checkout.

#### Example 2: Conventional Commit Formatting
- **Context:** Committing changes to the authentication controller.
- **User prompt:** "Format commit message for auth service fix."
- **Action/Result:** Agent crafts message `fix(auth): resolve JWT expiration handling edge case`.

---

## Quick Reference

- `conventional-commits` - Format all messages as `<type>(<scope>): <description>`.
- `clean-branching` - Use feature/ or fix/ branch naming prefixes.
- `no-force-push-main` - NEVER force-push to main or master branches.

---

## References

- [references/git-flow-templates.md](references/git-flow-templates.md) - Conventional commit & branch template reference.
- [process/context/all-context.md](../../../process/context/all-context.md) - Project context and repository guidelines.
