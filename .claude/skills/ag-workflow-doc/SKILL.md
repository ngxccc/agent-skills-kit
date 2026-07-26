---
name: ag-workflow-doc
description: "Use when generating grounded feature and infrastructure workflow specs, WBS tables, and sequence diagrams using Codebase Memory MCP graph search and the SSOT Workflow Documentation Standard."
---

# Feature & Infrastructure Workflow Documentation Skill

Use this skill whenever generating architectural workflow documentation, feature workflow specs, or infrastructure audit guides for a codebase.

## Mandatory Execution Protocol

### 1. Codebase Memory MCP Indexing & Grounding (CRITICAL)
Before drafting any section, you MUST query the project's Codebase Knowledge Graph (`codebase-memory-mcp`) to extract factual code symbols, routes, controllers, services, database schemas, and guard mechanisms:

- **`search_graph`**: Find exact controllers, services, DTOs, guards, filters (e.g. `search_graph(query="RegisterController")`).
- **`trace_path`**: Trace inbound callers or outbound DB calls for sequence diagrams.
- **`get_code_snippet`**: Retrieve verbatim DTO validation schemas, route handler signatures, and transaction handling logic.
- **`get_architecture`**: Read package layout and service boundaries.

If MCP tools return no results or MCP is unavailable, fallback to surgical grep/glob reads, but NEVER invent routes, DTO names, or file paths.

### 2. Determine Document Type (`docType`)
Select the appropriate document archetype from `process/development-protocols/references/workflow-documentation-standard.md`:
- `docType: feature-workflow` — Business features (Auth, Booking, Payment, User management).
- `docType: infrastructure-workflow` — System cross-cutting concerns (Global Exception Filters, Interceptors, Guards, Outbox Relay).

### 3. Apply SSOT Markdown Template
Load the exact template from `process/development-protocols/references/workflow-documentation-standard.md`:
1. **Frontmatter**: Include `title`, `tags`, `docType`, `status`, `date`.
2. **WBS Table**: 4-level breakdown (`1.0` Module -> `1.1` Feature -> `1.1.1` Guard/DTO -> `1.1.1.1` Task).
3. **Mermaid Sequence Diagram**: Clean `sequenceDiagram` with `autonumber` and clear participant aliases.
4. **Tech Decisions**: Verbatim code snippets for DTO Validation, Service Logic, and DB Transactions.
5. **Defense-in-Depth / Security**: Multi-layer security breakdown (CDN, Throttler Guard, Identity Verification, SQL Shielding).
6. **Implementation / Audit Checklist**: Step-by-step checkboxes with clear artifacts.

### 4. File Naming & Output Path Resolution
Follow the strict **PascalCase with Underscores** naming convention:
- Syntax: `PascalCase_With_Underscores_Workflow.md` (e.g. `Register_User_Workflow.md`, `Global_Exception_Filter_Workflow.md`).

**Destination Priority**:
1. `second-brain/Docs/<Topic>/<File_Name_Workflow.md>` (if `second-brain/` directory exists in the repo workspace).
2. `process/features/<topic>/references/<File_Name_Workflow.md>` (if working within a feature scope).
3. `process/general-plans/references/<File_Name_Workflow.md>` (fallback).
