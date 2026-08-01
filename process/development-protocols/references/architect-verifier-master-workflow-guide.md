# Architect & Verifier Autonomous Operational Playbook (Master Workflow Guide)

> **Agent Execution Mandate:** This document defines the mandatory, autonomous state machine for executing technical changes across the `agent-skills-kit` harness: Idea $\rightarrow$ Formal Spec $\rightarrow$ Frozen TDD Suite $\rightarrow$ Counter-Example Loop $\rightarrow$ Socratic Interrogation $\rightarrow$ Proof Review $\rightarrow$ Operational SSOT Documentation.
>
> All AI Agents (Orchestrators, Subagents, and Specialist Roles) MUST execute this state machine sequentially for all High-Risk tasks without relying on manual user prompts.

---

## 1. Task Risk Classification & Activation Protocol

Before executing any request, agents MUST evaluate the task scope against this matrix to determine the execution mode.

| Task Class          | Trigger Conditions                                                                                                                                                                                                                                                       | Mandatory Workflow Mode                                                                  | Required Harness Artifacts                                                                                                                                                                                                                       |
| :------------------ | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **High-Risk Class** | • Auth, JWT, OAuth & Identity boundaries<br>• Billing, Checkout & Payment Transactions<br>• DB Schema Migration / Destructive Mutation<br>• Public API Contract & DTO Changes<br>• Runtime / Gateway / Proxy / Middleware<br>• Permission Matrices & Security Boundaries | **Autonomous Architect & Verifier Protocol**<br>(Phases 0 $\rightarrow$ 6 State Machine) | • `process/features/[feature]/active/[feature-slug]-[topic-slug]-formal-spec.md`<br>• `risk-gate.json`<br>• `adversarial-validation.json`<br>• `verification.json`<br>• `interrogation-report.json`<br>• `review-decision.json`<br>• `docs/adr/` |
| **Low-Risk Class**  | • Minor bug fixes (< 15 lines of code)<br>• UI / CSS / Formatting tweaks<br>• Typo fixes & non-logic configuration updates                                                                                                                                               | **Lightweight RIPER-5 / Fast Mode**<br>(Bypass Formal Spec & Heavyweight Gate)           | • Active Plan file or Fast Mode Plan                                                                                                                                                                                                             |

---

## 2. End-to-End State Machine Architecture

```mermaid
flowchart TD
    Phase0["Phase 0: ARCHITECT (ag-brainstorming)\n• One-Question Grilling Algorithm\n• Author <feature-slug>-<topic-slug>-formal-spec.md\n• Record ADR in docs/adr/"] --> Phase1["Phase 1: PLAN (ag-plan-agent / ag-generate-plan)\n• Decompose 3-Column WBS Plan\n• Write risk-gate.json manifest"]
    Phase1 --> Phase2["Phase 2: VERIFIER PREP - TDD RED (ag-tester / ag-security / ag-scenario)\n• Freeze Level 2 Tests into adversarial-validation.json (status: RED)"]
    Phase2 --> Phase3["Phase 3: EXECUTE - TDD GREEN (ag-execute-agent)\n• Implement source code\n• Resolve bugs via verification.json Counter-Example Loop"]
    Phase3 --> Phase4["Phase 4: CODE INTERROGATION (ag-code-interrogation)\n• Execute 5-Layer Cognitive Stack Interrogation Loop\n• Emit interrogation-report.json"]
    Phase4 --> Phase5["Phase 5: PROOF REVIEW (ag-code-reviewer / ag-security)\n• Cross-examine diff vs Formal Spec & verification.json\n• Emit review-decision.json (mustStopBeforeFinalize: false)"]
    Phase5 --> Phase6["Phase 6: UPDATE PROCESS & SSOT (ag-update-process-agent)\n• Validate docs: bun run .claude/skills/ag-docs/scripts/validate-docs.mjs\n• Archive Spec & Export docs/design/<feature-slug>-<topic-slug>-workflow.md"]
```

### State Transition Preconditions & Deliverable Gates

| From State                   | To State                     | Gate Condition / Prerequisite                                                                         | Verified By                 |
| :--------------------------- | :--------------------------- | :---------------------------------------------------------------------------------------------------- | :-------------------------- |
| **Phase 0 (ARCHITECT)**      | **Phase 1 (PLAN)**           | Formal Spec written to `process/features/[feature]/active/[feature-slug]-[topic-slug]-formal-spec.md` | `ag-brainstorming`          |
| **Phase 1 (PLAN)**           | **Phase 2 (VERIFIER PREP)**  | WBS Plan created and `risk-gate.json` initialized with `formalSpecPath`                               | `ag-plan-agent`             |
| **Phase 2 (VERIFIER PREP)**  | **Phase 3 (EXECUTE)**        | Level 2 tests frozen into `adversarial-validation.json` with status `RED`                             | `ag-tester` / `ag-security` |
| **Phase 3 (EXECUTE)**        | **Phase 4 (INTERROGATION)**  | All frozen tests PASS; `verification.json` status is `PASS` (0 failures)                              | `ag-execute-agent`          |
| **Phase 4 (INTERROGATION)**  | **Phase 5 (PROOF REVIEW)**   | 5-Layer Socratic Interrogation passed; `interrogation-report.json` emitted                            | `ag-code-interrogation`     |
| **Phase 5 (PROOF REVIEW)**   | **Phase 6 (UPDATE PROCESS)** | `review-decision.json` contains `mustStopBeforeFinalize: false` & `verdict: "APPROVED"`               | `ag-code-reviewer`          |
| **Phase 6 (UPDATE PROCESS)** | **COMPLETED**                | Docs audit passes 100%; operational SSOT exported to `docs/design/`                                   | `ag-update-process-agent`   |

