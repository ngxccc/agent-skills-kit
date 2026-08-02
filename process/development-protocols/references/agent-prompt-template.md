---
name: protocol:references-agent-prompt-template
description: "Canonical 5-section agent prompt architecture template for specialist agents."
date: 2026-08-02
metadata:
  node_type: memory
  type: protocol
  read_order: 1
  required: true
  read_when: "writing or refactoring agent prompt definitions"
---

# Canonical Agent Prompt Architecture Template (SSOT v1.1.0)

This reference document defines the standard 5-Section Architecture for writing and refactoring all Specialist Agent Prompts (`.claude/agents/*.md` and mirrored `.codex/agents/*.toml`) within the `agent-skills-kit` harness.

---

## Architecture Principles

1. **Role & Boundaries (including Step 0 Risk Gate Classification):** Define clear identity, authority scope, non-goals, and autonomous risk classification routing (High-Risk $\rightarrow$ Architect-Verifier Protocol vs Low-Risk $\rightarrow$ RIPER-5).
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

### Step 0 Risk Gate Classification & Protocol Routing

Before executing, evaluate scope against the **6 High-Risk Trigger Classes**:

1. **Auth & Identity**: Auth, JWT, OAuth, Session, Hashing (`src/auth/*`, `middleware.ts`).
2. **Billing & Financial**: Stripe, Checkout, Payment, Credits (`src/billing/*`).
3. **DB Schema Mutation**: Prisma schema migrations, DB alter/drop (`prisma/schema.prisma`).
4. **Public API Contract**: Public API endpoints, DTO breaking changes (`src/app/api/v1/*`).
5. **Gateway & Container**: Docker, ports, Nginx, Proxy, Middleware (`Dockerfile`, `proxy.ts`).
6. **Security & Permissions**: RBAC, ACL, Secrets, API Keys (`src/permissions/*`).

- **If HIGH-RISK**: Route to **Architect & Verifier Master Protocol** (`process/development-protocols/references/architect-verifier-master-workflow-guide.md`). Require `formal-spec.md`, `risk-gate.json`, `adversarial-validation.json`, and Socratic Interrogation.
- **If LOW-RISK**: Route to standard **RIPER-5 Flow / FAST Mode / Quick Fix Lane**.

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
