#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const strict = process.argv.includes("--strict");
const failures = [];
const warnings = [];

function fail(message) {
  failures.push(message);
}

function warn(message) {
  if (strict) failures.push(message);
  else warnings.push(message);
}

function walk(dir, predicate, out = []) {
  const abs = path.join(root, dir);
  if (!fs.existsSync(abs)) return out;
  for (const entry of fs.readdirSync(abs, { withFileTypes: true })) {
    const rel = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(rel, predicate, out);
    else if (!predicate || predicate(rel)) out.push(rel);
  }
  return out;
}

function read(relPath) {
  return fs.readFileSync(path.join(root, relPath), "utf8");
}

function hasDateStamp(name) {
  return /(\d{2}-\d{2}-\d{2}|\d{4}-\d{2}-\d{2}|\d{2}-\d{2}-\d{4})/.test(name);
}

for (const dir of [
  "process/general-plans/active",
  "process/general-plans/completed",
  "process/features",
]) {
  if (!fs.existsSync(path.join(root, dir))) fail(`${dir} missing`);
}

const allPlans = [
  ...walk("process/general-plans", (rel) => rel.endsWith(".md")),
  ...walk("process/features", (rel) => rel.endsWith(".md")),
].sort();

const activePlans = allPlans.filter((file) => file.includes("/active/"));
const completedPlans = allPlans.filter((file) => file.includes("/completed/"));
const duplicateNames = new Map();

const roadmapPath = path.join(root, "process/ROADMAP.md");
const completedRoadmapPath = path.join(root, "process/roadmap/completed.md");

let roadmapContent = "";
if (fs.existsSync(roadmapPath)) {
  roadmapContent += fs.readFileSync(roadmapPath, "utf8") + "\n";
}
if (fs.existsSync(completedRoadmapPath)) {
  roadmapContent += fs.readFileSync(completedRoadmapPath, "utf8") + "\n";
}

const roadmapLines = roadmapContent.split("\n");

function getPlanTitle(file) {
  try {
    const text = read(file);
    const titleLine = text.split("\n").find(line => line.trim().startsWith("#"));
    if (titleLine) {
      return titleLine.replace(/^#+\s*/, "").trim();
    }
  } catch (e) {}
  return "";
}

function getRoadmapStatus(title) {
  if (!title || !roadmapContent) return null;
  for (const line of roadmapLines) {
    if (line.includes(title)) {
      const match = line.match(/-\s*\[([ xX])\]/);
      if (match) {
        return match[1].toLowerCase() === "x" ? "completed" : "active";
      }
    }
  }
  return null;
}

const samples = {
  nameNotDateStamped: [],
  noPlanInName: [],
  missingPhaseRules: [],
  missingVerification: [],
  likelyReferenceInActive: [],
};

for (const file of activePlans) {
  const name = path.basename(file);
  duplicateNames.set(name, (duplicateNames.get(name) || 0) + 1);
  const text = read(file);

  if (!hasDateStamp(name)) samples.nameNotDateStamped.push(file);
  if (!/_PLAN_|PLAN\.md$|PLAN_/.test(name)) samples.noPlanInName.push(file);
  if (
    !/Phase Completion Rules|phase is NOT complete|Phase is NOT complete/i.test(
      text,
    )
  ) {
    samples.missingPhaseRules.push(file);
  }
  if (
    !/Verification|Test Procedure|Manual test|Post-Phase Testing|Acceptance Criteria/i.test(
      text,
    )
  ) {
    samples.missingVerification.push(file);
  }
  if (
    /handoff|README|execution-sequence/i.test(name) &&
    !/_PLAN_|PLAN/i.test(name)
  ) {
    samples.likelyReferenceInActive.push(file);
  }
  const title = getPlanTitle(file);
  if (title && roadmapContent) {
    const status = getRoadmapStatus(title);
    if (!status) {
      warn(`Active plan not listed in ROADMAP.md: "${title}" (${file})`);
    } else if (status === "completed") {
      warn(`Active plan "${title}" (${file}) is marked as completed [x] in ROADMAP.md`);
    }
  }

}

for (const file of completedPlans) {
  const title = getPlanTitle(file);
  if (title && roadmapContent) {
    const status = getRoadmapStatus(title);
    if (status === "active") {
      warn(`Completed plan "${title}" (${file}) is marked as active [ ] in ROADMAP.md`);
    }
  }
}
// --- New rule: Every non-Icebox task in ROADMAP must link to a plan ---
function validateRoadmapPlanLinks() {
  if (!roadmapContent) return;

  const iceboxIndex = roadmapLines.findIndex(line =>
    line.includes("Idea Icebox") || line.includes("Backlog")
  );

  const linesToCheck = iceboxIndex === -1
    ? roadmapLines
    : roadmapLines.slice(0, iceboxIndex);

  for (const line of linesToCheck) {
    const trimmed = line.trim();
    if (!trimmed.startsWith("- [ ]") && !trimmed.startsWith("- [x]") && !trimmed.startsWith("- [X]")) {
      continue;
    }

    // Skip if it's already a header or separator
    if (trimmed.startsWith("##") || trimmed.startsWith("---")) continue;

    const hasPlanLink = /\]\((process\/)?(general-plans|features)\/.*\.md\)/.test(line);
    if (!hasPlanLink) {
      fail(`ROADMAP task missing plan link: "${trimmed.substring(0, 80)}..."`);
    }

    // New rule: Completed task must not link to active plan
    const isCompleted = trimmed.startsWith("- [x]") || trimmed.startsWith("- [X]");
    const linksToActive = /\]\((process\/)?(general-plans|features)\/active\/.*\.md\)/.test(line);
    if (isCompleted && linksToActive) {
      fail(`Completed task still links to active plan: "${trimmed.substring(0, 80)}..."`);
    }
  }
}

validateRoadmapPlanLinks();

const duplicateBasenameGroups = [...duplicateNames.entries()]
  .filter(([, count]) => count > 1)
  .map(([name, count]) => ({ name, count }));

if (activePlans.length > 10)
  warn(`active plan count is high: ${activePlans.length}`);
for (const [key, files] of Object.entries(samples)) {
  if (files.length > 0) warn(`${key}: ${files.length} active files`);
}
if (duplicateBasenameGroups.length > 0) {
  warn(
    `duplicate active plan basenames: ${duplicateBasenameGroups.length} groups`,
  );
}

const result = {
  activePlans: activePlans.length,
  completedPlans: completedPlans.length,
  warnings,
  failures,
  samples: Object.fromEntries(
    Object.entries(samples).map(([key, files]) => [key, files.slice(0, 20)]),
  ),
  duplicateBasenameGroups: duplicateBasenameGroups.slice(0, 20),
  strict,
};

console.log(JSON.stringify(result, null, 2));

if (failures.length > 0) {
  process.exitCode = 1;
}
