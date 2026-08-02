#!/usr/bin/env node
import { execSync } from "node:child_process";

try {
  const branch = execSync("git rev-parse --abbrev-ref HEAD", {
    encoding: "utf8",
  }).trim();
  console.log(`Current active branch: ${branch}`);
} catch (e) {
  console.error("Failed to get git status.");
}
