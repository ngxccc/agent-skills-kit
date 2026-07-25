---
name: ag-git-pr
description: "Use when creating Git Pull Requests. Enforces Conventional Commits PR title format, structured PR body template, automated assignees, labels, project, and milestone without emojis."
argument-hint: "create|validate|template"
metadata:
  author: Team
  version: "1.1.0"
---

# Enterprise Git Pull Request (PR) Management

This skill ensures that all Pull Requests (PRs) created across the repository follow a strict, enterprise-grade specification for title, description (body), assignees, labels, project boards, and milestones without emojis or decorative icons.

---

## Standard Specifications Summary

1. **Title Format**: `<type>(<scope>): <short description>` or `[TICKET-ID] <type>(<scope>): <short description>`
   - Allowed Types: `feat`, `fix`, `refactor`, `perf`, `test`, `docs`, `chore`, `style`, `ci`, `build`
   - Example: `feat(auth): add OAuth2 refresh token support`
   - Rule: Strictly clean text only. Emojis and icons are prohibited.
2. **PR Body Template**: Mandatory structured sections (Summary, Type of Change, Context & Related References, Changes Made, Verification & Testing, Security & Compliance Checklist).
3. **Assignees**: Default `@me` or explicit comma-separated list of GitHub usernames.
4. **Labels**: Mandatory structured tags:
   - Category tag: `type:<category>` (`type:feat`, `type:fix`, `type:refactor`, etc.)
   - Area tag: `area:<domain>` (`area:auth`, `area:core`, `area:ui`, etc.)
   - Status tag: `status:needs-review`
5. **Project**: Linked to active GitHub Project board or phase name.
6. **Milestone**: Linked to target release version or sprint milestone (e.g. `v1.0.0`, `Sprint 42`).

---

## Usage & Execution

### 1. Interactive PR Creation via Helper Script

Run the automated standard validation script:

```bash
bun run .claude/skills/ag-git-pr/scripts/create-pr.mjs \
  --title "feat(auth): add OAuth2 refresh token handling" \
  --type feat \
  --scope auth \
  --plan process/general-plans/active/auth_PLAN_25-07-26.md \
  --issue 42 \
  --assignee "@me" \
  --label "type:feat,area:auth,priority:p1" \
  --project "Agent Harness v1" \
  --milestone "v1.0.0"
```

### 2. Dry Run Mode (Preview Without Execution)

To preview the exact validation and `gh pr create` command without submitting:

```bash
bun run .claude/skills/ag-git-pr/scripts/create-pr.mjs \
  --title "fix(api): handle payload boundary check" \
  --type fix \
  --scope api \
  --dry-run
```

### 3. Execution via `xd://github` Device (for Subagents / Direct Tools)

When creating a PR using the `xd://github` device, pass parameters adhering strictly to the schema:

```json
{
  "op": "pr_create",
  "title": "feat(auth): add OAuth2 refresh token support",
  "body": "## Summary\nAdd OAuth2 refresh token support...\n\n## Type of Change\n- [x] `feat`",
  "head": "feature/auth-refresh",
  "base": "main",
  "assignee": ["@me"],
  "label": ["type:feat", "area:auth", "status:needs-review"]
}
```

---

## Standard Reference Docs

- [Full PR Template & Format Specification](references/pr-template.md)
