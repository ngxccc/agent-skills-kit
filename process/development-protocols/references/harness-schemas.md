---
title: Harness JSON Artifacts Schema & Specification (SSOT v2.0.0)
tags:
  - type/specification
  - topic/harness
  - ssot
docType: specification
date: 2026-08-01
version: 2.0.0
---

# Harness JSON Artifacts Schema & Specification (SSOT v2.0.0)

This document defines the authoritative JSON Schema (Draft-07 compliant) structures for all harness report artifacts stored in `process/features/[feature]/reports/harness/[planSlug]/` or `process/general-plans/reports/harness/[planSlug]/`.

V2.0.0 reverse-engineers and formalizes the rich enterprise verification manifests containing architectural traces, Quality Gate reports, and Property-Based/Adversarial matrices.

---

## 1. `risk-gate.json` Schema & Template

**Purpose**: Declares risk classification, system invariants, formal specification/ADR links, verification gates, and pre-finalize stop flags.

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": [
    "formalSpecPath",
    "riskClass",
    "invariants",
    "verificationGates",
    "status"
  ],
  "properties": {
    "featureSlug": { "type": "string" },
    "feature": { "type": "string" },
    "topic": { "type": "string" },
    "formalSpecPath": { "type": "string" },
    "adrPath": { "type": "string" },
    "adversarialValidationPath": { "type": "string" },
    "planPath": { "type": "string" },
    "riskClass": { "type": "string" },
    "mustStopBeforeFinalize": { "type": "boolean" },
    "invariants": {
      "type": "array",
      "items": { "type": "string" }
    },
    "verificationGates": {
      "type": "object",
      "additionalProperties": { "type": "string" }
    },
    "status": {
      "type": "string",
      "enum": [
        "CODE_DONE_VERIFIED",
        "PENDING",
        "IN_PROGRESS",
        "APPROVED",
        "REJECTED"
      ]
    },
    "updatedAt": { "type": "string" },
    "createdAt": { "type": "string" }
  }
}
```

### Rich Production Template (`risk-gate.json`)

```json
{
  "feature": "booking",
  "topic": "payment-confirmation",
  "formalSpecPath": "process/features/booking/active/Payment_Confirmation_Formal_Spec.md",
  "adrPath": "second-brain/Docs/ADRs/0004-payment-confirmation-architecture.md",
  "adversarialValidationPath": "process/features/booking/reports/harness/payment_PLAN_01-08-26/adversarial-validation.json",
  "planPath": "process/features/booking/active/payment_PLAN_01-08-26.md",
  "riskClass": "High-Risk Class (Billing & Payment Transactions)",
  "mustStopBeforeFinalize": true,
  "invariants": [
    "INV-1: Atomicity & Anti-Double-Processing via DB Pessimistic Locking",
    "INV-2: Transactional Dual-Write Outbox & 7-Day Retention",
    "INV-3: Expiry, Locking & Idempotency Safety",
    "INV-4: Reconciliation & Auto-Refund Safety (PaymentReconciliationProcessor)",
    "INV-5: Strict Ownership & Anti-Enumeration Defense",
    "INV-6: PayOS Signature Verification & Anti-Replay Defense",
    "INV-7: Redis Fail-Closed Fallback",
    "INV-8: DB Statement Timeout & Observability Guard",
    "INV-9: UI/UX State Machine & Status Polling Contract"
  ],
  "verificationGates": {
    "typeCheck": "PASSED (0 type errors)",
    "linter": "PASSED (0 lint warnings/errors)",
    "unitTests": "PASSED (13/13 tests pass)",
    "supertestSpecs": "PASSED (8 Supertest E2E specs in test/integration/booking.spec.ts)",
    "migration": "GENERATED (drizzle/20260801004446_fair_natasha_romanoff/migration.sql)"
  },
  "status": "CODE_DONE_VERIFIED",
  "updatedAt": "2026-08-01T00:00:00.000Z"
}
```

---

## 2. `adversarial-validation.json` Schema & Template

**Purpose**: Stores the frozen Level 2 Property-Based & Adversarial Test Matrix (TDD RED / GREEN).

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["formalSpecPath", "status", "testSuite"],
  "properties": {
    "featureSlug": { "type": "string" },
    "feature": { "type": "string" },
    "topic": { "type": "string" },
    "formalSpecPath": { "type": "string" },
    "adrPath": { "type": "string" },
    "status": {
      "type": "string",
      "enum": ["GREEN_PASSED", "RED_FROZEN", "FAILED"]
    },
    "verifiedAt": { "type": "string" },
    "frozenAt": { "type": "string" },
    "testSuite": {
      "type": "object",
      "required": ["propertyBasedTests", "adversarialMatrix", "edgeCases"],
      "properties": {
        "propertyBasedTests": {
          "type": "array",
          "items": {
            "type": "object",
            "required": ["id", "name", "boundInvariant", "status"],
            "properties": {
              "id": { "type": "string" },
              "name": { "type": "string" },
              "boundInvariant": { "type": "string" },
              "status": { "type": "string" }
            }
          }
        },
        "adversarialMatrix": {
          "type": "array",
          "items": {
            "type": "object",
            "required": ["id", "scenario", "status"],
            "properties": {
              "id": { "type": "string" },
              "scenario": { "type": "string" },
              "status": { "type": "string" }
            }
          }
        },
        "edgeCases": {
          "type": "array",
          "items": {
            "type": "object",
            "required": ["id", "scenario", "status"],
            "properties": {
              "id": { "type": "string" },
              "scenario": { "type": "string" },
              "status": { "type": "string" }
            }
          }
        }
      }
    },
    "verificationResults": {
      "type": "object",
      "additionalProperties": { "type": "string" }
    }
  }
}
```

