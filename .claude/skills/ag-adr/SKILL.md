---
name: ag-adr
description: "Use when creating, updating, or validating Architectural Decision Records (ADRs) to ensure structural and formatting consistency."
argument-hint: "create|validate"
metadata:
  author: Team
  version: "1.0.0"
---

# Architectural Decision Records (ADR) Management

This skill provides guidelines and automated validation tools for managing Architectural Decision Records (ADRs) under the centralized directory `second-brain/Docs/ADRs/` (or `docs/adr/`). It ensures that all ADR files follow the repository's standard structure, numbering, and naming conventions.
## When to Apply

Use this skill when:
- Creating a new ADR under `second-brain/Docs/ADRs/`.
- Reviewing, updating, or auditing existing ADR files.
- Verifying the consistency of architectural records.

## Subcommands

| Subcommand | Purpose |
| ---------- | ------- |
| `/ag-adr create` | Guidelines on writing a new ADR |
| `/ag-adr validate` | Runs automated validation across all ADR files in the repository |

## How to Use

To validate all ADR files in the repository, run:

```bash
bun run .claude/skills/ag-adr/scripts/validate-adrs.mjs
```

If any ADR file violates the required naming, numbering, or structural format (e.g. missing Context, Decision, Status, or Consequences sections), the script exits with code `1` and prints detailed error messages.

## References

- [ADR Standard Layout Specification](references/adr-layout.md)
