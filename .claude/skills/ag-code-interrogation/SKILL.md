---
name: ag-code-interrogation
description: Socratic Code Interrogation skill for conducting deep 5-Layer Cognitive Stack Q&A on AI-generated code, verifying developer mental models, and enforcing system invariants before proof review.
trigger_keywords: code, interrogation
layer: helper
---

# Socratic Code Interrogation Protocol (`ag-code-interrogation`)

## When to Apply

Use this skill when working with ag-code-interrogation workflows, tasks, or system specifications.

## How to Use

Refer to the workflow instructions and command references detailed below.

> **Operational Purpose:** Verifies that developers and AI agents truly understand recent codebase changes, AI-generated logic, and underlying system invariants before code finalization. Prevents "auto-pilot acceptance" of subtle bugs, hidden race conditions, or unhandled edge cases.

---

## References & Deep Documentation

- `references/code-interrogation-guide.md` — Deep operational guide, full 5-Layer breakdown, communication mode protocols, and complete JSON schema specifications.
- `scripts/validate-interrogation-report.mjs` — Automated artifact validation script enforcing schema correctness and business invariants.

---

## 1. Trigger Conditions & Applicability

This skill MUST be invoked during:

- **Phase 4 (Code Interrogation)** of the Architect & Verifier Master Workflow.
- Any pull request or major feature review involving complex logic, concurrent state updates, financial/identity boundaries, or AI-generated code blocks.
- When explicitly requested via keywords: `interrogation`, `Socratic review`, `code interview`, `verify understanding`, `code challenge`.

---

## 2. Core Operational Rules

### Rule 1: Role-Based Communication Modes

- **Agent-to-Human Mode:** Ask 1–2 Socratic questions per turn via interactive CLI/ask dialog. Guide human to self-discover flaws without giving immediate fixes (**Zero-Code-Handout Policy**).
- **Agent-to-Agent Mode:** Interrogator Agent sends structured Socratic evaluation prompts via `hub` messaging to Executor Agent.

### Rule 2: 5-Layer Cognitive Stack Traversal

Interrogations MUST traverse all five cognitive layers in sequence:

1. **L1 (Intuition & Bias Filtering):** Challenge confirmation bias & unexamined AI code.
2. **L2 (Inquiry & Deconstruction):** Probe first principles & System Invariants (`INV-X`).
3. **L3 (Systems Thinking):** Analyze 500 concurrent reqs, DB locks (`FOR UPDATE`), IO, and memory.
4. **L4 (Divergent Thinking & Inversion):** Fail-safe inversion (Attacker mindset) & trade-off justification.
5. **L5 (Execution & Proof):** Inspect property-based tests (`fast-check`) and counter-example logs.

### Rule 3: Loop Termination & Circuit Breaker (3-Strikes Rule)

- Maximum **3 probing turns** allowed per Layer/Topic.
- If unresolved after 3 turns, trigger Circuit Breaker (`circuitBreakerTriggered: true`, `gateVerdict: "FAIL"`) and route back to Phase 3 (TDD GREEN Fix).

### Rule 4: Verdict & Severity Matrix (3-Lane Policy)

- **CRITICAL (Red Lane):** Invariant breach (`INV-X`), concurrency race condition, or DB deadlock $\rightarrow$ **`FAIL`** (Block release; return to Phase 3).
- **MAJOR (Yellow Lane):** Unclear AI code boundary or weak property test $\rightarrow$ **`RETRY`** (Max 3 turns) or **`PASS_WITH_CONCERNS`**.
- **MINOR (Green Lane):** Minor telemetry gap or doc note $\rightarrow$ **`PASS`**.

### Rule 5: Incremental Flushing Rule (Mandatory Context-Overflow Protection)

To prevent context overflow or agent memory loss during long Socratic sessions, **`interrogation-report.json` MUST BE CREATED AT THE START AND FLUSHED/UPDATED AFTER EVERY SINGLE Q&A TURN**. Append the turn record to `qaTrace` and update `identifiedRisks` immediately.

---

## 3. Artifact Validation Requirement

Upon completing or updating an interrogation session, validate `interrogation-report.json` using the automated script:

```bash
bun .claude/skills/ag-code-interrogation/scripts/validate-interrogation-report.mjs <path-to-report.json>
```

---

## References

- [references/code-interrogation-guide.md](references/code-interrogation-guide.md)
- [process/context/all-context.md](process/context/all-context.md)
