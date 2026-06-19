# style-where-sql-expression

## Impact

**HIGH**

## Description

In Drizzle's Relational Query Builder, never pass a raw SQL expression (like `eq()`) directly as the `where` object configuration.

Use either:

1. **Callback functions** (when typing permits, e.g. on concrete database instances).
2. **Object filter mapping** (e.g., `{ role: { eq: filters.role } }`) when compiling through transaction union types (like `TDatabase | TTransaction`) where callback overloads are lost.

## Incorrect

```typescript
// ❌ BAD: Will crash at runtime with "DrizzleError: Unknown relational filter field: 'decoder'"
const user = await db.query.users.findFirst({
  where: eq(users.id, userId),
});
```

## Correct

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
