---
name: ag-strict-config-derivation
description: "Enforces Single Source of Truth + Type Derivation pattern for all config lists (columns, permissions, forms, status). Compile-time safety for DTOs and queries."
license: MIT
argument-hint: "[no-args]"
trigger_keywords: strict, config, derivation
layer: helper
---

# Strict Config Derivation (Single Source of Truth)

This skill defines the **only acceptable pattern** for any configuration that controls both runtime behavior and TypeScript types. It is the repository-wide architectural standard for eliminating duplication and drift between queries, DTOs, mappers, and UI.

## When to Apply

**MUST** apply this skill when:

- Defining Drizzle column lists (`columns`, `.select`)
- Defining role/permission matrices or navigation visibility
- Defining form field configurations (React Hook Form + Zod)
- Defining status/state machine transitions
- Defining any list of keys used in multiple layers (DB, DTO, UI, validation)
- Refactoring existing `Pick<>` or duplicated string unions

**Trigger keywords:** column list, permission, role matrix, form field, status transition, nav item, feature flag, single source of truth.

## How to Use

1. **Construct the Const**: Define your runtime configuration list using `as const` to freeze the keys at compile time.
2. **Derive the Type**: Map over the keys of the typeof const config (e.g. `[K in keyof typeof CONFIG]`) to construct your TypeScript types dynamically.
3. **Consume in Queries and UI**: Pass the runtime const directly into database queries and validate return values using `satisfies` with the derived type.
4. **Enforce Clean Comments**: Write self-documenting code and only use comments tagged with the Better Comments Tag Dictionary to explain the _why_ of config settings.

## Core Rule (Strict)

**There must be exactly one source of truth for the list of keys.**

### Correct Pattern (Mandatory)

```typescript
export const ORDER_PUBLIC_COLUMNS = {
  id: true,
  status: true,
  totalAmount: true,
  createdAt: true,
} as const;

export type OrderPublic = {
  [K in keyof typeof ORDER_PUBLIC_COLUMNS]: TOrder[K];
};

const orders = await db.query.orders.findMany({
  columns: ORDER_PUBLIC_COLUMNS,
});

return {
  id: order.id,
  status: order.status,
  totalAmount: order.totalAmount,
  createdAt: order.createdAt,
} satisfies OrderPublic;
```

## Forbidden Patterns (NEVER)

- Hardcoding column/field lists in multiple files
- Using `Pick<T, "a" | "b" | "c">` when a const object already exists
- Defining DTO type first, then duplicating keys in the query
- Using `as any` or type assertions to bypass derivation
- Manually maintaining three places (query + DTO + mapper)

## Coding & Commenting Standards (The Zero Semantic Noise Policy)

All code written in this repository must strictly adhere to commenting standards to ensure readability and eliminate redundant text.

### Commenting Rules

1. **ZERO Semantic Noise**: NEVER write comments that explain "WHAT" the code does or translate basic syntax. Clean code must be self-documenting. If the logic is simple, readable, and standard, output **ZERO** comments.
2. **Explain "WHY", not "WHAT"**: Comments MUST ONLY explain complex algorithms, business logic quirks, system constraints, or architectural trade-offs.
3. **English only**: All comments must be written in English.

### Better Comments Tag Dictionary

When writing comments, you **MUST** prefix them with one of the following exactly formatted uppercase tags followed by a colon:

- `WHY:` - Explains the business logic, architectural decisions, or why a specific approach was chosen over another.
- `PERF:` - Highlights Big O Time/Space Complexity or performance optimization details.
- `HACK:` - Documents workarounds, unconventional solutions, or temporary fixes bypassing system limitations.
- `BUG:` - Notes known issues, unexpected behaviors, or failing edge cases.
- `FIXME:` - Marks broken, deprecated, or urgently needing refactoring code.
- `TODO:` - Indicates planned features, missing implementations, or future improvements.
- `IDEA:` - Suggests alternative approaches or architectural improvements for future iterations.
- `INFO:` - Crucial contextual info or external documentation links that the developer must know.
- `#region [Name]` / `#endregion` - Logically groups large sections of code/variables to keep files scannable.

## Foundational Engineering Principles

This skill also enforces three core principles that support the config derivation pattern:

- **YAGNI** — You Aren't Gonna Need It: Only implement what current callers actually need. Never add fields, abstraction, or configuration "for the future".
- **KISS** — Keep It Simple, Stupid: Prefer the simplest, most boring solution. Complexity must be justified by measurable long-term savings.
- **DRY** — Don't Repeat Yourself: Every piece of knowledge (especially lists of keys) must have exactly one authoritative source.

Detailed definitions and strict MUST/NEVER rules are available in [references/foundational-principles.md](references/foundational-principles.md).

## Enforcement

- Any code introducing a new config list without this pattern will be rejected in review.
- AI agents **MUST** load this skill before writing column, permission, or form configurations.
- Violation is treated as serious architectural debt (equivalent to using `any`).

## References

- [Detailed Pattern Definition](references/single-source-of-truth-pattern.md)
- [Consolidated Strict Rules](references/strict-rules-catalog.md)