### Rich Production Template (`adversarial-validation.json`)

```json
{
  "feature": "booking",
  "topic": "payment-confirmation",
  "formalSpecPath": "process/features/booking/active/Payment_Confirmation_Formal_Spec.md",
  "adrPath": "second-brain/Docs/ADRs/0004-payment-confirmation-architecture.md",
  "status": "GREEN_PASSED",
  "verifiedAt": "2026-08-01T00:00:00.000Z",
  "testSuite": {
    "propertyBasedTests": [
      {
        "id": "PBT-01",
        "name": "Pessimistic Locking & Anti-Double Confirmation",
        "boundInvariant": "INV-1",
        "status": "PASSED"
      },
      {
        "id": "PBT-02",
        "name": "Transactional Outbox Dual-Write Integrity",
        "boundInvariant": "INV-2",
        "status": "PASSED"
      }
    ],
    "adversarialMatrix": [
      {
        "id": "ADV-1",
        "scenario": "Confirm vs Expiry Timeout Race Condition",
        "status": "PASSED"
      },
      {
        "id": "ADV-2",
        "scenario": "Concurrent PayOS Webhooks at t=0ms",
        "status": "PASSED"
      }
    ],
    "edgeCases": [
      {
        "id": "EDGE-1",
        "scenario": "Payment Amount Mismatch",
        "status": "PASSED"
      }
    ]
  },
  "verificationResults": {
    "typeCheck": "0 errors",
    "linter": "0 warnings/errors",
    "unitTests": "13/13 tests passed",
    "supertestSpecs": "8 Supertest E2E specs passed"
  }
}
```

---

## 3. `verification.json` Schema & Template

**Purpose**: Logs execution test results, layer-by-layer coverage maps, and Counter-Example JSON payloads (TDD GREEN).

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": [
    "status",
    "verificationResults",
    "invariantsVerified",
    "edgeCasesCoverage",
    "adversarialMatrixCoverage"
  ],
  "properties": {
    "featureSlug": { "type": "string" },
    "feature": { "type": "string" },
    "topic": { "type": "string" },
    "formalSpecPath": { "type": "string" },
    "contractVersion": { "type": "string" },
    "verifiedAt": { "type": "string" },
    "status": {
      "type": "string",
      "enum": ["GREEN_PASSED", "PASS", "FAIL"]
    },
    "totalTestsRun": { "type": "number" },
    "passCount": { "type": "number" },
    "failCount": { "type": "number" },
    "verificationResults": {
      "type": "object",
      "additionalProperties": { "type": "string" }
    },
    "invariantsVerified": {
      "type": "array",
      "items": { "type": "string" }
    },
    "edgeCasesCoverage": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["id", "name", "layer", "status"],
        "properties": {
          "id": { "type": "string" },
          "name": { "type": "string" },
          "layer": { "type": "string" },
          "status": { "type": "string" }
        }
      }
    },
    "adversarialMatrixCoverage": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["id", "name", "layer", "status"],
        "properties": {
          "id": { "type": "string" },
          "name": { "type": "string" },
          "layer": { "type": "string" },
          "status": { "type": "string" }
        }
      }
    },
    "counterExampleLoop": {
      "type": "object",
      "properties": {
        "failuresEncountered": { "type": "number" },
        "counterExamples": { "type": "array" }
      }
    },
    "counterExamples": {
      "type": "array",
      "items": {
        "type": "object",
        "required": [
          "violatedInvariant",
          "counterExample",
          "instructionForCoder"
        ],
        "properties": {
          "violatedInvariant": { "type": "string" },
          "counterExample": { "type": "object" },
          "instructionForCoder": { "type": "string" }
        }
      }
    }
  }
}
```

### Rich Production Template (`verification.json`)

```json
{
  "feature": "booking",
  "topic": "payment-confirmation",
  "formalSpecPath": "process/features/booking/active/Payment_Confirmation_Formal_Spec.md",
  "contractVersion": "Payment Plan Contract: EXECUTE (TDD GREEN)",
  "verifiedAt": "2026-08-01T00:00:00.000Z",
  "status": "GREEN_PASSED",
  "totalTestsRun": 21,
  "passCount": 21,
  "failCount": 0,
  "verificationResults": {
    "typeCheck": "PASSED (0 errors)",
    "linter": "PASSED (0 errors, 0 warnings)",
    "unitTests": "PASSED (13/13 tests pass in src/modules/booking/)",
    "supertestSpecs": "PASSED (8 Supertest E2E specs in test/integration/booking.spec.ts)"
  },
  "invariantsVerified": [
    "INV-1: Atomicity & Anti-Double-Processing via DB Pessimistic Locking"
  ],
  "edgeCasesCoverage": [
    {
      "id": "EDGE-1",
      "name": "Payment Amount Mismatch",
      "layer": "Supertest E2E (8.4) & Unit Spec (requires_refund & auto-refund)",
      "status": "VERIFIED_GREEN"
    }
  ],
  "adversarialMatrixCoverage": [
    {
      "id": "ADV-1",
      "name": "Confirm vs Expiry Timeout Race Condition",
      "layer": "PostgreSQL DB Engine (SELECT FOR UPDATE bi-locking)",
      "status": "VERIFIED_GREEN"
    }
  ],
  "counterExamples": [],
  "counterExampleLoop": {
    "failuresEncountered": 0,
    "counterExamples": []
  }
}
```

---

## 4. `review-decision.json` Schema & Template

**Purpose**: Gatekeeper report emitted by Proof Review phase before finalize.

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": [
    "status",
    "verdict",
    "mustStopBeforeFinalize",
    "harnessManifests"
  ],
  "properties": {
    "featureSlug": { "type": "string" },
    "feature": { "type": "string" },
    "topic": { "type": "string" },
    "status": {
      "type": "string",
      "enum": ["APPROVED", "REJECTED"]
    },
    "mustStopBeforeFinalize": { "type": "boolean" },
    "reviewedAt": { "type": "string" },
    "reviewedBy": {
      "type": "array",
      "items": { "type": "string" }
    },
    "invariantsVerified": { "type": ["number", "string"] },
    "verdict": { "type": "string" },
    "harnessManifests": {
      "type": "array",
      "items": { "type": "string" }
    }
  }
}
```

