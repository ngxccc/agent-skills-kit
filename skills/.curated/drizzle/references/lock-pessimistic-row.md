# lock-pessimistic-row

## Impact

**CRITICAL**

## Description

Use pessimistic row locking (`.for("update", { noWait: true })`) in transaction boundaries when reading balances, credit limits, or stock quantities that are about to be modified. This prevents concurrent write hazards, double-spending, and race conditions.

## Incorrect

```typescript
// ❌ BAD: Read is not locked, concurrent checkouts can cause race conditions (double spend)
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

## Correct

```typescript
//  GOOD: Locks the row immediately, preventing race conditions or throwing early if locked
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
    if (err instanceof Error && err.message.includes("could not obtain lock")) {
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
