---
name: ag-generate-plan
description: Create or update implementation plans in the repo's SIMPLE, COMPLEX, or PHASE PROGRAM format. Use when turning an idea, PRD, or approved direction into saved plan artifacts.
trigger_keywords: plan, create plan, write plan, generate spec, plan artifact, phase program, umbrella plan, session goal block
layer: contract
metadata:
  author: agent-skills-kit-pro-max-kit
  version: "2.0.0"
---

# Generate Plan & Phase Program (`ag-generate-plan`)

## When to Apply

Use this skill when turning ideas, PRDs, or approved directions into authoritative implementation plan artifacts for the project.

This skill is the canonical plan artifact contract for the repository, supporting three complexity classifications:

1. **SIMPLE**: Single-session feature (8-15 steps, 1 plan artifact).
2. **COMPLEX**: Multi-phase project within 1 plan file.

## How to Use

Refer to the workflow instructions and command references detailed below.

---

## Workflow

1. Read `references/generate-plan.md` for the single-plan contract.
2. Run `date +%d-%m-%y` before choosing the filename.
3. Classify complexity: `SIMPLE`, `COMPLEX`, or `PHASE PROGRAM`.
4. Save plans inside task subfolders:
   - Single plan: `process/general-plans/active/{slug}_{date}/{slug}_PLAN_{date}.md` (or `process/features/{feature}/active/{slug}_{date}/{slug}_PLAN_{date}.md`).
   - Phase Program: `process/features/{feature}/active/{program-slug}_{date}/{program-slug}-umbrella_PLAN_{date}.md` for umbrella plan, and `phase-NN-{slug}_PLAN_{date}.md` for per-phase stubs.
5. Per **task-folder artefact colocation**, every artifact (plan, spec, reports, references) lives FLAT inside the task folder.
6. Validate generated artifacts:
   - Single plan: `node .claude/skills/ag-generate-plan/scripts/validate-plan-artifact.mjs <plan-path>`
   - Umbrella plan: `node .claude/skills/ag-generate-plan/scripts/validate-umbrella-artifact.mjs <umbrella-path>`
   - Phase stub: `node .claude/skills/ag-generate-plan/scripts/validate-phase-stub.mjs <stub-path>`

---

## Phase Program Kickoff Procedure (3+ Phases)

When `PHASE PROGRAM` is detected (3 or more dependent phases):

1. **Invoke `ag-agent-strategy-compare`**: For each phase, run strategy evaluation before drafting.
2. **Read Template Files**:
   - `.claude/skills/ag-generate-plan/templates/umbrella-plan-template.md`
   - `.claude/skills/ag-generate-plan/templates/phase-stub-template.md`
3. **Emit Kickoff Recommendation**: Present feature folder, umbrella plan name, phase list, and immediate next action. Stop for user approval.
4. **Create Artifacts**:
   - Create task folder: `process/features/{feature}/active/{program-slug}_{date}/`
   - Create umbrella plan: `{program-slug}-umbrella_PLAN_{date}.md`
   - Create phase plan stubs: `phase-NN-{slug}_PLAN_{date}.md`
5. **Emit Compressed Session-Goal Block**: Print copy-pasteable `/goal` block (≤4000 chars) in chat.

---

## Required Plan Sections

For new or newly touched direct `*_PLAN_*.md` files, include all required sections:

- `Touchpoints`
- `Public Contracts`
- `Blast Radius`
- `Verification Evidence` (table: `| Gate / Scenario | Strategy | Proves SPEC criterion |`)
- `Test Infra Improvement Notes`
- `Resume and Execution Handoff`
- `Validate Contract` (placeholder for `ag-validate-agent`)

## References

- [process/context/all-context.md](process/context/all-context.md)
- [process/development-protocols/phase-programs.md](process/development-protocols/phase-programs.md)
