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

  // Extract title (first line starting with #)
  const titleLine = planContent.split("\n").find(line => line.trim().startsWith("#"));
  if (!titleLine) return null;
  const title = titleLine.replace(/^#+\s*/, "").trim();

  // Extract status
  let isCompleted = false;
  
  // If the file path contains '/completed/', consider it completed
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

  return { title, isCompleted };
}

// Gather all plan files or single target
const plansToProcess = [];
if (!targetArg || targetArg === "--all") {
  const allPlans = [
    ...walk("process/general-plans", (rel) => rel.endsWith(".md") && (rel.includes("/active/") || rel.includes("/completed/"))),
    ...walk("process/features", (rel) => rel.endsWith(".md") && (rel.includes("/active/") || rel.includes("/completed/")))
  ];
  for (const file of allPlans) {
    const fullPath = path.join(root, file);
    const parsed = parsePlan(fullPath);
    if (parsed) {
      plansToProcess.push(parsed);
    }
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

for (const { title, isCompleted } of plansToProcess) {
  let titleIndex = -1;
  for (let i = 0; i < roadmapLines.length; i++) {
    if (roadmapLines[i].includes(title)) {
      titleIndex = i;
      break;
    }
  }

  const checkbox = isCompleted ? "[x]" : "[ ]";

  if (titleIndex !== -1) {
    // Update existing line
    const line = roadmapLines[titleIndex];
    roadmapLines[titleIndex] = line.replace(/-\s*\[[ xX]\]/, `- ${checkbox}`);
    console.log(`Synced existing roadmap item: "${title}" -> ${checkbox}`);
  } else {
    // Find where to insert the new roadmap item under Active Milestone
    let activeMilestoneHeaderIndex = -1;
    for (let i = 0; i < roadmapLines.length; i++) {
      if (roadmapLines[i].includes("Đích đến hiện tại") || roadmapLines[i].includes("Active Milestone")) {
        activeMilestoneHeaderIndex = i;
        break;
      }
    }

    if (activeMilestoneHeaderIndex === -1) {
      roadmapLines.push(`- ${checkbox} ${title}`);
    } else {
      let insertIndex = -1;
      let insideList = false;
      for (let i = activeMilestoneHeaderIndex + 1; i < roadmapLines.length; i++) {
        const line = roadmapLines[i].trim();
        const isListItem = line.startsWith("- [ ]") || line.startsWith("- [x]") || line.startsWith("- [X]");
        
        if (isListItem) {
          insideList = true;
        } else if (insideList && line === "") {
          insertIndex = i;
          break;
        } else if (insideList && (line.startsWith("#") || line.startsWith("---"))) {
          insertIndex = i;
          break;
        }
      }

      if (insertIndex === -1) {
        insertIndex = activeMilestoneHeaderIndex + 3;
      }

      roadmapLines.splice(insertIndex, 0, `- ${checkbox} ${title}`);
      console.log(`Added new roadmap item: "${title}" -> ${checkbox}`);
    }
  }
}

fs.writeFileSync(roadmapPath, roadmapLines.join("\n"), "utf8");
console.log("ROADMAP.md updated successfully.");
