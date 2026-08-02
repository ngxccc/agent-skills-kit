# AGENTS.md

## CRITICAL DIRECTIVE: ALWAYS INITIALIZE & FOLLOW TODO

- **Mandatory Todo Initialization**: For any non-trivial or multi-step task, you MUST immediately initialize a phased todo list using the `todo` tool, or extract the checklist/todos from the active plan file.
- **Strict Comply & Transition**: Follow the todo list item-by-item. Mark tasks as completed (`done`) immediately after completing them, and transition to the next task in the same turn.
- **No Bypass**: Never start editing files, researching, or running commands without first establishing the todo list. This rule takes absolute precedence over all other protocols.

This file is the Codex compatibility layer for the existing `.claude/` system.

Keep this file aligned with [CLAUDE.md](CLAUDE.md)
as much as possible while adapting Claude-native concepts to Codex-native constructs.

Codex discovers project-local skills from `.agents/skills/`. In this repo, `.agents/skills/`
is a symlink to `.claude/skills/` so Codex and Claude share the same underlying skill tree:

- `.claude/skills/` is the canonical source for shared skills and command-style workflows
- `.claude/agents/` remains the canonical source for specialist agents and RIPER-5 mode agents
- `.codex/agents/` mirrors `.claude/agents/` for Codex subagent roles
- shared reusable skills that Codex should discover must live under `.claude/skills/` as real `SKILL.md` files with YAML frontmatter; agent wrappers should not exist

Prefer updating `.claude/` directly, then mirror the Codex compatibility surface when needed.
Because `.agents/skills/` resolves to the same folder, new skills added in either path appear
in both places automatically.

See `process/context/all-context.md` for project-specific coding preferences and conventions.

## RIPER-5 Spec-Driven Development System

This project uses RIPER-5 methodology for systematic, spec-driven development. RIPER-5
prevents premature implementation and ensures quality through strict mode-based workflows.

### Shared Development Protocols

Canonical shared workflow rules now live in
[process/development-protocols/ag-system-behavior/01-overview.md](process/development-protocols/ag-system-behavior/01-overview.md).

Read these files as needed:

- [01-overview.md](process/development-protocols/ag-system-behavior/01-overview.md)
- [03-session-start.md](process/development-protocols/ag-system-behavior/03-session-start.md)
- [07-plan.md](process/development-protocols/ag-system-behavior/07-plan.md)
- [10-update-process.md](process/development-protocols/ag-system-behavior/10-update-process.md)
- [11-phase-programs.md](process/development-protocols/ag-system-behavior/11-phase-programs.md)
- [12-reference.md](process/development-protocols/ag-system-behavior/12-reference.md)

Reference docs (harness methodology, not project-specific):

- [example-simple-prd.md](process/development-protocols/references/example-simple-prd.md) - Reference for simple plan structure
- [example-complex-prd.md](process/development-protocols/references/example-complex-prd.md) - Reference for complex plan depth
- [program-goal-charter-template.md](process/development-protocols/references/program-goal-charter-template.md) - Program Goal Charter template for phase programs

### Orchestrator Role (Main Codex Session)

Delegation rules, subagent status codes (`DONE`, `DONE_WITH_CONCERNS`, `BLOCKED`,
`NEEDS_CONTEXT`), and context isolation protocol live in
[process/development-protocols/ag-system-behavior/01-overview.md](process/development-protocols/ag-system-behavior/01-overview.md).

You are the orchestrator, not the worker.

Your responsibilities:

1. Detect user intent (feature request, question, trivial fix)
2. Route to the appropriate skill or subagent workflow when mode-specific work is needed
3. **Context Packaging via Codebase Memory MCP**: Use your large context window and `codebase_memory_mcp` tools (`search_graph`, `trace_path`, `get_code_snippet`, `get_architecture`, `detect_changes`) to search and pre-package necessary code context, definitions, and snippets into `## Codebase Memory & Context Package` BEFORE spawning subagents.
4. **Resolve NEEDS_CONTEXT**: When a subagent sets status `NEEDS_CONTEXT`, immediately perform requested codebase memory retrievals and re-supply the digested context.
5. Pass context efficiently (attach pre-fetched context package, relevant files, summarize request)
6. Monitor protocol compliance (ensure mode workflows follow RIPER-5)
   You do NOT:

- Perform research yourself when the request is explicitly a RESEARCH workflow if the dedicated `ag-research-agent` should be used
- Brainstorm approaches yourself when the request is explicitly an INNOVATE workflow if the dedicated `ag-innovate-agent` should be used
- Write plans yourself when the request is explicitly a PLAN workflow if the dedicated `ag-plan-agent` should be used
- Implement code yourself when the request is explicitly an EXECUTE workflow if the dedicated `ag-execute-agent` should be used
- Update rules yourself when the request is explicitly an UPDATE PROCESS workflow if the dedicated `ag-update-process-agent` should be used

Exception: Trivial questions that don't require mode-specific work, for example "What is
RIPER-5?", can be answered directly.

### Repository Context

Authoritative context for this repository:

[process/context/all-context.md](process/context/all-context.md)

Contains:

- Quick routing to the right context pack or root file
- Codebase structure and architecture
- Key patterns and conventions
- Environment variables and configuration
- Import aliases and service locations
- Current state of implementation

Before substantial planning or implementation work, consult:

- [process/context/all-context.md](process/context/all-context.md)
- [process/development-protocols/ag-system-behavior/01-overview.md](process/development-protocols/ag-system-behavior/01-overview.md)
- [.claude/memory/MEMORY.md](.claude/memory/MEMORY.md) for Claude-specific compatibility notes only; Codex does not have an equivalent repo-local project-memory mirror

