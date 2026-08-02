#!/usr/bin/env node

/**
 * scripts/run-audit-parallel.mjs — High-performance parallel audit suite runner.
 * Runs all 12 harness, context, doc, and plan validators concurrently.
 *
 * Author: ngxc
 * Version: 1.0.0
 */

import { exec } from "node:child_process";
import { promisify } from "node:util";

const execAsync = promisify(exec);

const validators = [
  {
    name: "Agent Parity",
    cmd: "node .claude/skills/ag-audit-ag/scripts/validate-agent-parity.mjs",
  },
  {
    name: "Skills Structure",
    cmd: "node .claude/skills/ag-audit-ag/scripts/validate-skills.mjs",
  },
  {
    name: "Guide Sync",
    cmd: "node .claude/skills/ag-audit-ag/scripts/validate-guide-sync.mjs",
  },
  {
    name: "Protocol Wiring",
    cmd: "node .claude/skills/ag-audit-ag/scripts/validate-protocol-wiring.mjs",
  },
  {
    name: "Seeds Integrity",
    cmd: "node .claude/skills/ag-audit-ag/scripts/validate-seeds.mjs",
  },
  {
    name: "Kit Portability",
    cmd: "node .claude/skills/ag-audit-ag/scripts/validate-kit-portability.mjs",
  },
  {
    name: "Skill Patterns",
    cmd: "bun run .claude/skills/ag-audit-ag/scripts/validate-skill-patterns.mjs",
  },
  {
    name: "Context Discovery",
    cmd: "node .claude/skills/ag-audit-context/scripts/validate-context-discovery.mjs",
  },
  {
    name: "Skill Routing",
    cmd: "node .claude/skills/ag-audit-context/scripts/validate-skill-routing.mjs",
  },
  {
    name: "Skills Catalog Check",
    cmd: "node .claude/skills/ag-audit-context/scripts/generate-skills-catalog.mjs --check",
  },
  {
    name: "Docs Audit",
    cmd: "bun run .claude/skills/ag-docs/scripts/validate-docs.mjs",
  },
  {
    name: "Plan Artifact",
    cmd: "node .claude/skills/ag-generate-plan/scripts/validate-plan-artifact.mjs",
  },
];

async function main() {
  const startTime = Date.now();
  console.log(
    `🚀 Running ${validators.length} Audit Validators in Parallel...\n`,
  );

  let failures = 0;

  const results = await Promise.allSettled(
    validators.map(async (item) => {
      try {
        const { stdout, stderr } = await execAsync(item.cmd);
        return { name: item.name, success: true, stdout, stderr };
      } catch (err) {
        return { name: item.name, success: false, error: err };
      }
    }),
  );

  for (const res of results) {
    if (res.status === "fulfilled" && res.value.success) {
      console.log(`\x1b[32m✓ [PASS]\x1b[0m ${res.value.name}`);
    } else {
      failures++;
      const val = res.status === "fulfilled" ? res.value : res.reason;
      console.log(`\x1b[31m❌ [FAIL]\x1b[0m ${val.name || "Unknown"}`);
      if (val.error?.stdout) console.log(val.error.stdout);
      if (val.error?.stderr) console.error(val.error.stderr);
    }
  }

  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log(`\n--------------------------------------------------`);
  if (failures === 0) {
    console.log(
      `\x1b[32m✨ All ${validators.length} Audit Validators Passed (${duration}s)\x1b[0m`,
    );
  } else {
    console.log(
      `\x1b[31m❌ Audit Failed with ${failures} failure(s) (${duration}s)\x1b[0m`,
    );
    process.exit(1);
  }
}

main();
