# Architectural Decision Record (ADR) Layout Specification

All ADR files in the repository MUST follow the standard structure defined in this specification to ensure consistent auditing and indexing.

## Naming Convention

- **Filename Pattern**: `\d{4}-<kebab-case-description>.md`
- **Example**: `0009-hybrid-faceted-search-for-catalog-filtering.md`
- **Rules**:
  - Exactly 4 digits for the prefix number.
  - Suffix and filename must be in lowercase.
  - Hyphens used as word separators.

## Required Headers and Sections

### 1. Document Title (Level 1 Heading)

The document MUST start with a Level 1 heading containing the ADR number and title:

```markdown
# <Number>. <Title>
```

_Example_: `# 9. Hybrid Faceted Search for Catalog Filtering`
_Rule_: The numerical value must match the 4-digit prefix of the filename (e.g. `0009` matches `9`).

### 2. Date

A single Date line immediately following the title in `YYYY-MM-DD` format:

```markdown
Date: YYYY-MM-DD
```

### 3. Status Section (`## Status`)

Indicates the current status of the decision. Valid status values are:

- `Proposed`: The decision is under review or discussion.
- `Accepted`: The decision is approved and should be followed.
- `Rejected`: The decision was reviewed but not adopted.
- `Deprecated`: The decision has been superseded by a later ADR.

### 4. Context Section (`## Context`)

Describes the problem, forces, and requirements leading to this decision.

### 5. Decision Section (`## Decision`)

Specifies the chosen solution, path, or pattern to resolve the context.

### 6. Consequences Section (`## Consequences`)

Details the positive and negative tradeoffs resulting from the decision.
