---
name: ag-docs
description: "Trigger keywords: docs, README, document codebase, ADR, architectural decision, decision record, design doc, architecture record, RFC, request for comments, architectural proposal, system design. Skill for analyzing codebase, managing project documentation, creating/validating Architectural Decision Records (ADRs), Request for Comments (RFCs), and System Design Docs."
trigger_keywords: docs
layer: helper
---

# Documentation, ADR, RFC & Design Management (`ag-docs`)

## When to Apply

Use this skill when working with ag-docs workflows, tasks, or system specifications.

## How to Use

Refer to the workflow instructions and command references detailed below.
Analyze codebase and manage project documentation, Architectural Decision Records (ADRs), Request for Comments (RFCs), and System Design Specifications through scouting, structured doc generation, and automated validation.

## Default (No Arguments)

If invoked without arguments, present available documentation operations:

| Operation   | Description                                              |
| ----------- | -------------------------------------------------------- |
| `init`      | Analyze codebase & create initial docs                   |
| `update`    | Analyze changes & update docs                            |
| `summarize` | Quick codebase summary                                   |
| `adr`       | Create or validate Architectural Decision Records (ADRs) |
| `rfc`       | Create or validate Request for Comments (RFCs)           |
| `design`    | Create or validate System Design & Workflow Specs        |

## Subcommands

| Subcommand           | Reference                          | Purpose                                                  |
| -------------------- | ---------------------------------- | -------------------------------------------------------- |
| `/ag-docs init`      | `references/init-workflow.md`      | Analyze codebase and create initial documentation        |
| `/ag-docs update`    | `references/update-workflow.md`    | Analyze codebase and update existing documentation       |
| `/ag-docs summarize` | `references/summarize-workflow.md` | Quick analysis and update of codebase summary            |
| `/ag-docs adr`       | `references/adr-layout.md`         | Create or validate Architectural Decision Records (ADRs) |
| `/ag-docs rfc`       | `references/rfc-layout.md`         | Create or validate Request for Comments (RFC proposals)  |
| `/ag-docs design`    | `references/design-doc-layout.md`  | Create or validate System Design & Operational Workflows |

## Routing

Parse `$ARGUMENTS` first word:

- `init` → Load `references/init-workflow.md`
- `update` → Load `references/update-workflow.md`
- `summarize` → Load `references/summarize-workflow.md`
- `adr` → Load `references/adr-layout.md` and manage ADRs under `second-brain/Docs/ADRs/` or `docs/adr/`
- `rfc` → Load `references/rfc-layout.md` and manage RFCs under `second-brain/Docs/RFCs/` or `docs/rfc/`
- `design` → Load `references/design-doc-layout.md` and manage Design Docs under `docs/design/` or `second-brain/Docs/Design/`
- empty/unclear → Present available options

## Automated Validation Scripts

To validate all ADR files in the repository for standard formatting, run:

```bash
bun run .claude/skills/ag-docs/scripts/validate-adrs.mjs
```

To validate all RFC files in the repository for standard formatting, run:

```bash
bun run .claude/skills/ag-docs/scripts/validate-rfcs.mjs
```

To validate all System Design Documents in the repository for standard formatting, run:

```bash
bun run .claude/skills/ag-docs/scripts/validate-design-docs.mjs
```

## Shared Context

For this repo, durable agent-facing documentation lives in `process/context/`, not `./docs`.
Read `process/context/all-context.md` first to choose the relevant root file or context group.
Use `audit-context` after adding, moving, splitting, or grouping context files.

### Feature & Infrastructure Workflow Documentation

For generating feature workflow specifications or infrastructure audit guides (with WBS tables, sequence diagrams, and defense-in-depth security), load `process/development-protocols/references/workflow-documentation-standard.md` or use `ag-docs` design mode.

---

## References

- [references/adr-layout.md](references/adr-layout.md) - Architectural Decision Record layout specification.
- [references/rfc-layout.md](references/rfc-layout.md) - Request for Comments proposal layout specification.
- [references/design-doc-layout.md](references/design-doc-layout.md) - System Design & Workflow layout specification.
