---
title: Harness JSON Artifacts Schema & Specification (SSOT)
tags:
  - type/specification
  - topic/harness
  - ssot
docType: specification
date: 2026-07-31
version: 1.0.0
---

# Harness JSON Artifacts Schema & Specification

This document defines the formal JSON Schema structures for all harness report artifacts stored in `process/features/[feature]/reports/harness/[planSlug]/` or `process/general-plans/reports/harness/[planSlug]/`.
---

## 1. `risk-gate.json` Schema & Template

**Purpose**: Declares risk classification and links to the canonical Formal Specification file.

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["featureSlug", "riskClass", "formalSpecPath", "mustStopBeforeFinalize"],
  "properties": {
    "featureSlug": { "type": "string" },
    "riskClass": { 
      "type": "string", 
      "enum": ["Auth", "Billing", "DB Schema", "API Contract", "Secrets", "Gateway", "Low-Risk"] 
    },
    "formalSpecPath": { "type": "string" },
    "mustStopBeforeFinalize": { "type": "boolean" },
    "createdAt": { "type": "string" }
  }
}
```

### Template (`risk-gate.json`)
```json
{
  "featureSlug": "wallet-transfer",
  "riskClass": "Billing",
  "formalSpecPath": "process/features/wallet-transfer/active/Wallet_Transfer_Formal_Spec.md",
  "mustStopBeforeFinalize": true,
  "createdAt": "2026-07-31T00:00:00Z"
}
```

---

## 2. `adversarial-validation.json` Schema & Template

**Purpose**: Stores the frozen Level 2 Property-Based & Adversarial Test Matrix (TDD RED).

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["featureSlug", "frozenAt", "testMatrix"],
  "properties": {
    "featureSlug": { "type": "string" },
    "frozenAt": { "type": "string" },
    "testMatrix": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["id", "scenarioType", "invariantBound", "description", "testFilePath", "status"],
        "properties": {
          "id": { "type": "string" },
          "scenarioType": { "type": "string", "enum": ["PROPERTY_BASED", "RACE_CONDITION", "ADVERSARIAL_INPUT", "BOUNDARY_LIMIT"] },
          "invariantBound": { "type": "string" },
          "description": { "type": "string" },
          "testFilePath": { "type": "string" },
          "status": { "type": "string", "enum": ["RED", "GREEN"] }
        }
      }
    }
  }
}
```

### Template (`adversarial-validation.json`)
```json
{
  "featureSlug": "wallet-transfer",
  "frozenAt": "2026-07-31T00:00:00Z",
  "testMatrix": [
    {
      "id": "ADV-1",
      "scenarioType": "RACE_CONDITION",
      "invariantBound": "INV-1 (Data Consistency)",
      "description": "2 concurrent withdrawal requests within 1ms with balance = 100",
      "testFilePath": "tests/wallet/race.test.ts",
      "status": "RED"
    }
  ]
}
```

---

## 3. `verification.json` Schema & Template

**Purpose**: Logs execution test results and structured Counter-Example JSON payloads (TDD GREEN).

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["status", "totalTestsRun", "passCount", "failCount", "counterExamples"],
  "properties": {
    "status": { "type": "string", "enum": ["PASS", "FAIL"] },
    "totalTestsRun": { "type": "number" },
    "passCount": { "type": "number" },
    "failCount": { "type": "number" },
    "counterExamples": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["violatedInvariant", "counterExample", "instructionForCoder"],
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

### Template (`verification.json`)
```json
{
  "status": "FAIL",
  "totalTestsRun": 15,
  "passCount": 14,
  "failCount": 1,
  "counterExamples": [
    {
      "violatedInvariant": "INV-1 (Data Consistency)",
      "counterExample": {
        "initialState": { "userBalance": 100 },
        "inputs": [{ "action": "withdraw", "amount": 100 }, { "action": "withdraw", "amount": 100 }],
        "timing": "concurrent_1ms",
        "expectedOutput": "Error: InsufficientBalanceException",
        "actualOutput": "Success: Both processed",
        "actualFinalBalance": -100
      },
      "instructionForCoder": "Fix race condition in withdraw method using pessimistic DB locking or atomic transaction."
    }
  ]
}
```

---

## 4. `review-decision.json` Schema & Template

**Purpose**: Gatekeeper report emitted by Proof Review phase before finalize.

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["featureSlug", "mustStopBeforeFinalize", "reviewedBy", "invariantsVerified", "verdict"],
  "properties": {
    "featureSlug": { "type": "string" },
    "mustStopBeforeFinalize": { "type": "boolean" },
    "reviewedBy": { "type": "array", "items": { "type": "string" } },
    "invariantsVerified": { "type": "number" },
    "verdict": { "type": "string", "enum": ["APPROVED", "REJECTED"] },
    "reviewedAt": { "type": "string" }
  }
}
```

### Template (`review-decision.json`)
```json
{
  "featureSlug": "wallet-transfer",
  "mustStopBeforeFinalize": false,
  "reviewedBy": ["ag-code-reviewer", "ag-security"],
  "invariantsVerified": 3,
  "verdict": "APPROVED",
  "reviewedAt": "2026-07-31T00:00:00Z"
}
```
