<!--
Sync Impact Report
- Version change: (unratified template) → 1.0.0
- Rationale: Initial ratification of the project constitution, deriving five core
  principles and two supporting sections directly from the existing project
  documentation in docs/ (project-overview.md, coding-guidelines.md,
  functional-requirements.md, ui-guidelines.md, testing-guidelines.md).
- Modified principles: N/A (first adoption; no prior ratified principles existed)
- Added sections:
  - Core Principles: I. Code Quality & Consistency
  - Core Principles: II. Test-First Development & Coverage Discipline (NON-NEGOTIABLE)
  - Core Principles: III. User Experience Consistency
  - Core Principles: IV. Simplicity & Scope Discipline
  - Core Principles: V. Monorepo Workflow & Collaboration
  - Technology Stack & Architecture Constraints
  - Development Workflow & Quality Gates
  - Governance
- Removed sections: None
- Templates requiring updates:
  - .specify/templates/plan-template.md — ✅ no changes required (Constitution Check
    section already reads gates generically from this file)
  - .specify/templates/spec-template.md — ✅ no changes required
  - .specify/templates/tasks-template.md — ✅ no changes required
  - .specify/templates/checklist-template.md — ✅ no changes required
- Follow-up TODOs:
  - TODO(RATIFICATION_DATE): Original ratification date predates this document;
    the project maintainers should confirm whether 2026-08-17 (date of this
    formalization) is acceptable as the ratification date or supply the true
    original adoption date.
-->

# ae-bootcamp-lab-6-aschott Constitution

## Core Principles

### I. Code Quality & Consistency
All code MUST follow the conventions defined in `docs/coding-guidelines.md`:
`camelCase` for variables/functions, `UPPER_SNAKE_CASE` for constants,
`PascalCase` for React components and classes, 2-space indentation, and LF
line endings. Imports MUST be grouped (external libraries, internal modules,
styles) and separated by blank lines. Code MUST adhere to DRY, KISS, and
SOLID principles: extract repeated logic into shared utilities, prefer simple
straightforward implementations over premature optimization, and keep every
module, component, or function focused on a single responsibility. All
error-prone operations MUST include explicit error handling with meaningful
messages and user-facing feedback. Comments MUST explain *why*, not *what*;
obvious or outdated comments MUST be removed. ESLint MUST run clean (no
unresolved errors) before a change is considered complete.
**Rationale**: Consistent style and disciplined structure keep a small
full-stack codebase maintainable as multiple contributors (including AI
agents) touch it, and prevent quality regressions from accumulating silently.

### II. Test-First Development & Coverage Discipline (NON-NEGOTIABLE)
Tests MUST be written to describe expected behavior before or alongside
implementation, per `docs/testing-guidelines.md`. Every new feature or bug fix
MUST include unit tests, and cross-component or API-integration behavior MUST
include integration tests; end-to-end tests remain out of scope until
explicitly introduced. Tests MUST be independent, isolated (no shared state,
external dependencies mocked), and MUST test observable behavior rather than
implementation details. The project MUST maintain 80%+ code coverage across
packages, with critical user workflows (create, view, update, delete todo)
covered at 100%. All tests MUST pass locally before a pull request is opened.
**Rationale**: A todo application's value is in its reliability; automated,
isolated tests are the cheapest way to guarantee persisted changes and UI
state remain correct as the codebase evolves.

### III. User Experience Consistency
All user-facing UI changes MUST conform to `docs/ui-guidelines.md`: the
defined color palette (light/dark mode), typography scale, and 8px spacing
grid; the single-column layout with a 600px max width on larger screens; and
the documented component specs for todo cards, inputs, buttons, and the
delete-confirmation dialog. Interactive elements MUST be keyboard accessible,
meet WCAG AA color contrast, and expose descriptive ARIA labels. The
dark/light mode toggle MUST persist user preference in `localStorage` and
default to system preference. Playful Halloween-themed elements (icons,
accent colors) MUST be preserved and MUST NOT be replaced with unrelated
theming without an explicit, documented decision.
**Rationale**: A consistent, accessible design system prevents visual drift
across contributions and keeps the app usable for all users regardless of who
implements a given screen or component.

