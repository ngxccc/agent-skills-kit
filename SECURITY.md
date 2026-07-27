# Security Policy

> **Agent Skills Kit Security Model & Vulnerability Disclosure Policy**

---

## 🛡️ Supported Versions

| Version | Supported | Notes |
| :--- | :--- | :--- |
| **Latest (`main` branch)** | ✅ Yes | Active security patches and updates |
| Older releases / commits | ❌ No | Please upgrade to latest `main` |

---

## 🔒 Reporting a Vulnerability

**Do NOT open a public issue for security vulnerabilities.**

To report a vulnerability privately, please use GitHub Private Vulnerability Reporting:

👉 **[Report a Security Vulnerability](https://github.com/ngxccc/agent-skills-kit/security/advisories/new)**

### Response Timeline
- **Acknowledgment:** Within 48 hours.
- **Severity Assessment:** Within 7 days.
- **Patch & Fix:** Target resolution within 30 days.

---

## 🎯 Scope

### In Scope
- **Hook Scripts (`.claude/hooks/`, `.codex/hooks/`)**: Bypass flaws in `privacy-block.cjs` or `scout-block.cjs` that allow unauthorized access to sensitive files or secrets.
- **Installer Script (`install.sh`)**: Command injection, supply chain issues, or unsafe file operations.
- **Agent Governance & Prompts (`.claude/agents/`, `.codex/agents/`)**: Prompt injection vulnerabilities that bypass RIPER-5 phase-locking, tool permissions, or formal spec risk gates.
- **Secret & Credential Leakage**: Flaws in the harness that expose `.env` secrets, API keys, or private tokens to agent context unexpectedly.
- **ADR & Spec Verification Scripts**: Vulnerabilities in automated validators (`validate-adrs.mjs`, `validate-agent-parity.mjs`).

### Out of Scope
- Vulnerabilities in upstream AI CLI tools (Claude Code, OpenAI Codex, Antigravity).
- Vulnerabilities in application code outside the harness directory.
- Denial of Service (DoS) against local developer workstations.

---

## 🤖 Harness Security & Automated Verification

The `agent-skills-kit` enforces strict security boundaries during agent execution:

1. **High-Risk Security Baseline (`ag-security`)**:
   - Automated STRIDE & OWASP ASVS scans for High-Risk features (Auth, Billing, Secrets, Public APIs).
   - Formal Spec Invariant validation (`INV-1`) before implementation approval.
2. **Privacy Block Hook**:
   - Intercepts unsafe file access attempts to prevent secret leakage.
3. **Formal Verifier Matrix**:
   - Security personas flag vulnerabilities into `adversarial-validation.json` and block phase closure if unverified.

---

## 📜 Safe Harbor

We consider good-faith security research authorized. We will not take legal action against researchers who report vulnerabilities according to this policy without exploiting them or exposing user data.
