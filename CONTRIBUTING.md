# Contributing to agent-skills-kit

Thank you for your interest in contributing to **agent-skills-kit**! This project provides a production-grade agent harness for Claude Code, Codex, Antigravity, Cursor, and Windsurf. We welcome contributions from everyone.

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md).

---

## 💬 Communication Channels

- **WhatsApp (primary):** [Join our community group](https://chat.whatsapp.com/E42ySo6iGmuAyeh25eAXuu?s=cl&p=i&mlu=1)
- **GitHub Issues:** Bug reports, feature requests, and task tracking
- **GitHub Discussions:** Architectural questions, ideas, and general conversation

> This is our official community channel — we do not use Discord, Slack, or other platforms.

---

## 🛠️ Development Prerequisites

Before contributing, ensure you have:

- **Node.js** >= 20 or **Bun** >= 1.1
- **bash** or **zsh** shell
- **git** >= 2.30
- **Operating system:** macOS, Linux, or Windows with WSL2

The harness is designed to be zero-dependency for core execution, with lightweight Node/Bun validation scripts for audit checks.

---

## 🧩 Types of Contributions

### 1. Skills (`.claude/skills/`)

Skills are reusable capability modules that live under `.claude/skills/`. Each skill MUST:

- Have its own directory (e.g., `.claude/skills/my-skill/`)
- Contain a `SKILL.md` file with valid YAML frontmatter (`name`, `description`)
- **Not** use the `ag-` prefix unless submitting an official core harness skill
- Include helper scripts under a `scripts/` subdirectory if required

### 2. Agents (`.claude/agents/` and `.codex/agents/`)

Agent definitions provide specialized personas for workflow phases. Each agent MUST:

- Maintain strict 1:1 parity between `.claude/agents/<agent-name>.md` (Claude Code) and `.codex/agents/<agent-name>.toml` (Codex)
- Follow existing naming conventions and prompt structure

### 3. Hooks (`.claude/hooks/`)

Pre- and post-execution lifecycle hooks that run automatically during agent sessions.

### 4. Protocols & Playbooks (`process/development-protocols/`)

Development standards, phase rules, and master workflow guides.

### 5. Documentation & Second Brain (`README.md`, `second-brain/Docs/`)

Improvements to system guides, ADRs, workflow standards, and translation files.

---

## 🚀 Getting Started Workflow

1. **Fork** the repository on GitHub.
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/<your-username>/agent-skills-kit.git
   cd agent-skills-kit
   ```
3. **Install** the harness into a test project to verify execution:
   ```bash
   bash /path/to/agent-skills-kit/install.sh
   ```
4. **Run Audit Suite** to confirm your environment is clean:
   ```bash
   ./scripts/run-audit-parallel.mjs
   ```
   All 12 audit validators should pass with 0 failures before you start making changes.

---

## 🏛️ Architecture Overview

The harness uses a dual-surface architecture for Claude Code and Codex compatibility:

```
.claude/
  agents/          # Claude Code agent definitions (*.md)
  skills/          # Shared skill modules (each directory contains SKILL.md)
  hooks/           # Session lifecycle hooks
.codex/
  agents/          # Codex agent definitions (*.toml, mirrored from .claude/agents/)
process/
  development-protocols/ # Shared workflow rules, master guides & PRD references
  context/               # Authoritative project context entrypoints (all-context.md)
second-brain/
  Docs/
    ADRs/          # Architectural Decision Records (000X-<name>.md)
    <Topic>/       # Operational SSOT Workflow Documentation
```

Skills are shared between surfaces via the `.agents/skills` symlink that Codex uses to discover `.claude/skills/`.

---

## 🔀 Enterprise Git Flow & Pull Request Guidelines

This repository enforces the **Enterprise Git Flow** standard (`ag-git-flow`).

### Conventional Commits Title Format

All PR titles and commit messages MUST follow Conventional Commits:

- `feat:` — New skill, agent, hook, or capability
- `fix:` — Bug fix in existing functionality or script
- `docs:` — Documentation or protocol updates
- `refactor:` — Code/prompt restructuring without behavior change
- `chore:` — Maintenance, manifest updates, or tooling changes

Examples:

```text
feat(skills): add code-interrogation skill with 5-layer cognitive stack
fix(install): correct symlink detection in install.sh on WSL2
docs(protocols): update architect-verifier master workflow guide
chore(manifest): register new skills in ag-manifest.json
```

### PR Requirements

- **Scope:** Keep PRs focused: **one contribution type per PR** (target 200-400 lines of meaningful change).
- **Audit Requirement:** All 12 parallel audit validators MUST pass:
  ```bash
  ./scripts/run-audit-parallel.mjs
  bun run .claude/skills/ag-docs/scripts/validate-docs.mjs
  ```
- **Manifest Sync:** If adding or moving files, update `ag-manifest.json`.

---

## 📋 Manifest Sync (`ag-manifest.json`)

The `ag-manifest.json` file tracks all managed files in the harness. When you add new files (skills, agents, hooks, protocols):

1. Add the file path to `ag-manifest.json` under the appropriate section.
2. Keep entries sorted alphabetically within each section.
3. Run `./scripts/run-audit-parallel.mjs` to confirm kit portability and manifest integrity.

---

## ✅ Contribution Checklists

### Skill Checklist

- [ ] Skill lives under `.claude/skills/<skill-name>/`
- [ ] `SKILL.md` exists with valid YAML frontmatter (`name`, `description`)
- [ ] Any helper scripts are placed under `scripts/`
- [ ] File paths registered in `ag-manifest.json`
- [ ] Validation passes: `node .claude/skills/ag-audit-ag/scripts/validate-skills.mjs`

### Agent Checklist

- [ ] Claude agent definition exists in `.claude/agents/<agent-name>.md`
- [ ] Codex agent mirror exists in `.codex/agents/<agent-name>.toml`
- [ ] Parity validation passes: `node .claude/skills/ag-audit-ag/scripts/validate-agent-parity.mjs`

---

## ⚖️ Review & Code of Conduct

- PRs are reviewed by maintainers within **48 business hours**.
- At least **one maintainer approval** is required before merging.
- No CLA is required — contributions are licensed under the [MIT License](LICENSE).

Thank you for helping build a world-class AI agent harness!
