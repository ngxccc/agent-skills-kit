# dto-omit-for-objects

## Impact

**CRITICAL**

## Description

Always define Data Transfer Objects (DTOs) using the TypeScript `Omit` utility type to exclude sensitive database fields (such as `password`) and audit fields (`createdAt`, `updatedAt`, `deletedAt`) from being exposed to the presentation or action layers.

## Incorrect

```typescript
// ❌ BAD: Exposes password and system audit metadata directly to the caller
export async function getB2BProfile(id: string): Promise<TUser | undefined> {
  return await db.query.users.findFirst({ where: { id } });
}
```

## Correct

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
