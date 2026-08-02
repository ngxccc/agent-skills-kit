---
name: ag-brainstorming
description: "Use when starting creative work, building components, or modifying behavior. Trigger keywords: brainstorm, spec, design, approach, requirements, clarify. Explores user intent, requirements, architecture trade-offs, and design specs before implementation."
trigger_keywords: brainstorming
layer: helper
---

# Brainstorming Ideas Into Designs (`ag-brainstorming`)

## When to Apply

This skill is designed for the agent to reference when:

- Starting any creative work, building new components, adding features, or modifying system behavior.
- Exploring user intent, requirements, architecture trade-offs (Trade-off Matrix), and design specifications before implementation.
- Evaluating designs against the 7 Baseline Engineering Evaluation Domains (Domain A–G: Security, UI/UX, Performance, Reliability, Maintainability, Observability, Compliance).
- Triggered by explicit keywords: `brainstorm`, `spec`, `design`, `approach`, `requirements`, `clarify`.

---

## How to Use

### 1. Step-by-Step Instructions

1. **Explore Project Context:** Check codebase, existing architecture, and recent commits before proposing changes.
2. **Interactive Socratic Questioning:** Ask clarifying questions one at a time to uncover purpose, constraints, and success criteria.
3. **Structured Trade-Off Matrix:** Propose 2–3 approaches formatted as a Trade-off Matrix (Pros/Cons/Risk Class) with a recommended default choice.
4. **Domain A–G Evaluation:** Systematically evaluate design against Security, UI/UX, Performance, Reliability, Maintainability, Observability, and Compliance.
5. **High-Risk Class Grilling:** For Auth, Billing, Schema, API Gateway, or Secrets, execute One-Question Grilling and invoke `ag-docs adr` for hard architectural decisions.
6. **Write Design Doc / Formal Spec:**
   - For standard features, save design spec to `docs/design/<feature-topic>-design.md` or `process/features/{feature}/active/`.
   - For **High-Risk features** (Auth, Billing, DB Schema, API Gateway, Secrets), author the **Formal Specification** at `process/features/{feature}/active/{feature-slug}-{topic-slug}-formal-spec.md` using template `process/development-protocols/references/formal-spec-template.md` (defining Zod validation contracts, System Invariants `INV-1..N`, and Adversarial Payloads `ADV-1..N`).
7. **Transition:** After user approves written spec, invoke the `ag-generate-plan` skill to create the implementation plan.

### 2. Examples

#### Example 1: New Feature Brainstorming & Trade-Off Matrix

- **Context:** User wants to add OAuth2 social login to an existing app.
- **User prompt:** "Help me brainstorm the design for adding Google and GitHub OAuth login."
- **Action/Result:** Agent checks current auth state, presents a Trade-off Matrix comparing Session cookies vs JWT tokens, evaluates Domain A (Security) and Domain D (Reliability), writes spec doc, and transitions to plan mode.

#### Example 2: High-Risk System Redesign

- **Context:** Redesigning payment credit calculation and schema migration.
- **User prompt:** "Brainstorm redesigning our billing credit engine."
- **Action/Result:** Agent identifies High-Risk billing class, executes One-Question Grilling with default choices, records ADR via `ag-docs adr`, writes Formal Spec to `process/features/billing/active/Billing_Credit_Formal_Spec.md`, and requests user review.

---

## Quick Reference

- `collaborative-design` - Never write code before design approval.
- `trade-off-matrix` - Present choices using a structured Pros/Cons/Risk matrix.
- `domain-a-g-framework` - Evaluate across Security, UI/UX, Performance, Reliability, Maintainability, Observability, and Compliance.
- `high-risk-grilling` - Enforce system invariants (`INV-1`) and ADR creation (`ag-docs adr`) for critical domains.
- `terminal-state` - The only skill invoked after design approval is `ag-generate-plan`.

---

## References

- [references/brainstorming-guide.md](references/brainstorming-guide.md) - Complete workflow diagram, Trade-off Matrix template, 7 Engineering Evaluation Domains (A–G), and 8-step checklist.
- [process/development-protocols/references/formal-spec-template.md](../../../process/development-protocols/references/formal-spec-template.md) - Formal Specification template for High-Risk features.
- [process/context/all-context.md](../../../process/context/all-context.md) - Agent Skills Kit Repository Context and codebase guidelines.
