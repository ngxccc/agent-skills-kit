# style-query-vs-select

## Impact

**HIGH**

## Description

Choose query builders based on performance and relation requirements:

1. **Use Core SQL queries (`db.select().from()`)** for flat lookups, simple joins, and hot paths (e.g. checking sessions) to minimize CPU runtime SQL compilation overhead. Combine with `.prepare()` for high-frequency lookup statements.
2. **Use Relational Queries (`db.query`)** only when fetching deeply nested relationships (using the `with` query configuration) to benefit from automatic nested object hydration.

## Incorrect

```typescript
// ❌ BAD: Compiles SQL dynamically at runtime for every session check
const user = await db.query.users.findFirst({
  where: { id: userId },
});
```

## Correct

```typescript
//  GOOD: Translates 1:1 to SQL without relational compilation overhead
const [user] = await db
  .select()
  .from(users)
  .where(eq(users.id, userId))
  .limit(1);
```