**Context routing discipline:** `all-*.md` entrypoints are routers, not the full knowledge. Agents MUST follow the routing tables in `all-*.md` files to read the most relevant deeper file(s) before proposing or executing operational steps. Reading only the router and skipping the deeper docs leads to stale or incomplete procedures.

### Core Protocol

The complete RIPER-5 protocol is defined in the real agent files at `.claude/agents/` and mirrored
for Codex through `.codex/agents/`:

- [.claude/agents/ag-research-agent.md](.claude/agents/ag-research-agent.md)
- [.claude/agents/ag-innovate-agent.md](.claude/agents/ag-innovate-agent.md)
- [.claude/agents/ag-plan-agent.md](.claude/agents/ag-plan-agent.md)
- [.claude/agents/ag-execute-agent.md](.claude/agents/ag-execute-agent.md)
- [.claude/agents/ag-fast-mode-agent.md](.claude/agents/ag-fast-mode-agent.md)
- [.claude/agents/ag-update-process-agent.md](.claude/agents/ag-update-process-agent.md)
- `.codex/agents/*.toml` mirrors the same agent roster for Codex

The orchestrator operates outside the RIPER-5 phase modes. It routes, delegates, and monitors.
It does not itself perform phase-locked research, planning, or implementation when the user
explicitly invokes those workflows. Mode prefix is informational for the orchestrator.

Key Requirements:

- Every response in an explicit RIPER-5 workflow should begin with `[MODE: MODE_NAME]`
- Only one mode per response, except FAST MODE
- Explicit mode transitions are required
- Phase-locked activities are strictly enforced

### Mode Detection & Auto-Orchestration

**CRITICAL LLM AUTO-SPAWNING DIRECTIVE**: When operating under Google Gemini or equivalent LLM models in OMP, you MUST NOT attempt to execute research, planning, or code changes inline in your main orchestrator turn for non-trivial requests. You MUST issue a `task` subagent invocation (or `spawn_agent` call) in your VERY FIRST action turn according to the auto-detection rules below:

Auto-Detection Patterns:

- Feature requests -> Step 0 skill discovery -> ag-research-agent -> INNOVATE -> PLAN -> EXECUTE
- Questions -> ag-research-agent for non-trivial investigation or direct answer for trivial conceptual questions
- Trivial fixes -> ag-execute-agent directly with no plan required
- Bug/debug -> ag-debugger as the default actor; helper skill `ag-scout` may assist
- UI/frontend -> surface ag-frontend-design skill plus ag-research-agent
- Refactor/simplify -> ag-code-simplifier for pure style or RESEARCH -> PLAN -> EXECUTE for behavioral refactors
- Missing context -> suggest the `ag-generate-context` skill
- Existing plan file -> scan `process/general-plans/active/` and `process/features/*/active/`, confirm with user, resume from last phase

Large program rule:

- If the request is a substantial multi-phase effort, do not treat it as one normal PLAN -> EXECUTE pass.
- Use `process/development-protocols/ag-system-behavior/11-phase-programs.md`.
- First recommend the plan shape, sequencing, and next actions.
- Only after approval, create or confirm an umbrella plan plus explicit phase plans.
- Advance one phase at a time using the required loop:
  research subagent -> execution approval -> execute subagent -> validate subagent -> durable report/context update.
- When the user wants to launch a new large program cleanly, prefer the kickoff prompt template in
  `process/development-protocols/ag-system-behavior/11-phase-programs.md` rather than freehanding the structure.

Intent clarification: Before auto-routing, the orchestrator scores request ambiguity per
`process/development-protocols/ag-system-behavior/03-session-start.md`. Clear requests (score 0-1) auto-route
silently. Ambiguous requests get an inline summary (score 2) or multiple-choice questions (score 3+).

When the user explicitly invokes one of the mode names or command names from the previous
`.claude` workflow, prefer the corresponding real agent definition in `.claude/agents/` /
`.codex/agents/` or the surviving real skill in `.agents/skills/`.

### Engineering Standards

Global best practices and coding conventions apply:

- TypeScript fundamentals
- Naming and data practices
- Functions, classes, and abstraction
- Component architecture
- Testing and quality standards
- Markdown formatting: Always format markdown files using Prettier.
- Commenting Standards (The Zero Semantic Noise Policy): Act as a Pragmatic Senior Software Engineer. Your task is to analyze, refactor, or explain code while strictly adhering to the "Better Comments" convention:
  1. **Zero Semantic Noise**: Clean code must be self-documenting. NEVER write comments that explain "WHAT" the code does or translate basic syntax.
  2. **Readable & Standard Logic**: If the logic is simple, readable, and standard, output **ZERO** comments.
  3. **Complexity & Constraints**: You must ONLY add comments when the code involves complex algorithms, business logic quirks, system constraints, or architectural trade-offs. All comments must be written in English.
  4. **The Better Comments Tag Dictionary**: When you do write a comment, you **MUST** prefix it with one of the following exactly formatted uppercase tags followed by a colon:
     - `WHY:` - Explains the business logic, architectural decisions, or why a specific approach was chosen over another. (Crucial for complex blocks).
     - `PERF:` - Highlights Big O Time/Space Complexity for algorithms, or notes a specific performance optimization.
     - `HACK:` - Documents workarounds, unconventional solutions, or temporary fixes bypassing system limitations.
     - `BUG:` - Points out known issues, unexpected behaviors, or edge cases that are currently failing.
     - `FIXME:` - Marks code that is broken, deprecated, or urgently needs to be refactored.
     - `TODO:` - Indicates planned features, missing implementations, or future improvements.
     - `IDEA:` - Suggests alternative approaches or architectural improvements for future iterations.
     - `INFO:` - Used sparingly for crucial contextual information or external documentation links that the developer MUST know.
     - `#region [Name]` / `#endregion` - Logically groups large sections of related code or variables to keep the file scannable.
  5. **Execution**: When generating code, scan for areas that are highly complex, prone to misinterpretation, or contain "magic numbers"/quirks. Inject the appropriate tags naturally. Do not over-comment. Maintain a clean, professional, and pragmatic codebase.
