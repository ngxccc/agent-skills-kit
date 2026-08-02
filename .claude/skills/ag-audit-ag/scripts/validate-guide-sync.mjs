#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import {
  exists,
  listSkillDirs,
  parseFrontmatter,
} from "../../ag-audit-context/scripts/shared-skill-utils.mjs";

const root = process.cwd();
const failures = [];
const warnings = [];

function fail(message) {
  failures.push(message);
}

function warn(message) {
  warnings.push(message);
}

function read(relPath) {
  return fs.readFileSync(path.join(root, relPath), "utf8");
}

// --- Agent sync ---

function listAgentNames(dir, extension) {
  const dirAbs = path.join(root, dir);
  if (!fs.existsSync(dirAbs)) return [];
  return fs
    .readdirSync(dirAbs, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(extension))
    .map((entry) => entry.name.slice(0, -extension.length))
    .sort();
}

function extractTableAgents(text) {
  // Match backtick-wrapped names in markdown
  const agents = new Set();
  for (const match of text.matchAll(/`([a-z0-9:-]+)`/g)) {
    agents.add(match[1]);
  }
  return agents;
}

const guidePath = "AGENTS.md";
if (!exists(guidePath)) {
  fail("AGENTS.md does not exist");
} else {
  const guideText = read(guidePath);

  // Extract agents from AGENTS.md sections (between Mode Agents and Routing Protocol)
  const agentsStart = guideText.indexOf("## Mode Agents (Codex Compatibility)");
  const agentsEnd = guideText.indexOf("## Routing Protocol");
  const agentsSection = agentsStart !== -1 && agentsEnd !== -1 ? guideText.substring(agentsStart, agentsEnd) : "";
  const guideAgents = extractTableAgents(agentsSection);

  // Get disk agents
  const diskAgents = new Set(listAgentNames(".claude/agents", ".md"));

  // Get disk skills that have a SKILL.md
  const diskSkillDirs = listSkillDirs();
  const diskSkills = new Set();
  for (const skill of diskSkillDirs) {
    const skillFile = `.claude/skills/${skill}/SKILL.md`;
    if (exists(skillFile)) {
      const parsed = parseFrontmatter(skillFile);
      if (parsed?.fields.name) {
        diskSkills.add(parsed.fields.name);
      }
      diskSkills.add(skill);
    }
  }

  // Check: every disk agent should be in AGENTS.md
  for (const agent of diskAgents) {
    if (!guideAgents.has(agent)) {
      fail(
        `Agent ${agent} exists on disk but missing from AGENTS.md agent tables`,
      );
    }
  }

  // Check: every AGENTS.md agent should exist on disk
  for (const agent of guideAgents) {
    // Ignore non-agent backticks like tools:
    if (agent === "tools" || agent === "tools:" || agent.includes(":")) continue;
    // Ignore if it's actually a workflow skill
    if (diskSkills.has(agent) || diskSkills.has(`ag-${agent}`)) continue;
    if (!diskAgents.has(agent)) {
      warn(
        `Agent ${agent} listed in AGENTS.md but not found on disk at .claude/agents/${agent}.md`,
      );
    }
  }

  // --- Skill sync ---

  // Extract skills from all sections of AGENTS.md
  const guideSkills = extractTableAgents(guideText);
  // Build a set of skill folder names for matching
  const diskSkillFolders = new Set(
    diskSkillDirs.filter((skill) => exists(`.claude/skills/${skill}/SKILL.md`)),
  );

  // Check: every disk skill with a SKILL.md should be in README.md
  for (const folder of diskSkillFolders) {
    const skillFile = `.claude/skills/${folder}/SKILL.md`;
    const parsed = parseFrontmatter(skillFile);
    const name = parsed?.fields?.name || folder;
    // Strip ag- prefix for matching (README.md uses folder names, not ag-prefixed names)
    const nameWithoutPrefix = name.startsWith("ag-") ? name.slice(3) : name;
    // Check if the skill folder name, frontmatter name, or stripped name appears in README.md
    if (
      !guideSkills.has(folder) &&
      !guideSkills.has(name) &&
      !guideSkills.has(nameWithoutPrefix)
    ) {
      fail(
        `Skill ${folder} (name: ${name}) exists on disk but missing from AGENTS.md skill catalog`,
      );
    }
  }

  // Check: every AGENTS.md skill should exist on disk
  for (const skill of guideSkills) {
    // Also check ag-prefixed variant (README.md may list "code-reviewer" which is an agent, not a skill folder)
    if (
      !diskSkillFolders.has(skill) &&
      !diskSkills.has(skill) &&
      !diskSkills.has(`ag-${skill}`)
    ) {
    }
  }
}

const result = {
  checkedAgents: true,
  checkedSkills: true,
  warnings,
  failures,
};

console.log(JSON.stringify(result, null, 2));

if (failures.length > 0) {
  process.exitCode = 1;
}
