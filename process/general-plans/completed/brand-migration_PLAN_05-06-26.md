# Plan - Brand and Prefix Migration (agent-skills-kit -> agent-skills-kit, vc- -> ag-)

Date: 2026-06-05
Status: active

## 1. Overview
Rename the project branding from `agent-skills-kit` to `agent-skills-kit`, and rename the `vc-` and `vc:` prefixes to `ag-` and `ag:` across all agents, skills, hooks, plans, validation scripts, and workflows.

## 2. Proposed Changes

### A. Folder and File Renames
1. **Agents (`.claude/agents/` and `.codex/agents/`)**:
   - `ag-research-agent.md` -> `ag-research-agent.md`
   - `ag-innovate-agent.md` -> `ag-innovate-agent.md`
   - `ag-plan-agent.md` -> `ag-plan-agent.md`
   - `ag-execute-agent.md` -> `ag-execute-agent.md`
   - `ag-fast-mode-agent.md` -> `ag-fast-mode-agent.md`
   - `ag-update-process-agent.md` -> `ag-update-process-agent.md`
   - `ag-debugger.md` -> `ag-debugger.md`
   - `ag-tester.md` -> `ag-tester.md`
   - `ag-code-reviewer.md` -> `ag-code-reviewer.md`
   - `ag-code-simplifier.md` -> `ag-code-simplifier.md`
   - `ag-git-manager.md` -> `ag-git-manager.md`
   - `ag-ui-ux-designer.md` -> `ag-ui-ux-designer.md`
   - (Same renames for `.codex/agents/*.toml` files and `.agents/agents/*` folders)
2. **Skills (`.claude/skills/` and `.agents/skills/`)**:
   - `ag-web-testing/` -> `ag-web-testing/`
   - `ag-xia/` -> `ag-xia/`
   - `ag-update/` -> `ag-update/`
   - `ag-watzup/` -> `ag-watzup/`
   - `ag-tech-graph/` -> `ag-tech-graph/`
   - `ag-setup/` -> `ag-setup/`
   - `ag-team/` -> `ag-team/`
   - `ag-sequential-thinking/` -> `ag-sequential-thinking/`
   - `ag-scout/` -> `ag-scout/`
   - `ag-security/` -> `ag-security/`
   - `ag-repomix/` -> `ag-repomix/`
   - `ag-scenario/` -> `ag-scenario/`
   - `ag-problem-solving/` -> `ag-problem-solving/`
   - `ag-publish/` -> `ag-publish/`
   - `ag-preview/` -> `ag-preview/`
   - `ag-audit-context/` -> `ag-audit-context/`
   - `ag-audit-plans/` -> `ag-audit-plans/`
   - `ag-audit-ag/` -> `ag-audit-ag/` (rename to `ag-audit-ag/` or keep `ag-audit-ag/`? Let's use `ag-audit-ag/`)
   - `ag-generate-context/` -> `ag-generate-context/`
   - `ag-generate-plan/` -> `ag-generate-plan/`
3. **Manifest Files**:
   - `ag-manifest.json` -> `ag-manifest.json`

### B. Code and Config Replacements
1. **Manifest File references**:
   - Replace occurrences in `resolve-manifest.mjs`, `install.sh`, `.github/workflows/*`, validation scripts.
2. **Branding Replacements**:
   - Replace `agent-skills-kit` with `agent-skills-kit` in all markdown files, shell scripts, and workflow YAMLs.
3. **Prefix Replacements**:
   - Replace `vc-` with `ag-` in all file paths, script requirements, frontmatter `name:` (e.g. `ag:setup` -> `ag:setup`), and orchestration protocols.
   - Replace `vc:` with `ag:` in skill names and references.
   - Update `CLAUDE.md`, `AGENTS.md`, and all `process/development-protocols/` files.
4. **Symlinks**:
   - Re-link `.agents/skills` to `../.claude/skills`.

### C. Validation Script Updates
- Update validation scripts (now in `.claude/skills/ag-audit-ag/scripts/` and similar) to check for `ag-` prefix instead of `vc-` prefix, and `ag-manifest.json` instead of `ag-manifest.json`.

## 3. Verification Plan
1. Run all hook tests:
   ```bash
   node .codex/hooks/lib/__tests__/statusline-suite.cjs
   ```
2. Run all validation scripts:
   ```bash
   node .claude/skills/ag-audit-ag/scripts/validate-agent-parity.mjs
   node .claude/skills/ag-audit-ag/scripts/validate-skills.mjs
   node .claude/skills/ag-audit-ag/scripts/validate-guide-sync.mjs
   node .claude/skills/ag-audit-ag/scripts/validate-protocol-wiring.mjs
   node .claude/skills/ag-audit-ag/scripts/validate-seeds.mjs
   node .claude/skills/ag-audit-context/scripts/validate-context-discovery.mjs
   node .claude/skills/ag-audit-context/scripts/validate-skill-routing.mjs
   node .claude/skills/ag-audit-context/scripts/validate-skill-cross-refs.mjs
   node .claude/skills/ag-audit-context/scripts/validate-skill-dependencies.mjs
   node .claude/skills/ag-audit-context/scripts/validate-confusable-skills.mjs
   node .claude/skills/ag-audit-plans/scripts/validate-plan-inventory.mjs
   node .claude/skills/ag-generate-context/scripts/validate-all-context.mjs
   ```
3. Run `git status` to ensure clean state and no missing file traces.