---

## 3. Phase-by-Phase Execution Protocol

### 🔹 Phase 0: ARCHITECT (`ag-brainstorming`)

- **Executing Agent:** `ag-brainstorming` (or Orchestrator in Brainstorming mode).
- **Input Prerequisites:** Feature requirement statement or architectural request.
- **Autonomous Execution Algorithm:**
  1. Identify High-Risk triggers (Auth, Billing, DB Schema, API Contract, Security).
  2. Conduct **One-Question Grilling**: Ask single, focused questions (with 2-4 concrete options per turn) to discover:
     - **System Invariants:** Non-negotiable logic rules (e.g., `INV-1: Balance cannot drop below zero`).
     - **Fail-Safe Boundary:** Safe fallback behavior under unexpected exceptions.
     - **Level 2 Edge Cases:** Concurrency, race conditions, adversarial payloads.
  3. Author the Formal Spec file at `process/features/[feature]/active/[feature-slug]-[topic-slug]-formal-spec.md` using template `process/development-protocols/references/formal-spec-template.md`.
  4. If architectural decisions were made, write an ADR to `docs/adr/000X-[kebab-case-name].md`.
- **Output Deliverables:** `[feature-slug]-[topic-slug]-formal-spec.md`, optional ADR file.

---

### 🔹 Phase 1: PLAN (`ag-plan-agent` / `ag-generate-plan`)

- **Executing Agent:** `ag-plan-agent` / `ag-generate-plan`.
- **Input Prerequisites:** Active Formal Spec at `process/features/[feature]/active/[feature-slug]-[topic-slug]-formal-spec.md`.
- **Autonomous Execution Algorithm:**
  1. Parse the Formal Spec; extract all System Invariants (`INV-1`, `INV-2`, etc.).
  2. Create active Plan file at `process/features/[feature]/active/[feature-slug]-plan-[dd-mm-yy].md`.
  3. Include `formalSpecPath` in the Plan header.
  4. Decompose work into a 3-column Primitive Atomic WBS Table (Phase, Task, Acceptance Criteria).
  5. Initialize `risk-gate.json` at `process/features/[feature]/reports/harness/[planSlug]/risk-gate.json`.
- **Output Deliverables:** Active Plan file, `risk-gate.json`.

---

### 🔹 Phase 2: VERIFIER PREP - TDD RED (`ag-tester` / `ag-security` / `ag-scenario`)

- **Executing Agent:** `ag-tester`, `ag-security`, `ag-scenario`.
- **Input Prerequisites:** `risk-gate.json` pointing to valid `formalSpecPath`.
- **Autonomous Execution Algorithm:**
  1. Read System Invariants from `formalSpecPath`.
  2. Generate Level 2 Property-Based Tests (`fast-check`), race condition simulations, and boundary limit tests.
  3. Write test code into test suite files (e.g., `tests/[feature]/[scenario].test.ts`).
  4. Freeze test suite metadata into `process/features/[feature]/reports/harness/[planSlug]/adversarial-validation.json` with all items set to status `RED`.
  5. Run test runner to confirm 100% of frozen tests fail prior to implementation (TDD RED confirmation).
- **Output Deliverables:** Test code files, `adversarial-validation.json` (status: `RED`).

---

### 🔹 Phase 3: EXECUTE - TDD GREEN & COUNTER-EXAMPLE LOOP (`ag-execute-agent`)

- **Executing Agent:** `ag-execute-agent`.
- **Input Prerequisites:** Active Plan file, Formal Spec, `adversarial-validation.json` (status: `RED`).
- **Autonomous Execution Algorithm:**
  1. Read Formal Spec invariants and frozen test matrix.
  2. Write source code implementation complying strictly with 100% of System Invariants.
  3. Run test runner.
  4. If any test fails, write structured counter-example details to `process/features/[feature]/reports/harness/[planSlug]/verification.json`:
     - Capture `violatedInvariant`, `counterExample` (initial state, inputs, timing, expected vs actual), and `instructionForCoder`.
  5. Refactor source code iteratively driven by counter-example payloads until 100% of tests PASS.
  6. Update `verification.json` status to `PASS`.
- **Output Deliverables:** Implementation source code, `verification.json` (`status: "PASS"`).