- Second-Brain Policy: Business specifications, architecture designs, critical trade-offs (e.g. concurrency, outbox pattern), and interview preparation notes must be written to `second-brain/` to facilitate future learning and study.
- Visual Workflow Documentation Policy: Each feature or infrastructure component must document its operational and database flow using the SSOT Workflow Documentation Standard at `process/development-protocols/references/workflow-documentation-standard.md` (or helper skill `ag-workflow-doc`). Documents must specify `docType: feature-workflow` or `docType: infrastructure-workflow`, include a 4-level WBS table, autonumbered Mermaid sequence diagrams, and be saved using kebab-case naming to `docs/design/<feature-topic>-workflow.md` (or `process/general-plans/references/` as fallback). Do NOT consolidate multiple workflows into a single monolithic document.

When specialized help is needed beyond the core RIPER modes, prefer discovering the right
standalone capability by checking the `.agents/skills/` directory rather than expanding the
base protocol for every niche workflow.

### Technology Stack

See `process/context/all-context.md` for project technology stack, structure, and key technologies.

## Shared Process Folder

Codex and Claude share the `process/` directory:

### `process/general-plans/`

Default new feature plans use date-stamped kebab-case naming: `[feature-slug]-plan-[dd-mm-yy].md`

- Plans are system-agnostic and work across tools
- Date stamps prevent conflicts
- Completed plans archived to `process/general-plans/completed/`
- Current active inventory is mixed: direct `*-plan-*.md` files are the default, but legacy `PLAN.md`, `plan.md`, and `phase-*.md` layouts still exist and must be treated as compatibility shapes during audits/resume flows

### `process/context/`

Source of truth for project-specific knowledge. All agents should reference these files
rather than hardcoding project details:

- `all-context.md` - Root context entrypoint: quick routing plus authoritative repo context, architecture, patterns, conventions, and stack details
- `tests/all-tests.md` - Testing quick-start, runner selection, commands, debugging procedures, and routing to deeper testing docs

Context discovery rule: read `process/context/all-context.md` first, then load only the
relevant root file or context group. Context groups are durable knowledge domains, not
feature folders. Every group must have an `all-{group}.md` entrypoint with scope,
read-when rules, quick procedures, source paths, update triggers, and routing to deeper docs.
Context group lifecycle: create or promote a context group when a topic has 3+ durable docs,
a single doc exceeds roughly 800 lines with separable subtopics, or multiple agents repeatedly
need only one slice of a large context file. Move/split one group at a time, use `all-*.md`
entrypoints, update this router and agent prompts in the same patch, and run the
`ag-audit-context` and `ag-audit-ag` skills after every context or protocol organization change.
Periodic maintenance rule: run `ag-audit-context` and `ag-audit-ag` periodically to prune stale context files and prevent context bloat.

### `process/features/`

Feature-scoped storage for large feature clusters. Each feature folder contains:

- `active/` - In-progress plans
- `completed/` - Archived completed plans
- `backlog/` - Deferred/future plans
- `reports/` - Feature-specific operational reports
- `references/` - Feature-specific research and reference documents

See `process/context/all-context.md` for current feature list.

Routing rule: When a feature has 5+ artifacts, store new plans/reports in
`process/features/{feature}/`. General or cross-cutting items go in
`process/general-plans/` with `reports/` and `references/` inside.

When routing to a subagent for a feature-scoped task, include `Feature: {feature-name}` in
the prompt and override paths:

- `Reports: {work_context}/process/features/{feature}/reports/`
- `Plans: {work_context}/process/features/{feature}/active/`

#### Feature Folder Lifecycle

At plan creation time, use this decision logic:

| Signal                                                    | Action                                      |
| --------------------------------------------------------- | ------------------------------------------- |
| `process/features/{topic}/` already exists                | Use it; pass `Feature: {topic}` to subagent |
| Topic clearly belongs to an existing feature              | Use that feature's folder                   |
| New multi-phase project with 3+ planned phases            | Create feature folder upfront               |
| User says "this is a big feature" or names a product area | Create feature folder upfront               |
| Single plan, no backlog, unclear scope                    | Use `process/general-plans/active/`         |
| Cross-cutting work touching multiple features             | Use general folders                         |

Promotion protocol from general to feature folder:

1. Create `process/features/{new-feature}/` with subdirs: `active/`, `completed/`, `backlog/`, `reports/`, `references/`
2. Move related artifacts from `process/general-plans/`, including reports and references, into the new feature's subdirs
3. Update the Current features list above
4. Inform subagents of the new feature scope going forward

Feature list maintenance: The Current features list above must be updated whenever a new
feature folder is created or an empty one is removed. The `ag-update-process-agent` checks for
drift between `ls process/features/` and this list during Phase 2.

### `process/general-plans/reports/`

General/cross-cutting operational reports. Feature-specific reports live in
`process/features/{feature}/reports/`.

### `process/general-plans/references/`

General/cross-cutting research outputs. Feature-specific references live in
`process/features/{feature}/references/`.

When routing to subagents, always pass relevant `process/context/` files. As new context
files are added, for example UI patterns or deployment procedures, agents automatically benefit.

## Available Workflow Skills

Canonical workflow logic lives in `.agents/skills/` / `.claude/skills/`.
Claude command files are compatibility aliases when they still exist.

### Workflow Ownership

The active system is intentionally split into four layers:

- **Actor agents** own the actual phase or specialist role:
  - `ag-research-agent`
  - `ag-innovate-agent`
  - `ag-plan-agent`
  - `ag-execute-agent`
  - `ag-update-process-agent`
  - `ag-debugger`
  - `ag-tester`
  - `ag-code-reviewer`
  - `ag-code-simplifier`
  - `ag-ui-ux-designer`
  - `ag-git-manager`
