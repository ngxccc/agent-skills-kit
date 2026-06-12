#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const planPath = process.argv[2];

if (!planPath) {
  console.error("Usage: node update-roadmap.mjs <plan-path>");
  process.exit(1);
}

const fullPlanPath = path.isAbsolute(planPath) ? planPath : path.join(root, planPath);
if (!fs.existsSync(fullPlanPath)) {
  console.error(`Plan file not found: ${planPath}`);
  process.exit(1);
}

const planContent = fs.readFileSync(fullPlanPath, "utf8");

// Extract title (first line starting with #)
const titleLine = planContent.split("\n").find(line => line.trim().startsWith("#"));
if (!titleLine) {
  console.error("Could not find a title in the plan file.");
  process.exit(1);
}
const title = titleLine.replace(/^#+\s*/, "").trim();

// Extract status
let isCompleted = false;
const statusMatch = planContent.match(/\*\*Status\*\*:\s*([^\n]+)/i) || planContent.match(/Status:\s*([^\n]+)/i);
if (statusMatch) {
  const statusStr = statusMatch[1].trim();
  if (statusStr.includes("✅") || statusStr.toUpperCase().includes("VERIFIED") || statusStr.toUpperCase().includes("DONE") || statusStr.toUpperCase().includes("COMPLETED")) {
    isCompleted = true;
  }
}

// Read ROADMAP.md
const roadmapPath = path.join(root, "process/ROADMAP.md");
if (!fs.existsSync(roadmapPath)) {
  console.log("ROADMAP.md not found in process directory. Skipping roadmap sync.");
  process.exit(0);
}

let roadmapContent = fs.readFileSync(roadmapPath, "utf8");
const roadmapLines = roadmapContent.split("\n");

// Check if the title already exists in ROADMAP.md
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
  // Replace [ ] or [x] with the correct checkbox
  roadmapLines[titleIndex] = line.replace(/-\s*\[[ xX]\]/, `- ${checkbox}`);
  console.log(`Updated existing roadmap item: "${title}" -> ${checkbox}`);
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
    console.warn("Active Milestone section not found in ROADMAP.md. Appending to the end of the file.");
    roadmapLines.push(`- ${checkbox} ${title}`);
  } else {
    // Find the end of the first list under Active Milestone
    let insertIndex = -1;
    let insideList = false;
    for (let i = activeMilestoneHeaderIndex + 1; i < roadmapLines.length; i++) {
      const line = roadmapLines[i].trim();
      const isListItem = line.startsWith("- [ ]") || line.startsWith("- [x]") || line.startsWith("- [X]");
      
      if (isListItem) {
        insideList = true;
      } else if (insideList && line === "") {
        // Empty line right after list items represents end of the list
        insertIndex = i;
        break;
      } else if (insideList && (line.startsWith("#") || line.startsWith("---"))) {
        // Next header or separator represents end of section
        insertIndex = i;
        break;
      }
    }

    if (insertIndex === -1) {
      // Fallback: insert right after the header + 2 lines
      insertIndex = activeMilestoneHeaderIndex + 3;
    }

    roadmapLines.splice(insertIndex, 0, `- ${checkbox} ${title}`);
    console.log(`Added new roadmap item: "${title}" -> ${checkbox}`);
  }
}

fs.writeFileSync(roadmapPath, roadmapLines.join("\n"), "utf8");
console.log("ROADMAP.md updated successfully.");
