# type-union-exclude

## Impact

**CRITICAL**

## Description

Use `Exclude<T, U>` for filtering string literal union types and `Omit<T, K>` only for object/interface types.

## Incorrect

```typescript
type PaymentMethod = "PAYOS" | "CASH" | "TRADE_CREDIT";

// ❌ BAD: Type wrongPayment is corrupted. Omit acts on properties of the global String prototype.
type WrongPayment = Omit<PaymentMethod, "TRADE_CREDIT">;
```

## Correct

```typescript
type PaymentMethod = "PAYOS" | "CASH" | "TRADE_CREDIT";

//  GOOD: Filtered correctly, resolves to "PAYOS" | "CASH"
type PublicPayment = Exclude<PaymentMethod, "TRADE_CREDIT">;
```