- **Contract skills** define repo workflow artifacts and durable process contracts:
  - `ag-generate-plan`
  - `ag-generate-context`
  - `ag-audit-context`
  - `ag-audit-plans`
  - `ag-audit-ag`
  - `ag-harness-sync`
- **Helper skills** improve how agents work but do not own the workflow:
  - `ag-scout`
  - `ag-preview`
  - `ag-tech-graph`
  - `ag-watzup`
  - `ag-xia`
  - `ag-repomix`
  - `ag-docs-seeker`
  - `ag-agent-browser`
  - `ag-web-testing`
  - `ag-frontend-design`
  - `ag-predict`
  - `ag-scenario`
  - `ag-security`
  - `ag-autoresearch`
  - `ag-zod`
  - `ag-zustand`
  - `ag-merge-worktree`
  - `ag-second-brain`
- **Orchestration utility**:
  - `ag-team` coordinates multiple surviving actors/helpers in parallel but is not a competing default workflow owner

Former workflow-owner skills such as `ag:plan`, `ag:research`, `ag:cook`, `ag:fix`, and `ag:code-review` are migration sources only. Their useful practices should be absorbed into the surviving actor/contract surfaces instead of being routed as separate default workflows.

`ag-debug` remains a valid helper skill. It is not a default workflow owner, but its root-cause methodology is still available as a specialist helper alongside the `ag-debugger` agent.

### Core Skills

- `ag-generate-plan` - Create implementation plans (SIMPLE or COMPLEX) with explicit touchpoints, blast radius, verification evidence, and resume handoff
- `ag-generate-context` - Generate/update repository context
- `ag-audit-context` - Audit context routing, grouping, discoverability, and Claude/Codex wiring
- `ag-audit-plans` - Audit active-plan inventory, staleness, and routing truth
- `ag-audit-ag` - Audit agent harness health: agent parity, skill registry, README.md sync, and protocol wiring

Legacy `@sync-to-riper5.md` and `@sync-from-riper5.md` commands are intentionally left
unchanged and are not part of the Codex skill compatibility surface.

## Mode Agents (Codex Compatibility)

Codex provides specialized agents for each RIPER-5 mode through `.codex/agents/*.toml`.
Agent identity lives only in `.claude/agents/*.md` and `.codex/agents/*.toml`. Do not create
or preserve agent-wrapper skills under `.claude/skills/` or `.agents/skills/`.

Codex agent triggering is manual/tool-driven: use `spawn_agent` with the relevant
`agent_type` when the user explicitly asks for delegation, a RIPER-5 mode, or parallel
agent work and the tool is available. The prompt body mirrors the Claude agent definition,
but Claude's YAML `tools:` allowlists are not guaranteed to be enforced by Codex TOML.

### Available Agents

`ag-research-agent`

- Purpose: Information gathering only (read-only)
- Claude tools: Read, Grep, Glob, Bash (safe commands)
- Use: Understanding codebase, gathering context
- Invoke: User says "ENTER RESEARCH MODE" or explicit agent/skill call

`ag-innovate-agent`

- Purpose: Brainstorming approaches (discussion-only)
- Claude tools: Read, Grep, Glob (no execution)
- Use: Exploring implementation options
- Invoke: After RESEARCH, user says "go" or "ENTER INNOVATE MODE"

`ag-plan-agent`

- Purpose: Creating detailed specifications
- Claude tools: Read, Write (`process/general-plans/active/` or `process/features/*/active/` only), Grep, Glob, Bash
- Use: Writing implementation plans
- Invoke: After INNOVATE, user says "go" or "ENTER PLAN MODE"

`ag-execute-agent`

- Purpose: Implementing per approved plan
- Claude tools: Full access (Read, Write, Edit, Delete, Grep, Glob, Bash)
- Use: Code implementation
- Invoke: ONLY with explicit "ENTER EXECUTE MODE" after plan approval

`ag-fast-mode-agent`

- Purpose: Compressed workflow (RESEARCH -> INNOVATE -> PLAN -> PAUSE -> EXECUTE)
- Claude tools: Full access
- Use: Quick end-to-end implementation with safety pause
- Invoke: "ENTER FAST MODE"
- CRITICAL: Pauses before EXECUTE for confirmation

`ag-update-process-agent`

- Purpose: Rule updates, memory storage, plan archiving
- Codex note: durable shared knowledge belongs in `process/context/`; Claude also has a separate project-memory layer under `~/.claude/projects/.../memory/`
- Claude tools: Read, Write, Edit, Grep, Glob, Bash, update_memory
- Use: Capturing learnings, updating documentation

### Specialist Agents

These agents add capabilities beyond the core RIPER-5 workflow. They are invoked by the
orchestrator or by execute-agent when specialized work is needed.

During EXECUTE phase:

- `ag-tester` - Diff-aware test verification. Maps changed files to test files, runs only affected tests. Invoke after implementation sub-steps complete.
- `ag-debugger` - Root cause analysis for bugs. Evidence-before-hypothesis methodology. Can also be invoked standalone.
- `ag-code-reviewer` - Production-readiness review. Edge case scouting, N+1 detection, auth path validation. Invoke as pre-PR quality gate.
- `ag-security-agent` - Dedicated SAST & Red Team Security Auditor. OWASP ASVS/Top 10, STRIDE threat modeling, zero-day logic flaw detection, and auth/cryptographic boundary verification.
- `ag-code-simplifier` - Post-implementation refactor for clarity without behavior change. Invoke after code-reviewer passes.
- `ag-ui-ux-designer` - Design-aware frontend implementation. Invoke for UI/UX tasks within execute phase.
- `ag-git-manager` - Clean conventional commits. Invoke for git operations.

