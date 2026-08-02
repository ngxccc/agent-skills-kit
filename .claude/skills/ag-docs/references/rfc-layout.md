# Request for Comments (RFC) Layout Specification

All RFC files in the repository MUST follow the standard structure defined in this specification to ensure consistent review, indexing, and architectural proposal tracking.

## Naming Convention

- **Filename Pattern**: `\d{4}-<kebab-case-description>.md`
- **Example**: `0001-payment-gateway-refactor.md`
- **Rules**:
  - Exactly 4 digits for the prefix number.
  - Suffix and filename must be in lowercase `kebab-case`.
  - Hyphens used as word separators.

## Required Headers and Sections

### 1. Document Title (Level 1 Heading)

The document MUST start with a Level 1 heading containing the RFC number and title:

```markdown
# <Number>. <Title>
```

_Example_: `# 1. Payment Gateway Refactor`  
_Rule_: The numerical value must match the 4-digit prefix of the filename (e.g. `0001` matches `1`).

### 2. Metadata (Date, Author, Status)

Immediately following the title, include Date, Author, and Status metadata:

```markdown
Date: YYYY-MM-DD
Author: <Author / Agent / Team>
Status: Draft | Under Review | Approved | Rejected | Superseded by [ADR-XXXX](link)
```

### 3. Summary Section (`## Summary`)

A 2–3 sentence high-level summary of the proposed architectural or system change.

### 4. Context & Motivation (`## Context & Motivation`)

Explains why this change is required, the underlying problem, business drivers, and current system limitations.

### 5. Detailed Proposal (`## Detailed Proposal`)

Specifies the proposed architectural design, API contracts, data flows, and code structure.

### 6. Drawbacks & Alternatives (`## Drawbacks & Alternatives`)

Lists potential drawbacks, trade-offs, and alternative approaches considered.

### 7. Unresolved Questions (`## Unresolved Questions`)

Highlights open questions, risks, or security considerations requiring discussion before decision locking.

---

## Canonical RFC Template

```markdown
# 0. Proposal Title

Date: YYYY-MM-DD
Author: Team / Agent
Status: Draft

## Summary

[Summary description]

## Context & Motivation

[Problem statement and motivation]

## Detailed Proposal

[Proposed technical solution]

## Drawbacks & Alternatives

- **Drawback**: [Description]
- **Alternative 1**: [Description]

## Unresolved Questions

- [ ] Question 1
```
