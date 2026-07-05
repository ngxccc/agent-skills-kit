# select-insert-from-select

## Impact

**HIGH**

## Description

In Drizzle ORM v1.0.0-rc.4+, bulk insert queries built via `db.insert(table).select(...)` no longer require the subquery's selected columns to match the target table's exact column declaration order.

When populating tables from subqueries:

1. **Omit auto-generated default columns**: Do not select primary key columns (`id`), generated timestamps (`createdAt`, `updatedAt`), or default enum values if the target table already defines `default()`, `$defaultFn()`, or `defaultNow()`.
2. **Order Independence**: Select columns in any logical order mapping to target schema keys; Drizzle ORM automatically maps subquery keys to table column fields at runtime.

## Incorrect

```typescript
// ❌ BAD: Redundantly selecting id/timestamps and enforcing strict column ordering
await db.insert(users).select(
  db.select({
    id: tempUsers.id,
    email: tempUsers.email,
    name: tempUsers.name,
    createdAt: tempUsers.createdAt,
    updatedAt: tempUsers.updatedAt,
    role: tempUsers.role,
    status: tempUsers.status,
  }).from(tempUsers)
);
```

## Correct

```typescript
// ✅ GOOD: Selecting only required payload fields; Drizzle applies table defaults automatically
await db.insert(users).select(
  db.select({
    name: tempUsers.name,
    email: tempUsers.email,
    role: tempUsers.role,
  }).from(tempUsers)
);
```