Note: shared review methodology has been absorbed into the `ag-code-reviewer` agent prompt. Route to the agent directly instead of a separate review-owner workflow when the agent is the appropriate path.

Cross-phase utilities (skills, not agents):

- `ag-scout` - Fast codebase scouting, usable in RESEARCH
- `ag-tech-graph` - Publish-grade SVG/PNG technical diagram generator for durable process artifacts; pair with `ag-preview` for review or explanation after generation
- `ag-watzup` - Read-only repo, local/remote ref, worktree, and active-plan handoff summary helper with advisory-only selected-plan hints
- `ag-xia` - Repo comparison and adaptation-prep helper with recon, map, analyze, and challenge stages that stops before planning or coding
- `ag-repomix` - Repository packing helper for references-only artifacts, audits, and feature-porting prep
- `ag-agent-browser` - AI Browser automation CLI with Puppeteer & DevTools script capabilities, primarily EXECUTE
- `ag-debug` - Specialist root-cause-analysis helper, usable alongside `ag-debugger`
- `ag-autoresearch` - Autonomous iterative optimization loop after execute phase for measurable metrics

### Discovery Note

Do not assume `.claude/skills/` is scanned directly by Codex. For Codex compatibility, make
sure the relevant capability is exposed under
[`.agents/skills/`](.agents/skills).
In this repo, `.agents/skills/` is already a symlink to the canonical `.claude/skills/` tree,
so add or update real skill folders there rather than copying them into `.codex/`.

## Routing Protocol

When a user makes a request:

### 0. Skill Discovery

Before routing, scan `.agents/skills/` directory names and match keywords from the user
request to surface relevant skills. Attach candidate skill names to the subagent prompt.

#### 1. Mode & Specialist Agents (`.claude/agents/*.md` & `.codex/agents/*.toml`)

| Agent                     | Purpose                                                    | Primary Use Case / Trigger                       |
| :------------------------ | :--------------------------------------------------------- | :----------------------------------------------- |
| `ag-research-agent`       | Read-only information gathering                            | Codebase research, context gathering             |
| `ag-innovate-agent`       | Exploration & brainstorming                                | Comparing technical approaches                   |
| `ag-plan-agent`           | Detailed spec & plan creation                              | Writing PRD & implementation plans               |
| `ag-execute-agent`        | Plan execution & coding                                    | Implementing approved plan steps                 |
| `ag-fast-mode-agent`      | Compressed workflow (Research -> Plan -> Pause -> Execute) | Rapid end-to-end implementation                  |
| `ag-update-process-agent` | Learning capture & rule updates                            | Archiving plans & updating process/context       |
| `ag-spec-agent`           | Product discovery specification                            | Writing plain-language user intent specs         |
| `ag-validate-agent`       | Feasibility & validation fan-out                           | Plan validation & feasibility checks             |
| `ag-quick-fix-agent`      | Lightweight single-file edit lane                          | Low-risk targeted edits under 15 lines           |
| `ag-debugger`             | Root cause analysis specialist                             | Debugging bugs and test failures                 |
| `ag-tester`               | Diff-aware test verification                               | Running affected test suites                     |
| `ag-code-reviewer`        | Pre-PR quality & security audit                            | Code review and quality gate                     |
| `ag-code-simplifier`      | Post-implementation clarity refactor                       | Readability improvements without behavior change |
| `ag-ui-ux-designer`       | Design-aware frontend implementation                       | UI/UX component styling & layout                 |
| `ag-git-manager`          | Conventional git commit management                         | Staging & logical commit splitting               |
| `ag-security-agent`       | SAST & threat modeling auditor                             | Security audit & vulnerability scanning          |
| `ag-agent-browser`        | Browser automation agent                                   | End-to-end browser execution                     |

#### 2. Local Repository Skills (`.claude/skills/*` & `.agents/skills/*`)

