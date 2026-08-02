---
name: ag-reverse-code-review
description: "Trigger keywords: reverse review, compare options, trade-off analysis, eval approaches, which pattern is better. Reverse Code Review skill for evaluating architectural trade-offs, comparing multi-option implementations (Trade-off Matrix), and evaluating student critical thinking rather than just syntax correctness."
trigger_keywords: reverse, code, review
layer: helper
---

# Reverse Code Review Protocol (`ag-reverse-code-review`)

## When to Apply

This skill is designed for the agent to reference when:

- The user is a student or developer choosing between multiple architectural patterns or implementation approaches.
- The agent needs to present multi-option Trade-off Matrices to evaluate student critical thinking and mental models.
- Triggered by explicit keywords: `reverse review`, `compare options`, `trade-off analysis`, `eval approaches`, `which pattern is better`.

---

## How to Use

### 1. Step-by-Step Instructions

1. **Generate 2-4 Architectural Options (`INV-1`):** When presented with a complex problem, generate 2-4 distinct implementation approaches (e.g., Option A: Optimistic Lock, Option B: Pessimistic Row Lock, Option C: Redis Redlock).
2. **Mandate Student Trade-Off Analysis (`INV-2`):** Refuse to declare a "winner" immediately. Require the student to evaluate each option across:
   - **Time/Space Complexity & Latency**
   - **Data Consistency & Race Condition Guarantees**
   - **Operational & Cognitive Complexity**
3. **Grade Reasoning & Uncover Blind Spots (`INV-3`):** Evaluate the student's analysis, pointing out unexamined edge cases (e.g., DB connection pool exhaustion, Redis split-brain).
4. **Format Decision into ADR (`INV-4`):** Once the student justifies their choice, assist them in formatting the decision into an Architectural Decision Record (ADR) for `second-brain/30_Resources/Architectures/` or `docs/adr/`.

### 2. Examples

#### Example 1: Evaluating Concurrency Locking Options

- **Context:** Student needs to select a locking mechanism for a high-concurrency ticket system.
- **User prompt:** "Should I use Optimistic Locking or Redis Redlock for ticket reservation?"
- **Action/Result:** The agent presents Option A (TypeORM Optimistic Lock `@Version`), Option B (`SELECT FOR UPDATE`), and Option C (Redis Redlock). It asks the student to construct a Trade-off Matrix evaluating Latency vs Consistency under 10,000 req/sec.

#### Example 2: Comparing State Management Strategies

- **Context:** Student is deciding between local Zustand store vs server-side Redis session for cart state.
- **User prompt:** "Compare Zustand vs Redis for managing user cart state."
- **Action/Result:** The agent presents Option A (Client-side Zustand), Option B (Server Redis Session), and Option C (Hybrid optimistic UI). It requires the student to evaluate offline support vs cross-device sync trade-offs.

---

## Quick Reference

- `multi-approach-generation` - Present 2-4 distinct architectural options for complex problems.
- `student-tradeoff-mandate` - Require student to evaluate Latency, Consistency, and Complexity.
- `socratic-evaluation` - Grade student reasoning and highlight unexamined edge cases.
- `adr-export-gate` - Format finalized choices into Architectural Decision Records (ADRs).

---

## References

- [process/context/all-context.md](../../../process/context/all-context.md) - Project context and architecture guidelines.
- [second-brain-integration](../ag-second-brain/SKILL.md) - Obsidian Second Brain integration skill.
