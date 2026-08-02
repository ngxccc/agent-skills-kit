---
name: ag-second-brain
description: "Use when querying, searching, updating, or adding notes in the Obsidian second brain without fabricating details."
trigger_keywords: second, brain
layer: helper
---

# Second Brain QA & Explainer Skill

This skill allows the agent to search the local Obsidian second brain using a dedicated script, extract matching notes, and answer user queries with absolute accuracy by citing specific local notes as sources.

## When to Apply

- The user asks for an explanation, summary, or definition of any technical concept, SOP, workflow, or vocabulary term.
- You need to verify if a specific topic or rule is documented in the second brain before answering.
- The user explicitly requests searching, updating, adding knowledge, or ducing drafts/inbox notes.
- The user wants to clean up the inbox or migrate raw notes into structured Atomic Notes.

## How to Use

To query the second brain for a specific topic, execute the search script:

```bash
bun /home/ngxc/workspace/agent-skills-kit/.agents/skills/ag-second-brain/scripts/search_brain.mjs "<query>"
```

### Knowledge Modification & Creation Guidelines

1. **Search Before Edit**: Run the search script to check if the concept already exists. Avoid creating duplicate notes for the same concept.
2. **Updating Existing Notes**:
   - Maintain the strict 5-part structure (Frontmatter, TL;DR, Core Concept, Concrete Examples, Related Notes).
   - Run `bun 99_Meta/Scripts/validate_notes.mjs <file_path>` after editing.
3. **Creating Inbox Notes**:
   - Save temporary drafts or raw incoming notes directly to `00_Inbox/<filename>.md`. These do not require strict frontmatter or section templates initially.
4. **Migrating Inbox to Atomic Notes**:
   - Read the raw note from `00_Inbox/`.
   - Apply the Litmus Test: If actionable (SOP, scripts, guidelines), place in `30_Resources/Methods/`. If cognitive (theory, definitions), place in `30_Resources/Concepts/` or `30_Resources/Tech/`.
   - Structure the note into the 5-part Atomic Note format.
   - Add backlinks to relevant MOCs (`000_Tech_MOC`, `000_Concepts_MOC`, or `000_Methods_MOC`) and register the link inside those MOC files.
   - Run validation script on the new file: `bun 99_Meta/Scripts/validate_notes.mjs <new_file_path>`.
   - Once successfully validated, delete the raw note from `00_Inbox/`.
5. **Creating Workflow Documentation**:
   - When creating or editing workflow docs in `second-brain/Docs/<Topic>/`, follow the SSOT Workflow Documentation Standard at `process/development-protocols/references/workflow-documentation-standard.md` (or `ag-workflow-doc` skill).
   - Use `docType: feature-workflow` or `docType: infrastructure-workflow`.
   - Use PascalCase with Underscores file naming: `PascalCase_With_Underscores_Workflow.md` (e.g., `Register_User_Workflow.md`).
   - Use Codebase Memory MCP graph tools (`search_graph`, `trace_path`, `get_code_snippet`) to extract grounded code symbols and avoid hallucinated routes or DTOs.
6. **Flashcard Creation & SRS Guidelines**:
   - **Directory Structure**: Store flashcard files under `50_Flashcards/<DeckName>/` (e.g., `50_Flashcards/Backend/` or `50_Flashcards/Vocabulary/CV/`). Yanki automatically derives the Anki deck name from the folder path.
   - **File Format Constraints**:
     - **Frontmatter**: Omit standard atomic note tags to skip standard validation. Keep _only_ the `noteId` in the YAML block (e.g., `--- \n noteId: 12345 \n ---`) to preserve Anki's review history and avoid duplicate cards.
     - **No Headings**: Never write `# Title` headings in the body of the markdown, as Yanki renders headings into the Anki card content.
     - **Separator Spacing**: The thematic break `---` separating front and back content must be surrounded by an empty line both above and below it.
   - **Supported Yanki Card Syntax**:
     - **Basic**:
       ```markdown
       Front content

       ---

       Back content
       ```
     - **Reversed with Extra**: Use a double `---` to create a reversible card (twice the cards). A third `---` defines an "Extra" section visible on the back of both generated cards:
       ```markdown
       Term / Concept A

       ---

       ---

       Definition / Concept B

       ---

       Extra context shown on both sides
       ```
     - **Cloze Deletion**: Hide terms with double tildes `~~`, adding optional `_italics_` inside for hints:
       ```markdown
       All will be ~~revealed _hint text_~~.
       ```
     - **Advanced Cloze Numbering**: Group clozes to reveal simultaneously by adding a number inside the cloze:
       ```markdown
       ~~1 Grouped A~~ and ~~1 Grouped B~~.
       ```
     - **Type-in-the-Answer**: Emphasize the last line with `_italics_` to force a spelling text-input check in Anki:
       ```markdown
       Spell the term:

       _spelling_
       ```

### Response Guidelines

1. **Exact Extraction**: Read the source note paths returned by the script and use their content (like `## TL;DR` or `Core Concept`) to answer.
2. **Mandatory Citations**: Always reference the source note path or link (e.g., `[[Note_Name]]` or `30_Resources/Concepts/Path/Note_Name.md`) at the end of your explanation.
3. **No Fabrication**: If the script returns `NO_MATCHES_FOUND` or if the matching notes do not contain the answer, you **MUST** explicitly state: "Kiến thức này không có trong second-brain." Do not guess, hallucinate, or use external/pretrained LLM knowledge to answer the query.

## References

- [Obsidian Second Brain Structure Guidelines](https://obsidian.md/)
