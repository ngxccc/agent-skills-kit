#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const targetArg = process.argv[2];

// Check if ROADMAP.md exists
const roadmapPath = path.join(root, "process/ROADMAP.md");
if (!fs.existsSync(roadmapPath)) {
  console.log("ROADMAP.md not found in process directory. Skipping roadmap sync.");
  process.exit(0);
}

// Helper to recursively list files
function walk(dir, predicate, out = []) {
  const abs = path.isAbsolute(dir) ? dir : path.join(root, dir);
  if (!fs.existsSync(abs)) return out;
  for (const entry of fs.readdirSync(abs, { withFileTypes: true })) {
    const rel = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(rel, predicate, out);
    } else if (!predicate || predicate(rel)) {
      out.push(rel);
    }
  }
  return out;
}

// Process a single plan content
function parsePlan(fullPath) {
  const planContent = fs.readFileSync(fullPath, "utf8");

  const titleLine = planContent.split("\n").find(line => line.trim().startsWith("#"));
  if (!titleLine) return null;
  const title = titleLine.replace(/^#+\s*/, "").trim();

  let isCompleted = false;
  if (fullPath.includes("/completed/")) {
    isCompleted = true;
  } else {
    const statusMatch = planContent.match(/\*\*Status\*\*:\s*([^\n]+)/i) || planContent.match(/Status:\s*([^\n]+)/i);
    if (statusMatch) {
      const statusStr = statusMatch[1].trim();
      if (statusStr.includes("✅") || statusStr.toUpperCase().includes("VERIFIED") || statusStr.toUpperCase().includes("DONE") || statusStr.toUpperCase().includes("COMPLETED")) {
        isCompleted = true;
      }
    }
  }

  const relativePath = path.relative(path.join(root, "process"), fullPath).replace(/\\/g, "/");
  return { title, isCompleted, planPath: relativePath };
}

// Gather plans
const plansToProcess = [];
if (!targetArg || targetArg === "--all") {
  const allPlans = [
    ...walk("process/general-plans", (rel) => rel.endsWith(".md") && (rel.includes("/active/") || rel.includes("/completed/"))),
    ...walk("process/features", (rel) => rel.endsWith(".md") && (rel.includes("/active/") || rel.includes("/completed/")))
  ];
  for (const file of allPlans) {
    const fullPath = path.join(root, file);
    const parsed = parsePlan(fullPath);
    if (parsed) plansToProcess.push(parsed);
  }
  console.log(`Scanning all plans: found ${plansToProcess.length} plans to sync.`);
} else {
  const fullPlanPath = path.isAbsolute(targetArg) ? targetArg : path.join(root, targetArg);
  if (!fs.existsSync(fullPlanPath)) {
    console.error(`Plan file not found: ${targetArg}`);
    process.exit(1);
  }
  const parsed = parsePlan(fullPlanPath);
  if (!parsed) {
    console.error("Could not parse title from the plan file.");
    process.exit(1);
  }
  plansToProcess.push(parsed);
}

// Update ROADMAP.md
let roadmapContent = fs.readFileSync(roadmapPath, "utf8");
let roadmapLines = roadmapContent.split("\n");

for (const plan of plansToProcess) {
  const { title, isCompleted, planPath } = plan;
  let titleIndex = -1;
  for (let i = 0; i < roadmapLines.length; i++) {
    if (roadmapLines[i].includes(title)) {
      titleIndex = i;
      break;
    }
  }

  const checkbox = isCompleted ? "[x]" : "[ ]";
  const planLink = planPath ? `([plan](${planPath}))` : "";

  if (titleIndex !== -1) {
    // Update existing line - replace checkbox and ensure link exists
    let line = roadmapLines[titleIndex];
    line = line.replace(/-\s*\[[ xX]\]/, `- ${checkbox}`);

    // Remove any old plan link for this title to avoid duplicates
    line = line.replace(/\s*\(\[plan\]\([^)]+\)\)/, "");

    if (planLink) {
      line = `${line} ${planLink}`;
    }
    roadmapLines[titleIndex] = line;
    console.log(`Synced existing roadmap item: "${title}" -> ${checkbox}`);
  } else {
    // Insert new item under Active Milestone
    let activeMilestoneHeaderIndex = -1;
    for (let i = 0; i < roadmapLines.length; i++) {
      if (roadmapLines[i].includes("Active Milestone") || roadmapLines[i].includes("Đích đến hiện tại")) {
        activeMilestoneHeaderIndex = i;
        break;
      }
    }

    const newLine = planLink
      ? `- ${checkbox} ${title} ${planLink}`
      : `- ${checkbox} ${title}`;

    if (activeMilestoneHeaderIndex === -1) {
      roadmapLines.push(newLine);
    } else {
      let insertIndex = -1;
      let insideList = false;
      for (let i = activeMilestoneHeaderIndex + 1; i < roadmapLines.length; i++) {
        const l = roadmapLines[i].trim();
        const isListItem = l.startsWith("- [ ]") || l.startsWith("- [x]") || l.startsWith("- [X]");
        if (isListItem) {
          insideList = true;
        } else if (insideList && (l === "" || l.startsWith("#") || l.startsWith("---"))) {
          insertIndex = i;
          break;
        }
      }
      if (insertIndex === -1) insertIndex = activeMilestoneHeaderIndex + 3;
      roadmapLines.splice(insertIndex, 0, newLine);
    }
    console.log(`Added new roadmap item: "${title}" -> ${checkbox}`);
  }
}

fs.writeFileSync(roadmapPath, roadmapLines.join("\n"), "utf8");
console.log("ROADMAP.md updated successfully.");
