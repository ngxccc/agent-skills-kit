---
name: ag-code-interrogation
description: "Trigger keywords: interrogation, Socratic review, code interview, mental models, auto-pilot prevention, verify understanding, code challenge, critical thinking. Use when verifying if a developer or AI agent truly understands recent codebase changes or AI-generated code."
license: MIT
argument-hint: "[no-args]"
metadata:
  author: Team
  version: "1.0.0"
---

# Code Interrogation & Socratic Review Skill

## When to Apply

This skill is designed for the agent to reference when:
- A developer or AI agent has generated, modified, or reviewed non-trivial code changes.
- Preparing to transition from **EXECUTE** mode to **UPDATE PROCESS** or merging a pull request.
- Verifying whether the developer actually understands the implementation rather than accepting AI output on auto-pilot.
- Trigger keywords: `code interrogation`, `Socratic review`, `code interview`, `mental models`, `prevent auto-pilot`, `verify understanding`, `code challenge`.

---

## How to Use

### 1. Step-by-Step Instructions

#### Phase 1: Diff & Context Ingestion
1. Inspect the target `git diff`, changed files, or proposed implementation.
2. Identify high-risk constructs: external state mutations, async boundaries, performance bottlenecks, implicit assumptions, and complex algorithms.

#### Phase 2: Continuous Socratic Interrogation Loop
Conduct an indefinite, multi-turn Q&A dialogue with the developer. Do NOT limit the dialogue to a fixed number of turns.
- **`continue` Command Control:** Typing `"continue"` or answering a question MUST immediately generate a new probing question across the Cognitive Stack. `"continue"` is strictly an advancement signal and MUST NEVER be interpreted as a stop signal.
- **Stopping Condition:** The loop runs indefinitely until the developer explicitly issues a stop command (e.g., `"stop"`, `"exit"`, `"done"`). Every turn prompt MUST explicitly instruct: *"Type `continue` for the next question, or `stop` to end."*
Structure each turn dynamically across the **Embedded 5-Layer Cognitive Stack**:

##### Embedded Cognitive Stack & Mental Models Framework

1. **Layer 1: Intuition & Bias Filtering (Preventing Passive Acceptance)**
   - *Confirmation Bias:* Actively look for counter-evidence and edge cases rather than only validating happy-path scenarios.
   - *Sunk Cost Fallacy:* Challenge code that is kept solely because time was spent writing or generating it.
   - *Sample Question:* "Did you accept this implementation because it passed initial sanity checks, or have you systematically searched for failure states?"

2. **Layer 2: Inquiry & Deconstruction (First Principles)**
   - *First Principles Thinking:* Deconstruct the implementation into its core primitives, data structures, and fundamental logic.
   - *Socratic Questioning:* Question implicit assumptions and unstated prerequisites.
   - *Sample Question:* "Explain this specific function from first principles. What are its primitive inputs, invariant constraints, and core logic steps?"

3. **Layer 3: Systems Thinking & Second-Order Effects (Ripple Impact)**
   - *Systems Thinking:* View the code as an interconnected subsystem with feedback loops and state boundaries.
   - *Second-Order Thinking:* Ask "And then what happens?" to anticipate downstream consequences across memory, IO, thread pools, and API callers.
   - *Sample Question:* "What second-order effects will this change have on database connection pools, memory allocations, or downstream API consumers under heavy load?"

4. **Layer 4: Innovation & Divergent Thinking (Trade-off Analysis)**
   - *Lateral Thinking:* Explore non-obvious alternative architectures, patterns, or algorithms.
   - *Inversion:* Ask how the system could fail or how one could intentionally break this code.
   - *Sample Question:* "What alternative patterns were evaluated, and why is this approach superior despite its inherent trade-offs?"

5. **Layer 5: Execution & Proof of Verification (Evidence-Based)**
   - *Deliberate Practice & Probabilistic Thinking:* Evaluate risk distributions and demand empirical evidence.
   - *Concrete Verification:* Require unit test outputs, stress test logs, or step-by-step verification traces.
   - *Sample Question:* "What concrete execution logs, benchmark results, or boundary tests prove this code remains robust under edge conditions?"

#### Phase 3: Gate Decision
Evaluate the developer's responses continuously:
- **PASS**: The developer demonstrates deep comprehension, articulates trade-offs, and provides concrete evidence of verification. Proceed to commit or `UPDATE PROCESS`.
- **REJECT**: The developer relies on hand-waving, superficial explanations, or unverified AI assumptions. Return to `EXECUTE` phase to refactor or re-verify.

---

### 2. Examples

#### Example 1: Interrogating an AI-Generated Concurrency Implementation
- **Context:** An AI agent generated a distributed locking mechanism using Redis.
- **User prompt:** "Run code interrogation on my recent concurrency changes."
- **Action/Result:** The agent initiates a continuous Socratic loop:
  1. *Turn 1 (Deconstruction):* "Explain why line 42 uses double-checked locking instead of a single atomic operation?" -> Developer answers or types `continue`.
  2. *Turn 2 (Second-Order Effect):* "If Redis experiences a failover during key lock acquisition, what happens to downstream booking transactions?" -> Developer types `continue`.
  3. *Turn 3 (Continuous Loop):* The agent continues generating new probing questions on each `continue` until the developer types `stop` or demonstrates complete mastery -> **PASS**.
---

## Quick Reference

- `continuous-loop` - Maintain an open-ended back-and-forth Socratic dialogue. Typing `"continue"` or replying with an answer generates a new probing question without stopping.
- `bias-filtering` - Guard against Confirmation Bias and Sunk Cost Fallacy when evaluating AI-generated code.
- `first-principles` - Deconstruct code logic to raw facts and invariants before accepting abstractions.
- `systems-thinking` - Evaluate second-order impacts on system boundaries, memory, and concurrency.

---

## References

- **Cognitive Stack Framework**: 5-layer hierarchy for cognitive processing (Intuition & Bias Filtering, Inquiry & Deconstruction, Systems Thinking, Divergent Thinking, Strategic Execution).
- **Critical Thinking Models**: Mental models for deconstructing complex problems (First Principles, Inversion, Second-Order Thinking, Occam's Razor).
- **Socratic Questioning Method**: Systematic questioning technique to illuminate underlying assumptions and logic.
