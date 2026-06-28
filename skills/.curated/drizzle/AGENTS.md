# Drizzle ORM & Database Design Best Practices

**Version 1.0.0**
Drizzle ORM Best Practices and Guidelines
June 2026

> **Note:**
> This document is mainly for agents and LLMs to follow when maintaining,
> generating, or refactoring codebases. Humans may also find it useful,
> but guidance here is optimized for automation and consistency by AI-assisted workflows.

---

## Abstract

Comprehensive guide for writing type-safe, high-performance database queries and services using Drizzle ORM. Contains 11 rules across 7 categories, prioritized by impact from critical (DTO boundary isolation, type safety, schemas) to high/medium (query selection, performance optimization, error handling). Each rule includes detailed explanations, real-world examples comparing incorrect vs. correct implementations, and specific impact metrics to guide automated code review and generation.

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

6. [Query Style & Performance](#6-query-style--performance) — **HIGH**
   - 6.1 [style-query-vs-select](references/style-query-vs-select.md) — HIGH (optimizes between query compilation overhead and relational object hydration)
   - 6.2 [style-where-sql-expression](references/style-where-sql-expression.md) — HIGH (prevents runtime crashes in Relational Query builder filters)
   - 6.3 [style-conditional-aggregation](references/style-conditional-aggregation.md) — HIGH (reduces connection roundtrips by collapsing multiple aggregates into a single query via conditional aggregation)

7. [Error Handling](#7-error-handling) — **MEDIUM**
   - 7.1 [error-handling-undefined-vs-throw](references/error-handling-undefined-vs-throw.md) — MEDIUM (clarifies the boundary between normal business flow control and actual system errors)

---## 1. DTO & Schema Isolation

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

1. **Use `snakeCase.table` (not `pgTable`)** from `drizzle-orm/pg-core`. This automatically translates JavaScript camelCase property names to database snake_case column names, eliminating the need to explicitly define snake_case column names as string arguments in standard column builders (e.g. write `emailVerified: boolean().notNull()` instead of `emailVerified: boolean("email_verified").notNull()`).
2. **Mix in entity templates** from `./helpers.schema` to handle primary keys, timestamps, and soft deletes consistently across schemas:
   - `baseEntity`: Adds a UUIDv7-based `id` primary key and timezone-aware timestamps `createdAt` and `updatedAt`.
   - `fullEntity`: Adds a UUIDv7-based `id` primary key, timezone-aware timestamps `createdAt` and `updatedAt`, and a timezone-aware soft delete timestamp `deletedAt`.
3. **Use UUIDv7** as the default primary key type. UUIDv7 keys are sortable by time and prevent index fragmentation, unlike traditional random UUIDv4 keys.

- **Incorrect (Using standard pgTable and manual snake_case mappings):**

  ```typescript
  import { pgTable, text, timestamp, uuid, boolean } from "drizzle-orm/pg-core";
  import { v4 as uuidv4 } from "uuid";

  // ❌ BAD: Avoid standard pgTable, manually writing snake_case strings for columns,
  // and manually defining id/timestamps in every schema
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

  //  GOOD: Uses snakeCase.table to automatically infer column names,
  // and spreads fullEntity for unified primary key and timestamp fields
  export const products = snakeCase.table(
    "product",
    {
      ...fullEntity, // Adds id (uuid v7), createdAt, updatedAt, and deletedAt
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

When configuring relations, observe the following conventions:

1. **Explicit Foreign Keys**: Always explicitly configure relation foreign keys using `from` and `to` options inside both `r.one` and `r.many` definitions to ensure strict type-safety and alignment.
2. **Ambiguity Resolution via `alias`**: If there are multiple relations between the same two tables (e.g. `users` to `users` representing parent/employees, or a table having multiple foreign keys pointing to `users`), specify a unique `alias` parameter on both sides of the relation to resolve ambiguity.
3. **Nullable vs. Mandatory Relations**: Use the `optional: false` flag inside `r.one` helper configurations to explicitly signal that a relationship is mandatory (not null).

- **Incorrect (Defining inline relations):**

  ```typescript
  // ❌ BAD: Defining relations inline in the schema file or omitting from/to/alias/optional
  import { relations } from "drizzle-orm";
  import { users } from "./auth.schema";
  import { orders } from "./order.schema";

  export const usersRelations = relations(users, ({ many }) => ({
    orders: many(orders),
  }));
  ```

- **Correct (Centralized relations with explicit configurations):**

  ```typescript
  //  GOOD: Centralized relations inside relations.ts using defineRelations,
  // with explicit from/to fields, aliases for overlapping relations, and optional settings
  import { defineRelations } from "drizzle-orm";
  import { orders, orderItems } from "./order.schema";
  import { accounts, sessions, users } from "./auth.schema";
  import { creditLimitHistory } from "./credit-limit-history.schema";

  export const schemaRelations = defineRelations(
    {
      users,
      accounts,
      sessions,
      orders,
      orderItems,
      creditLimitHistory,
    },
    (r) => ({
      users: {
        // 1. One-to-one mapping with explicit from and to
        cart: r.one.carts({
          from: r.users.id,
          to: r.carts.userId,
        }),
        // 2. Self-referencing relationship resolving ambiguity with alias
        employees: r.many.users({
          from: r.users.id,
          to: r.users.parentId,
          alias: "employees",
        }),
        parent: r.one.users({
          from: r.users.parentId,
          to: r.users.id,
          alias: "parent",
        }),
        // 3. Multiple relationships to the same table resolving ambiguity with unique alias
        creditLimitHistory: r.many.creditLimitHistory({
          alias: "userCreditLimitHistory",
        }),
        changedCreditLimits: r.many.creditLimitHistory({
          alias: "changedByCreditLimitHistory",
        }),
      },

      sessions: {
        // 4. Mandatory relationship (non-nullable foreign key) using optional: false
        user: r.one.users({
          from: r.sessions.userId,
          to: r.users.id,
          optional: false,
        }),
      },

      creditLimitHistory: {
        user: r.one.users({
          from: r.creditLimitHistory.userId,
          to: r.users.id,
          alias: "userCreditLimitHistory",
        }),
        changedByUser: r.one.users({
          from: r.creditLimitHistory.changedBy,
          to: r.users.id,
          alias: "changedByCreditLimitHistory",
        }),
      },
    }),
  );
  ```

---

## 5. Query Selection & YAGNI

### 5.1 `select-yagni-returning`

Avoid wildcard queries (`SELECT *`) in database services. Select only the columns needed to satisfy the return DTO. Apply the YAGNI (You Aren't Gonna Need It) principle to `.returning()` clauses of write operations.

- **Incorrect (Wildcard select and returning all columns):**

  ```typescript
  // ❌ BAD: Fetches all columns, and writes back all columns in returning()
  const [repayment] = await db
    .select()
    .from(debtRepayments)
    .where(eq(debtRepayments.id, id));

  const [updated] = await db.update(debtRepayments).set(data).returning();
  ```

- **Correct (Explicit columns and minimum returning fields):**

  ```typescript
  //  GOOD: Explicitly fetches only DTO fields and returns only the modified ID
  const [repayment] = await db
    .select({
      id: debtRepayments.id,
      amount: debtRepayments.amount,
      status: debtRepayments.status,
    })
    .from(debtRepayments)
    .where(eq(debtRepayments.id, id));

  const [updated] = await db
    .update(debtRepayments)
    .set(data)
    .returning({ id: debtRepayments.id });
  ```

### 5.2 `select-returning-caller-fields`

Select and return only the columns that callers actually access. Apply at two levels:

1. **`.select({ … })`** — fetch only the columns the method body reads. Wildcard `select()` sends every column over the wire even when the code touches two.
2. **`.returning({ … })`** — return only what the caller uses. Default rule: if no column beyond existence is consumed, return `{ id: <table>.id }` only. Return the full typed row only when the shape must satisfy an interface or the action passes the whole object to the client.

- **Incorrect (Wildcard select fetches all columns; returning sends full row):**

  ```typescript
  // ❌ BAD: select() downloads every user column; returning() sends back the full order row
  const [user] = await tx
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .for("update", { noWait: true });
  const [order] = await tx
    .update(orders)
    .set({ status })
    .where(eq(orders.id, id))
    .returning();
  ```

- **Correct (Only columns the body reads; returning trimmed to caller usage):**

  ```typescript
  //  GOOD: Narrow select to exactly the fields consumed
  const [user] = await tx
    .select({
      role: users.role,
      creditLimit: users.creditLimit,
      currentDebt: users.currentDebt,
    })
    .from(users)
    .where(eq(users.id, userId))
    .for("update", { noWait: true });

  //  GOOD: Caller only checks existence — id is enough
  const [order] = await tx
    .update(orders)
    .set({ approvalStatus: "APPROVED" })
    .where(eq(orders.id, orderId))
    .returning({ id: orders.id });

  //  GOOD: Caller also reads shippingFee — include it explicitly
  const [updated] = await tx
    .update(orders)
    .set({ shippingFee: bid.quotedPrice })
    .where(eq(orders.id, orderId))
    .returning({ id: orders.id, shippingFee: orders.shippingFee });
  ```

---

## 6. Query Style & Performance

### 6.1 `style-query-vs-select`

Choose query builders based on performance and relation requirements:

1. **Use Core SQL queries (`db.select().from()`)** for flat lookups, simple joins, and hot paths (e.g. checking sessions) to minimize CPU runtime SQL compilation overhead. Combine with `.prepare()` for high-frequency lookup statements.
2. **Use Relational Queries (`db.query`)** only when fetching deeply nested relationships (using the `with` query configuration) to benefit from automatic nested object hydration.

- **Incorrect (Using relational query builder for a hot-path flat lookup):**

  ```typescript
  // ❌ BAD: Compiles SQL dynamically at runtime for every session check
  const user = await db.query.users.findFirst({
    where: { id: userId },
  });
  ```

- **Correct (Using Core SQL or Prepared Statement for flat lookup):**

  ```typescript
  //  GOOD: Translates 1:1 to SQL without relational compilation overhead
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
  ```

### 6.2 `style-where-sql-expression`

In Drizzle's Relational Query Builder, never pass a raw SQL expression (like `eq()`) directly as the `where` object configuration.

Use either:

1. **Callback functions** (when typing permits, e.g. on concrete database instances).
2. **Object filter mapping** (e.g., `{ role: { eq: filters.role } }`) when compiling through transaction union types (like `TDatabase | TTransaction`) where callback overloads are lost.

- **Incorrect (Passing raw SQL expression to relational where):**

  ```typescript
  // ❌ BAD: Will crash at runtime with "DrizzleError: Unknown relational filter field: 'decoder'"
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });
  ```

- **Correct (Using a callback function or shorthand/operator object):**

  ```typescript
  //  GOOD: Valid callback syntax for concrete DB instances
  const user1 = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.id, userId),
  });

  //  GOOD: Valid object operator syntax, compatible with union types (e.g. transactions)
  const user2 = await db.query.users.findMany({
    where: {
      role: { eq: filters.role },
    },
  });

  //  GOOD: Valid shorthand syntax for simple equality checks
  const user3 = await db.query.users.findFirst({
    where: { id: userId },
  });
  ```

### 6.3 `style-conditional-aggregation`

Avoid executing multiple sequential queries to aggregate metrics from the same table (e.g. total count, sum, counts for specific date ranges, etc.). Instead, use SQL `CASE WHEN` inside Drizzle `sql` expressions to gather multiple metrics in a single table scan. Combine independent queries using `Promise.all` for parallel execution.

- **Incorrect (Multiple sequential queries on the same table):**

  ```typescript
  // ❌ BAD: High connection overhead and redundant table scans
  const totalOrders = await db.select({ count: sql`count(*)` }).from(orders);

  const activeRevenue = await db
    .select({ sum: sql`sum(amount)` })
    .from(orders)
    .where(ne(orders.status, "CANCELLED"));

  const current30DaysRevenue = await db
    .select({ sum: sql`sum(amount)` })
    .from(orders)
    .where(
      and(ne(orders.status, "CANCELLED"), gte(orders.createdAt, thirtyDaysAgo)),
    );
  ```

- **Correct (Single query with conditional aggregates):**

  ```typescript
  //  GOOD: Low overhead and single table scan
  const [metrics] = await db
    .select({
      totalOrders: sql<number>`count(*)::integer`,
      totalRevenue: sql<string>`coalesce(sum(case when ${orders.status} != 'CANCELLED' then ${orders.totalAmount} else 0 end), '0')`,
      currentRevenue: sql<string>`coalesce(sum(case when ${orders.status} != 'CANCELLED' and ${orders.createdAt} >= ${thirtyDaysAgo} then ${orders.totalAmount} else 0 end), '0')`,
      currentOrders: sql<number>`count(case when ${orders.status} != 'CANCELLED' and ${orders.createdAt} >= ${thirtyDaysAgo} then 1 else null end)::integer`,
    })
    .from(orders);
  ```

---

## 7. Error Handling

### 7.1 `error-handling-undefined-vs-throw`

Differentiate between normal query outcomes and system/validation errors:

1. **Return `undefined`** (or `null`) in read-only lookup queries when a record is not found. This allows standard client-side conditional flow controls without forcing verbose `try/catch` wrapping.
2. **Throw an exception (`throw new Error`)** for database mutation failures (`INSERT`, `UPDATE`), transactions, webhook reconciliation mismatches, or critical business logic invariants (such as credit limit checks).

- **Incorrect (Throwing error for a simple user existence check):**

  ```typescript
  // ❌ BAD: Forces caller to use try/catch for simple verification
  async function getProfile(id: string): Promise<UserDTO> {
    const user = await db.select().from(users).where(eq(users.id, id)).limit(1);
    if (!user) throw new Error("User not found");
    return user;
  }
  ```

- **Correct (Returning undefined for queries, throwing for modifications):**

  ```typescript
  //  GOOD: Read queries return undefined on miss
  async function getProfile(id: string): Promise<UserDTO | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);
    return user;
  }

  //  GOOD: Modifications or webhooks throw on miss
  async function updateProfile(id: string, data: UpdateDTO): Promise<UserDTO> {
    const [updated] = await db
      .update(users)
      .set(data)
      .where(eq(users.id, id))
      .returning();
    if (!updated) throw new Error("errors.userNotFound");
    return updated;
  }
  ```
