# Tool Invocation Discipline & Preference Matrix

This document defines the strict, non-negotiable policy for selecting specialized tools over generic shell commands across all AI coding assistant workflows.

## Mandatory Specialized Tool Rule

1. **File Reading & Line Selection**: MUST use `read(path="<file>:<lines>")`. NEVER use shell `cat`, `head`, `tail`, `less`, `more`, or redirection.
2. **Code Intelligence & Navigation**: MUST use `lsp` (`action: "definition" | "references" | "hover" | "type_definition"`). NEVER search text manually with `grep` or `rg` for symbol callsites or definitions.
3. **Symbol Renames & AST Refactoring**: MUST use `lsp` (`action: "rename" | "rename_file"`) or `ast_edit`. NEVER use `sed`, `awk`, regex replace, or hand edits for cross-file symbol refactoring.
4. **Program State & Debugging**: MUST use `debug` (DAP Debugger via `xd://debug`) for inspecting stack frames, variables, memory, and setting breakpoints. NEVER write temporary `console.log` / `print` statements or custom debugging scripts.
5. **Codebase Exploration**: MUST use `codebase-memory-mcp` (`search_graph`, `trace_path`, `get_code_snippet`) or `glob` / `grep`. NEVER use `find`, `ls -R`, or open-ended shell searching.
6. **Shell/Bash Boundary**: `bash` is restricted ONLY to build commands, running test suites, binary invocations, or fact pipelines (`sort | uniq -c`). Shell commands shadowing specialized tools are strictly BLOCKED.

## Tool Invocation Preference Matrix

| Task Category           | Forbidden Shell Command ❌  | Mandatory Specialized Tool ✅ | Invocation Mechanism                                                                           |
| :---------------------- | :-------------------------- | :---------------------------- | :--------------------------------------------------------------------------------------------- |
| **Read File Range**     | `cat`, `head -n`, `tail -n` | `read`                        | `read(path="src/app.ts:50-120")`                                                               |
| **Find Symbol Callers** | `grep -r`, `rg`             | `lsp (action="references")`   | `write("xd://lsp", {"action":"references","file":"...","line":N,"symbol":"..."})`              |
| **Cross-File Rename**   | `sed -i`, text replace      | `lsp (action="rename")`       | `write("xd://lsp", {"action":"rename","file":"...","line":N,"symbol":"...","new_name":"..."})` |
| **AST Codemod**         | `sed`, regex scripts        | `ast_edit`                    | `write("xd://ast_edit", {"paths":["..."],"ops":[{"pat":"...","out":"..."}]})`                  |
| **Runtime Debugging**   | `console.log`, `print`      | `debug` (DAP Debugger)        | `write("xd://debug", {"action":"set_breakpoint","file":"...","line":N})`                       |
| **Code Architecture**   | `find .`, `grep`            | `codebase-memory-mcp`         | `write("xd://mcp__codebase_memory_search_graph", {"project":"<name>","query":"..."})`          |

## Explicit Device Invocation Payload Examples

### 1. Codebase Memory MCP (`xd://mcp__codebase_memory_*`)

- **List Projects**:
  `write("xd://mcp__codebase_memory_list_projects", {})`
- **Index Repository** (requires `repo_path`):
  `write("xd://mcp__codebase_memory_index_repository", {"repo_path": "/full/path/to/repo", "mode": "fast"})`
- **Search Knowledge Graph** (requires `project` and `query` or `name_pattern`):
  `write("xd://mcp__codebase_memory_search_graph", {"project": "home-user-repo", "query": "validate"})`
