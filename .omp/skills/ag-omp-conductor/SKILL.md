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

## When to Apply

Use this skill when:

- Orchestrating multiple parallel subagents in the OMP environment.
- Setting up inter-agent communication via the `irc` tool.
- Validating the merged output of subagents using LSP or AST tools.
- Driving browser-based E2E tests or vision-based QA in the workspace.

---

## 1. Tool Matrix Reference

The Conductor has full access to the OMP tool surface, categorized into 6 primary operational groups:

| Category                    | Tool                                                       | Function / Application inside Conductor                                               |
| :-------------------------- | :--------------------------------------------------------- | :------------------------------------------------------------------------------------ |
| **Read & Search**           | `read`, `find`, `search`                                   | Read files/DB/URLs, locate files by glob, grep regex across workspace.                |
| **Editing & Resolution**    | `write`, `edit`, `ast_edit`, `resolve`                     | Write files, patch lines, perform structural refactors, resolve preview state.        |
| **System & Code**           | `bash`, `eval`, `recipe`, `lsp`                            | Run shell commands, execute JS/Python cells, invoke compiler/Make, query LSP.         |
| **Web & Graphics**          | `browser`, `web_search`, `generate_image`, `inspect_image` | Automate Chromium via Puppeteer, query search engines, generate/inspect visual specs. |
| **Concurrency & Debugging** | `task`, `irc`, `job`, `debug`                              | Spawn parallel subagents, send IRC DMs, manage background jobs, run DAP debugger.     |
| **Management & QA**         | `todo`, `github`, `report_tool_issue`                      | Live TUI task list tracking, GitHub API integration, report tool bugs.                |

---

## 2. Detailed Tool-by-Tool Usage Guide

Here is the exhaustive parameter and syntax reference for all 22 OMP-specific tools:

### Group 1: Read & Search

#### `read`

- **Purpose**: Opens and reads disk files, directories, archives, SQLite databases, PDFs, Jupyter notebooks, images, web URLs, and virtual schemes (`skill://`, `pr://`, `issue://`, `agent://`, `artifact://`, `memory://`, `mcp://`, `local://`, `conflict://`, `jobs://`).
- **Key Selectors**:
  - `:50-200` — Line range (inclusive).
  - `:50+150` — Count form (150 lines starting at line 50).
  - `:raw` — Verbatim text (no anchors, no signatures summarization).
  - `:conflicts` — Enumerates git merge conflicts.
- **Examples**:
  ```bash
  # Line range from app.ts inside a tarball
  read "build/bundle.tar.gz:src/app.ts:120-180"
  # Verbatim read of parser config
  read "src/parser.ts:1-40:raw"
  # Load PR details (automatically cached)
  read pr://1234
  ```

#### `find`

- **Purpose**: Fast file-name lookup by glob. Sorted by modification time (mtime, newest first), relative to CWD. Honors `.gitignore` by default.
- **Examples**:
  ```json
  find paths=["src/routes/**/*.tsx"]
  find paths=["apps/**/package.json", "packages/**/package.json"]
  ```

#### `search`

- **Purpose**: Rust regex lookup across files, directories, globs, or internal URLs. Context lines start with a space; matches start with `*LINE|`. Paginated via `skip`. Cross-line patterns auto-enable when the regex contains a literal `\n`.
- **Examples**:
  ```json
  search pattern="TODO\\(\\w+\\)" paths=["src/"] i=true
  search pattern="function \\w+\\([^)]*\\)\\s*\\{\\n\\s*\\}" paths=["src/"]
  ```

---

### Group 2: Editing & Resolution

#### `write`

- **Purpose**: Creates or overwrites a file, archive entry, or SQLite row. Runs format-on-save automatically.
- **Examples**:
  ```json
  write path="src/routes/health.ts" content="export const ok = () => 'ok';\n"
  ```

#### `edit`

- **Purpose**: Applies a line-anchored patch against the per-session read cache using two-character line hashes (`hashline` mode). Prevents conflicting updates.
- **Syntax**:
  - `+ ANCHOR` — Insert after anchored line.
  - `< ANCHOR` — Insert before anchored line.
  - `- A..B` — Delete inclusive range.
  - `= A..B` — Replace inclusive range.
