# error-handling-undefined-vs-throw

## Impact

**MEDIUM**

## Description

Differentiate between normal query outcomes and system/validation errors:

1. **Return `undefined`** (or `null`) in read-only lookup queries when a record is not found. This allows standard client-side conditional flow controls without forcing verbose `try/catch` wrapping.
2. **Throw an exception (`throw new Error`)** for database mutation failures (`INSERT`, `UPDATE`), transactions, webhook reconciliation mismatches, or critical business logic invariants (such as credit limit checks).

## Incorrect

```typescript
// ❌ BAD: Forces caller to use try/catch for simple user verification query
async function getProfile(id: string): Promise<UserDTO> {
  const user = await db.select().from(users).where(eq(users.id, id)).limit(1);
  if (!user) throw new Error("User not found");
  return user;
}
```

## Correct

```typescript
//  GOOD: Read queries return undefined on miss
async function getProfile(id: string): Promise<UserDTO | undefined> {
  const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);
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
