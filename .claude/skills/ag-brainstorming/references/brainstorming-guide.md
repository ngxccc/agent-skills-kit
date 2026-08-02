# Brainstorming Framework & Protocol Reference Guide

> **Operational Purpose:** Detailed reference documentation for the `ag-brainstorming` skill, covering the 7 Foundational Engineering Domains (A–G), Dynamic Domain Inference, System Invariant Discovery, and Deliverable Artifact standards.

---

## 1. Foundational Baseline Domains (A – G) & Dynamic Inference

During brainstorming, evaluate the proposed design using the **7 Baseline Domains**:

1. **Domain A: Security & Data Privacy**
   - AuthN/AuthZ boundaries, Principle of Least Privilege, Zero Trust access controls.
   - Input validation (Zod schemas), protection against OWASP Top 10 (SQLi, XSS, CSRF).
   - Sensitive data encryption (at rest & in transit), PII handling, audit logging.

2. **Domain B: UI/UX & Usability**
   - Interaction design, user flows, visual hierarchy, layout responsiveness (Tailwind).
   - Accessibility (WCAG standards, keyboard navigation, ARIA attributes).
   - Loading/empty states, optimistic UI, clear error feedback messaging.

3. **Domain C: Performance & Scalability**
   - Latency budgets, throughput targets, rendering/page load time optimization.
   - Database query efficiency (N+1 query elimination, indexing, pagination).
   - Asset & bundle size optimization, caching strategy (Redis, HTTP Cache-Control), rate limiting.

4. **Domain D: Reliability & Resilience**
   - System stability, idempotency guarantees (`INV-2`), fail-safe boundaries.
   - Retry strategies with exponential backoff, transaction boundaries, DB fallback mechanisms.
   - Data integrity, graceful degradation under unexpected failures.

5. **Domain E: Maintainability & Architecture**
   - Zero-Duplicate-Convention compliance, clean architecture & separation of concerns.
   - Design pattern selection (GoF / Functional patterns), strict type safety (TypeScript DTOs).
   - Modularity, low coupling, clarity for the 6-month maintainer.

6. **Domain F: Observability & Operations**
   - Structured logging, error telemetry (Sentry), key operational metrics (RED/USE signals).
   - Operational runbooks, deployment strategy, feature flags, health checks.

7. **Domain G: Business & Compliance**
   - Business invariants (`INV-1`), domain rules, state machine transitions.
   - Regulatory compliance (GDPR, PCI-DSS, licensing), SLA commitments, operational cost limits.

---

### Open-Ended Dynamic Domain Inference Rule

> **Agent Dynamic Reasoning Directive:** The 7 baseline domains above are a foundational guide, NOT a closed ceiling. Depending on the feature context, dynamically evaluate specialized domains as needed (e.g., _Domain H: Pedagogy & Cognitive Load Theory_, _Domain I: Offline-First Sync_, _Domain J: Real-time WebSockets / Streaming_).

---

## 2. Core Discovery Elements

1. **System Invariants (`INV-*`):** Non-negotiable logic rules that MUST NEVER be violated under any execution state.
2. **Fail-Safe Boundary:** Safe fallback state when unexpected system failures or network exceptions occur.
3. **Edge Cases & Adversarial Matrix:** Race conditions, boundary limits, corrupted inputs, and concurrent state mutations.

---

## 3. Deliverable Artifact Standards

Upon completing brainstorming:

1. **Formal Specification File:**
   - Path: `process/features/[feature-slug]/active/[feature-slug]-[topic-slug]-formal-spec.md`
   - Formatted per `process/development-protocols/references/formal-spec-template.md`.
2. **Architectural Decision Record (ADR):**
   - Path: `docs/adr/000X-[kebab-case-name].md`
3. **Harness Manifest (`risk-gate.json`):**
   - Path: `process/features/[feature-slug]/reports/harness/[planSlug]/risk-gate.json`
