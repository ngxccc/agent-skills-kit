# Good First Issues

Curated starter issues for new contributors. Each issue is scoped, documented, and has a mentor available.

Pick one that interests you, comment on the GitHub issue to claim it, and submit a PR when ready.

## Issue Board

| # | Title | Labels | Description | Difficulty | Time Estimate | Mentor |
|---|-------|--------|-------------|------------|---------------|--------|
| 1 | Git bisect helper skill | `good first issue`, `skill` | Create a skill that wraps `git bisect` with guided prompts for finding the commit that introduced a bug | Easy | ~2-3h | @withkynam |
| 2 | Changelog generator skill | `good first issue`, `skill` | Create a skill that generates a changelog from conventional commits between two tags or refs | Easy | ~2-3h | @withkynam |
| 3 | Dependency updater skill | `good first issue`, `skill` | Create a skill that checks for outdated dependencies and proposes safe updates with a summary of breaking changes | Easy | ~2-3h | @withkynam |
| 4 | Env validator skill | `good first issue`, `skill` | Create a skill that validates `.env` files against a schema or `.env.example`, reporting missing or extra variables | Easy | ~2-3h | @withkynam |
| 5 | Accessibility auditor agent | `good first issue`, `agent` | Create an agent that audits frontend code for WCAG violations using axe-core rules and suggests fixes | Medium | ~4-6h | @withkynam |
| 6 | Performance profiler agent | `good first issue`, `agent` | Create an agent that profiles build times, bundle sizes, and runtime performance, then suggests optimizations | Medium | ~4-6h | @withkynam |
| 7 | Translate README to Spanish | `good first issue`, `translation` | Translate README.md to Spanish and save as `docs/README.es.md` with all links and badges intact | Easy | ~1-2h | @withkynam |
| 8 | Translate README to French | `good first issue`, `translation` | Translate README.md to French and save as `docs/README.fr.md` with all links and badges intact | Easy | ~1-2h | @withkynam |
| 9 | Translate README to German | `good first issue`, `translation` | Translate README.md to German and save as `docs/README.de.md` with all links and badges intact | Easy | ~1-2h | @withkynam |
| 10 | Mermaid diagram for RIPER-5 flow | `good first issue`, `docs` | Create a Mermaid flowchart showing the RIPER-5 phase progression (Research, Innovate, Plan, Execute, Update Process) with decision points | Easy | ~1-2h | @withkynam |
| 11 | "Getting Started" tutorial | `good first issue`, `docs` | Write a step-by-step tutorial walking through installing the kit, creating a first skill, and running it in a real project | Medium | ~3-4h | @withkynam |
| 12 | Auto-format on save hook | `good first issue`, `hook` | Create a pre-commit hook that auto-formats staged files using the project's Prettier/ESLint config | Easy | ~1-2h | @withkynam |
| 13 | Validate install.sh on Ubuntu 24.04 | `good first issue`, `bug` | Run install.sh on a fresh Ubuntu 24.04 environment and report any failures. Fix identified issues. | Easy | ~1h | @withkynam |
| 14 | Fix README badge link goes to wrong page | `good first issue`, `bug` | Audit all badge links in README.md and fix any that point to incorrect or dead URLs | Easy | ~30min | @withkynam |
| 15 | Add --help flag to install.sh | `good first issue`, `enhancement` | Add a `--help` flag to install.sh that prints usage information, available options, and examples | Easy | ~1-2h | @withkynam |

## How to Use This List

1. **Browse** the table above and find an issue that matches your interest and skill level
2. **Check GitHub Issues** to see if it has already been claimed
3. **Comment** on the issue to let others know you are working on it
4. **Fork** the repo and create a branch named `feat/<issue-number>-<short-description>`
5. **Submit a PR** referencing the issue number

If an issue is not yet created on GitHub, feel free to create it using the title and description above.

## Contributing a Good First Issue

Have an idea for a good starter task? Open a PR adding a row to the table above. Good first issues should be:

- **Scoped** -- completable in a single PR
- **Documented** -- clear description of what "done" looks like
- **Mentored** -- at least one person willing to review and guide
- **Standalone** -- minimal dependencies on other open work
