---
name: ag-brainstorming
description: "Trigger keywords: brainstorm, spec, design, approach, requirements, clarify, architect. Interactive brainstorming skill for exploring requirements, evaluating engineering domains (Domain A-G), codebase discovery via MCP, Trade-off Matrix analysis, and generating Formal Specs/ADRs."
license: MIT
argument-hint: "[feature-idea-or-topic]"
metadata:
  author: ngxc
  version: "1.0.0"
---

# Interactive Brainstorming Protocol (`ag-brainstorming`)

## When to Apply

This skill is designed for the agent to reference when:
- The user wants to brainstorm, design a new feature, explore architectural approaches, or define requirements.
- Operating in **Phase 0 (ARCHITECT)** of the Architect & Verifier workflow before writing implementation plans or code.
- Triggered by explicit keywords: `brainstorm`, `spec`, `design`, `approach`, `requirements`, `clarify`, `architect`.

---

## How to Use

### 1. Step-by-Step Instructions

1. **Stage 0: MCP-First Codebase Discovery:** Query Knowledge Graph (`search_graph`, `get_architecture`, `trace_path`) and inspect `process/context/all-context.md` to ground the design in existing codebase patterns. Lock the Zero-Duplicate-Convention rule.
2. **Stage 1: Socratic & Dynamic Domain Evaluation:**
   - Offer Visual Companion (Mermaid flowcharts, ASCII layouts) alongside prose.
   - Ask exactly **ONE** focused question per message (One-Question Grilling).
   - Evaluate the feature across Baseline Domains A–G (Security, Performance, UI/UX, Reliability, Maintainability, Observability, Compliance) + inferred dynamic domains (e.g., Domain H).
   - Present design choices as a structured 2–4 option **Trade-off Matrix**.
3. **Stage 2: Core Discovery:** Explore and define System Invariants (`INV-*`), Fail-Safe Boundaries, and Level 2 Edge Cases.
4. **Stage 3: Incremental Presentation:** Present the specification incrementally section-by-section (Objectives → Invariants & Schemas → Boundaries → Edge Cases) with user approval gates.
5. **Stage 4: Spec Self-Review & User Gate:** Run the 4-point self-review checklist, write the Formal Spec and ADR files, and pause for explicit user approval before entering Phase 1 (PLAN).

### 2. Examples

#### Example 1: Designing a Real-Time Notification Feature
- **Context:** User wants to add WebSocket notifications to an existing app.
- **User prompt:** "Brainstorm how we should implement real-time notifications."
- **Action/Result:** Agent performs MCP discovery on existing routes, offers visual companion, presents a Trade-off Matrix (WebSockets vs. SSE vs. Polling), and asks ONE targeted Socratic question about connection scalability.

#### Example 2: Exploring Payment Webhook Resilience
- **Context:** User is planning a third-party payment integration.
- **User prompt:** "Help me spec out the PayOS payment webhook handler."
- **Action/Result:** Agent discovers existing DB services, defines invariant `INV-2` (idempotent event processing), presents fail-safe boundary options, and incrementally presents the spec.

---

## Quick Reference

- `mcp-first-discovery` - Query codebase graph (`search_graph`, `get_architecture`) before asking questions.
- `one-question-grilling` - Ask exactly ONE focused question per turn; avoid cognitive overload.
- `tradeoff-matrix` - Present 2–4 options with Pros, Cons, and Risk Class.
- `incremental-presentation` - Present spec section-by-section with explicit user approval pauses.

---

## References

- [references/brainstorming-guide.md](references/brainstorming-guide.md) - Detailed guide for 7 Baseline Domains (A-G), Dynamic Inference, and Artifact standards.
- [process/context/all-context.md](../../../process/context/all-context.md) - Project context and architecture guidelines.
- [formal-spec-template](../../../process/development-protocols/references/formal-spec-template.md) - Formal Specification document template.
