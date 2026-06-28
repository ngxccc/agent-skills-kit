---
name: drizzle
description: Rules, standards, and references for Drizzle ORM query styles, performance optimization, and type safety. Use when writing Drizzle queries, defining database services, or manipulating database schema types.
license: MIT
argument-hint: '[--table <string>] [--query-type <string>]'
metadata:
  author: Team
  version: 1.0.0
---

# Drizzle ORM Best Practices

Comprehensive guide for writing type-safe, high-performance database queries and services using Drizzle ORM. Contains 11 rules across 7 categories, prioritized by impact from critical (setup, schemas, type safety) to high/medium (query selection, performance).

## When to Apply

Reference these guidelines when:

- Defining database services and interfaces.
- Writing read/write operations with Drizzle ORM.
- Designing Data Transfer Objects (DTOs) and API boundary types.
- Deciding between Drizzle Relational Queries (`db.query`) and Core SQL Queries (`db.select`).
- Handling database query failures and non-existent records.

## Rule Categories by Priority

| Priority | Category                 | Impact   | Prefix     | Rules |
| -------- | ------------------------ | -------- | ---------- | ----- |
| 1        | DTO & Schema Isolation   | CRITICAL | `dto-`     | 1     |
| 2        | Type Safety & Unions     | CRITICAL | `type-`    | 1     |
| 3        | Transactions & Locking   | CRITICAL | `lock-`    | 1     |
| 4        | Schema & Relations Config| CRITICAL | `schema-`, `relations-` | 2 |
| 5        | Query Selection & YAGNI  | HIGH     | `select-`  | 2     |
| 6        | Query Style & Performance| HIGH     | `style-`   | 3     |
| 7        | Error Handling           | MEDIUM   | `error-`   | 1     |

## Quick Reference

### 1. DTO & Schema Isolation (CRITICAL)

- [dto-omit-for-objects](references/dto-omit-for-objects.md) - Define DTOs using Omit on Object types to isolate database schemas from presentation layers.

### 2. Type Safety & Unions (CRITICAL)

- [type-union-exclude](references/type-union-exclude.md) - Use Exclude for filtering string literal union types and Omit for object types.

### 3. Transactions & Locking (CRITICAL)

- [lock-pessimistic-row](references/lock-pessimistic-row.md) - Use pessimistic row locking in transactions to prevent concurrent write hazards.

### 4. Schema & Relations Config (CRITICAL)

- [schema-creation](references/schema-creation.md) - Use snakeCase.table for automatic case conversion and mix in baseEntity/fullEntity helpers.
- [relations-configuration](references/relations-configuration.md) - Centralize table relations using defineRelations with explicit from, to, optional, and alias parameters.

### 5. Query Selection & YAGNI (HIGH)

- [select-yagni-returning](references/select-yagni-returning.md) - Explicitly select columns mapping to DTOs and apply YAGNI to returning clauses.
- [select-returning-caller-fields](references/select-returning-caller-fields.md) - Select and return only the columns callers actually access; default unused returns to id only.

### 6. Query Style & Performance (HIGH)

- [style-query-vs-select](references/style-query-vs-select.md) - Prefer Core select queries for flat lookups and Relational queries for deeply nested relation hydration.
- [style-where-sql-expression](references/style-where-sql-expression.md) - Never pass raw SQL expressions directly to Relational Query where clauses.
- [style-conditional-aggregation](references/style-conditional-aggregation.md) - Use conditional aggregation via CASE WHEN to consolidate multiple aggregate queries into a single query.

### 7. Error Handling (MEDIUM)

- [error-handling-undefined-vs-throw](references/error-handling-undefined-vs-throw.md) - Return undefined for missing records in read-only queries and throw for write/update/invariant failures.

## How to Use

Read individual reference files for detailed guidelines, configurations, and code examples:

- [dto-omit-for-objects](references/dto-omit-for-objects.md)
- [type-union-exclude](references/type-union-exclude.md)
- [lock-pessimistic-row](references/lock-pessimistic-row.md)
- [select-yagni-returning](references/select-yagni-returning.md)
- [select-returning-caller-fields](references/select-returning-caller-fields.md)
- [style-query-vs-select](references/style-query-vs-select.md)
- [style-where-sql-expression](references/style-where-sql-expression.md)
- [style-conditional-aggregation](references/style-conditional-aggregation.md)
- [error-handling-undefined-vs-throw](references/error-handling-undefined-vs-throw.md)
- [schema-creation](references/schema-creation.md)
- [relations-configuration](references/relations-configuration.md)

## Full Compiled Document

For the complete guide with all rules expanded: [AGENTS.md](AGENTS.md)

## References

- [Drizzle ORM Official Documentation](https://orm.drizzle.team/)
- [Drizzle Prepared Statements](https://orm.drizzle.team/docs/perf-queries)
- [TypeScript Utility Types Guide](https://www.typescriptlang.org/docs/handbook/utility-types.html)
