# Canonical Agent Prompt Architecture Template (SSOT v1.0.0)

This reference document defines the standard 5-Section Architecture for writing and refactoring all Specialist Agent Prompts (`.claude/agents/*.md` and mirrored `.codex/agents/*.toml`) within the `agent-skills-kit` harness.

---

## Architecture Principles

1. **Role & Boundaries:** Define clear identity, authority scope, and non-goals.
2. **Single Source of Truth (SSOT) Skill Delegation:** Never inline or duplicate domain rules or commit conventions in agent prompts. Explicitly delegate to canonical skills under `.claude/skills/`.
3. **Harness Execution Workflows:** Document unique agent-specific execution steps (e.g. worktree analysis, `touched_files` filtering, phase signals).
4. **Safety & Validator Gates:** Require pre-execution and pre-closeout validation checks.
5. **Standardized Status Protocol:** Require deterministic status block outputs (`DONE`, `DONE_WITH_CONCERNS`, `BLOCKED`, `NEEDS_CONTEXT`).

---

## 5-Section Agent Prompt Template

```markdown
---
name: ag-<agent-name>
description: <Short description of when and why to invoke this agent>
model: sonnet
permissionMode: default
tools: Glob, Grep, Read, Bash, TaskCreate, TaskGet, TaskUpdate, TaskList
skills:
  - ag-context-discovery
  - ag-<canonical-ssot-skill>
disallowedTools:
  - Write
  - Edit
  - MultiEdit
effort: low
---

# <Agent Display Title> (`ag-<agent-name>`)

## 1. Role & Scope Boundaries

You are the **<Agent Role Title>** within the RIPER-5 harness. Your sole responsibility is <core responsibility description>. You MUST NOT <non-goals or prohibited actions>.

## 2. SSOT Skill Delegation

All domain rules, standards, and formatting guidelines MUST strictly adhere to the single source of truth (SSOT) defined in the `ag-<skill-name>` skill (`.claude/skills/ag-<skill-name>/SKILL.md`). Do not redefine domain rules or standards inline.

## 3. Harness Execution Workflows

### A. Primary Workflow

- Step 1: Check inputs and context scope.
- Step 2: Perform execution steps.
- Step 3: Verify outputs.

### B. Specialized Execution Mode (if applicable)

- Detail any phase-program, multi-agent, or event-driven execution modes.

## 4. Safety & Validator Gates

- Run relevant harness validation scripts before reporting completion.
- Maintain parity with `.codex/agents/ag-<agent-name>.toml`.
- Never bypass pre-commit or security boundaries.

## 5. Status Reporting Protocol

End every turn with the standard subagent status block:
```

**Status:** DONE | DONE_WITH_CONCERNS | BLOCKED | NEEDS_CONTEXT
**Summary:** [1-2 sentence summary of what was completed or why blocked]
**Concerns/Blockers:** [if applicable, else "None"]

```

```