- **Examples**:
  ```json
  edit input="@@ src/auth.ts\n= 87qa..87qa\n~  return await loadUser(id);\n"
  ```

#### `ast_edit`

- **Purpose**: Structural rewrite using ast-grep patterns. Ignores whitespace and comments. Captures nodes like `$A`, captures zero-or-more like `$$$ARGS`. Staged as a preview.
- **Examples**:
  ```json
  ast_edit ops=[{ "pat": "legacyFn($$$ARGS)", "out": "newFn($$$ARGS)" }] paths=["src/**/*.ts"]
  ast_edit ops=[{ "pat": "console.log($$$)", "out": "" }] paths=["src/"]
  ```

#### `resolve`

- **Purpose**: Applies or discards a pending preview action staged by `ast_edit` or plan approvals.
- **Examples**:
  ```json
  resolve action="apply" reason="clean up debugging logs"
  resolve action="discard" reason="keep logs until hotfix verification"
  ```

---

### Group 3: System & Code Intelligence

#### `bash`

- **Purpose**: Executes shell commands in a persistent session. Supports `cwd`, `env` variables, and PTY mode.
- **Examples**:
  ```json
  bash command="git status"
  ```

#### `eval`

- **Purpose**: Runs Python (`py`) or JavaScript (`js`) cells in a persistent, stateful kernel environment.
- **Examples**:
  ```json
  eval language="py" code="import math\nprint(math.sqrt(64))"
  eval language="js" code="const fs = require('fs'); display(fs.readdirSync('.'));"
  ```

#### `recipe`

- **Purpose**: Runs a target task from the project's task runner (e.g. Bun, Make, Cargo, Just).
- **Examples**:
  ```json
  recipe target="test"
  ```

#### `lsp`

- **Purpose**: Language server client wrapper for code navigation, outline, diagnostics, quick-fixes, and symbol renames.
- **Key Actions**: `definition`, `type_definition`, `implementation`, `references`, `hover`, `symbols`, `diagnostics`, `code_actions`, `rename`, `rename_file`, `status`, `capabilities`, `reload`, `request`.
- **Examples**:
  ```json
  lsp action="references" file="src/server/auth.ts" line=42 symbol="issueToken"
  lsp action="rename" file="src/auth/jwt.ts" line=14 symbol="issueToken" new_name="mintToken"
  lsp action="diagnostics" file="*"
  ```

---

### Group 4: Web & Graphics

#### Web Research Prefix (r.jina.ai)

- **Rule**: Always prefix external web URLs with `https://r.jina.ai/` when performing research, reading documentation, or fetching web content (e.g. `read "https://r.jina.ai/https://github.com/sickn33/antigravity-awesome-skills"` or `browser open name="main" url="https://r.jina.ai/https://omp.sh/docs/skills"`). Jina AI converts web pages into clean, LLM-friendly Markdown, bypassing scraping/bot protection and optimizing token consumption. If the Jina AI service fails (e.g. returns a timeout, 5xx error, or fails to parse), fallback immediately to the standard/original URL for reading or browsing.

#### `web_search`

- **Purpose**: Submits queries through the Brave/Tavily/Kagi search engine chain.
- **Examples**:
  ```json
  web_search query="bun workspaces hoisting behaviour" recency="month"
  ```

#### `browser`

- **Purpose**: Real Chromium browser tab driven through Puppeteer. Actions include `open`, `run` (executes async JS with `tab` and `page` in scope), and `close`.
- **Examples**:
  ```json
  browser open name="main" url="https://example.com/login"
  browser run name="main" code="const obs = await tab.observe(); const btn = obs.elements.find(e => e.role === 'button'); await (await tab.id(btn.id)).click();"
  browser close name="main"
  ```

#### `generate_image`

- **Purpose**: Structured image generation.
- **Examples**:
  ```json
  generate_image subject="wireframe diagram" scene="web app dashboard" style="flat minimalist"
  ```

#### `inspect_image`

- **Purpose**: Vision model analysis of a local image.
- **Examples**:
  ```json
  inspect_image path="reports/ui-diff.png" prompt="Is the logo aligned correctly with the menu items?"
  ```

---

### Group 5: Concurrency & Debugging

#### `task`

