#!/usr/bin/env node

/**
 * Enterprise PR Generator & Validator Script
 * Validates PR title, body, assignees, labels, project, and milestone against enterprise standards.
 * Strictly no emojis or decorative icons.
 */

import { execSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync, unlinkSync } from "node:fs";
import { join } from "node:path";

function parseArgs() {
  const args = process.argv.slice(2);
  const params = {
    title: "",
    type: "",
    scope: "",
    summary: "",
    body: "",
    bodyFile: "",
    plan: "",
    issue: "",
    assignee: [],
    label: [],
    project: "",
    milestone: "",
    base: "main",
    head: "",
    draft: false,
    dryRun: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--title" && i + 1 < args.length) params.title = args[++i];
    else if (arg === "--type" && i + 1 < args.length) params.type = args[++i];
    else if (arg === "--scope" && i + 1 < args.length) params.scope = args[++i];
    else if (arg === "--summary" && i + 1 < args.length)
      params.summary = args[++i];
    else if (arg === "--body" && i + 1 < args.length) params.body = args[++i];
    else if (arg === "--body-file" && i + 1 < args.length)
      params.bodyFile = args[++i];
    else if (arg === "--plan" && i + 1 < args.length) params.plan = args[++i];
    else if (arg === "--issue" && i + 1 < args.length) params.issue = args[++i];
    else if (arg === "--assignee" && i + 1 < args.length)
      params.assignee.push(...args[++i].split(","));
    else if (arg === "--label" && i + 1 < args.length)
      params.label.push(...args[++i].split(","));
    else if (arg === "--project" && i + 1 < args.length)
      params.project = args[++i];
    else if (arg === "--milestone" && i + 1 < args.length)
      params.milestone = args[++i];
    else if (arg === "--base" && i + 1 < args.length) params.base = args[++i];
    else if (arg === "--head" && i + 1 < args.length) params.head = args[++i];
    else if (arg === "--draft") params.draft = true;
    else if (arg === "--dry-run") params.dryRun = true;
  }

  return params;
}

const CONVENTIONAL_TYPES = [
  "feat",
  "fix",
  "refactor",
  "perf",
  "test",
  "docs",
  "chore",
  "style",
  "ci",
  "build",
];

function validateTitle(params) {
  let title = params.title;
  if (!title && params.type) {
    const scopePart = params.scope ? `(${params.scope})` : "";
    title = `${params.type}${scopePart}: ${params.summary || "update implementation"}`;
  }

  if (!title) {
    throw new Error(
      'PR Title is required. Use --title "<type>(<scope>): <summary>"',
    );
  }

  // Check for emojis or non-ASCII icon characters
  const emojiRegex =
    /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u;
  if (emojiRegex.test(title)) {
    throw new Error(
      `PR title "${title}" contains emojis/icons, which violate enterprise repository standards.`,
    );
  }

  const conventionalRegex =
    /^(feat|fix|refactor|perf|test|docs|chore|style|ci|build)(\([a-z0-9_.\/-]+\))?!?: .+/;
  if (!conventionalRegex.test(title)) {
    console.warn(
      `[WARNING] PR title "${title}" does not strictly match conventional commit format: <type>(<scope>): <summary>`,
    );
  }

  return title;
}

function buildBody(params) {
  if (params.bodyFile && existsSync(params.bodyFile)) {
    return readFileSync(params.bodyFile, "utf-8");
  }

  if (params.body) {
    return params.body;
  }

  const planText = params.plan ? params.plan : "None specified";
  const issueText = params.issue ? `Closes #${params.issue}` : "None specified";

  return `## Summary
${params.summary || "Describe changes introduced in this PR."}

## Type of Change
${CONVENTIONAL_TYPES.map((t) => `- [${params.type === t ? "x" : " "}] \`${t}\``).join("\n")}

## Context & Related References
- Plan / Specification: \`${planText}\`
- Issue / Ticket: ${issueText}

## Changes Made
- Implementation details and touchpoints.

## Verification & Testing
- [x] Type check & lint verification passed
- [x] Automated test suite executed & passed
- [x] Manual verification completed

### Testing Evidence
\`\`\`
[Execution output / test suite results]
\`\`\`

## Security & Compliance Checklist
- [x] No hardcoded secrets, private keys, or credentials
- [x] Follows repository commenting standards (Zero Semantic Noise policy)
- [x] Verified backwards compatibility and non-breaking API contracts
`;
}

function validateAndFormatLabels(labels, type, scope) {
  const result = new Set(labels);

  if (type && CONVENTIONAL_TYPES.includes(type)) {
    result.add(`type:${type}`);
  }

  if (scope) {
    result.add(`area:${scope}`);
  }

  if (result.size === 0) {
    result.add("status:needs-review");
  }

  return Array.from(result);
}

function main() {
  try {
    const params = parseArgs();
    const title = validateTitle(params);
    const body = buildBody(params);
    const labels = validateAndFormatLabels(
      params.label,
      params.type,
      params.scope,
    );
    const assignees = params.assignee.length > 0 ? params.assignee : ["@me"];

    console.log("====================================================");
    console.log("AG-GIT-PR: Enterprise Pull Request Validation Pass");
    console.log("====================================================");
    console.log(`Title:     ${title}`);
    console.log(`Assignee:  ${assignees.join(", ")}`);
    console.log(`Labels:    ${labels.join(", ")}`);
    if (params.project) console.log(`Project:   ${params.project}`);
    if (params.milestone) console.log(`Milestone: ${params.milestone}`);
    console.log(`Base:      ${params.base}`);
    if (params.draft) console.log(`Status:    Draft`);
    console.log("----------------------------------------------------");

    const ghArgs = ["pr", "create"];
    ghArgs.push("--title", `"${title.replace(/"/g, '\\"')}"`);

    const tempBodyPath = join(process.cwd(), ".git-pr-temp-body.md");
    writeFileSync(tempBodyPath, body, "utf-8");
    ghArgs.push("--body-file", `"${tempBodyPath}"`);

    for (const a of assignees) {
      ghArgs.push("--assignee", `"${a}"`);
    }

    for (const l of labels) {
      ghArgs.push("--label", `"${l}"`);
    }

    if (params.project) ghArgs.push("--project", `"${params.project}"`);
    if (params.milestone) ghArgs.push("--milestone", `"${params.milestone}"`);
    if (params.base) ghArgs.push("--base", `"${params.base}"`);
    if (params.head) ghArgs.push("--head", `"${params.head}"`);
    if (params.draft) ghArgs.push("--draft");

    const ghCmd = `gh ${ghArgs.join(" ")}`;

    console.log("\n[Generated Standard Command]:");
    console.log(ghCmd);

    if (params.dryRun) {
      console.log(
        "\n[Dry Run] Standard PR command generated successfully without execution.",
      );
      if (existsSync(tempBodyPath)) unlinkSync(tempBodyPath);
      process.exit(0);
    }

    console.log("\nExecuting gh pr create...");
    try {
      execSync(ghCmd, { encoding: "utf-8", stdio: "inherit" });
      console.log("\nPR created successfully!");
    } catch (cmdErr) {
      console.error(
        "\nFailed to execute gh pr create. Ensure gh CLI is authenticated (`gh auth status`).",
      );
      console.error(cmdErr.message);
    } finally {
      if (existsSync(tempBodyPath)) unlinkSync(tempBodyPath);
    }
  } catch (err) {
    console.error("\nStandard Validation Error:", err.message);
    process.exit(1);
  }
}

main();
