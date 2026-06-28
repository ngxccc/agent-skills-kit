# relations-configuration

## Impact

**CRITICAL**

## Description

Define database relationships centrally in a single file (`relations.ts`) using the `defineRelations` helper rather than defining relations inline inside schema files.

When configuring relations, observe the following conventions:

1. **Explicit Foreign Keys**: Always explicitly configure relation foreign keys using `from` and `to` options inside both `r.one` and `r.many` definitions to ensure strict type-safety and alignment.
2. **Ambiguity Resolution via `alias`**: If there are multiple relations between the same two tables (e.g. `users` to `users` representing parent/employees, or a table having multiple foreign keys pointing to `users`), specify a unique `alias` parameter on both sides of the relation to resolve ambiguity.
3. **Nullable vs. Mandatory Relations**: Use the `optional: false` flag inside `r.one` helper configurations to explicitly signal that a relationship is mandatory (not null).

## Incorrect

```typescript
// ❌ BAD: Defining relations inline in the schema file or omitting from/to/alias/optional
import { relations } from "drizzle-orm";
import { users } from "./auth.schema";
import { orders } from "./order.schema";

export const usersRelations = relations(users, ({ many }) => ({
  orders: many(orders),
}));
```

## Correct

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