- **Purpose**: Spawns parallel subagent slots. Passing `isolated: true` configures git worktrees/overlays to isolate concurrent edits.
- **Examples**:
  ```json
  task agent="explore" tasks=[{ "id": "Audit", "assignment": "Check config files" }]
  ```

#### `irc`

- **Purpose**: Short synchronous prose messages between live slots (e.g. `0-Main` and `1-Subagent`).
- **Examples**:
  ```json
  irc op="list"
  irc op="send" to="1-DatabaseSetup" message="What columns exist in the User table?"
  ```

#### `job`

- **Purpose**: Wait on or cancel background processes or subagents.
- **Examples**:
  ```json
  job op="wait" jobId="DatabaseSetup"
  ```

#### `debug`

- **Purpose**: DAP-driven debugger execution. Off by default. Supports conditional breakpoints, stepping, variables, frames, and expressions.
- **Examples**:
  ```json
  debug action="launch" adapter="debugpy" program="transform.py"
  debug action="set_breakpoint" file="transform.py" line=58 condition="i == 3"
  debug action="stack_trace" levels=5
  debug action="evaluate" frame_id=0 expression="sum(totals)" context="repl"
  ```

---

### Group 6: Management & QA

#### `todo`

- **Purpose**: Updates the live phased todo registry shown in the session TUI.
- **Examples**:
  ```json
  todo ops=[{ op: "init", list: [{ phase: "Verification", items: ["Run cargo test", "Verify lsp"] }] }]
  ```

#### `github`

- **Purpose**: GitHub CLI wrapper. Actions: `repo_view`, `pr_create`, `pr_checkout`, `pr_push`, `search_issues`, `search_prs`, `search_code`, `search_commits`, `search_repos`, `run_watch`.
- **Examples**:
  ```json
  github op="pr_checkout" pr=1234
  github op="pr_create" fill=true draft=true
  github op="run_watch"
  ```

#### `report_tool_issue`

- **Purpose**: Flags unexpected tool behavior for automated QA tracking.
- **Examples**:
  ```json
  report_tool_issue tool="lsp" description="LSP crash during workspace diagnostics"
  ```

---

## 3. Multi-Agent Orchestration Protocol

When a large or multi-subsystem task is initiated, the Conductor must follow this sequence:

### Step 1: Research & Scope Definition

- Use `find` and `search` to map the files.
- Call `lsp diagnostics` or check TS types to understand dependencies.
- _OMP Tool used_: `read`, `find`, `search`, `lsp`

### Step 2: Formulate the Assignment

- Draft a clear multi-task parallel execution plan.
- Create a live TUI task list using `todo` to keep the user informed.
- _OMP Tool used_: `todo`

### Step 3: Fan out via Task Spawning

- Call the `task` tool to spawn subagents. Ensure tasks with potential conflicts are isolated using `isolated: true` (worktrees). _(Note: Always pass the agent name WITHOUT the `ag-` prefix to the `task` tool, e.g. use `plan-agent` instead of `ag-plan-agent`)_.
- _OMP Tool used_: `task`

### Step 4: IRC Coordination & Monitoring

- Monitor progress. If a subagent needs to request data from another subagent, coordinate the communication over `irc`.
- If background jobs or long-running tasks are started, manage them using `job`.
- _OMP Tool used_: `irc`, `job`

### Step 5: Merge & Verification

- If subagents were isolated, merge their branches back.
- Run validation test suites using `recipe`.
- Use `lsp references` or `lsp definition` to verify that no imports are broken.
- _OMP Tool used_: `recipe`, `lsp`

---

## 4. Agent & Skill Catalog

This catalog defines all existing agents and skills in the development environment. Whenever orchestrating workflows, the Conductor references this list to select the optimal actor or specialist skill.

### Agents

_(CRITICAL NOTE: Due to Cloud API restrictions, custom agent profiles like `ag-plan-agent` or `ag-research-agent` are NOT provisioned in the Google Cloud backend console, and invoking them via the `task` tool will fail with a 404 or 400 error. Therefore, when spawning subagents via the `task` tool, the Conductor MUST ONLY use the default `"task"` agent for general-purpose reasoning tasks, or `"quick_task"` for cheap mechanical tasks. The custom agent profiles cataloged below serve as conceptual/prose guides only; you should map their roles and system instructions directly into the `assignment` parameter of a `"task"` or `"quick_task"` subagent)._

