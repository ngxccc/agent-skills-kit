# Enterprise Pull Request Specification

All Pull Requests in this repository MUST follow this standardized format. No emojis, decorative icons, or informal symbols may be used in PR titles or descriptions.

---

## 1. Title Standard

PR titles MUST follow the Conventional Commits specification or Ticket Reference format:

```
<type>(<scope>): <imperative short description>
```
or
```
[TICKET-ID] <type>(<scope>): <imperative short description>
```

### Allowed `<type>` Values
- `feat`: A new feature or capability
- `fix`: A bug fix
- `refactor`: Code refactoring without behavioral or interface changes
- `perf`: Performance optimization
- `test`: Adding or updating automated tests
- `docs`: Documentation updates only
- `chore`: Tooling, build, dependency, or process maintenance updates
- `style`: Formatting changes (whitespace, semicolons) without logic changes
- `ci`: CI/CD configuration or script updates

### Title Rules
- Use imperative mood in the summary ("add" not "added" or "adds").
- Maximum length: 72 characters.
- Start description with a lowercase letter.
- Do NOT add a period `.` at the end of the title.
- Do NOT include emojis or icons in the title.

### Examples
- `feat(auth): add OAuth2 refresh token support`
- `fix(api): handle missing authorization header gracefully`
- `chore(deps): update bun runtime to version 1.3.14`

---

## 2. PR Body Markdown Template

```markdown
## Summary
Concise explanation of the changes introduced by this PR and the business/technical reason for the change.

## Type of Change
- [ ] feat: New feature
- [ ] fix: Bug fix
- [ ] refactor: Code refactoring (no functional change)
- [ ] perf: Performance improvement
- [ ] test: Testing updates
- [ ] docs: Documentation update
- [ ] chore: Maintenance or tooling update

## Context & Related References
- Plan / Specification: process/general-plans/active/... (or link to active feature plan)
- Issue / Ticket: Closes #<issue_number> / Relates to #<issue_number>

## Changes Made
- Detailed technical breakdown of specific changes made across files/packages.

## Verification & Testing
- [ ] Type check passed (`bun run check-types` / `tsc --noEmit`)
- [ ] Unit & integration test suite passed (`bun test`)
- [ ] Manual verification completed

### Testing Evidence
```
[Paste execution output, test suite logs, or smoke test command results here]
```

## Security & Compliance Checklist
- [ ] No hardcoded secrets, private keys, or API tokens introduced
- [ ] Zero Semantic Noise commenting standards maintained (`WHY:`, `PERF:`, `HACK:`, `BUG:`, `FIXME:`, `TODO:`, `IDEA:`, `INFO:`)
- [ ] Backwards-compatibility verified; breaking changes documented if applicable
```

---

## 3. Label Standard

PRs MUST be assigned at least one category label and one area label.

### Category Labels
- `type:feat`, `type:fix`, `type:refactor`, `type:docs`, `type:test`, `type:chore`, `type:perf`

### Area Labels
- `area:core`, `area:ui`, `area:api`, `area:auth`, `area:db`, `area:deps`, `area:ci`, `area:harness`

### Status & Priority Labels
- `priority:p0` (critical), `priority:p1` (high), `priority:p2` (normal), `status:needs-review`

---

## 4. Assignee, Project, & Milestone Standards

- **Assignee**: Default to branch author (`@me`) or explicit reviewer username.
- **Project**: Associated with the active GitHub Project board or current sprint name.
- **Milestone**: Linked to the target release version or sprint milestone (e.g., `v1.0.0`, `Sprint 42`).
