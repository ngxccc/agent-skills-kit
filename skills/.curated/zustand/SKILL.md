---
name: zustand
description: "Rules and standards for state management using Zustand in React and Next.js. Use when implementing client-side stores, persistence with localStorage, or preventing SSR hydration mismatch."
license: MIT
argument-hint: "[no-args]"
metadata:
  author: ngxc
  version: "1.0.0"
---

# Zustand State Management

Zustand is a lightweight, fast, and opinionated state management library for React. It is especially useful for client-side state, shopping carts, and local caches. This skill outlines the patterns, best practices, and Next.js SSR hydration guidelines for Zustand.

## When to Apply

Use this skill when:

- Creating a new Zustand store or refactoring an existing store in the B2B Storefront or Admin application.
- Configuring state persistence with `localStorage` or other storage backends using the `persist` middleware.
- Preventing Next.js Hydration Mismatch errors during SSR and client hydration.
- Ensuring state updates are strictly immutable (no direct mutations).
- Implementing data flow between Zustand client stores and Next.js Server Actions.

## How to Use

### 1. Store Definition & Immutability

Ensure state updates are strictly immutable. Do not mutate state objects or arrays directly. Always use spread operators (`...`) or non-mutating array methods (`map`, `filter`, `concat`).

```typescript
import { create } from "zustand";

interface UserState {
  users: Array<{ id: string; name: string }>;
  addUser: (user: { id: string; name: string }) => void;
}

export const useUserStore = create<UserState>((set) => ({
  users: [],
  addUser: (newUser) =>
    set((state) => ({
      users: [...state.users, newUser], // Clean, immutable update
    })),
}));
```

### 2. State Persistence & Partialize

When using the `persist` middleware, exclude transient UI states (like `isOpen`, `isLoading`, or `error`) from the persistent storage to avoid bad user experience upon page reloads. Use `partialize` to select only the fields that need to be persisted.

```typescript
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,
      setIsOpen: (isOpen) => set({ isOpen }),
    }),
    {
      name: "cart-storage",
      partialize: (state) => ({ items: state.items }), // Persists only items
    },
  ),
);
```

### 3. Next.js SSR & Hydration Mismatch Avoidance

Next.js Server-Side Rendering (SSR) compiles the initial page render on the server, while `localStorage` is only available on the client. To avoid hydration mismatches, use one of the following strategies:

#### Strategy A: Safe `useMounted` State Selector Hook (Recommended)

Export a wrapper hook that subscribes to the Zustand store but only returns the selected state after the component has successfully mounted.

```typescript
import { useState, useEffect } from "react";

export function useCart<T>(selector: (state: CartState) => T): T | undefined {
  const store = useCartStore(selector);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  return isMounted ? store : undefined;
}
```

#### Strategy B: Manual Hydration (`skipHydration: true`)

Set `skipHydration: true` in the persist configuration, and manually trigger `rehydrate()` on mount in a root client layout or provider.

```typescript
// store.ts
persist(
  (set) => ({ ... }),
  {
    name: "store-name",
    skipHydration: true,
  }
)

// client-provider.tsx
useEffect(() => {
  useCartStore.persist.rehydrate();
}, []);
```

### 4. Naming Guidelines

- **No Hungarian Notation**: Do not prefix interfaces with `I` (e.g. use `CartState` instead of `ICartState`).
- **No Type Prefixing**: Do not prefix type aliases with `T` (e.g. use `CartItem` instead of `TCartItem`).
- **Generics**: Generic parameters should be prefixed with `T` (e.g. `T`).

## References

- [Zustand Official Documentation](https://github.com/pmndrs/zustand)
- [Persist Middleware Reference Guide](https://zustand.docs.pmnd.rs/reference/middlewares/persist)
- [Next.js Hydration Mismatch Documentation](https://nextjs.org/docs/messages/react-hydration-error)
