import { execSync } from "node:child_process";
import * as path from "node:path";
import * as fs from "node:fs";

export default function (pi) {
  pi.on("session_start", (event) => {
    try {
      const payload = {
        session_id: event.sessionId || "default-session",
        hook_event_name: "SessionStart",
        event: "SessionStart",
      };

      const scriptPath = path.resolve(
        process.cwd(),
        ".claude/hooks/session-init.cjs",
      );
      if (fs.existsSync(scriptPath)) {
        execSync(`node "${scriptPath}"`, {
          input: JSON.stringify(payload),
          encoding: "utf-8",
          stdio: ["pipe", "ignore", "ignore"],
        });
      }
    } catch (_e) {
      // Session lifecycle errors are ignored
    }
  });

  pi.on("turn_start", (event) => {
    try {
      const isSubagent = event.isSubagent || event.subagentId;
      if (isSubagent) {
        const payload = {
          session_id: event.sessionId || "default-session",
          hook_event_name: "SubagentStart",
          event: "SubagentStart",
        };

        const scriptPath = path.resolve(
          process.cwd(),
          ".claude/hooks/subagent-init.cjs",
        );
        if (fs.existsSync(scriptPath)) {
          execSync(`node "${scriptPath}"`, {
            input: JSON.stringify(payload),
            encoding: "utf-8",
            stdio: ["pipe", "ignore", "ignore"],
          });
        }
      }
    } catch (_e) {
      // Ignore
    }
  });
}
