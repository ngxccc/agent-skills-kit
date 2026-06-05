#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const failures = [];
const warnings = [];

function fail(message) {
  failures.push(message);
}

// 1. Read conductor skill file
const conductorSkillPath = path.join(
  root,
  ".omp/skills/ag-omp-conductor/SKILL.md",
);
if (!fs.existsSync(conductorSkillPath)) {
  fail(`.omp/skills/ag-omp-conductor/SKILL.md missing`);
  printResultAndExit();
}
const conductorSkillText = fs.readFileSync(conductorSkillPath, "utf8");

// Helper to check if name is in the SKILL.md file
function checkNameInCatalog(name, type) {
  const escapedName = name.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
  const regex = new RegExp(`\`${escapedName}\``);
  if (!regex.test(conductorSkillText)) {
    fail(`${type} "${name}" is not documented in ag-omp-conductor/SKILL.md`);
  }
}

// 2. Validate Agents
const agentsDir = path.join(root, ".claude/agents");
if (fs.existsSync(agentsDir)) {
  const agentFiles = fs.readdirSync(agentsDir).filter((f) => f.endsWith(".md"));
  for (const f of agentFiles) {
    const agentName = f.slice(0, -3);
    checkNameInCatalog(agentName, "Agent");
  }
}

// 3. Validate Core Skills
const coreSkillsDir = path.join(root, ".claude/skills");
if (fs.existsSync(coreSkillsDir)) {
  const skillDirs = fs.readdirSync(coreSkillsDir).filter((f) => {
    return (
      fs.statSync(path.join(coreSkillsDir, f)).isDirectory() &&
      fs.existsSync(path.join(coreSkillsDir, f, "SKILL.md"))
    );
  });
  for (const skill of skillDirs) {
    checkNameInCatalog(skill, "Core Skill");
  }
}

// 4. Validate Curated Skills
const curatedSkillsDir = path.join(root, "skills/.curated");
if (fs.existsSync(curatedSkillsDir)) {
  const curatedDirs = fs.readdirSync(curatedSkillsDir).filter((f) => {
    return (
      fs.statSync(path.join(curatedSkillsDir, f)).isDirectory() &&
      fs.existsSync(path.join(curatedSkillsDir, f, "SKILL.md"))
    );
  });
  for (const skill of curatedDirs) {
    checkNameInCatalog(skill, "Curated Skill");
  }
}

function printResultAndExit() {
  const result = {
    checkedConductorCatalog: true,
    warnings,
    failures,
  };
  console.log(JSON.stringify(result, null, 2));
  if (failures.length > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

printResultAndExit();
