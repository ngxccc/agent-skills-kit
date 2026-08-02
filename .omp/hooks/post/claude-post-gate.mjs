import { execSync } from "node:child_process";
import * as path from "node:path";
import * as fs from "node:fs";

const mapToolName = (ompName) => {
  switch (ompName) {
    case "write":
      return "Write";
    case "edit":
      return "Edit";
    case "ast_edit":
      return "MultiEdit";
    default:
      return ompName;
  }
};

const runClaudePostHook = (hookScript, payload) => {
  try {
    const scriptPath = path.resolve(
      process.cwd(),
      `.claude/hooks/${hookScript}`,
    );
    if (!fs.existsSync(scriptPath)) {
      return;
    }
    execSync(`node "${scriptPath}"`, {
      input: JSON.stringify(payload),
      encoding: "utf-8",
      stdio: ["pipe", "ignore", "ignore"],
    });
  } catch (_error) {
    // Post hooks are observational, ignore errors
  }
};

export default function (pi) {
  pi.on("tool_result", (event) => {
    const toolName = event.toolName;
    const targetTools = ["write", "edit", "ast_edit"];

    if (targetTools.includes(toolName)) {
      const payload = {
        session_id: event.sessionId || "default-session",
        hook_event_name: "PostToolUse",
        event: "PostToolUse",
        tool_name: mapToolName(toolName),
        tool_input: event.input || {},
        tool_result: event.content || {},
      };

      // 1. Run session-state
      runClaudePostHook("session-state.cjs", payload);

      // 2. Run post-edit-simplify-reminder
      runClaudePostHook("post-edit-simplify-reminder.cjs", payload);
    }
  });
}
