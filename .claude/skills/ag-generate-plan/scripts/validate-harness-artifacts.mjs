#!/usr/bin/env bun
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, resolve } from "node:path";

// Color helpers
const green = (str) => `\x1b[32m${str}\x1b[0m`;
const red = (str) => `\x1b[31m${str}\x1b[0m`;
const yellow = (str) => `\x1b[33m${str}\x1b[0m`;
const cyan = (str) => `\x1b[36m${str}\x1b[0m`;
const bold = (str) => `\x1b[1m${str}\x1b[0m`;

let totalHarnessesChecked = 0;
let totalErrors = 0;

function validateRiskGate(data) {
  const errors = [];
  if (!data.feature && !data.featureSlug) {
    errors.push(`Missing 'feature' or 'featureSlug'`);
  }
  if (!data.formalSpecPath || typeof data.formalSpecPath !== "string") {
    errors.push(`Missing or invalid 'formalSpecPath'`);
  }
  if (!data.riskClass || typeof data.riskClass !== "string") {
    errors.push(`Missing or invalid 'riskClass'`);
  }
  if (!Array.isArray(data.invariants)) {
    errors.push(`Missing or invalid 'invariants' array`);
  }
  if (!data.verificationGates || typeof data.verificationGates !== "object") {
    errors.push(`Missing or invalid 'verificationGates' object`);
  }
  if (!data.status || typeof data.status !== "string") {
    errors.push(`Missing or invalid 'status'`);
  }
  return errors;
}

function validateAdversarialValidation(data) {
  const errors = [];
  if (!data.feature && !data.featureSlug) {
    errors.push(`Missing 'feature' or 'featureSlug'`);
  }
  if (!data.formalSpecPath || typeof data.formalSpecPath !== "string") {
    errors.push(`Missing or invalid 'formalSpecPath'`);
  }
  if (!data.status || typeof data.status !== "string") {
    errors.push(`Missing or invalid 'status'`);
  }
  if (!data.testSuite || typeof data.testSuite !== "object") {
    errors.push(`Missing or invalid 'testSuite' object`);
  } else {
    if (!Array.isArray(data.testSuite.propertyBasedTests)) {
      errors.push(`Missing 'testSuite.propertyBasedTests' array`);
    }
    if (!Array.isArray(data.testSuite.adversarialMatrix)) {
      errors.push(`Missing 'testSuite.adversarialMatrix' array`);
    }
    if (!Array.isArray(data.testSuite.edgeCases)) {
      errors.push(`Missing 'testSuite.edgeCases' array`);
    }
  }
  return errors;
}

function validateVerification(data) {
  const errors = [];
  if (!data.feature && !data.featureSlug) {
    errors.push(`Missing 'feature' or 'featureSlug'`);
  }
  if (!data.status || typeof data.status !== "string") {
    errors.push(`Missing or invalid 'status'`);
  }
  if (
    !data.verificationResults ||
    typeof data.verificationResults !== "object"
  ) {
    errors.push(`Missing or invalid 'verificationResults' object`);
  }
  if (!Array.isArray(data.invariantsVerified)) {
    errors.push(`Missing or invalid 'invariantsVerified' array`);
  }
  if (!Array.isArray(data.edgeCasesCoverage)) {
    errors.push(`Missing or invalid 'edgeCasesCoverage' array`);
  } else {
    data.edgeCasesCoverage.forEach((item, idx) => {
      if (!item.id || !item.name || !item.layer || !item.status) {
        errors.push(
          `edgeCasesCoverage[${idx}] missing required keys (id, name, layer, status)`,
        );
      }
    });
  }
  if (!Array.isArray(data.adversarialMatrixCoverage)) {
    errors.push(`Missing or invalid 'adversarialMatrixCoverage' array`);
  } else {
    data.adversarialMatrixCoverage.forEach((item, idx) => {
      if (!item.id || !item.name || !item.layer || !item.status) {
        errors.push(
          `adversarialMatrixCoverage[${idx}] missing required keys (id, name, layer, status)`,
        );
      }
    });
  }
  return errors;
}