- **`ag-code-reviewer`** _(Simulate via `"task"`)_: Comprehensive code review with scout-based edge case detection. Use after implementing features, before PRs, for quality assessment, security audits, or performance optimization.
- **`ag-code-simplifier`** _(Simulate via `"task"`)_: Simplifies and refines code for clarity, consistency, and maintainability while preserving all functionality. Focuses on recently modified code unless instructed otherwise.
- **`ag-debugger`** _(Simulate via `"task"`)_: Use this agent when you need to investigate issues, analyze system behavior, diagnose performance problems, examine database structures, collect and analyze logs from servers or CI/CD pipelines, run tests for debugging purposes, or optimize system performance.
- **`ag-execute-agent`** _(Simulate via `"task"`)_: EXECUTE MODE - Implementing EXACTLY what was planned. Full tool access. Can only be invoked after explicit user confirmation. Use after plan is approved.
- **`ag-fast-mode-agent`** _(Simulate via `"task"`)_: FAST MODE - Execute compressed RIPER-5 workflow (RESEARCH + INNOVATE + PLAN) in one session, then pause for EXECUTE confirmation. Use when you want quick end-to-end solution.
- **`ag-git-manager`** _(Simulate via `"task"`)_: Stage, commit, and push code changes with conventional commits. Use when user says "commit", "push", or finishes a feature/fix.
- **`ag-innovate-agent`** _(Simulate via `"task"`)_: INNOVATE MODE - Brainstorming and exploring implementation approaches. Discusses possibilities without making decisions. Use after research is complete.
- **`ag-plan-agent`** _(Simulate via `"task"`)_: PLAN MODE - Creating exhaustive technical specifications and implementation plans. Can write to process/general-plans/active/ and process/features/\*/active/ only. Use after approach is decided.
- **`ag-research-agent`** _(Simulate via `"task"`)_: RESEARCH MODE - Information gathering only. Use for understanding existing code, architecture, and context. Never suggests implementations or modifications.
- **`ag-tester`** _(Simulate via `"task"`)_: Use this agent when you need to validate code quality through testing, including running unit and integration tests, analyzing test coverage, validating error handling, checking performance requirements, or verifying build processes.
- **`ag-ui-ux-designer`** _(Simulate via `"task"`)_: Use this agent when the user needs UI/UX execution support including interface implementation, design-system polish, responsive layouts, animations, accessibility review, or design documentation.
- **`ag-update-process-agent`** _(Simulate via `"task"`)_: UPDATE PROCESS MODE - Analyze execution, generate rule improvements, update plan files and context. Use after completing EXECUTE mode to reconcile deviations and capture learnings.

### Core Harness Skills