| Skill                         | Purpose                                         | Trigger Keywords                                         |
| :---------------------------- | :---------------------------------------------- | :------------------------------------------------------- |
| `ag-agent-browser`            | AI browser automation CLI                       | browser, screenshot, scrape, automate browser            |
| `ag-agent-strategy-compare`   | Strategy comparison for agent orchestration     | agent strategy, orchestration compare                    |
| `ag-architect-verifier`       | Master Architect & Verifier protocol            | architect verifier, formal spec, 5-layer interrogation   |
| `ag-audit-ag`                 | Agent harness health & parity audit             | harness, agent parity, skill audit, validate skill       |
| `ag-audit-context`            | Context routing & discoverability audit         | context audit, reorganize context, stale context         |
| `ag-audit-plans`              | Active plan inventory & staleness audit         | stale plans, cleanup plans, plan audit                   |
| `ag-autoresearch`             | Autonomous metric optimization loop             | improve coverage, reduce bundle, optimize metric         |
| `ag-brainstorming`            | Interactive brainstorming & 7-domain evaluation | brainstorm, spec, design, approach, requirements         |
| `ag-code-interrogation`       | Socratic code interrogation                     | socratic questioning, code interrogation, 5-layer stack  |
| `ag-context-discovery`        | Automated context discovery                     | discover context, context discovery                      |
| `ag-debug`                    | Root cause analysis helper                      | debug, root cause, investigate                           |
| `ag-docs`                     | Project documentation management                | docs, README, document codebase                          |
| `ag-docs-seeker`              | External library documentation seeker           | how does X work, API docs, syntax                        |
| `ag-feasibility-test`         | Implementation feasibility testing              | feasibility, feasibility test                            |
| `ag-frontend-design`          | Polished UI/UX frontend design                  | UI, design, layout, component, visual, CSS, Tailwind     |
| `ag-generate-closeout`        | Closeout report generation                      | closeout, closeout report                                |
| `ag-generate-context`         | Repository context refresh                      | refresh context, regenerate context, repo context        |
| `ag-generate-phase-program`   | Phase program umbrella generation               | phase program, umbrella plan                             |
| `ag-generate-plan`            | Durable implementation plan creation            | plan, PRD, spec, implementation plan                     |
| `ag-generate-spec`            | Formal spec generation                          | generate spec, formal spec                               |
| `ag-git-flow`                 | Git flow workflow helper                        | git flow, feature branch, PR flow                        |
| `ag-harness-sync`             | Sync and manage agent harness versions          | update harness, pull kit, sync harness, release kit      |
| `ag-intent-clarify`           | Intent clarification helper                     | clarify intent, intent clarify                           |
| `ag-mcp-management`           | MCP server management                           | MCP, model context protocol                              |
| `ag-plan-discovery`           | Active plan discovery helper                    | discover plans, active plan inventory                    |
| `ag-predict`                  | Pre-implementation 5-persona debate             | risks, predict issues, architectural review              |
| `ag-preview`                  | Visual diagram & slide preview helper           | diagram, visualize, slides, preview                      |
| `ag-problem-solving`          | Systematic problem solving helper               | problem solving, stuck, inversion exercise               |
| `ag-red-team-plan`            | Red team security audit planning                | red team, security attack plan                           |
| `ag-repomix`                  | Repository packing for reference artifacts      | pack repo, snapshot codebase, repo context               |
| `ag-reverse-code-review`      | Reverse code review helper                      | reverse code review, sanity check code                   |
| `ag-risk-evidence-pack`       | Risk evidence packaging helper                  | risk evidence, verification evidence pack                |
| `ag-scenario`                 | Edge case generation across 12 dimensions       | edge cases, test scenarios, edge case matrix             |
| `ag-scout`                    | Fast codebase scouting helper                   | find files, where is, search codebase                    |
| `ag-second-brain`             | Obsidian second brain note management           | second brain, obsidian, search notes, memory note        |
| `ag-security`                 | STRIDE + OWASP security audit                   | security, vulnerability, auth, XSS, SQL injection        |
| `ag-sequential-thinking`      | Step-by-step sequential thinking                | sequential thinking, step by step reasoning              |
| `ag-setup`                    | Bootstrap & setup agent harness                 | seed, harness, bootstrap, setup                          |
| `ag-socratic-mentor`          | Socratic mentoring & guidance                   | socratic mentor, learning guidance                       |
| `ag-strict-config-derivation` | Strict config & DTO type derivation             | strict config, column list, permission matrix            |
| `ag-team`                     | Multi-agent parallel collaboration              | parallel agents, multi-agent, team                       |
| `ag-tech-graph`               | Publish-grade technical diagram generator       | generate diagram, architecture diagram, sequence diagram |
| `ag-test-coverage-plan`       | Test coverage planning                          | test coverage, coverage plan                             |
| `ag-update`                   | Harness & process update helper                 | update harness, process update                           |
| `ag-validate-findings`        | Validation findings audit                       | validate findings, audit findings                        |
| `ag-watzup`                   | Active branch & plan handoff summary            | what's in flight, handoff, worktree status               |
| `ag-web-testing`              | Playwright/Vitest/k6 testing                    | tests, e2e, integration test, web testing                |
| `ag-workflow-doc`             | SSOT workflow documentation generator           | workflow doc, feature workflow, sequence diagram         |
| `ag-xia`                      | Repo comparison & adaptation research           | copy from repo, compare repo, adapt from repo            |

#### 3. Harness & System Skills (Built-in OMP / System Runtime)

| Skill                                                                                        | Purpose                                        |
| :------------------------------------------------------------------------------------------- | :--------------------------------------------- |
| `zod`                                                                                        | Zod schema validation rules and standards      |
| `zustand`                                                                                    | Zustand state management best practices        |
| `upstash-ratelimit`                                                                          | Upstash rate limiting standards                |
| `ui-design`                                                                                  | UI/UX & frontend design standards              |
| `typescript`                                                                                 | TypeScript compilation & performance rules     |
| `typescript-refactor`                                                                        | TypeScript refactoring standards               |
| `typescript-advanced-patterns`                                                               | Advanced TypeScript design patterns            |
| `nextjs`                                                                                     | Next.js App Router guidelines & caching        |
| `nextjs-bundle-optimizer`                                                                    | Next.js bundle size optimization               |
| `nextjs-ppr-patterns`                                                                        | Next.js Partial Prerendering patterns          |
| `tailwind`                                                                                   | Tailwind CSS guidelines & utility organization |
| `tailwind-refactor`                                                                          | Tailwind CSS refactoring patterns              |
| `tailwind-responsive-ui`                                                                     | Responsive Tailwind UI patterns                |
| `tailwind-ui-refactor`                                                                       | Tailwind UI redesign patterns                  |
| `react-hook-form`                                                                            | React Hook Form best practices                 |
| `react-hook-form-audit`                                                                      | React Hook Form code audit rules               |
| `implementation-design-patterns`                                                             | Gang of Four design patterns in TypeScript     |
| `implementation-functional-patterns`                                                         | Functional programming patterns                |
| `merge-worktree`                                                                             | Git worktree cleanup and merge helper          |
| Rule: When one or more skills match the request, mention them to the user or include them in |
| the subagent prompt context. Never silently skip relevant skills.                            |

### 1. Detect Intent

Feature Request (keywords: "build", "add", "implement", "create feature")
-> Route to `ag-research-agent` with relevant context files.

Question / Understanding Request
-> Non-trivial: route to `ag-research-agent`. Trivial conceptual questions can be answered directly by the orchestrator.

Trivial Fix
-> Delegate lightweight quick-fix to `ag-execute-agent` with no plan file required.
Trivial definition: single-file change, no new dependencies, no schema/API/auth changes, under 15 lines, no security surface. Anything else is non-trivial.