function validateReviewDecision(data) {
  const errors = [];
  if (!data.status || typeof data.status !== "string") {
    errors.push(`Missing or invalid 'status'`);
  }
  if (typeof data.mustStopBeforeFinalize !== "boolean") {
    errors.push(`Missing or invalid boolean 'mustStopBeforeFinalize'`);
  }
  if (!data.verdict || typeof data.verdict !== "string") {
    errors.push(`Missing or invalid 'verdict'`);
  }
  if (!Array.isArray(data.harnessManifests)) {
    errors.push(`Missing or invalid 'harnessManifests' array`);
  }
  return errors;
}

function validateHarnessDir(dirPath) {
  totalHarnessesChecked++;
  console.log(
    `\n${cyan("🔍 Validating Harness Manifest Directory:")} ${bold(dirPath)}`,
  );

  const files = {
    "risk-gate.json": validateRiskGate,
    "adversarial-validation.json": validateAdversarialValidation,
    "verification.json": validateVerification,
    "review-decision.json": validateReviewDecision,
  };

  let dirErrors = 0;

  for (const [filename, validator] of Object.entries(files)) {
    const fullPath = join(dirPath, filename);
    if (!existsSync(fullPath)) {
      console.log(`  ${red("❌ Missing mandatory file:")} ${filename}`);
      dirErrors++;
      totalErrors++;
      continue;
    }

    try {
      const content = readFileSync(fullPath, "utf-8");
      const parsed = JSON.parse(content);
      const fileErrors = validator(parsed, fullPath);

      if (fileErrors.length === 0) {
        console.log(
          `  ${green("✔")} ${filename} - ${green("VALID (SSOT v2.0.0 compliant)")}`,
        );
      } else {
        console.log(`  ${red("✖")} ${filename} - ${red("INVALID")}:`);
        fileErrors.forEach((err) => console.log(`     - ${red(err)}`));
        dirErrors += fileErrors.length;
        totalErrors += fileErrors.length;
      }
    } catch (err) {
      console.log(
        `  ${red("💥 Malformed JSON in")} ${filename}: ${err.message}`,
      );
      dirErrors++;
      totalErrors++;
    }
  }

  if (dirErrors === 0) {
    console.log(`  ${green("✨ Harness directory verification PASSED 100%")}`);
  }
}

// Main execution
const targetArg = process.argv[2];

if (targetArg) {
  const targetPath = resolve(targetArg);
  if (existsSync(targetPath)) {
    validateHarnessDir(targetPath);
  } else {
    console.error(red(`Target path does not exist: ${targetPath}`));
    process.exit(1);
  }
} else {
  // Scan all harness directories in process/
  const harnessDirs = [];

  function scan(dir) {
    if (!existsSync(dir)) return;
    const entries = readdirSync(dir);
    for (const entry of entries) {
      const full = join(dir, entry);
      if (statSync(full).isDirectory()) {
        if (entry === "harness") {
          // Add subdirectories of harness/
          const subEntries = readdirSync(full);
          for (const sub of subEntries) {
            const subFull = join(full, sub);
            if (statSync(subFull).isDirectory()) {
              harnessDirs.push(subFull);
            }
          }
        } else {
          scan(full);
        }
      }
    }
  }

  scan("process");

  if (harnessDirs.length === 0) {
    console.log(yellow("No harness report directories found in process/"));
  } else {
    harnessDirs.forEach(validateHarnessDir);
  }
}

console.log("\n" + "=".repeat(60));
if (totalErrors === 0) {
  console.log(
    green(
      `🎉 SUCCESS: Checked ${totalHarnessesChecked} harness directory/directories with 0 validation errors.`,
    ),
  );
  process.exit(0);
} else {
  console.log(
    red(
      `❌ FAILURE: Found ${totalErrors} schema validation error(s) across ${totalHarnessesChecked} directory/directories.`,
    ),
  );
  process.exit(1);
}
