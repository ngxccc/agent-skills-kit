# drizzle-kit-cli-mcp

## Impact

**HIGH**

## Description

Drizzle Kit v1.0.0-rc.4 introduces machine-readable JSON output modes (`--output json`), a public programmatic SDK (`@drizzle-kit/cli`), and a native Model Context Protocol (MCP) server (`drizzle-kit mcp`) over stdio for AI agents and non-interactive CI/CD automation.

When operating database migration lifecycles in non-interactive shell scripts or AI subagents:

1. **Non-Interactive JSON Envelope**: Use `--output json` on `generate`, `push`, `pull`, `up`, `export`, and `check` CLI commands to receive typed JSON responses `{ status, errors, payloads }`.
2. **Pre-supplied Migration Hints**: To resolve table/column renames and data loss confirmations in headless execution, supply a structured hints file using `--hints-file ./drizzle-hints.json` or `--hints '[...]'`.
3. **MCP Server Integration**: AI Coding Assistants can spawn `drizzle-kit mcp` via stdio to inspect database schemas, generate migrations, and push schema changes automatically through tool calls.
4. **Programmatic SDK**: Import SDK utilities directly from `@drizzle-kit/cli` (`generate()`, `push()`, `pull()`, `check()`, `up()`, `exportSql()`).

## CLI & Script Usage

```bash
# Non-interactive migration check returning JSON envelope
drizzle-kit check --output json

# Push schema changes in CI with pre-supplied hints to bypass TTY prompts
drizzle-kit push --output json --hints-file ./drizzle-hints.json
```

## Programmatic SDK Example

```typescript
import { push, generate } from "drizzle-kit/cli";

// Programmatic schema generation
const genResult = await generate({
  schema: "./src/database/schemas",
  out: "./drizzle",
  dialect: "postgresql",
});

if (genResult.status === "success") {
  console.log("Migration generated successfully:", genResult.payload);
}
```

## MCP Server Configuration (`mcp.json`)

```json
{
  "mcpServers": {
    "drizzle-kit": {
      "command": "bunx",
      "args": ["drizzle-kit", "mcp"]
    }
  }
}
```
