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

const primaryAdrDir = path.resolve("second-brain/Docs/ADRs");
const fallbackAdrDir = path.resolve("docs/adr");
const adrDir = fs.existsSync(primaryAdrDir) ? primaryAdrDir : (fs.existsSync(fallbackAdrDir) ? fallbackAdrDir : primaryAdrDir);
let failures = 0;

function logError(file, message) {
  console.error(`${colors.red}FAIL:${colors.reset} [${file}] ${message}`);
  failures++;
}

function logSuccess(file, message) {
  console.log(`${colors.green}PASS:${colors.reset} [${file}] ${message}`);
}

if (!fs.existsSync(adrDir)) {
  fs.mkdirSync(adrDir, { recursive: true });
}

const files = fs.readdirSync(adrDir).filter(f => f.endsWith(".md"));

if (files.length === 0) {
  console.log(`${colors.yellow}Warning: No ADR files found in docs/adr.${colors.reset}`);
  process.exit(0);
}

console.log(`${colors.cyan}Auditing ${files.length} Architectural Decision Records (ADRs)...${colors.reset}\n`);

for (const file of files) {
  const filePath = path.join(adrDir, file);
  const content = fs.readFileSync(filePath, "utf-8");
  const currentFileFailures = failures;
  
  // 1. Check filename format (e.g. 0001-some-decision.md)
  const fileRegex = /^(\d{4})-(.+)\.md$/;
  const fileMatch = file.match(fileRegex);
  if (!fileMatch) {
    logError(file, "Filename must match standard 4-digit prefix pattern, e.g., '0001-some-decision.md'");
    continue;
  }
  
  const fileNum = parseInt(fileMatch[1], 10);
  
  // 2. Check Level 1 Heading matches the number
  const lines = content.split("\n");
  const firstLine = lines[0] ? lines[0].trim() : "";
  const h1Regex = /^#\s+(\d+)\.\s+(.+)$/;
  const h1Match = firstLine.match(h1Regex);
  
  if (!h1Match) {
    logError(file, "File must start with a level 1 heading in format '# <Number>. <Title>'");
    continue;
  }
  
  const headingNum = parseInt(h1Match[1], 10);
  if (fileNum !== headingNum) {
    logError(file, `ADR number mismatch: filename specifies '${fileNum}' but H1 specifies '${headingNum}'`);
  }
  
  // 3. Check Date
  const dateRegex = /^Date:\s+\d{4}-\d{2}-\d{2}/m;
  if (!dateRegex.test(content)) {
    logError(file, "Missing or invalid Date format. Must contain 'Date: YYYY-MM-DD'");
  }
  
  // 4. Check Sections
  const requiredSections = [
    { title: "Status", heading: "## Status" },
    { title: "Context", heading: "## Context" },
    { title: "Decision", heading: "## Decision" },
    { title: "Consequences", heading: "## Consequences" },
    { title: "Explicit Tradeoffs", heading: "### Explicit Tradeoffs" }
  ];
  
  for (const sec of requiredSections) {
    if (!content.includes(sec.heading)) {
      logError(file, `Missing required section heading '${sec.heading}'`);
    }
  }
  
  // If no failures occurred for this file, log success
  if (failures === currentFileFailures) {
    logSuccess(file, `Valid ADR structure (ADR #${headingNum})`);
  }
}

console.log("\n" + "─".repeat(50));
if (failures > 0) {
  console.error(`\n${colors.red}${colors.bold}Audit failed with ${failures} error(s).${colors.reset}`);
  process.exit(1);
} else {
  console.log(`\n${colors.green}${colors.bold}Audit passed! All ADR files conform to the standard structure.${colors.reset}`);
  process.exit(0);
}
