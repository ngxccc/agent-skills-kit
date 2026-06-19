# select-yagni-returning

## Impact

**HIGH**

## Description

Avoid wildcard queries (`SELECT *`) in database services. Select only the columns needed to satisfy the return DTO. Apply the YAGNI (You Aren't Gonna Need It) principle to `.returning()` clauses of write operations.

## Incorrect

```typescript
// ❌ BAD: Fetches all columns, and writes back all columns in returning()
const [repayment] = await db
  .select()
  .from(debtRepayments)
  .where(eq(debtRepayments.id, id));

const [updated] = await db.update(debtRepayments).set(data).returning();
```

## Correct

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
