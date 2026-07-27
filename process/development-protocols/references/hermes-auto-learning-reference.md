# Hermes Agent Auto-Learning & Coding-Fix Logging Methodology

This reference document synthesizes the autonomous procedural learning pattern adapted from `NousResearch/hermes-agent` into `agent-skills-kit`.

---

## 1. Core Principles

1. **Procedural Knowledge Persistence**: When an agent completes a complex incident investigation or non-trivial troubleshooting task (3+ diagnostic steps or non-obvious framework behavior), the learned recipe must be persisted as a managed skill via `manage_skill`.
2. **Standardized Naming Convention**: Managed troubleshooting skills MUST use the `fix-<domain>-<issue>` kebab-case naming scheme (e.g. `fix-drizzle-unique-constraint`, `fix-nestjs-guard-bypass`).
3. **Structured Skill Schema**:
   - `## Symptom & Context`: Stack trace, exact error message, or failing runtime state.
   - `## Root Cause Analysis`: Systemic root defect and causal chain.
   - `## Senior Fix Recipe`: Targeted code implementation pattern with file/line citations.
   - `## Verification & Prevention`: Diagnostic verification commands and anti-recurrence guardrails.

---

## 2. Integration Points in agent-skills-kit

- **`ag-debugger` Agent**: After disproving competing hypotheses and establishing the root cause, `ag-debugger` invokes `manage_skill` to store the troubleshooting recipe before handing the fix boundary back to `execute-agent`.
- **`ag-update-process-agent` Agent**: During **Phase 2 (Procedural Memory Capture)** of `UPDATE PROCESS` mode, the agent scans the execution history for repeatable troubleshooting workflows or reusable code patterns and persists them via `manage_skill`.

---

## 3. Storage & Isolation Guarantee

- Managed skills are stored strictly in `~/.omp/agent/managed-skills/<name>/SKILL.md`.
- User-authored skills in `.agents/skills/` or `~/.omp/agent/skills/` are NEVER overwritten.
