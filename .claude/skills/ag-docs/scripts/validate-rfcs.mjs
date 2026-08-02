#!/usr/bin/env bun
import fs from "node:fs";
import path from "node:path";

const colors = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
};

const primaryRfcDir = path.resolve("docs/rfc");
const fallbackRfcDir = path.resolve("second-brain/Docs/RFCs");
const rfcDir = fs.existsSync(primaryRfcDir)
  ? primaryRfcDir
  : fs.existsSync(fallbackRfcDir)
    ? fallbackRfcDir
    : primaryRfcDir;
let failures = 0;

function logError(file, message) {
  console.error(`${colors.red}FAIL:${colors.reset} [${file}] ${message}`);
  failures++;
}

function logSuccess(file, message) {
  console.log(`${colors.green}PASS:${colors.reset} [${file}] ${message}`);
}

if (!fs.existsSync(rfcDir)) {
  fs.mkdirSync(rfcDir, { recursive: true });
}

const files = fs.readdirSync(rfcDir).filter((f) => f.endsWith(".md"));

if (files.length === 0) {
  console.log(
    `${colors.yellow}Warning: No RFC files found in docs/rfc or second-brain/Docs/RFCs.${colors.reset}`,
  );
  process.exit(0);
}

console.log(
  `${colors.cyan}Auditing ${files.length} Request for Comments (RFCs)...${colors.reset}\n`,
);

const requiredSections = [
  "## Summary",
  "## Context & Motivation",
  "## Detailed Proposal",
  "## Drawbacks & Alternatives",
  "## Unresolved Questions",
];

for (const file of files) {
  const filePath = path.join(rfcDir, file);
  const content = fs.readFileSync(filePath, "utf-8");
  const currentFileFailures = failures;

  // 1. Check filename format (e.g. 0001-payment-gateway-refactor.md)
  const fileRegex = /^(\d{4})-(.+)\.md$/;
  const fileMatch = file.match(fileRegex);
  if (!fileMatch) {
    logError(
      file,
      "Filename must match standard 4-digit prefix pattern, e.g., '0001-proposal-title.md'",
    );
    continue;
  }

  const fileNum = parseInt(fileMatch[1], 10);

  // 2. Check Level 1 Heading matches the number
  const lines = content.split("\n");
  const firstLine = lines[0] ? lines[0].trim() : "";
  const h1Regex = /^#\s+(\d+)\.\s+(.+)$/;
  const h1Match = firstLine.match(h1Regex);

  if (!h1Match) {
    logError(
      file,
      "File must start with a level 1 heading in format '# <Number>. <Title>'",
    );
  } else {
    const headingNum = parseInt(h1Match[1], 10);
    if (headingNum !== fileNum) {
      logError(
        file,
        `Heading RFC number (${headingNum}) does not match filename prefix (${fileNum})`,
      );
    }
  }

  // 3. Check Metadata fields (Status)
  const statusRegex =
    /^Status:\s*(Draft|Under Review|Approved|Rejected|Superseded.*)/im;
  if (!statusRegex.test(content)) {
    logError(
      file,
      "File must include valid 'Status:' metadata (Draft, Under Review, Approved, Rejected, Superseded)",
    );
  }

  // 4. Check Required Markdown Sections
  for (const section of requiredSections) {
    if (!content.includes(section)) {
      logError(file, `Missing mandatory section '${section}'`);
    }
  }

  if (failures === currentFileFailures) {
    logSuccess(file, "Passed structural and naming validation.");
  }
}

console.log("\n----------------------------------------");
if (failures > 0) {
  console.error(
    `${colors.red}${colors.bold}Audit failed with ${failures} error(s).${colors.reset}`,
  );
  process.exit(1);
} else {
  console.log(
    `${colors.green}${colors.bold}All RFC files passed validation cleanly.${colors.reset}`,
  );
  process.exit(0);
}