### IV. Simplicity & Scope Discipline
Features MUST stay within the boundaries defined in
`docs/functional-requirements.md`. The application is single-user with no
authentication, multi-user support, priority/category systems, recurring
todos, reminders, undo/redo, bulk operations, advanced search/filtering, or
mobile-specific optimization. Any request to add capabilities outside this
scope MUST be explicitly called out and confirmed before implementation
rather than silently built. Within in-scope features, implementations MUST
favor the simplest solution that satisfies the documented requirement
(YAGNI); speculative abstractions or configuration for hypothetical future
needs are not permitted.
**Rationale**: A bootcamp-scoped todo app benefits from a firm, explicit
boundary so contributors do not over-engineer or silently expand scope,
keeping the codebase approachable for learning purposes.

### V. Monorepo Workflow & Collaboration
The project MUST remain organized as an npm-workspaces monorepo with
`packages/frontend` (React) and `packages/backend` (Express.js), per
`docs/project-overview.md`. Cross-package changes MUST be validated via the
root-level `npm test` and `npm run start` scripts before relying on
package-local scripts alone. Git work MUST follow atomic commits with
descriptive messages explaining the *why*, feature branches for new work, and
pull requests for review before merging, per the Git Practices in
`docs/coding-guidelines.md`. The code review checklist in
`docs/coding-guidelines.md` MUST be satisfied before a pull request is
considered ready to merge.
**Rationale**: A shared monorepo and consistent git workflow keep frontend
and backend changes coordinated and reviewable, avoiding integration
surprises between the two packages.

## Technology Stack & Architecture Constraints

The technology stack is fixed as documented in `docs/project-overview.md` and
MUST NOT be changed without an explicit, justified decision: React and React
DOM for the frontend, Express.js on Node.js for the backend, Jest for testing
in both packages, and `@testing-library/react` for frontend integration
tests. Node.js v16+ and npm v7+ are the minimum supported toolchain versions.
Persistence MUST go through the existing backend Express.js API; no
alternative storage mechanism or direct frontend-to-database access is
permitted. No database schema changes are permitted beyond basic todo storage
(title, due date, completion status, creation timestamp) without updating
`docs/functional-requirements.md` first.

## Development Workflow & Quality Gates

Before opening a pull request, contributors MUST: (1) run `npm test` from the
repository root and confirm all tests pass, (2) run linting
(`npm run lint` / `npm run lint:fix` where configured) and resolve all
errors, (3) verify new/changed behavior meets the 80%+ coverage target via
Jest coverage reports, and (4) walk through the Code Review Checklist in
`docs/coding-guidelines.md` (naming, import order, DRY, single responsibility,
error handling, comments, tests, atomic commits, no leftover
`console.log`/debug statements). UI changes additionally MUST be checked
against `docs/ui-guidelines.md` for color, spacing, typography, and
accessibility compliance. Reviewers MUST verify these gates were followed
before approving a merge.

## Governance

This constitution supersedes all other informal practices and prior
undocumented conventions for this project. Amendments MUST be proposed via
pull request, MUST update this file's version per semantic versioning
(MAJOR for incompatible governance/principle removals or redefinitions, MINOR
for new principles or materially expanded guidance, PATCH for clarifications
and non-semantic wording fixes), and MUST update the Sync Impact Report at
the top of this file. Any change that conflicts with an existing principle
MUST either update the principle explicitly or be rejected. Complexity or
scope additions that violate Principle IV (Simplicity & Scope Discipline)
MUST be justified in writing in the relevant plan or pull request description
before proceeding. All pull requests and code reviews MUST verify compliance
with this constitution; use `docs/coding-guidelines.md`,
`docs/testing-guidelines.md`, and `docs/ui-guidelines.md` for detailed runtime
guidance that implements these principles.

**Version**: 1.0.0 | **Ratified**: 2026-08-17 | **Last Amended**: 2026-08-17
