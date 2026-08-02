# {{group_name}} Context

This file is the canonical {{group_name}} context entrypoint for {{project_name}}.

Use it after `process/context/all-context.md` when the task needs {{group_scope_short}}.

---

## How to Use This Template

This is the standard template for creating `all-{group}.md` entrypoints when a new context group is created.

To use: copy this file to `process/context/{group}/all-{group}.md`, then replace:

- `{{group_name}}` with the display name (e.g., "Database", "Auth", "Infrastructure")
- `{{group_scope_short}}` with a brief scope phrase (e.g., "schema changes, migrations, or query patterns")
- `{{project_name}}` with the project name
- Fill in each section with real project-specific content

Every `all-{group}.md` entrypoint MUST have these sections: Scope, Read When, Quick Routing, Source Paths, Update Triggers.

---

## Scope

<!-- What this group covers and what it does NOT cover. Be explicit about boundaries. -->

This group covers:

- (list the durable knowledge domains this group owns)
- (be specific: "Prisma schema conventions" not just "database")
- (include operational knowledge, not just code locations)

It does not cover:

- (list what belongs elsewhere)
- (e.g., "feature-specific migration plans -- those belong in process/features/...")
- (e.g., "CI/CD pipeline config -- that belongs in the infra/ group")

## Read When

<!-- When should an agent load this group? Be action-oriented. -->

Read this entrypoint when:

- (describe the task that triggers reading this group)
- (describe another task)
- (describe another task)

## Quick Routing

<!-- Route to deeper docs within this group. This is the key value of the entrypoint. -->
<!-- Format: what the agent needs -> which file to read -->

- use `process/context/{{group}}/file-one.md` for (description of what it covers)
- use `process/context/{{group}}/file-two.md` for (description of what it covers)

## Source Paths

<!-- List all deeper docs in this group. Keep this list in sync with actual files. -->

- `process/context/{{group}}/...`

## Update Triggers

<!-- When should this group's content be refreshed? -->

Update this group when:

- (describe what changes would make this content stale)
- (describe another trigger)
- (describe another trigger)

## Canonical Notes

<!-- Any group-specific operational notes that don't fit elsewhere. -->
