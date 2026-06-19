# Single Source of Truth + Type Derivation

## Definition

**Single Source of Truth (SSOT) + Type Derivation** is a modern TypeScript architectural pattern that uses a single `const` object as the authoritative definition of a set of keys, from which both runtime configuration and TypeScript types are derived.

### Core Mechanism

```typescript
export const CONFIG = {
  fieldA: true,
  fieldB: true,
} as const;

export type DerivedType = {
  [K in keyof typeof CONFIG]: SomeBaseType[K];
};
```

### Why This Pattern Exists

Traditional approaches suffer from **three-way duplication**:

1. Keys written in the query / config object
2. Keys written in the DTO / interface definition (`Pick<...>`)
3. Keys written in the mapping / transformation logic

This duplication is fragile. When a new field is added or removed, all three locations must be updated manually. Over time, drift occurs, leading to runtime `undefined` values or over-fetching.

The SSOT pattern eliminates this by making the **const object** the only place where the list of keys is written. Everything else is derived.

### Technical Components

1. **`as const`** — Locks the object shape at the type level, turning string literals into literal types.
2. **Mapped Type** (`[K in keyof typeof CONFIG]`) — Derives a new type whose keys are exactly the keys of the const object.
3. **`satisfies` Operator** — Ensures the constructed value matches the derived type at compile time without widening.

### Benefits

- **Compile-time enforcement**: Adding a key in one place either works everywhere or produces a type error.
- **No drift**: The query, DTO, and mapper are guaranteed to stay in sync.
- **YAGNI by default**: Only fields explicitly listed in the const are fetched or exposed.
- **Discoverability**: The const object serves as living documentation of what data is actually used.

### When NOT to Use

- One-off queries that are never reused
- Internal implementation details that have no corresponding DTO
- Cases where the full schema type is intentionally required (rare)

This pattern is the TypeScript equivalent of "data-oriented programming" combined with "type-driven development".
