---
description: Audit a React component for React Hook Form performance anti-patterns and form validation issues
---

Audit the React Hook Form component file specified at: $1.

Focus on identifying and resolving performance bottlenecks, code quality issues, and structural anti-patterns.

Before you begin, read and apply the workspace-specific form standards defined in:

- `skill://react-hook-form-audit`
- `skill://react-hook-form`

### Anti-Patterns to Scan & Rectify

Analyze the component code against the following rules:

1. **Root-Level `watch()` Usage**:
   - Check if `watch()` is called at the component root level (e.g., `const values = watch()`). This triggers a full re-render of the entire form on every single keystroke.
   - **Remedy**: Instruct the user or rewrite the code to isolate state using `useWatch` or `useController` inside leaf component nodes, or utilize the `subscribe()` API (for React Hook Form v7.55+).

2. **Inlined Controllers & Render Loops**:
   - Check if `Controller` render functions or custom inputs are defined inline or dynamically inside the parent component's body.
   - **Remedy**: Extract helper render components outside the parent component render loop to prevent full component remounts on keystrokes.

3. **Asynchronous Submit Error Handling**:
   - Verify that the form submission function passed to `handleSubmit` (the `onSubmit` handler) wraps asynchronous network calls in a proper `try/catch` block.
   - **Remedy**: Wrap async operations in a try/catch block and handle server failures gracefully (e.g. mapping errors using `setError`).

4. **In-Component Schema Definition**:
   - Check if the validation schema (e.g., Zod schema) is defined inside the component body. This causes the schema to be re-compiled on every render.
   - **Remedy**: Move the schema definition outside the React component or memoize it if it depends on dynamic props.

5. **Registering Disabled Inputs**:
   - Verify that input elements are not disabled using `register('name', { disabled: true })` if the visual state changes dynamically. Check if this conflicts with input values being omitted from form submissions.
   - **Remedy**: Control the disabled state via UI props or context state rather than hard-registering it as disabled if the value needs to persist.

6. **Field Array Keys**:
   - If `useFieldArray` is used, ensure that the mapped list elements use `key={field.id}` instead of the array index `key={index}`. Using array indexes causes react key reconciliation bugs when inserting or removing items.

### Output Format

Provide a highly structured and actionable response:

1. **Summary of Findings**: A bulleted list of identified issues, citing specific line numbers and the potential impact of each issue.
2. **Verification Plan**: A step-by-step description of how to manually test the changes and verify that form validation and submission continue to work seamlessly.
