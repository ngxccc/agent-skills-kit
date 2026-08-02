# Duma Neobrutalist Redesign Plan

**Date**: August 1, 2026  
**Complexity**: SIMPLE (One-session)  
**Implementation Approach**: Standalone Client Component Architecture + Zustand Store + Neobrutalist Design System  
**Execution Model**: Continuous Implementation with Post-Testing  
**Formal Spec Path**: `process/features/duma-redesign/active/Duma_Redesign_Formal_Spec.md`  
**Risk Gate Artifact**: `process/features/duma-redesign/reports/harness/risk-gate.json`  
**Invariant Bindings**: `INV-1 (Neobrutalist Aesthetic Integrity)`, `INV-2 (Complete Mock Data Parity)`, `INV-3 (Zero Runtime State Mutation Loss)`

## Touchpoints

- **Files Read**: `src/app/globals.css`, `src/lib/mockData.ts`
- **Files Modified**: `src/app/layout.tsx`, `src/app/page.tsx`, `tailwind.config.ts`
- **Files Created**: `src/components/SwipeFeed.tsx`, `src/components/ActivityCard.tsx`, `src/components/Chat.tsx`, `src/components/Profile.tsx`, `src/components/BottomNav.tsx`

## Public Contracts

### UI Component Interfaces

1. `SwipeFeed`: Interactive activity card stack with swipe gestures (left/right/up)
2. `ActivityDetailDrawer`: Bottom sheet displaying host profile and attendee breakdown
3. `UserProfileDrawer`: Bio, activity stats, and mutual friend rankings

## Blast Radius

Single-session standalone UI frontend, zero database/API boundary impact. UI component addition, Neobrutalist CSS theme extensions, and Zustand client store setup.

## Harness & Mechanical Validation

Before phase transition or PR merge, run:

```bash
node .claude/skills/ag-generate-plan/scripts/validate-plan-artifact.mjs process/development-protocols/references/example-simple-prd.md
```

## Overview

Rebuild the Duma social activity discovery app with identical features and mock data, but redesigned with a neobrutalist + Gumroad minimalist aesthetic (rounded, easy on the eyes, modern, friendly, creative, cool). Update tech stack to pnpm, Next.js App Router, Tailwind CSS 4, and latest React Router + React Query patterns.

**Status**: ⏳ PLANNED (PHASE_1_PLAN_ACTIVE)

---

## Quick Links

