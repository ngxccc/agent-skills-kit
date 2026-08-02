# Query Consolidation via Conditional Aggregation (style-conditional-aggregation)

Consolidate multiple aggregate queries on the same table into a single query to reduce database roundtrips, connection overhead, and table scans.

## Rule

Avoid executing multiple sequential queries to aggregate metrics from the same table (e.g., total counts, sums, counts for specific date ranges, etc.). Instead, use SQL `CASE WHEN` inside Drizzle `sql` expressions to collect multiple metrics in a single table scan. Combine independent queries using `Promise.all` for parallel execution.

## Code Examples

### ❌ Bad: Multiple sequential queries on the same table

This code makes three database roundtrips, initiating three separate table scans on the `order` table:

```typescript
// ❌ BAD: High connection overhead and redundant table scans
const totalOrders = await db.select({ count: sql`count(*)` }).from(orders);

const activeRevenue = await db
  .select({ sum: sql`sum(amount)` })
  .from(orders)
  .where(ne(orders.status, "CANCELLED"));

const current30DaysRevenue = await db
  .select({ sum: sql`sum(amount)` })
  .from(orders)
  .where(
    and(ne(orders.status, "CANCELLED"), gte(orders.createdAt, thirtyDaysAgo)),
  );
```

### ✅ Good: Single query with conditional aggregates

This code makes a single database roundtrip, executing a single table scan on the `order` table:

```typescript
// ✅ GOOD: Low overhead and single table scan
const [metrics] = await db
  .select({
    totalOrders: sql<number>`count(*)::integer`,
    totalRevenue: sql<string>`coalesce(sum(case when ${orders.status} != 'CANCELLED' then ${orders.totalAmount} else 0 end), '0')`,
    currentRevenue: sql<string>`coalesce(sum(case when ${orders.status} != 'CANCELLED' and ${orders.createdAt} >= ${thirtyDaysAgo} then ${orders.totalAmount} else 0 end), '0')`,
    currentOrders: sql<number>`count(case when ${orders.status} != 'CANCELLED' and ${orders.createdAt} >= ${thirtyDaysAgo} then 1 else null end)::integer`,
  })
  .from(orders);
```

## Why it matters

1. **Reduced Roundtrips**: Query latency scales with network roundtrips. Consolidating 7 queries into 3 reduces connection overhead and latency.
2. **Single Table Scan**: PostgreSQL can compute multiple conditional sums and counts in a single pass over the table rows rather than reading the table multiple times.
3. **Driver and Type Safety**: Using `::integer` typecast in SQL tells Drizzle to return numeric counts directly rather than parsing PostgreSQL `bigint` count values as strings.