### Rich Production Template (`review-decision.json`)

```json
{
  "feature": "booking",
  "featureSlug": "booking",
  "topic": "payment-confirmation",
  "status": "APPROVED",
  "mustStopBeforeFinalize": false,
  "reviewedAt": "2026-08-01T00:00:00.000Z",
  "reviewedBy": ["ag-code-reviewer", "ag-security", "ag-architect-verifier"],
  "invariantsVerified": 9,
  "verdict": "100% Invariants (INV-1..INV-9), 6 Edge Cases (EDGE-1..EDGE-6), and 3 Adversarial Matrix Scenarios (ADV-1..ADV-3) verified against source code, Supertest E2E suite, and Quality Gates",
  "harnessManifests": [
    "process/features/booking/reports/harness/payment_PLAN_01-08-26/risk-gate.json",
    "process/features/booking/reports/harness/payment_PLAN_01-08-26/adversarial-validation.json",
    "process/features/booking/reports/harness/payment_PLAN_01-08-26/verification.json",
    "process/features/booking/reports/harness/payment_PLAN_01-08-26/review-decision.json"
  ]
}
```

---

## 5. `interrogation-report.json` Schema & Template

**Purpose**: Emitted by Phase 4 (Code Interrogation) after traversing the 5-Layer Cognitive Stack Q&A loop.

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["interrogatedAt", "layersEvaluated", "gateVerdict"],
  "properties": {
    "featureSlug": { "type": "string" },
    "feature": { "type": "string" },
    "topic": { "type": "string" },
    "interrogatedAt": { "type": "string" },
    "layersEvaluated": {
      "type": "array",
      "items": { "type": "string" }
    },
    "invariantsVerified": {
      "type": "array",
      "items": { "type": "string" }
    },
    "gateVerdict": {
      "type": "string",
      "enum": ["PASS", "FAIL"]
    },
    "summaryNotes": { "type": "string" }
  }
}
```

### Rich Production Template (`interrogation-report.json`)

```json
{
  "featureSlug": "wallet-transfer",
  "feature": "wallet-transfer",
  "topic": "pessimistic-locking",
  "interrogatedAt": "2026-08-01T00:00:00Z",
  "layersEvaluated": [
    "L1_BIAS",
    "L2_INVARIANTS",
    "L3_SYSTEMS",
    "L4_INVERSION",
    "L5_PROOF"
  ],
  "invariantsVerified": ["INV-1", "INV-2"],
  "gateVerdict": "PASS",
  "summaryNotes": "Developer demonstrated complete understanding of pessimistic DB locking in concurrency path."
}
```