- **`ag-agent-browser`**: AI-optimized browser automation CLI with context-efficient snapshots. Use for long autonomous sessions, self-verifying workflows, video recording, and cloud browser testing (Browserbase).
- **`ag-audit-ag`**: Audit agent harness health: Claude/Codex agent parity, skill registry consistency, README.md sync, and protocol file wiring. Use when agents, skills, README.md, or development-protocol files move, split, or drift.
- **`ag-audit-context`**: Audit project context routing, shared-skill discoverability, and Claude/Codex wiring. Use when context docs or skill surfaces move, split, or drift.
- **`ag-audit-plans`**: Audit active project plan files for staleness, completion, and routing truth. Use when cleaning up plans, reconciling active work, or archiving completed artifacts.
- **`ag-autoresearch`**: Autonomous iterative optimization loop for measurable metrics like coverage, performance, or bundle size. Use when repeated experiments can be judged by a mechanical score.
- **`ag-chrome-devtools`**: Automate browsers with Puppeteer CLI scripts and persistent sessions. Use for screenshots, performance analysis, network monitoring, web scraping, form automation, JavaScript debugging.
- **`ag-context-engineering`**: Check context limits, optimize token usage, and debug context failures. Use when asking about rate limits, usage warnings, memory systems, or context-aware agent design.
- **`ag-debug`**: Debug systematically with root-cause analysis before fixes. Use for bugs, test failures, unexpected behavior, performance issues, CI failures, or system investigation.
- **`ag-docs`**: Use when you need to analyze a codebase and initialize, update, or summarize project documentation.
- **`ag-docs-seeker`**: Search library/framework documentation via llms.txt (context7.com). Use for API docs, GitHub repository analysis, technical documentation lookup, latest library features.
- **`ag-frontend-design`**: Create polished frontend interfaces from designs/screenshots/videos. Use for web components, 3D experiences, replicating UI designs, quick prototypes, immersive interfaces, avoiding AI slop.
- **`ag-generate-context`**: Generate or update the project's authoritative repository context at process/context/all-context.md. Use when repo context is missing, stale, or contradicted by code.
- **`ag-generate-plan`**: Create or update implementation plans in the repo's SIMPLE or COMPLEX format. Use when turning an idea, PRD, or approved direction into a saved plan artifact.
- **`ag-mcp-management`**: Manage MCP servers - discover, analyze, execute tools/prompts/resources. Use for MCP integrations, intelligent tool selection, multi-server management, context-efficient capability discovery.
- **`ag-merge-worktree`**: Merge a git worktree branch back into the main checkout and clean up the worktree. Use when the user asks to merge, archive, or clean up a completed worktree.
- **`ag-predict`**: 5 expert personas debate proposed changes before implementation. Catches architectural, security, performance, and UX issues early. Use before major features or risky changes.
- **`ag-preview`**: Use when you need to inspect files or generate visual explanations, slides, diagrams, or HTML recaps.
- **`ag-problem-solving`**: Apply systematic problem-solving techniques when stuck. Use for complexity spirals, innovation blocks, recurring patterns, assumption constraints, simplification cascades, scale uncertainty.
- **`ag-publish`**: Push agent harness improvements from the current development repo to the remote kit repository. Use when you want to publish local harness changes back to the shared kit. Diffs managed files, shows what changed, bumps version, and pushes.
- **`ag-repomix`**: Use when you need to pack a local or remote repository into an AI-friendly reference artifact for research, audits, feature-porting prep, context review, or security-oriented repo analysis.
- **`ag-scenario`**: Generate comprehensive edge cases and test scenarios by decomposing features across 12 dimensions. Use before implementation or testing to catch issues early.
- **`ag-scout`**: Fast codebase scouting using shell search and optional parallel research agents. Use for file discovery, task context gathering, and quick scoped searches across directories.
- **`ag-security`**: STRIDE + OWASP-based security audit with optional auto-fix. Scans code for vulnerabilities, categorizes by severity, and can iteratively fix findings using ag-autoresearch pattern.
- **`ag-sequential-thinking`**: Apply step-by-step analysis for complex problems with revision capability. Use for multi-step reasoning, hypothesis verification, adaptive planning, problem decomposition, course correction.
- **`ag-setup`**: Interactive agent harness setup for any project. Detects your stack, asks about your project, scaffolds process directories, deep-scans the codebase, and populates context with real content. Works on fresh projects and existing projects with pre-existing configs — always asks before reorganizing.
- **`ag-skill-standard`**: Rules, standards, and validation guides for writing and structure of skills. Use when creating or updating any skill files to ensure pattern compliance.
- **`ag-team`**: Orchestrate Agent Teams for parallel multi-session collaboration. Use for research, implementation, review, and debug workflows requiring independent teammates.
- **`ag-tech-graph`**: Use when you need publish-grade SVG or PNG technical diagrams for architecture, flow, sequence, UML, state, or comparison visuals, with preview used afterward for review rather than generation.
- **`ag-update`**: Pull latest agent harness improvements from the remote kit repository. Shows a dry-run diff summary, waits for confirmation, then applies updates.
- **`ag-watzup`**: Use when you need a read-only handoff summary of current branch state, local/remote refs, worktrees, active project plans, selected-plan hints, and suggested next checks.
- **`ag-web-testing`**: Web testing with Playwright, Vitest, k6. E2E/unit/integration/load/security/visual/a11y testing. Use for test automation, flakiness, Core Web Vitals, mobile gestures, cross-browser.
- **`ag-xia`**: Use when you need to compare a local or remote repository, extract a feature idea, or prepare an adaptation study without planning or implementing it yet.

### Curated Reference Skills

