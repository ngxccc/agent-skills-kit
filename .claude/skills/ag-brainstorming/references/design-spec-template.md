---
name: reference:design-spec-template
description: "Standard Design Specification Template for non-high-risk features."
date: 2026-08-02
---

# Design Specification: <Feature Name>

**Status**: ⏳ Draft / ✅ Approved  
**Target Module**: `src/...`  
**Complexity**: Standard (Non-High-Risk)

---

## 1. Executive Summary & Goals

- **Core Goal**: [1-2 sentences describing business purpose and architecture goals]
- **In-Scope**: [List of explicit functional requirements]
- **Out-of-Scope**: [Scope boundaries to prevent scope creep]

---

## 2. Architecture & Design Choices

- **Chosen Approach**: [Summary of selected approach from Trade-off Matrix]
- **Component & File Layout**: [Folder structure, new components, state stores]

| Option       | Description       | Pros           | Cons         | Decision     |
| :----------- | :---------------- | :------------- | :----------- | :----------- |
| **Option A** | _Chosen Approach_ | _Key benefits_ | _Trade-offs_ | **Selected** |
| **Option B** | _Alternative_     | _Key benefits_ | _Trade-offs_ | Rejected     |

---

## 3. UI/UX & Component Interfaces

- **UI Components**: [List of React / Tailwind components]
- **State Management**: [Zustand store / React state hooks]
- **User Flow & Interaction**: [UI state transitions, loading/error states]

---

## 4. API & Data Contracts

- **TypeScript DTOs / Schemas**: [Data payload contracts]
- **API Surface**: [tRPC router procedures or REST endpoints]

---

## 5. Domain A–G Engineering Evaluation

- **Security (Domain A)**: [Input validation, RBAC boundaries]
- **Performance (Domain C)**: [Bundle size, query efficiency]
- **Reliability (Domain D)**: [Fail-safe boundaries, idempotency]
- **Maintainability (Domain E)**: [Clean architecture, type safety]
