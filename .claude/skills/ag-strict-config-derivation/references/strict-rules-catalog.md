# Strict Rules Catalog (Consolidated)

This file consolidates all strict architectural rules that must be followed when working with data access, DTOs, and configuration.

## 1. DTO & Schema Isolation (CRITICAL)

**Rule A: Always Define DTOs Using `Omit`**

Never expose raw database schemas. Always define DTOs using `Omit` to exclude audit fields (`createdAt`, `updatedAt`, `deletedAt`) and sensitive columns (`password`).

**Rule B: Never Use Wildcard Selects (`SELECT *`)**

Service queries must explicitly select only the columns defined in their corresponding DTOs using `columns: { ... }` in Relational Queries or `.select({ ... })` in Core SQL.

**Rule C: Use Const Objects as Single Source of Truth for Column Selection** (from this skill)

When narrowing columns, define the list as a single `export const` object with `as const`. Derive both the Drizzle config and the TypeScript DTO type from this object. Never duplicate the column keys manually.

## 2. Query Selection & YAGNI (HIGH)

**Rule: Apply YAGNI to `.returning()` Clauses**

When performing `INSERT` or `UPDATE`, do not blindly return the entire row. Only return the minimum required columns (usually just `{ id: table.id }` unless the caller actively consumes more fields).

**Rule: Select and Return Only Caller-Consumed Fields**

Before writing a query, trace all call-sites. Only select/return fields that are actually read by the callers. Default to returning only `{ id }` unless more is needed.

## 3. Error Handling (MEDIUM)

**Rule: Return `undefined` for Missing Records in Read Queries**

Read-only lookup queries (`getById`, `findByEmail`, etc.) **MUST** return `undefined` (or `null` in specific justified cases) when a record is not found. They **MUST NOT** throw.

**Rule: Throw for Mutation Failures and Invariants**

`INSERT`, `UPDATE`, transaction invariants, credit limit checks, and webhook reconciliation mismatches **MUST** throw. Never return `undefined` or `null` to signal a business rule violation in a mutation.

## 4. Config Derivation (from this skill)

**Rule: Single Source of Truth for Any Config List**

Any list of keys that appears in more than one layer (DB query, DTO, mapper, UI, validation) **MUST** be defined as a single `export const` object with `as const`. All dependent types and usage sites **MUST** derive from this object.

This rule applies to:

- Drizzle column selection
- Permission/role matrices
- Form field definitions
- Status transition maps
- Navigation item visibility rules

## 5. Foundational Principles

See [foundational-principles.md](foundational-principles.md) for the strict definitions of YAGNI, KISS, and DRY as enforced by this skill.

## Enforcement

All rules in this catalog are **strict**. Violations are treated as architectural debt. AI agents are required to load `ag-strict-config-derivation` before implementing any of the above areas.