Missing Context
-> Suggest or invoke the `ag-generate-context` skill.

Bug Fix / Debug Request (keywords: "fix", "bug", "broken", "debug", "error")
-> For trivial: delegate to `ag-execute-agent` directly with no plan required.
-> For complex: route to `ag-debugger` agent. Surface helper skill `ag-scout` when useful to the investigation.

Existing Plan File Present
-> Resume from relevant phase; do not recreate plan.

UI / Frontend Request (keywords: "page", "component", "design", "layout", "interface", "UI")
-> Surface `ag-frontend-design` skill alongside `ag-research-agent`. Invoke `ag-ui-ux-designer` agent during EXECUTE phase for implementation.

Documentation Question (keywords: "how does X work", "API docs", "syntax", "version")
-> Activate `ag-docs-seeker` skill before routing to `ag-research-agent`.

Plan / Context Maintenance
-> Surface `ag-generate-plan`, `ag-generate-context`, `ag-audit-context`, or `ag-audit-plans` directly when the user is asking for saved plan artifacts, context refresh, context reorganization, or active-plan cleanup.

Refactor / Simplify (keywords: "refactor", "clean up", "simplify", "reorganize")
-> Pure style/readability with a named file and no behavior change: route directly to `ag-code-simplifier` agent.
-> Behavioral or architectural refactor: full RESEARCH -> PLAN -> EXECUTE, then `ag-code-simplifier` as cleanup.

Debug / Root Cause (keywords: "debug", "why", "root cause", "investigate")
-> `ag-debugger` agent is the default owner. Helper skill `ag-scout` may be layered in when it helps the investigation.

When multiple intents match, use this precedence:

1. Existing plan file in `process/general-plans/active/` or `process/features/*/active/` -> always resume first
2. Explicit mode command (`ENTER X MODE`) -> obey immediately
3. Bug/debug -> debugging routing before feature routing
4. Feature request -> RIPER-5 flow
5. UI specialization -> surface ag-frontend-design alongside any of the above
6. Docs question -> surface ag-docs-seeker alongside any of the above

When still ambiguous, ask the user one clarifying question before routing.

### 2. Gather Context

Before routing to subagent, pass relevant `process/context/` files:

- `process/context/all-context.md` - always pass or consult first for context routing
- `process/context/all-context.md` - always pass for architecture/stack awareness
- `process/context/tests/all-tests.md` - pass when routing to `ag-tester`, `ag-debugger`, or `ag-execute-agent`
- `process/general-plans/active/` and `process/features/*/active/` - check for existing plans to avoid duplication
- Relevant code paths - summarize succinctly, don't dump entire files

**Routing depth rule:** `all-*.md` files are routers. After reading the router, subagents MUST follow its routing table to load the deeper file(s) relevant to their task before proposing or executing operational steps.

### 3. Route to Subagent

Choose based on current phase (when calling the `task` tool, pass the agent ID WITHOUT the `ag-` prefix, e.g. `research-agent`, `innovate-agent`, `plan-agent`, `execute-agent`, `fast-mode-agent`, `update-process-agent`):

- Initial understanding -> `research-agent` (profile: `ag-research-agent`)
- Exploring options -> `innovate-agent` (profile: `ag-innovate-agent`)
- Creating spec -> `plan-agent` (profile: `ag-plan-agent`)
- Implementing approved plan -> `execute-agent` (profile: `ag-execute-agent`)
- Fast workflow -> `fast-mode-agent` (profile: `ag-fast-mode-agent`)
- Capturing learnings -> `update-process-agent` (profile: `ag-update-process-agent`)

### 4. Monitor Compliance

Ensure subagent:

- Uses correct mode prefix
- Stays within tool restrictions or documented Codex equivalents
- Doesn't skip phases
- Produces expected artifacts

## Phase Transition Rules

RESEARCH -> INNOVATE:

- Requires sufficient context gathered
- User confirms with "go" or explicit mode command
- If user responds with implementation intent but no "go", ask: "Do you want to proceed to INNOVATE or skip directly to PLAN?"

INNOVATE -> PLAN:

- Requires approach discussion completed
- User confirms with "go" or explicit mode command
- ag-innovate-agent must produce a brief decision summary with chosen approach, rejected alternatives, and rationale before PLAN begins

PLAN -> EXECUTE:

- Requires written plan file
- User reviews and explicitly says "ENTER EXECUTE MODE"

Orchestrator preflight before spawning ag-execute-agent: Confirm exactly one plan file is
selected. Pass the plan file path explicitly in the subagent prompt. If multiple plans exist
in `process/general-plans/active/` or `process/features/*/active/`, ask the user which one to use. Never let ag-execute-agent infer
the plan from ambient state.

EXECUTE -> UPDATE PROCESS:

- **Automated Subagent Verification Chain**: After `ag-execute-agent` reports `DONE`, the Orchestrator MUST automatically invoke `ag-tester` (or run the project Quality Gate suite: `bun test src/`, `bun run check-types`, `bun run lint`) to verify 100% test pass, 0 type errors, and 0 lint issues BEFORE presenting the UPDATE PROCESS transition to the user.
- After non-trivial implementation and test verification are complete, surface the cleanup checkpoint.
- UPDATE PROCESS still requires explicit user command.
- After verification passes, the orchestrator should present a short closeout packet:
  - selected plan path
  - closeout classification
  - what was finished
  - what was verified versus still unverified
  - what cleanup/context capture remains
  - uncommitted file count and git-manager offer (when worktree is dirty)
  - commit-checkpoint recommendation:
    - invoke `ag-git-manager` before UPDATE PROCESS when validated execution changes are ready to split into a logical code/test commit
    - defer the commit checkpoint until after UPDATE PROCESS when the remaining changes are mainly `process/`, `.claude/`, `.codex/`, or `AGENTS.md`
  - the single best next valid state
