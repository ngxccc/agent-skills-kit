# schema-creation

## Impact

**CRITICAL**

## Description

Follow the workspace's custom conventions for database schema creation:

1. **Use `snakeCase.table` (instead of standard `pgTable`)** from `drizzle-orm/pg-core`. This automatically translates JavaScript camelCase property names to database snake_case column names, eliminating the need to explicitly define snake_case column names as string arguments in standard column builders (e.g. write `emailVerified: boolean().notNull()` instead of `emailVerified: boolean("email_verified").notNull()`).
2. **Mix in entity templates** from `./helpers.schema` to handle primary keys, timestamps, and soft deletes consistently across schemas:
   - `baseEntity`: Adds a UUIDv7-based `id` primary key and timezone-aware timestamps `createdAt` and `updatedAt`.
   - `fullEntity`: Adds a UUIDv7-based `id` primary key, timezone-aware timestamps `createdAt` and `updatedAt`, and a timezone-aware soft delete timestamp `deletedAt`.
3. **Use UUIDv7** as the default primary key type. UUIDv7 keys are sortable by time and prevent index fragmentation, unlike traditional random UUIDv4 keys.

## Incorrect

```typescript
import { pgTable, text, timestamp, uuid, boolean } from "drizzle-orm/pg-core";
import { v4 as uuidv4 } from "uuid";

// ❌ BAD: Avoid standard pgTable, manually writing snake_case strings for columns,
// and manually defining id/timestamps in every schema
export const products = pgTable("product", {
  id: uuid("id").primaryKey().$defaultFn(uuidv4),
  nameVi: text("name_vi").notNull(),
  nameEn: text("name_en"),
  brandId: uuid("brand_id").references(() => brands.id),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
```

## Correct

```typescript
import { snakeCase, text, uuid, boolean } from "drizzle-orm/pg-core";
import { fullEntity } from "./helpers.schema";
import { brands } from "./brand.schema";

//  GOOD: Uses snakeCase.table to automatically infer column names,
// and spreads fullEntity for unified primary key and timestamp fields
export const products = snakeCase.table(
  "product",
  {
    ...fullEntity, // Adds id (uuid v7), createdAt, updatedAt, and deletedAt
    nameVi: text().notNull(),
    nameEn: text(),
    brandId: uuid().references(() => brands.id, { onDelete: "set null" }),
    isQuoteOnly: boolean().notNull().default(false),
  },
  (table) => [index("product_brand_idx").on(table.brandId)],
);

export type TProduct = typeof products.$inferSelect;
export type TNewProduct = typeof products.$inferInsert;
```
