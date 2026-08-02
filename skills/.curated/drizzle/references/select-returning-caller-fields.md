# select-returning-caller-fields

## Impact

**HIGH**

## Description

Select and return only the columns that callers actually access. Apply this at two levels:

1. **`.select({ … })`** — fetch only the columns the method body reads (e.g. `role`, `creditLimit`, `currentDebt`). Wildcard `select()` causes Postgres to send every column over the wire even when the code touches two.
2. **`.returning({ … })`** — return only what the caller uses. Default rule: if no column beyond existence is consumed, return `{ id: <table>.id }` only.

Exceptions:

- Return the full typed row (`TShippingBid`, `TPayment`, etc.) when the shape must satisfy an `interface` or the action passes the whole object to the client.
- Return only fields explicitly accessed in the calling action/route; trace all call-sites before deciding the minimum set.

## Incorrect

```typescript
// ❌ BAD: Wildcard select fetches all columns; returning() sends full row
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

## Correct

```typescript
//  GOOD: Only the columns the body actually reads
const [user] = await tx
  .select({
    role: users.role,
    creditLimit: users.creditLimit,
    currentDebt: users.currentDebt,
    name: users.name,
    email: users.email,
  })
  .from(users)
  .where(eq(users.id, userId))
  .for("update", { noWait: true });

//  GOOD: Caller only checks existence / uses .id
const [order] = await tx
  .update(orders)
  .set({ approvalStatus: "APPROVED" })
  .where(eq(orders.id, orderId))
  .returning({ id: orders.id });

//  GOOD: Caller accesses .shippingFee too
const [updatedOrder] = await tx
  .update(orders)
  .set({ shippingFee: bid.quotedPrice })
  .where(eq(orders.id, orderId))
  .returning({ id: orders.id, shippingFee: orders.shippingFee });

//  GOOD: Full typed row returned because interface requires TShippingBid
const [bid] = await tx.insert(shippingBids).values(data).returning({
  id: shippingBids.id,
  orderId: shippingBids.orderId,
  vendorName: shippingBids.vendorName,
  quotedPrice: shippingBids.quotedPrice,
  isSelected: shippingBids.isSelected,
  internalNote: shippingBids.internalNote,
  createdAt: shippingBids.createdAt,
  updatedAt: shippingBids.updatedAt,
});
```