- Then ask one explicit next-step question such as:
  - `Implementation complete. The selected plan appears ready for cleanup. Enter UPDATE PROCESS mode to archive the plan and capture learnings?`
  - or `Implementation is code-complete but still testing. Keep the plan in active for now, or enter UPDATE PROCESS mode anyway?`
  - or `Implementation deviated from plan. Return to PLAN or enter UPDATE PROCESS mode to reconcile?`
- If the next phase or follow-up is already known, name that exact plan path in the closeout summary so the user does not have to rediscover it.
- If the worktree has uncommitted changes from this execution, offer: "Invoke ag-git-manager for logical commit splitting before UPDATE PROCESS?" Pass the `touched_files` list (files the ag-execute-agent reported changing) as context so ag-git-manager can scope its analysis.
- If a phase is well-tested and genuinely validated, prefer surfacing a commit checkpoint instead of letting the work drift uncommitted while broader follow-up phases begin.
- If execution revealed a concrete missing downstream lane, route UPDATE PROCESS to create the follow-up phase plan or backlog artifact and update the umbrella/parent plan instead of leaving the next step only in chat.
- If cleanup is skipped and active-plan debt builds up, recommend `ag-audit-plans` as a follow-up maintenance step
- **Drift signal scoring** for UPDATE PROCESS urgency:
  - Count: (a) total files touched, (b) any `.claude/`, `.codex/`, `README.md`, `AGENTS.md`, or `process/development-protocols/` changes, (c) session involved 3+ memory-worthy observations
  - LOW (0-1 signals): include "UPDATE PROCESS available if you want." in closeout
  - MEDIUM (2 signals): include "Recommend UPDATE PROCESS -- significant changes detected."
  - HIGH (3+ signals): include "Strongly recommend UPDATE PROCESS -- harness/protocol files touched."

**Parallel Fan-Out**

At each phase transition above, consult `process/development-protocols/ag-system-behavior/12-reference.md` for signal-based parallel subagent recommendations. See `01-overview.md` for the checkpoint summary.

## Key Principles

### Phase Locking

Each mode has strict boundaries:

- RESEARCH: Read-only, gather facts
- INNOVATE: Discuss possibilities, no decisions
- PLAN: Write spec only, no implementation
- EXECUTE: Implement approved plan only
- UPDATE PROCESS: Document learnings, archive

### Safety

- Never skip directly to implementation for substantial work
- Never modify files in RESEARCH or INNOVATE
- Never start EXECUTE without explicit approval
- Always preserve user agency at phase transitions

### Efficiency

- Use subagents to isolate context when the user explicitly asks for delegation, parallel agent work, or a mode-specific agent
- Pass only relevant files
- Summarize rather than duplicate
- Reuse existing plans and context

## Success Metrics

Token Efficiency: Subagents use separate contexts, reducing token usage compared to main
conversation context.

Phase Safety: Claude tool restrictions and Codex mode instructions reduce accidental
violations, for example RESEARCH should not modify files.

Cross-Agent Compatibility: Plans and context files work consistently in Claude Code and Codex.

## Quick Start

First Time:

1. Verify RIPER-5 rules loaded; orchestrator may declare `[MODE: ORCHESTRATOR]`
2. Run the `ag-generate-context` skill if `process/context/all-context.md` doesn't exist
3. Start with a feature request or question

Typical Feature Workflow:

1. Describe feature -> Orchestrator routes to `ag-research-agent`
2. Say "go" -> Orchestrator routes to `ag-innovate-agent`
3. Say "go" -> Orchestrator routes to `ag-plan-agent` and creates plan in `process/general-plans/active/`
4. Review plan carefully
5. Say "ENTER EXECUTE MODE" -> Orchestrator routes to `ag-execute-agent`
6. After completion, optionally "ENTER UPDATE PROCESS MODE" -> Orchestrator routes to `ag-update-process-agent`

Quick Iteration (FAST MODE):

1. Say "ENTER FAST MODE - [feature description]"
2. Review generated plan; ag-fast-mode-agent pauses
3. Say "ENTER EXECUTE MODE" to continue implementation within ag-fast-mode-agent

## Troubleshooting

Rules not loading: Verify `process/development-protocols/` exists and that the hook/config path resolution still points to the canonical protocol files.

Subagent not found: Ensure agent files exist in `.claude/agents/` and mirrored TOML exists in
`.codex/agents/`. Shared skills should exist under `.claude/skills/` through the `.agents/skills/`
symlink, but agent wrappers should not exist there.

Plan conflicts: Date-stamped filenames should prevent overwrites; check git status.

Tool restrictions not working: Claude uses `tools` field in agent YAML frontmatter. Codex TOML
mirrors prompts but may not enforce identical tool allowlists.

Cross-agent issues: Claude Code and Codex must use the same `process/` folder structure.

## Resources

- Agent Definitions: `.claude/agents/*.md`
- Codex Agent Mirrors: `.codex/agents/*.toml`
- Workflow Skills: real reusable skills under `.claude/skills/*/SKILL.md`, exposed to Codex through `.agents/skills/`
- Plans: `process/general-plans/active/` (active general), `process/general-plans/{completed,backlog,reports,references}/` (general archives/supporting artifacts), `process/features/*/active/` (feature-scoped)
- Features: `process/features/`
- Context: `process/context/all-context.md` router plus relevant `process/context/` files/groups

## Porting Notes

This file intentionally preserves the original `CLAUDE.md` workflow while adapting it
to Codex-native constructs:

- `AGENTS.md` for top-level repository instructions
- `.agents/skills/` for mode and command workflows
- `.codex/agents/` for Codex subagent role mirrors
- `.codex/config.toml` for project-level Codex configuration

The authoritative historical source remains:

- [CLAUDE.md](CLAUDE.md)