- [Context and Goals](#1-context-and-goals)
- [Execution Brief](#15-execution-brief)
- [Architecture Decisions](#3-architecture-decisions-final)
- [System Invariants](#4-system-invariants--reliability-invariants)
- [Implementation Checklist](#implementation-checklist)
- [Verification Evidence](#verification-evidence)
- [Resume and Execution Handoff](#resume-and-execution-handoff)

---

## 1. Context and Goals

Rebuild the Duma social activity discovery app with identical features and mock data, but redesigned with a neobrutalist + Gumroad minimalist aesthetic.

**In-scope**:

- All original features: SwipeFeed, ActivityCard, ActivityDetailDrawer, UserProfileDrawer, MyActivities, HostedActivities, Profile, Chat, BottomNav
- Complete mock data migration (users, activities, conversations, join requests)
- Neobrutalist design system implementation

**Out-of-scope**:

- Backend integration or real API calls (use `mockData.ts`)
- Real-time WebSocket chat

---

## 1.5 Execution Brief

### Phase A: Project Setup & Dependencies

- Initialize Next.js 15 with pnpm, upgrade to Tailwind CSS 4, install dependencies.

### Phase B: Design System & Tokens

- Create neobrutalist color palette and CSS variables in `globals.css`.

### Phase C: Data Layer & Mock Models

- Create `src/lib/types.ts` and `src/lib/mockData.ts` with complete interfaces and mock data.

### Phase D: Core UI Primitives & Navigation

- Build Button, Card, Badge, Drawer components and fixed `BottomNav.tsx`.

### Phase E: Feature Components & Verification

- Build SwipeFeed, ActivityCard, Drawers, MyActivities, Hosted, Profile, and Chat components.

---

## Phase Completion Rules

1. Mỗi bước thực thi (Phase A–E) phải thỏa mãn 100% nguyên tắc bất biến (`INV-1`..`INV-3`).
2. Biên dịch TypeScript `pnpm check-types` hoặc `bun run check-types` đạt 0 lỗi trước khi hoàn tất.
3. Không làm hỏng các UI components hiện tại trong dự án.

---

## Acceptance Criteria

1. **AC-1:** Gửi tương tác vuốt trên SwipeFeed $\rightarrow$ Card chuyển động mượt mà và chuyển trạng thái đúng.
2. **AC-2:** Nhấp vào chi tiết hoạt động $\rightarrow$ `ActivityDetailDrawer` trượt lên hiển thị thông tin đầy đủ.
3. **AC-3:** Nhấp gửi tin nhắn trong Chat $\rightarrow$ Tin nhắn xuất hiện tức thì và kích hoạt câu trả lời giả lập sau 1s.

---

## 3. Architecture Decisions (Final)

1. **Neobrutalist Design Tokens**: Sử dụng viền đen 2px, box-shadow offset 4px 4px 0px #000, màu sắc tương phản cao.
2. **Client-Side Mock Store**: Dùng Zustand / React Query quản lý trạng thái tương tác client-side mà không phụ thuộc backend.

---

## 4. System Invariants & Reliability Invariants

- `INV-1`: Neobrutalist Aesthetic Integrity (`box-shadow: 4px 4px 0px #000`, 2px solid borders).
- `INV-2`: Complete Mock Data Parity (users, activities, conversations, join requests).
- `INV-3`: Zero Runtime State Mutation Loss (Zustand/React Query client-side state).

---

## 11. Database Schema

_(Single-session client prototype — uses `src/lib/mockData.ts` and `src/lib/types.ts` data contracts)_

---

## 12. API Surface

_(Client-side interactive prototype consuming `mockData.ts`)_

---

## 14. Phased Delivery Plan

| Phase         | Description                | Deliverable                                 |
| :------------ | :------------------------- | :------------------------------------------ |
| **Phase A–B** | Setup & Design System      | `package.json` + `globals.css` theme tokens |
| **Phase C–D** | Data Layer & UI Primitives | `mockData.ts` + `Button`, `Card`, `Drawer`  |
| **Phase E**   | Features & Verification    | Complete Duma Neobrutalist app              |

---

## Implementation Checklist

### Primitive Atomic WBS Table

| Target File / Artifact            | Bound Invariant | Verification Command |
| :-------------------------------- | :-------------- | :------------------- |
| `src/app/globals.css`             | `INV-1`         | `pnpm check-types`   |
| `src/lib/mockData.ts`             | `INV-2`         | `pnpm check-types`   |
| `src/components/SwipeFeed.tsx`    | `INV-3`         | `pnpm check-types`   |
| `src/components/ActivityCard.tsx` | `INV-1`         | `pnpm check-types`   |
| `src/components/BottomNav.tsx`    | `INV-1`         | `pnpm check-types`   |

---

## Verification Evidence

1. **TypeScript Type Safety:** `pnpm check-types` passes with 0 errors.
2. **ESLint Clean:** `pnpm lint` passes with 0 warnings.
3. **Unit & Integration Tests:** `pnpm test` passes 100%.
4. **Mechanical Validation:** `node .claude/skills/ag-generate-plan/scripts/validate-plan-artifact.mjs process/development-protocols/references/example-simple-prd.md` passes with 0 errors.
5. **Context Alignment:** Aligned with `process/context/all-context.md` and `process/context/tests/all-tests.md`.

---

## Resume and Execution Handoff

- **Plan File Path:** `process/development-protocols/references/example-simple-prd.md` (this file)
- **Harness Risk Gate:** `process/features/duma-redesign/reports/harness/risk-gate.json` $\rightarrow$ `PHASE_1_PLAN_ACTIVE`
- **Next Instruction:** Nhập `ENTER EXECUTE MODE` hoặc `tiến hành` để khởi chạy Phase 2 và Phase 3 theo đúng quy trình RIPER-5.
