#!/usr/bin/env node

import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

function validateReport(filePath) {
  const absolutePath = resolve(process.cwd(), filePath);
  if (!existsSync(absolutePath)) {
    console.error(`[VALIDATION ERROR] File not found at path: ${absolutePath}`);
    process.exit(1);
  }

  let data;
  try {
    const raw = readFileSync(absolutePath, "utf-8");
    data = JSON.parse(raw);
  } catch (err) {
    console.error(`[VALIDATION ERROR] Invalid JSON format: ${err.message}`);
    process.exit(1);
  }

  const errors = [];

  // Required top-level fields
  const requiredFields = [
    "featureSlug",
    "planSlug",
    "interrogatedAt",
    "lastUpdatedAt",
    "gateVerdict",
    "circuitBreakerTriggered",
    "layersEvaluated",
    "invariantsVerified",
    "identifiedRisks",
    "qaTrace",
    "summaryNotes",
  ];

  for (const field of requiredFields) {
    if (data[field] === undefined || data[field] === null) {
      errors.push(`Missing required field: '${field}'`);
    }
  }

  // Enum validations
  const validVerdicts = ["PASS", "PASS_WITH_CONCERNS", "FAIL"];
  if (data.gateVerdict && !validVerdicts.includes(data.gateVerdict)) {
    errors.push(
      `Invalid gateVerdict: '${data.gateVerdict}'. Allowed values: ${validVerdicts.join(", ")}`,
    );
  }

  if (typeof data.circuitBreakerTriggered !== "boolean") {
    errors.push(
      `circuitBreakerTriggered must be a boolean, received: ${typeof data.circuitBreakerTriggered}`,
    );
  }

  // Validate layersEvaluated
  const validLayers = [
    "L1_BIAS",
    "L2_INVARIANTS",
    "L3_SYSTEMS",
    "L4_INVERSION",
    "L5_PROOF",
  ];
  if (Array.isArray(data.layersEvaluated)) {
    for (const layer of data.layersEvaluated) {
      if (!validLayers.includes(layer)) {
        errors.push(`Invalid layer in layersEvaluated: '${layer}'`);
      }
    }
  } else if (data.layersEvaluated !== undefined) {
    errors.push(`layersEvaluated must be an array`);
  }

  // Validate identifiedRisks
  const validSeverities = ["CRITICAL", "MAJOR", "MINOR"];
  const validStatuses = ["OPEN", "MITIGATED", "RESOLVED"];
  let hasUnresolvedCriticalRisk = false;

  if (Array.isArray(data.identifiedRisks)) {
    for (let index = 0; index < data.identifiedRisks.length; index++) {
      const risk = data.identifiedRisks[index];
      if (
        !risk.riskId ||
        !risk.severity ||
        !risk.description ||
        !risk.mitigationStatus
      ) {
        errors.push(
          `identifiedRisks[${index}] missing required fields (riskId, severity, description, mitigationStatus)`,
        );
      }
      if (risk.severity && !validSeverities.includes(risk.severity)) {
        errors.push(
          `identifiedRisks[${index}] invalid severity: '${risk.severity}'`,
        );
      }
      if (
        risk.mitigationStatus &&
        !validStatuses.includes(risk.mitigationStatus)
      ) {
        errors.push(
          `identifiedRisks[${index}] invalid mitigationStatus: '${risk.mitigationStatus}'`,
        );
      }
      if (
        risk.severity === "CRITICAL" &&
        risk.mitigationStatus !== "RESOLVED"
      ) {
        hasUnresolvedCriticalRisk = true;
      }
    }
  } else if (data.identifiedRisks !== undefined) {
    errors.push(`identifiedRisks must be an array`);
  }

  // Validate qaTrace
  const validEvaluations = ["ACCEPTABLE", "HAND_WAVY", "FLAWED"];
  if (Array.isArray(data.qaTrace)) {
    for (let index = 0; index < data.qaTrace.length; index++) {
      const turn = data.qaTrace[index];
      if (typeof turn.turn !== "number") {
        errors.push(`qaTrace[${index}].turn must be a number`);
      }
      if (!turn.layer || !turn.question || !turn.response || !turn.evaluation) {
        errors.push(
          `qaTrace[${index}] missing required fields (layer, question, response, evaluation)`,
        );
      }
      if (turn.evaluation && !validEvaluations.includes(turn.evaluation)) {
        errors.push(
          `qaTrace[${index}] invalid evaluation: '${turn.evaluation}'`,
        );
      }
      if (
        typeof turn.turnScore === "number" &&
        (turn.turnScore < 1 || turn.turnScore > 5)
      ) {
        errors.push(`qaTrace[${index}].turnScore must be between 1 and 5`);
      }
    }
  } else if (data.qaTrace !== undefined) {
    errors.push(`qaTrace must be an array`);
  }

  // Business Invariant Enforcement
  // 1. Unresolved CRITICAL risk must result in FAIL
  if (hasUnresolvedCriticalRisk && data.gateVerdict !== "FAIL") {
    errors.push(
      `BUSINESS INVARIANT BREACH: Report has an unresolved CRITICAL risk, but gateVerdict is '${data.gateVerdict}'. Verdict MUST be 'FAIL'.`,
    );
  }

  // 2. Circuit Breaker triggered must result in FAIL
  if (data.circuitBreakerTriggered === true && data.gateVerdict !== "FAIL") {
    errors.push(
      `BUSINESS INVARIANT BREACH: circuitBreakerTriggered is true, but gateVerdict is '${data.gateVerdict}'. Verdict MUST be 'FAIL'.`,
    );
  }

  if (errors.length > 0) {
    console.error(
      `[VALIDATION FAILED] ${errors.length} error(s) found in ${filePath}:`,
    );
    for (let idx = 0; idx < errors.length; idx++) {
      console.error(`  ${idx + 1}. ${errors[idx]}`);
    }
    process.exit(1);
  }

  console.log(`[VALIDATION SUCCESS] Report is valid!`);
  console.log(`  • Feature: ${data.featureSlug}`);
  console.log(`  • Verdict: ${data.gateVerdict}`);
  console.log(`  • Circuit Breaker Triggered: ${data.circuitBreakerTriggered}`);
  console.log(
    `  • Invariants Verified: ${data.invariantsVerified ? data.invariantsVerified.join(", ") : "None"}`,
  );
  console.log(
    `  • Q&A Turns Trace: ${data.qaTrace ? data.qaTrace.length : 0} turn(s)`,
  );
  console.log(
    `  • Identified Risks: ${data.identifiedRisks ? data.identifiedRisks.length : 0} risk(s)`,
  );
  process.exit(0);
}

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    "Usage: node validate-interrogation-report.mjs <path-to-interrogation-report.json>",
  );
  process.exit(1);
}

validateReport(targetPath);
