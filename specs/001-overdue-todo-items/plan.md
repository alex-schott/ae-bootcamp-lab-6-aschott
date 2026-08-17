# Implementation Plan: Support for Overdue Todo Items

**Branch**: `001-overdue-todo-items` | **Date**: 2026-08-17 | **Spec**: [spec.md](/workspaces/ae-bootcamp-lab-6-aschott/specs/001-overdue-todo-items/spec.md)

**Input**: Feature specification from `/specs/001-overdue-todo-items/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command; its definition describes the execution workflow.

## Summary

Users need to visually spot todos whose due date has passed without manually comparing dates.
The primary requirement is a client-side, derived "overdue" indicator on each todo card:
overdue = due date earlier than today AND not completed. Per the clarification session, the
indicator MUST include a non-color cue (text label/icon) in addition to any color styling, for
accessibility. This is purely a frontend presentation feature — the backend already returns
`dueDate` and `completed` for every todo, so no API, schema, or persistence changes are needed.
The technical approach is: (1) add a small, pure, dependency-injected `isOverdue(todo, today)`
utility so date logic is unit-testable without mocking global time, and (2) render a non-color
"Overdue" badge/label on `TodoCard` whenever `isOverdue` returns true, re-evaluated on every
render (i.e., automatically on toggle, edit, and list reload).

## Technical Context

**Language/Version**: JavaScript (ES2020+), React 18.2, Node.js v16+ (per `docs/project-overview.md`)

**Primary Dependencies**: React 18 / react-dom, `@testing-library/react` + `@testing-library/jest-dom` for component tests, Jest (via `react-scripts test --coverage`) as the test runner — all already present in `packages/frontend`. No new dependencies required.

**Storage**: N/A for this feature — reads the existing `dueDate` and `completed` fields already returned by `GET /api/todos`; no schema or persistence changes.

**Testing**: Jest + React Testing Library, colocated in `__tests__/` directories per `docs/testing-guidelines.md`; unit tests for the new date-utility function and component tests for `TodoCard`'s overdue rendering, following the existing `TodoCard.test.js` patterns.

**Target Platform**: Web browser (desktop-focused per `docs/functional-requirements.md`); no mobile-specific work.

**Project Type**: Web application (npm-workspaces monorepo: `packages/frontend` + `packages/backend`). This feature only touches `packages/frontend`.

**Performance Goals**: Overdue re-evaluation must be effectively free (a plain date comparison per todo on render) — no measurable impact on the existing render performance of a single-user-scale todo list.

**Constraints**: No new backend endpoints or schema changes; must not reduce the project's 80%+ coverage target; overdue indicator MUST include a non-color cue and meet WCAG AA contrast, per the constitution and the clarification recorded in spec.md.

**Scale/Scope**: Single user, small todo list (tens of items) — no scale or concurrency concerns.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Check | Result |
|---|---|---|
| I. Code Quality & Consistency | New `isOverdue` utility is a small, pure, single-responsibility function following existing naming/import conventions; no speculative abstraction added. | PASS |
| II. Test-First Development & Coverage | Plan requires unit tests for `isOverdue` (all boundary cases) and component tests for `TodoCard`'s overdue badge before/alongside implementation, per existing Jest patterns. | PASS |
| III. User Experience Consistency | Overdue indicator reuses existing `--danger-color` design token and spacing scale from `theme.css`; includes a non-color text/icon cue per the clarification, satisfying WCAG AA and ARIA-label requirements. | PASS |
| IV. Simplicity & Scope Discipline | No filtering, sorting, reminders, or severity tiers added — a single boolean-derived indicator only, matching spec Assumptions. | PASS |
| V. Monorepo Workflow & Collaboration | Change is isolated to `packages/frontend`; root `npm test` still validates both packages; no backend touch needed. | PASS |

No violations. Complexity Tracking table is not needed.

## Project Structure

### Documentation (this feature)

```text
specs/001-overdue-todo-items/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
│   └── is-overdue-contract.md
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
packages/frontend/
├── src/
│   ├── components/
│   │   ├── TodoCard.js              # MODIFIED: render overdue badge/label
│   │   └── __tests__/
│   │       └── TodoCard.test.js     # MODIFIED: overdue rendering test cases
│   ├── utils/                       # NEW directory
│   │   ├── todoStatus.js            # NEW: isOverdue(todo, today) pure function
│   │   └── __tests__/
│   │       └── todoStatus.test.js   # NEW: boundary-case unit tests
│   └── styles/
│       └── theme.css                # POSSIBLY MODIFIED: overdue badge styling (reuse existing tokens)

packages/backend/                    # UNCHANGED — dueDate/completed already exposed by existing API
```

**Structure Decision**: This is a web application (frontend + backend monorepo) using the
existing `packages/frontend` and `packages/backend` npm workspaces (per
`docs/project-overview.md`), not the generic template's top-level `backend/`/`frontend/`
layout. This feature is frontend-only: a new `src/utils/todoStatus.js` pure function plus a
small, non-color-cue rendering change in the existing `src/components/TodoCard.js`. No backend
directories change.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations — table intentionally omitted.
