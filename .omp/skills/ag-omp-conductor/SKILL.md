---
name: ag-omp-conductor
description: "OMP-specific multi-agent orchestration and tool coordination. Use when running parallel subagents, managing IRC messages, or utilizing OMP-specific tools (IRC, task, browser, DAP, etc.)."
license: MIT
argument-hint: "[task-description or plan-path]"
metadata:
  author: Team
  version: "1.0.0"
---

# OMP Conductor - Main Agent Multi-Subagent Orchestration

This skill is designed **exclusively for the OMP (oh-my-pi) harness**. It defines the role of the Main Agent (`0-Main`) as the central orchestrator, executing commands across all 22 OMP-specific tools to coordinate, communicate with, and validate parallel subagents.

---

## 1. Tool Matrix Reference

The Conductor has full access to the OMP tool surface, categorized into 6 primary operational groups:

| Category | Tool | Function / Application inside Conductor |
| :--- | :--- | :--- |
| **Đọc / Tìm kiếm** | `read`, `find`, `search` | Read files/DB/URLs, locate files by glob, grep regex across workspace. |
| **Chỉnh sửa** | `write`, `edit`, `ast_edit`, `resolve` | Write files, patch lines, perform structural refactors, resolve preview state. |
| **Hệ thống & Code**| `bash`, `eval`, `recipe`, `lsp` | Run shell commands, execute JS/Python cells, invoke compiler/Make, query LSP. |
| **Web & Đồ họa** | `browser`, `web_search`, `generate_image`, `inspect_image` | Automate Chromium via Puppeteer, query search engines, generate/inspect visual specs. |
| **Phân phối & Debug**| `task`, `irc`, `job`, `debug` | Spawn parallel subagents, send IRC DMs, manage background jobs, run DAP debugger. |
| **Quản lý & QA** | `todo_write`, `github`, `report_tool_issue` | Live TUI task list tracking, GitHub API integration, report tool bugs. |

---

## 2. Multi-Agent Orchestration Protocol

When a large or multi-subsystem task is initiated, the Conductor must follow this sequence:

### Step 1: Research & Scope Definition
*   Use `find` and `search` to map the files.
*   Call `lsp diagnostics` or check TS types to understand dependencies.
*   *OMP Tool used*: `read`, `find`, `search`, `lsp`

### Step 2: Formulate the Assignment
*   Draft a clear multi-task parallel execution plan.
*   Create a live TUI task list using `todo_write` to keep the user informed.
*   *OMP Tool used*: `todo_write`

### Step 3: Fan out via Task Spawning
*   Call the `task` tool to spawn subagents. Ensure tasks with potential conflicts are isolated using `isolated: true` (worktrees).
*   *OMP Tool used*: `task`

### Step 4: IRC Coordination & Monitoring
*   Monitor progress. If a subagent needs to request data from another subagent, coordinate the communication over `irc`.
*   If background jobs or long-running tasks are started, manage them using `job`.
*   *OMP Tool used*: `irc`, `job`

### Step 5: Merge & Verification
*   If subagents were isolated, merge their branches back.
*   Run validation test suites using `recipe`.
*   Use `lsp references` or `lsp definition` to verify that no imports are broken.
*   *OMP Tool used*: `recipe`, `lsp`

---

## 3. Configuration & CLI Integration

This skill is local to `.omp/skills/` and is automatically loaded by the OMP session because it is registered in `ag-manifest.json` under `.omp/**`.

Run the conductor simulation to see how a complex parallel workflow is managed:
```bash
bun run .omp/skills/ag-omp-conductor/scripts/simulate-conductor.mjs
```
