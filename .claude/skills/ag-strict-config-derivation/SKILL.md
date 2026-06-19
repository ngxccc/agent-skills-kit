---
name: ag-strict-config-derivation
description: "Use when defining any configuration list that must exist in both runtime and TypeScript types (columns, permissions, form fields, status transitions, navigation). Enforces the only acceptable modern Single Source of Truth pattern using const + as const + mapped types. MUST be followed for all new and refactored config lists. This is the strict architectural standard for the repository."
license: MIT
argument-hint: "[no-args]"
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

## Core Rule (Strict)

**There must be exactly one source of truth for the list of keys.**

### Correct Pattern (Mandatory)

```typescript
// 1. Single source of truth (only place keys are written)
export const ORDER_PUBLIC_COLUMNS = {
  id: true,
  status: true,
  totalAmount: true,
  createdAt: true,
} as const;

// 2. Derive the type (never manually list keys again)
export type OrderPublic = {
  [K in keyof typeof ORDER_PUBLIC_COLUMNS]: TOrder[K];
};

// 3. Reuse the const in the query
const orders = await db.query.orders.findMany({
  columns: ORDER_PUBLIC_COLUMNS,
});

// 4. Use satisfies when constructing the return value
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
