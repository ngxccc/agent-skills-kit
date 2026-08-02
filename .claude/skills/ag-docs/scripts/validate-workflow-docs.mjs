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

const primaryDesignDir = path.resolve("docs/design");
const fallbackDesignDir = path.resolve("second-brain/Docs/Design");
const designDir = fs.existsSync(primaryDesignDir)
  ? primaryDesignDir
  : fs.existsSync(fallbackDesignDir)
    ? fallbackDesignDir
    : primaryDesignDir;
let failures = 0;

function logError(file, message) {
  console.error(`${colors.red}FAIL:${colors.reset} [${file}] ${message}`);
  failures++;
}

function logSuccess(file, message) {
  console.log(`${colors.green}PASS:${colors.reset} [${file}] ${message}`);
}

if (!fs.existsSync(designDir)) {
  fs.mkdirSync(designDir, { recursive: true });
}

// Target workflow docs (files ending in -workflow.md or containing docType: *-workflow)
const allFiles = fs.readdirSync(designDir).filter((f) => f.endsWith(".md"));
const workflowFiles = allFiles.filter((f) => {
  if (f.endsWith("-workflow.md")) return true;
  const content = fs.readFileSync(path.join(designDir, f), "utf-8");
  return /docType:\s*(feature-workflow|infrastructure-workflow)/i.test(content);
});

if (workflowFiles.length === 0) {
  console.log(
    `${colors.yellow}Warning: No Workflow Doc files (*-workflow.md) found in docs/design.${colors.reset}`,
  );
  process.exit(0);
}

console.log(
  `${colors.cyan}Auditing ${workflowFiles.length} SSOT Workflow Documents (per workflow-documentation-standard.md)...${colors.reset}\n`,
);

for (const file of workflowFiles) {
  const filePath = path.join(designDir, file);
  const content = fs.readFileSync(filePath, "utf-8");
  const currentFileFailures = failures;

  // 1. Check filename format (kebab-case ending with -workflow.md)
  if (!/^[a-z0-9-]+-workflow\.md$/.test(file)) {
    logError(
      file,
      "Workflow filename must be kebab-case ending with '-workflow.md', e.g. 'user-registration-workflow.md'",
    );
  }

  // 2. Check Frontmatter (docType: feature-workflow or infrastructure-workflow)
  if (!/^---\s*\n[\s\S]*?\n---/m.test(content)) {
    logError(file, "File must contain a valid YAML frontmatter block");
  } else if (
    !/docType:\s*(feature-workflow|infrastructure-workflow)/i.test(content)
  ) {
    logError(
      file,
      "Frontmatter must specify 'docType: feature-workflow' or 'docType: infrastructure-workflow'",
    );
  }

  // 3. Check Level 1 Heading
  if (!/^#\s+.+/m.test(content)) {
    logError(file, "File must contain a Level 1 Heading (# Title)");
  }

  // 4. Check for 4-Level WBS Table
  if (!/##.*Work Breakdown Structure|##.*WBS/i.test(content)) {
    logError(file, "Missing required section 'Work Breakdown Structure (WBS)'");
  } else if (
    !/\|\s*WBS\s*ID\s*\|/i.test(content) &&
    !/\|\s*Phase\s*\|/i.test(content)
  ) {
    logError(file, "WBS section must contain a WBS markdown table");
  }

  // 5. Check for Mermaid Sequence Diagram (with sequenceDiagram & autonumber)
  if (!/```mermaid[\s\S]*?sequenceDiagram[\s\S]*?```/m.test(content)) {
    logError(
      file,
      "Missing required Mermaid sequence diagram (```mermaid \\n sequenceDiagram ... ```)",
    );
  } else if (!/autonumber/i.test(content)) {
    logError(
      file,
      "Mermaid sequence diagram should include 'autonumber' for step traceability",
    );
  }

  // 6. Check Operational Flow & Security / Defense-in-Depth sections
  if (
    !/##.*Operational Flow|##.*System Flow|##.*Execution Flow/i.test(content)
  ) {
    logError(file, "Missing required section 'Operational Flow'");
  }

  if (
    !/##.*Security|##.*Defense-in-Depth|##.*Security Controls/i.test(content)
  ) {
    logError(file, "Missing required section 'Security & Defense-in-Depth'");
  }

  if (failures === currentFileFailures) {
    logSuccess(file, "Passed SSOT Workflow Documentation Standard validation.");
  }
}

console.log(`\n${"─".repeat(50)}`);
if (failures > 0) {
  console.error(
    `\n${colors.red}${colors.bold}Workflow audit failed with ${failures} error(s).${colors.reset}`,
  );
  process.exit(1);
} else {
  console.log(
    `\n${colors.green}${colors.bold}All Workflow Docs passed validation cleanly.${colors.reset}`,
  );
  process.exit(0);
}
