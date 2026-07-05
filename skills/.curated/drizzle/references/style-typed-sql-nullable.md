# style-typed-sql-nullable

## Impact

**HIGH**

## Description

In Drizzle ORM v1.0.0-rc.4+, raw SQL expressions built with the `sql` operator support type-inferred `mapWith()` callbacks and explicit nullability chaining via `.nullable()`.

When building raw SQL expressions that decode values:

1. **Avoid `(val: any)` inside `mapWith()`**: Allow Drizzle to infer the underlying value type or explicitly type the callback argument.
2. **Chain `.nullable()` when SQL expressions can evaluate to `NULL`**: Using `.nullable()` updates the TypeScript return type of the SQL builder from `Type` to `Type | null`, preventing runtime undefined/null TypeError exceptions when database functions or expressions return `NULL`.

## Incorrect

```typescript
import { sql } from "drizzle-orm";

// ❌ BAD: Casting callback param to any and omitting nullability indicator
export const lowerEmail = (column: any) =>
  sql<string>`LOWER(${column})`.mapWith((val: any) => String(val)); // Returns string, but SQL LOWER can return null if input is null
```

## Correct

```typescript
import { sql } from "drizzle-orm";

// ✅ GOOD: Uses type-safe callback mapping and explicitly chains .nullable()
export const lowerEmail = (column: any) =>
  sql`LOWER(${column})`
    .mapWith((val: string) => val.trim().toLowerCase())
    .nullable(); // Returns string | null
```
