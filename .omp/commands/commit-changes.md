---
description: Commit the current unstaged changes in the repository, presenting a structured plan for review if confirmation is not yet provided.
---

Process the commit query or instruction provided:

$@

Perform the following direct commit strategy:

### Commit Strategy

1. **Analyze changes**: Analyze all current unstaged changes in the working directory using `git status` or `git diff`.
2. **Group changes**: Group the changes logically into separate, clean, scoped commits by function/feature (e.g. database service, UI component, API route, docs).
3. **Present plan for confirmation**: If the confirmation symbol (such as `[X]` or `[commit]`) is not present in the prompt, present the grouped commit plan to the user for review using the following standard markdown format, then stop and wait:

   ```markdown
   ### Group N: [Logical Scope Title]

   - **Scope**: `[type(scope)]`
   - **Message**: `[type(scope): conventional message]`
   - **Affected Files**:
     - `[path/to/file1]`
     - `[path/to/file2]`
   - **Description**:
     - [Specific description of change 1]
     - [Specific description of change 2]

   _(Use `---` separators between groups if there are multiple groups)._
   ```

4. **Direct commit**: When a confirmation symbol (`[X]` or `[commit]`) is present in the prompt, stage the files for each group and run the git commit command with the drafted conventional message. Do not push. After execution, report back a summary of the executed commits including their final hashes and affected scopes.

### CRITICAL POLICY & SAFETY RULES (MUST)

1. **No auto-commits**: For any subsequent turns, normal tasks, or other instructions, you MUST NEVER automatically stage or commit files, nor touch Git without the user's explicit request or when a clear confirmation symbol is present in the prompt. The user MUST review all changes first.
