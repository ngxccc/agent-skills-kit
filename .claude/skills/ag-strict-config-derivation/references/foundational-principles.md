# Foundational Engineering Principles (Strict)

This document defines the three core principles that underpin all architectural decisions in this repository. They are **strict** and must be followed.

## 1. YAGNI — You Aren't Gonna Need It

### Strict Definition

**YAGNI** means: Do not implement functionality, fields, abstraction layers, or configuration options until there is a **proven, immediate need** from a real caller or business requirement.

### MUST / NEVER

- **MUST** start with the minimum viable implementation that satisfies current callers.
- **MUST** trace all call-sites before adding any new field, method, or configuration.
- **NEVER** add a field "just in case" or "for future extensibility".
- **NEVER** create abstraction layers (interfaces, base classes, generic repositories) before at least two concrete implementations exist and are observably different.
- **NEVER** return more data from a query than what the current callers actually consume.

### Relation to Config Derivation

YAGNI is the reason we use the Single Source of Truth pattern. By forcing the column list to be explicitly declared in one place, we make over-fetching visible and painful, thereby enforcing YAGNI at the type level.

## 2. KISS — Keep It Simple, Stupid

### Strict Definition

**KISS** means: The simplest solution that works is almost always the correct one. Complexity must be justified by a measurable reduction in long-term maintenance cost or a non-negotiable performance requirement.

### MUST / NEVER

- **MUST** prefer straightforward, boring code over clever abstractions.
- **MUST** choose the solution with the smallest cognitive load for the next developer (6 months from now).
- **NEVER** introduce a new library, framework, or pattern just because it is "modern" or "elegant".
- **NEVER** solve a problem with a general-purpose framework when a 20-line function suffices.
- **NEVER** use advanced TypeScript features (conditional types, infer, branded types, etc.) unless the simpler alternative has been proven insufficient through actual usage.

### Relation to Config Derivation

The `const` + mapped type pattern is deliberately chosen because it is **boring and mechanical**. It does not require deep type wizardry. It is the KISS solution to the duplication problem.

## 3. DRY — Don't Repeat Yourself

### Strict Definition

**DRY** means: Every piece of knowledge or logic must have a single, unambiguous, authoritative representation within the system.

### MUST / NEVER

- **MUST** eliminate duplication of **knowledge** (column lists, role sets, validation rules, business constants).
- **MUST** treat duplication of **implementation** as acceptable only when the contexts are observably different and coupling would create worse problems.
- **NEVER** copy-paste column lists, permission arrays, or form field definitions.
- **NEVER** maintain the same list of strings or keys in three different files (query, DTO, mapper).

### Relation to Config Derivation

The Single Source of Truth pattern is the **strictest possible enforcement** of DRY for configuration data. By deriving types from a single const object, we make it impossible to violate DRY without triggering a compile error.

## Enforcement

These three principles are **non-negotiable**. Any code review or AI-generated implementation that violates YAGNI, KISS, or DRY will be rejected. The `ag-strict-config-derivation` skill exists primarily to make these principles mechanically enforceable through the TypeScript type system.
