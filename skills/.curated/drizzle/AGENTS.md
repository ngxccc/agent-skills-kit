# Drizzle ORM & Database Design Best Practices

**Version 1.1.0**
Drizzle ORM Best Practices, Guidelines, and Tooling Automation
July 2026

> **Note:**
> This document is mainly for agents and LLMs to follow when maintaining,
> generating, or refactoring codebases. Humans may also find it useful,
> but guidance here is optimized for automation and consistency by AI-assisted workflows.

---

## Abstract

Comprehensive guide for writing type-safe, high-performance database queries and services using Drizzle ORM and Drizzle Kit. Contains 14 rules across 8 categories, prioritized by impact from critical (DTO boundary isolation, type safety, schemas) to high/medium (query selection, performance optimization, error handling, tooling automation). Each rule includes detailed explanations, real-world examples comparing incorrect vs. correct implementations, and specific impact metrics to guide automated code review and generation.

---

## Table of Contents

1. [DTO & Schema Isolation](#1-dto--schema-isolation) — **CRITICAL**
   - 1.1 [dto-omit-for-objects](references/dto-omit-for-objects.md) — CRITICAL (prevents exposure of sensitive columns like passwords and keeps database schemas encapsulated)

2. [Type Safety & Unions](#2-type-safety--unions) — **CRITICAL**
   - 2.1 [type-union-exclude](references/type-union-exclude.md) — CRITICAL (prevents compiler errors and type corruption when filtering Union/Literal types)

3. [Transactions & Locking](#3-transactions--locking) — **CRITICAL**
   - 3.1 [lock-pessimistic-row](references/lock-pessimistic-row.md) — CRITICAL (prevents race conditions and double spend hazards under concurrent operations)

4. [Schema & Relation Configurations](#4-schema--relation-configurations) — **CRITICAL**
   - 4.1 [schema-creation](references/schema-creation.md) — CRITICAL (standardizes schema definitions using automatic snake_case inference and shared entities)
   - 4.2 [relations-configuration](references/relations-configuration.md) — CRITICAL (centralizes relationship definitions with explicit, type-safe mapping options)

5. [Query Selection & YAGNI](#5-query-selection--yagni) — **HIGH**
   - 5.1 [select-yagni-returning](references/select-yagni-returning.md) — HIGH (prevents wildcard query memory storms and database write return overhead)
   - 5.2 [select-returning-caller-fields](references/select-returning-caller-fields.md) — HIGH (prevents over-fetching columns and over-returning rows by tracing actual caller field access)
   - 5.3 [select-insert-from-select](references/select-insert-from-select.md) — HIGH (omits default columns and leverages column-order independence in db.insert().select())

6. [Query Style & Performance](#6-query-style--performance) — **HIGH**
   - 6.1 [style-query-vs-select](references/style-query-vs-select.md) — HIGH (optimizes between query compilation overhead and relational object hydration)
   - 6.2 [style-where-sql-expression](references/style-where-sql-expression.md) — HIGH (prevents runtime crashes in Relational Query builder filters)
   - 6.3 [style-conditional-aggregation](references/style-conditional-aggregation.md) — HIGH (reduces connection roundtrips by collapsing multiple aggregates into a single query via conditional aggregation)
   - 6.4 [style-typed-sql-nullable](references/style-typed-sql-nullable.md) — HIGH (preserves nullability and enforces type inference on raw SQL mapWith expressions)

7. [Error Handling](#7-error-handling) — **MEDIUM**
   - 7.1 [error-handling-undefined-vs-throw](references/error-handling-undefined-vs-throw.md) — MEDIUM (clarifies the boundary between normal business flow control and actual system errors)

8. [Tooling & MCP Automation](#8-tooling--mcp-automation) — **HIGH**
   - 8.1 [drizzle-kit-cli-mcp](references/drizzle-kit-cli-mcp.md) — HIGH (automates migration lifecycles with --output json, --hints, @drizzle-kit/cli SDK, and stdio MCP server)

---

## 1. DTO & Schema Isolation

### 1.1 `dto-omit-for-objects`

Always define Data Transfer Objects (DTOs) using the TypeScript `Omit` utility type to exclude sensitive database fields (such as `password`) and audit fields (`createdAt`, `updatedAt`, `deletedAt`) from being exposed to the presentation or action layers.

- **Incorrect (Exposing raw schema directly):**

  ```typescript
  // ❌ BAD: Exposes password and system audit metadata directly to the caller
  export async function getB2BProfile(id: string): Promise<TUser | undefined> {
    return await db.query.users.findFirst({ where: { id } });
  }
  ```

- **Correct (Isolating with Omit-based DTO):**

  ```typescript
  //  GOOD: DTO is clearly isolated, keeping database properties encapsulated
  export type UserB2BProfileDTO = Omit<
    TUser,
    | "password"
    | "emailVerified"
    | "image"
    | "createdAt"
    | "updatedAt"
    | "deletedAt"
  >;

  export async function getB2BProfile(
    id: string,
  ): Promise<UserB2BProfileDTO | undefined> {
    const user = await db.query.users.findFirst({
      where: { id },
      columns: {
        id: true,
        name: true,
        email: true,
        role: true,
        companyName: true,
      },
    });
    return user as UserB2BProfileDTO | undefined;
  }
  ```

---

## 2. Type Safety & Unions

### 2.1 `type-union-exclude`

Use `Exclude<T, U>` for filtering string literal union types and `Omit<T, K>` only for object/interface types.

- **Incorrect (Using Omit on Union/Literal types):**

  ```typescript
  type PaymentMethod = "PAYOS" | "CASH" | "TRADE_CREDIT";

  // ❌ BAD: Type wrongPayment is corrupted. Omit acts on properties of the global String prototype.
  type WrongPayment = Omit<PaymentMethod, "TRADE_CREDIT">;
  ```

- **Correct (Using Exclude on Union/Literal types):**

  ```typescript
  type PaymentMethod = "PAYOS" | "CASH" | "TRADE_CREDIT";

  //  GOOD: Filtered correctly, resolves to "PAYOS" | "CASH"
  type PublicPayment = Exclude<PaymentMethod, "TRADE_CREDIT">;
  ```

---

## 3. Transactions & Locking

### 3.1 `lock-pessimistic-row`

Use pessimistic row locking (`.for("update", { noWait: true })`) in transaction boundaries when reading balances, credit limits, or stock quantities that are about to be modified. This prevents concurrent write hazards, double-spending, and race conditions.

- **Incorrect (Read is not locked, concurrent checkouts can cause race conditions):**

  ```typescript
  // ❌ BAD: Concurrent checkouts can cause race conditions (double spend)
  await db.transaction(async (tx) => {
    const [user] = await tx
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);
    if (parseFloat(user.creditLimit) < orderTotal) {
      throw new Error("errors.insufficientCreditLimit");
    }

    await tx
      .update(users)
      .set({ currentDebt: newDebt })
      .where(eq(users.id, userId));
  });
  ```

- **Correct (Locks the row immediately, preventing race conditions or throwing early if locked):**

  ```typescript
  //  GOOD: Locks the row immediately, preventing race conditions
  await db.transaction(async (tx) => {
    let user;
    try {
      const [lockedUser] = await tx
        .select()
        .from(users)
        .where(eq(users.id, userId))
        .for("update", { noWait: true });
      user = lockedUser;
    } catch (err) {
      if (
        err instanceof Error &&
        err.message.includes("could not obtain lock")
      ) {
        throw new Error("errors.lockAcquisitionFailed", { cause: err });
      }
      throw err;
    }

    if (!user) {
      throw new Error("errors.userNotFound");
    }

    if (parseFloat(user.creditLimit) < orderTotal) {
      throw new Error("errors.insufficientCreditLimit");
    }

    await tx
      .update(users)
      .set({ currentDebt: newDebt })
      .where(eq(users.id, userId));
  });
  ```

---

## 4. Schema & Relation Configurations

### 4.1 `schema-creation`

Follow the workspace's custom conventions for database schema creation:

1. **Use `snakeCase.table` (not `pgTable`)** from `drizzle-orm/pg-core`. This automatically translates JavaScript camelCase property names to database snake_case column names, eliminating the need to explicitly define snake_case column names as string arguments in standard column builders.
2. **Mix in entity templates** from `./helpers.schema` to handle primary keys, timestamps, and soft deletes consistently across schemas (`baseEntity`, `fullEntity`).
3. **Use UUIDv7** as the default primary key type. UUIDv7 keys are sortable by time and prevent index fragmentation.

- **Incorrect (Using standard pgTable and manual snake_case mappings):**

  ```typescript
  import { pgTable, text, timestamp, uuid, boolean } from "drizzle-orm/pg-core";
  import { v4 as uuidv4 } from "uuid";

  export const products = pgTable("product", {
    id: uuid("id").primaryKey().$defaultFn(uuidv4),
    nameVi: text("name_vi").notNull(),
    nameEn: text("name_en"),
    brandId: uuid("brand_id").references(() => brands.id),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  });
  ```

- **Correct (Using snakeCase.table and helper entities):**

  ```typescript
  import { snakeCase, text, uuid, boolean } from "drizzle-orm/pg-core";
  import { fullEntity } from "./helpers.schema";
  import { brands } from "./brand.schema";

  export const products = snakeCase.table(
    "product",
    {
      ...fullEntity,
      nameVi: text().notNull(),
      nameEn: text(),
      brandId: uuid().references(() => brands.id, { onDelete: "set null" }),
      isQuoteOnly: boolean().notNull().default(false),
    },
    (table) => [index("product_brand_idx").on(table.brandId)],
  );

  export type TProduct = typeof products.$inferSelect;
  export type TNewProduct = typeof products.$inferInsert;
  ```

---

### 4.2 `relations-configuration`

Define database relationships centrally in a single file (`relations.ts`) using the `defineRelations` helper rather than defining relations inline inside schema files.

- **Incorrect (Defining inline relations):**

  ```typescript
  import { relations } from "drizzle-orm";
  import { users } from "./auth.schema";
  import { orders } from "./order.schema";

  export const usersRelations = relations(users, ({ many }) => ({
    orders: many(orders),
  }));
  ```

- **Correct (Centralized relations with explicit configurations):**

  ```typescript
  import { defineRelations } from "drizzle-orm";
  import { orders, orderItems } from "./order.schema";
  import { accounts, sessions, users } from "./auth.schema";

  export const schemaRelations = defineRelations(
    {
      users,
      accounts,
      sessions,
      orders,
      orderItems,
    },
    (r) => ({
      users: {
        cart: r.one.carts({
          from: r.users.id,
          to: r.carts.userId,
        }),
      },
    }),
  );
  ```

---

## 5. Query Selection & YAGNI

### 5.1 `select-yagni-returning`

- **Incorrect (Wildcard select and returning full object):**

  ```typescript
  const [newOrder] = await db.insert(orders).values(orderData).returning();
  ```

- **Correct (Selecting only DTO-mapped properties):**

  ```typescript
  const [newOrder] = await db
    .insert(orders)
    .values(orderData)
    .returning({ id: orders.id });
  ```

---

### 5.2 `select-returning-caller-fields`

Select and return only the columns callers actually access; default unused returns to `id` only.

---

### 5.3 `select-insert-from-select`

In Drizzle ORM v1.0.0-rc.4+, bulk insert queries built via `db.insert(table).select(...)` no longer require the subquery's selected columns to match the target table's exact column declaration order.

1. **Omit auto-generated default columns**: Do not select primary key columns (`id`), generated timestamps (`createdAt`, `updatedAt`), or default enum values if the target table defines defaults.
2. **Order Independence**: Select columns in any logical order mapping to target schema keys.

- **Incorrect (Redundantly selecting id/timestamps):**

  ```typescript
  await db.insert(users).select(
    db
      .select({
        id: tempUsers.id,
        email: tempUsers.email,
        name: tempUsers.name,
        createdAt: tempUsers.createdAt,
      })
      .from(tempUsers),
  );
  ```

- **Correct (Selecting only payload fields):**

  ```typescript
  await db.insert(users).select(
    db
      .select({
        name: tempUsers.name,
        email: tempUsers.email,
      })
      .from(tempUsers),
  );
  ```

---

## 6. Query Style & Performance

### 6.1 `style-query-vs-select`

- **Core SQL (`db.select().from()`)**: Preferred for flat lookups and high-frequency hot paths.
- **Relational Queries (`db.query`)**: Preferred when hydrating deeply nested relations.

---

### 6.2 `style-where-sql-expression`

Never pass raw SQL expressions directly to Relational Query `where` object configuration. Use callback functions or object operator syntax.

---

### 6.3 `style-conditional-aggregation`

Use SQL `CASE WHEN` inside Drizzle `sql` expressions to gather multiple metrics in a single table scan.

---

### 6.4 `style-typed-sql-nullable`

In Drizzle ORM v1.0.0-rc.4+, raw SQL expressions built with `sql` support type-inferred `mapWith()` callbacks and explicit nullability chaining via `.nullable()`.

- **Incorrect (Casting callback param to any and omitting nullability):**

  ```typescript
  export const lowerEmail = (column: any) =>
    sql<string>`LOWER(${column})`.mapWith((val: any) => String(val));
  ```

- **Correct (Type-safe callback mapping with .nullable()):**

  ```typescript
  export const lowerEmail = (column: any) =>
    sql`LOWER(${column})`
      .mapWith((val: string) => val.trim().toLowerCase())
      .nullable();
  ```

---

## 7. Error Handling

### 7.1 `error-handling-undefined-vs-throw`

Return `undefined` (or `null`) in read-only lookup queries when a record is not found. Throw an exception (`throw new Error`) for database mutations or business logic invariant failures.

---

## 8. Tooling & MCP Automation

### 8.1 `drizzle-kit-cli-mcp`

Drizzle Kit v1.0.0-rc.4 introduces machine-readable JSON output modes (`--output json`), a public programmatic SDK (`@drizzle-kit/cli`), and a native Model Context Protocol (MCP) server (`drizzle-kit mcp`) over stdio for AI agents and non-interactive CI/CD automation.

- **CLI & Script Usage:**

  ```bash
  drizzle-kit check --output json
  drizzle-kit push --output json --hints-file ./drizzle-hints.json
  ```

- **Programmatic SDK Example:**

  ```typescript
  import { push, generate } from "drizzle-kit/cli";

  const genResult = await generate({
    schema: "./src/database/schemas",
    out: "./drizzle",
    dialect: "postgresql",
  });
  ```

- **MCP Server Configuration (`mcp.json`):**

  ```json
  {
    "mcpServers": {
      "drizzle-kit": {
        "command": "npx",
        "args": ["drizzle-kit", "mcp"]
      }
    }
  }
  ```
