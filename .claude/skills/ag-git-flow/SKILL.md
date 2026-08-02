---
name: ag-git-flow
description: "Trigger keywords: git flow, branch management, rebase, merge request, commit convention, release flow, create pr, pull request, pr template, gh pr. Skill for managing branch creation, conventional commit formatting, feature branching, and clean pull request creation workflows."
trigger_keywords: git, flow
layer: helper
---

# Git Flow & Pull Request Protocol (`ag-git-flow`)

## When to Apply

This skill is designed for the agent to reference when:

- The user or agent needs to perform branch operations (creating feature branches, rebasing, squashing).
- Enforcing Conventional Commits formatting (`feat:`, `fix:`, `refactor:`, `docs:`, `test:`).
- Creating enterprise Pull Requests (PRs) with standard titles, structured Markdown bodies, labels, and assignees.
- Triggered by explicit keywords: `git flow`, `branch management`, `rebase`, `merge request`, `commit convention`, `create pr`, `pull request`, `pr template`, `gh pr`.

---

## How to Use

### 1. Step-by-Step Instructions

1. **Check Working Directory Status:** Run `git status` to verify clean state before branching or rebasing.
2. **Format Conventional Commits:** Ensure all commit messages strictly follow `<type>(<scope>): <short summary>`.
3. **Execute Clean Feature Branching:**
   - Feature branch pattern: `feature/<kebab-case-name>`
   - Bugfix branch pattern: `fix/<kebab-case-name>`
   - Hotfix branch pattern: `hotfix/<kebab-case-name>`
4. **Create Enterprise Pull Requests:**
   - Generate structured PR title: `<type>(<scope>): <short description>`
   - Build mandatory PR body using `references/pr-template.md`.
   - Execute PR creation via `xd://github` (`op: pr_create`) or helper script `.claude/skills/ag-git-flow/scripts/create-pr.mjs`.

### 2. Examples

#### Example 1: Creating a Feature Branch & Conventional Commit

- **Context:** User wants to start a new feature for payment webhooks.
- **User prompt:** "Start a new git branch and commit message for payment webhook integration."
- **Action/Result:** Agent checks git status, creates branch `feature/payment-webhook-integration`, and crafts commit `feat(payment): add PayOS webhook handler`.

#### Example 2: Enterprise Pull Request Creation

- **Context:** Committing and opening a PR for an authentication fix.
- **User prompt:** "Create a pull request for the auth service fix."
- **Action/Result:** Agent formats title `fix(auth): resolve JWT expiration handling`, builds body per `pr-template.md`, and runs PR creation via `create-pr.mjs` or `xd://github`.

---

## Quick Reference

- `conventional-commits` - Format all messages as `<type>(<scope>): <description>`.
- `clean-branching` - Use feature/ or fix/ branch naming prefixes.
- `enterprise-pr` - Enforce clean titles and structured body template without emojis.
- `no-force-push-main` - NEVER force-push to main or master branches.

---

## References

- [references/git-flow-templates.md](references/git-flow-templates.md) - Conventional commit & branch template reference.
- [references/pr-template.md](references/pr-template.md) - Enterprise Pull Request template and specification.
- [process/context/all-context.md](../../../process/context/all-context.md) - Project context and repository guidelines.