---

### 🔹 Phase 4: CODE INTERROGATION (`ag-code-interrogation`)

- **Executing Agent:** `ag-code-interrogation`.
- **Input Prerequisites:** Git diff, Formal Spec at `formalSpecPath`, passing test suite in `verification.json`.
- **Autonomous Execution Algorithm:**
  1. Inspect the git diff against `formalSpecPath`.
  2. Execute the **5-Layer Cognitive Stack Interrogation Protocol**:
     - **Layer 1 (Intuition & Bias Filtering):** Challenge confirmation bias and AI-generated code assumptions.
     - **Layer 2 (Inquiry & Deconstruction):** Deconstruct core logic and verify invariant defense mechanisms.
     - **Layer 3 (Systems Thinking & Second-Order Effects):** Probe concurrency, DB locks, IO, memory, and API caller impacts.
     - **Layer 4 (Innovation & Divergent Thinking):** Evaluate trade-off choices and inversion failure modes.
     - **Layer 5 (Execution & Proof):** Inspect concrete execution logs, telemetry, and test assertion evidence.
  3. Emit interrogation report to `process/features/[feature]/reports/harness/[planSlug]/interrogation-report.json`.
- **Output Deliverables:** `interrogation-report.json` (`gateVerdict: "PASS"`).

---

### 🔹 Phase 5: PROOF REVIEW GATE (`ag-code-reviewer` / `ag-security`)

- **Executing Agent:** `ag-code-reviewer`, `ag-security`.
- **Input Prerequisites:** Completed git diff, passing `verification.json`, passed `interrogation-report.json`.
- **Autonomous Execution Algorithm:**
  1. Conduct SAST security audit and invariant verification on git diff.
  2. Verify zero regressions against security boundaries and System Invariants.
  3. Emit review decision to `process/features/[feature]/reports/harness/[planSlug]/review-decision.json`:
     - Set `mustStopBeforeFinalize: false` and `verdict: "APPROVED"`.
- **Output Deliverables:** `review-decision.json`.

---

### 🔹 Phase 6: UPDATE PROCESS & SSOT EXPORT (`ag-update-process-agent`)

- **Executing Agent:** `ag-update-process-agent`.
- **Input Prerequisites:** `review-decision.json` (`verdict: "APPROVED"`).
- **Autonomous Execution Algorithm:**
  1. Run mandatory doc audit script:
     `bun run .claude/skills/ag-docs/scripts/validate-docs.mjs`
  2. Archive Formal Spec: Move `process/features/[feature]/active/[feature-slug]-[topic-slug]-formal-spec.md` to `process/features/[feature]/completed/`.
  3. Synthesize operational evidence using `ag-workflow-doc` and export SSOT operational doc to:
     `docs/design/<feature-slug>-<topic-slug>-workflow.md` (conforming to `workflow-documentation-standard.md`).
- **Output Deliverables:** Validated docs, archived spec, `docs/design/<feature-slug>-<topic-slug>-workflow.md`.

---

## 4. Harness Artifact Schemas & Directory Layout (SSOT)

### Directory Standard

```
process/features/{feature-slug}/
├── active/
│   ├── [feature-slug]-[topic-slug]-formal-spec.md   <-- Formal Spec (Pre-Implementation)
│   └── [feature-slug]-plan-[dd-mm-yy].md           <-- Active Plan file
├── reports/
│   └── harness/
│       └── [planSlug]/
│           ├── risk-gate.json                  <-- Declares formalSpecPath & risk class
│           ├── adversarial-validation.json     <-- Frozen Level 2 Tests (TDD RED)
│           ├── verification.json               <-- Counter-Example Logs & Test Output (TDD GREEN)
│           ├── interrogation-report.json       <-- Socratic Interrogation Result
│           └── review-decision.json            <-- Proof Verification Gate Report
└── completed/                                  <-- Archived Spec location upon completion

docs/adr/
docs/rfc/
docs/design/
└── <feature-slug>-<topic-slug>-workflow.md        <-- Operational SSOT Document (kebab-case)

### JSON Schemas & Reference Specification (SSOT)

> **Canonical Schema Specification:** All harness JSON artifacts MUST strictly comply with the **Harness JSON Artifacts Schema & Specification (SSOT v2.0.0)** defined at:
> [`process/development-protocols/references/harness-schemas.md`](process/development-protocols/references/harness-schemas.md)

Refer to [`harness-schemas.md`](process/development-protocols/references/harness-schemas.md) for the complete JSON Schema (Draft-07 compliant) definitions and rich production templates for:
1. **`risk-gate.json`**: Risk classification, System Invariants, formal specification links, and verification gates.
2. **`adversarial-validation.json`**: Frozen Level 2 Property-Based, Adversarial Matrix & Edge Case test suites.
3. **`verification.json`**: Execution test results, layer-by-layer coverage maps, and Counter-Example payload contracts.
4. **`review-decision.json`**: Gatekeeper verification report, verdict, and manifest references before finalize.
```
