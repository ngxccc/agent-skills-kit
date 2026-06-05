---
title: Prefer Property Syntax Over Method Syntax to Avoid Bivariance Holes
impact: HIGH
impactDescription: prevents 100% of unsound function-parameter assignability on interface members
tags: mod, bivariance, method-syntax, property-syntax, soundness
---

## Prefer Property Syntax Over Method Syntax to Avoid Bivariance Holes

TypeScript's `strictFunctionTypes` makes function-type assignability contravariant in parameters — for function-typed _property_ members. For _method_ members (declared with the method-call syntax `name(...): T`), it intentionally keeps **bivariant** parameter checking for backward compatibility with array methods on subtypes. The result: the same logical signature is sound under one declaration style and unsound under the other. Library authors writing interfaces consumed by structural-subtyping code should default to property syntax everywhere parameters matter.

**Incorrect (method syntax — bivariance hole accepts an unsound assignment):**

```typescript
class Animal {
  name = "";
}
class Dog extends Animal {
  breed = "";
}

interface Listener<T> {
  notify(value: T): void; // method syntax — bivariant parameter
}

const dogListener: Listener<Dog> = {
  notify(d) {
    console.log(d.breed);
  },
};
const animalListener: Listener<Animal> = dogListener;
// ^ Accepted even under strict mode. animalListener.notify(new Animal()) crashes at runtime
//   because notify expects a Dog (accesses .breed).
animalListener.notify(new Animal()); // 💥 TypeError: cannot read property 'breed' of undefined
```

**Correct (property syntax — contravariant parameters under strictFunctionTypes):**

```typescript
interface Listener<T> {
  notify: (value: T) => void; // property syntax — contravariant parameter
}

const dogListener: Listener<Dog> = { notify: (d) => console.log(d.breed) };
const animalListener: Listener<Animal> = dogListener;
// ^ Error: Type 'Listener<Dog>' is not assignable to type 'Listener<Animal>'.
//   Types of property 'notify' are incompatible.
```

The same code, the same intent — different soundness because of where the `(` sits.

**Quick reference:**

| Syntax                            | Where it appears       | Parameter variance                                     |
| --------------------------------- | ---------------------- | ------------------------------------------------------ |
| `notify(v: T): void`              | interface, type, class | **Bivariant** (unsound)                                |
| `notify: (v: T) => void`          | interface, type        | **Contravariant** (sound, under `strictFunctionTypes`) |
| `notify(v: T): void` in a `class` | class method           | Bivariant — same hole                                  |
| `notify = (v: T): void => …`      | class field with arrow | Contravariant — sound                                  |

The bivariance hole is preserved deliberately for `Array<T>` and DOM types — too much code relies on it (`Array<Dog>` assignable to `Array<Animal>` works only because `forEach(callbackfn(value: T))` is bivariant in `T`). When writing a _new_ interface that doesn't need that legacy escape hatch, choose property syntax.

In classes, fields with arrow functions also use contravariant typing — but they have a different cost (per-instance allocation, no `super` access). Reserve them for the cases where soundness matters more than memory.

**When NOT to apply:**

- When deliberately modelling collection-like types that should follow array variance — rare in application code, occasionally needed when polyfilling built-in shapes.
- Class methods where you need `super` access or method-decoration. The bivariance hole is the cost of doing business with class semantics; either accept it or shift the surface to a function returning an object literal.

**Scope delta:**

- No existing TypeScript skill in this repo covers the method-vs-property bivariance hole. It is the single most common source of unsound assignability bugs in libraries declaring callback-bearing interfaces.

Reference: [TypeScript 2.6 Release Notes — `--strictFunctionTypes`](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-6.html#strict-function-types)