- **`code-simplifier`**: Code simplification skill for improving clarity, consistency, and maintainability while preserving exact behavior. Use when simplifying code, reducing complexity, cleaning up recent changes, applying refactoring patterns, or improving readability. Triggers on tasks involving code cleanup, simplification, refactoring, or readability improvements.
- **`implementation-design-patterns`**: Implementation guide for the 22 Gang of Four design patterns in TypeScript, distilled from refactoring.guru. Use this skill when writing, refactoring, or reviewing TypeScript that exhibits a pattern-shaped problem — class-explosion from inheritance, conditionals switching on type, tight coupling to concrete classes, tree-shaped models, runtime algorithm selection, undo/redo, snapshot-and-restore, state-dependent behavior, subscriber notification, or hiding subsystem complexity.
- **`implementation-functional-patterns`**: TypeScript's functional answers to the 22 Gang of Four classes — factory functions (Factory Method, Abstract Factory, Prototype, Memento), module-scope singletons, fluent immutable builders, wrapper functions (Adapter, Facade), native Proxy, WeakMap caches (Flyweight), discriminated unions with exhaustive match (State, Visitor, Composite), event emitters and signals (Mediator, Observer), pipelines and composition (CoR, Decorator), stream methods (Iterator), closures-as-commands, higher-order strategies, lambda placement.
- **`nextjs`**: Next.js 16 App Router performance, caching, server components, server actions, routing, and codebase-hygiene best practices — plus a category-major review/refactor algorithm with codebase-level (remove/dedup/reuse) findings.
- **`nextjs-bundle-optimizer`**: Next.js 16 bundle-size and build-time optimization guidelines.
- **`nextjs-ppr-patterns`**: Next.js 16 App Router pages mixing static and dynamic content — Partial Prerendering (PPR) under the Cache Components model.
- **`react-hook-form`**: React Hook Form performance optimization for client-side form validation using useForm, useWatch, useController, useFieldArray, and the v7.55+ subscribe() API.
- **`react-hook-form-audit`**: Audits a Next.js (App Router, 14/15+) codebase for React Hook Form anti-patterns — watch() at form root, Controller inlined in parent, async submit without try/catch, missing setError on server failures, RHF in non-"use client" files, RHF mixed with useActionState, schemas defined inside components, useFieldArray without field.id keys, register({ disabled }) for visual disabling.
- **`tailwind`**: Tailwind CSS v4 performance optimization and best practices guidelines (formerly tailwindcss-v4-style).
- **`tailwind-refactor`**: Tailwind CSS code refactoring patterns for v4 migration and anti-pattern cleanup.
- **`tailwind-responsive-ui`**: Responsive UI transformation patterns for Tailwind CSS applications.
- **`tailwind-ui-refactor`**: Refactoring UI design patterns for Tailwind CSS applications to improve visual hierarchy, spacing, typography, color, depth, and polish.
- **`typescript`**: TypeScript performance, tsconfig, type errors, async patterns — triggered when the user asks to "optimize TypeScript performance", "speed up tsc compilation", "configure tsconfig.json", "fix type errors", "improve async patterns", or encounters TS errors (TS2322, TS2339, "is not assignable to").
- **`typescript-advanced-patterns`**: Advanced TypeScript — type-level programming, library/DSL APIs, declaration merging, modern language features at depth (decorators, using, const T, NoInfer, variance), and feature implementation patterns built on advanced types.
- **`typescript-refactor`**: TypeScript and TSX refactoring and modernization guidelines from a principal specialist perspective, current to TypeScript 6.0 and React 19.
- **`ui-design`**: UI/UX and frontend design best practices guidelines (formerly frontend-design).
- **`upstash-ratelimit`**: Rules, standards, and references for rate limiting in serverless environments using Upstash Ratelimit.
- **`zod`**: Zod v4 schema validation best practices. Use when defining schemas, utilizing safeParse, or customizing error messages.

---

## How to Use

This skill is local to `.omp/skills/` and is automatically loaded by the OMP session because it is registered in `ag-manifest.json` under `.omp/**`.

To run the conductor simulation showing how a complex parallel workflow is managed:

```bash
bun run .omp/skills/ag-omp-conductor/scripts/simulate-conductor.mjs
```

## References

- [OMP Tool Routing & Subagent Management Guide](references/tool-routing.md)
