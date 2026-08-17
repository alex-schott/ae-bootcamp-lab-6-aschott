# Tasks: Support for Overdue Todo Items

**Input**: Design documents from `/specs/001-overdue-todo-items/`

**Prerequisites**: [plan.md](/workspaces/ae-bootcamp-lab-6-aschott/specs/001-overdue-todo-items/plan.md) (required), [spec.md](/workspaces/ae-bootcamp-lab-6-aschott/specs/001-overdue-todo-items/spec.md) (required for user stories), [research.md](/workspaces/ae-bootcamp-lab-6-aschott/specs/001-overdue-todo-items/research.md), [data-model.md](/workspaces/ae-bootcamp-lab-6-aschott/specs/001-overdue-todo-items/data-model.md), [contracts/is-overdue-contract.md](/workspaces/ae-bootcamp-lab-6-aschott/specs/001-overdue-todo-items/contracts/is-overdue-contract.md)

**Tests**: Included. The feature spec explicitly requires automated tests covering the overdue
determination logic and its display, and the project constitution mandates Test-First
Development, so test tasks are mandatory (not optional) for this feature.

**Organization**: Tasks are grouped by user story to enable independent implementation and
testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

## Path Conventions

This is the existing npm-workspaces monorepo. This feature only touches the frontend package:
`packages/frontend/src/`. No backend paths are involved (see plan.md Structure Decision).

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Establish the new module location for the shared date-utility logic.

- [X] T001 Create the `packages/frontend/src/utils/` directory with a colocated
  `packages/frontend/src/utils/__tests__/` subdirectory, matching the existing test-colocation
  convention used by `packages/frontend/src/components/__tests__/` and
  `packages/frontend/src/services/__tests__/`.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: The shared `isOverdue` determination logic that both User Story 1 and User Story 2
depend on. No user story work can begin until this is implemented and passing.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T002 Write unit tests for `isOverdue(todo, today)` in
  `packages/frontend/src/utils/__tests__/todoStatus.test.js`, covering all 6 behavioral
  guarantees from
  [contracts/is-overdue-contract.md](/workspaces/ae-bootcamp-lab-6-aschott/specs/001-overdue-todo-items/contracts/is-overdue-contract.md):
  null `dueDate` → false; due date is today → false; past due date + incomplete → true; past due
  date + complete → false; future due date → false (regardless of completed); and purity (same
  inputs → same output, no throw on a malformed `dueDate` string). Use fixed injected `today`
  values (not real system time) for determinism. Confirm the tests fail (module doesn't exist
  yet).
- [X] T003 Implement `isOverdue(todo, today = new Date())` in
  `packages/frontend/src/utils/todoStatus.js` per
  [contracts/is-overdue-contract.md](/workspaces/ae-bootcamp-lab-6-aschott/specs/001-overdue-todo-items/contracts/is-overdue-contract.md)
  and
  [data-model.md](/workspaces/ae-bootcamp-lab-6-aschott/specs/001-overdue-todo-items/data-model.md)
  (day-granularity comparison, `dueDate`/`completed` reads only, never throws), making the T002
  tests pass. (depends on T001, T002)

**Checkpoint**: `isOverdue` is implemented, unit-tested, and passing — user story work can begin.

---

## Phase 3: User Story 1 - Visually Identify Overdue Todos (Priority: P1) 🎯 MVP

**Goal**: Incomplete todos whose due date has passed are visibly, accessibly marked as overdue
in the todo list, using a non-color cue.

**Independent Test**: Create todos with due dates in the past, today, and the future (some
complete, some incomplete) and verify only incomplete, past-due todos show the "Overdue" badge.

### Tests for User Story 1 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T004 [P] [US1] Add component tests in
  `packages/frontend/src/components/__tests__/TodoCard.test.js` covering Acceptance Scenarios
  1–5 from spec.md User Story 1: (1) past due date + incomplete → "Overdue" text is rendered;
  (2) due date is today → no "Overdue" text; (3) future due date → no "Overdue" text; (4) past
  due date + completed → no "Overdue" text; (5) no due date set → no "Overdue" text. Assert via
  visible text (e.g. `screen.queryByText(/overdue/i)`), per the UI Rendering Contract. Confirm
  the tests fail (badge not yet implemented).

### Implementation for User Story 1

- [X] T005 [US1] In `packages/frontend/src/components/TodoCard.js`, import `isOverdue` from
  `../utils/todoStatus` and compute an `isOverdue(todo)` boolean in the non-editing render
  branch. (depends on T003, T004)
- [X] T006 [US1] In `packages/frontend/src/components/TodoCard.js`, conditionally render a
  visible, non-color "⚠ Overdue" text badge inside `.todo-content` (next to the title/due date)
  when the boolean from T005 is `true`; render nothing when `false`. (depends on T005)
- [X] T007 [US1] Add `.todo-overdue-badge` styling rules in
  `packages/frontend/src/App.css`, reusing the existing `--danger-color` and `--space-xs`
  design tokens from `packages/frontend/src/styles/theme.css`, and confirm WCAG AA contrast in
  both light and dark themes per `docs/ui-guidelines.md`. (depends on T006)

**Checkpoint**: Run `npm test --workspace=frontend -- TodoCard` and confirm all T004 tests pass.
User Story 1 is fully functional and independently testable/demoable (MVP).

---

## Phase 4: User Story 2 - Overdue Status Stays Accurate After Changes (Priority: P2)

**Goal**: The overdue indicator updates immediately (no reload) when the user completes a todo
or edits its due date, and reappears correctly if the todo is later re-opened.

**Independent Test**: Take an existing overdue todo and (a) mark it complete, and (b) edit its
due date to today/a future date; verify the "Overdue" badge disappears immediately in both
cases. Then re-open a completed, past-due todo and verify the badge reappears.

### Tests for User Story 2 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T008 [US2] Add an integration test in `packages/frontend/src/__tests__/App.test.js`: seed
  an overdue todo via the mocked `GET /api/todos` response, mark it complete via its checkbox,
  and assert the "Overdue" badge is removed immediately with no reload — Acceptance Scenario 1.
- [X] T009 [US2] Add an integration test in `packages/frontend/src/__tests__/App.test.js`: for
  an overdue todo, use the edit form to change its due date to a future date, save, and assert
  the "Overdue" badge is removed immediately upon save — Acceptance Scenario 2. (same file as
  T008; sequential to avoid conflicting edits)
- [X] T010 [P] [US2] Add a component test in
  `packages/frontend/src/components/__tests__/TodoCard.test.js`: render `TodoCard` with a
  completed, past-due todo (no badge expected), then re-render with the same todo marked
  incomplete, and assert the "Overdue" badge now appears — Acceptance Scenario 3 / edge case.

### Implementation for User Story 2

- [X] T011 [US2] Run T008–T010 against the existing re-render behavior from User Story 1 (React
  re-renders `TodoCard` whenever its `todo` prop changes after toggle/edit). If any test reveals
  stale state (e.g., the badge not updating after a parent state change in
  `packages/frontend/src/App.js` or memoization in
  `packages/frontend/src/components/TodoCard.js`), fix the state/props flow so the `todo` prop
  update always triggers re-evaluation of `isOverdue`. (depends on T005, T006, T008, T009, T010)

**Checkpoint**: Run `npm run test:frontend` and confirm all tests (User Story 1 + User Story 2)
pass together. Both stories now work independently and in combination.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Final validation across both user stories.

- [X] T012 Run `npm test --workspace=frontend -- --coverage` and confirm
  `packages/frontend/src/utils/todoStatus.js` reaches 100% coverage and every new overdue-related
  branch added to `packages/frontend/src/components/TodoCard.js` (part of the "view todos"
  critical workflow) is also covered at 100%, per the constitution's Principle II requirement
  that critical user workflows (create, view, update, delete todo) be covered at 100% — not just
  the project's general 80%+ target (`docs/testing-guidelines.md`); add any missing test cases
  for uncovered branches.
- [X] T013 Run lint (`npm run lint` if configured, or the CRA/ESLint output surfaced by
  `npm test --workspace=frontend`) on all files changed in this feature and fix any
  errors/warnings per `docs/coding-guidelines.md`.
- [X] T014 Manually execute the validation steps in
  [quickstart.md](/workspaces/ae-bootcamp-lab-6-aschott/specs/001-overdue-todo-items/quickstart.md)
  (past/today/future/no-due-date todos, toggle, edit, dark/light mode) to confirm end-to-end
  behavior matches spec.md Success Criteria SC-001 through SC-004.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion (T001) — BLOCKS both user stories.
- **User Story 1 (Phase 3)**: Depends on Foundational (Phase 2) completion.
- **User Story 2 (Phase 4)**: Depends on Foundational (Phase 2) completion, AND functionally
  depends on User Story 1's badge existing (T005–T007) since it tests the badge
  appearing/disappearing — implement sequentially after Phase 3 rather than in parallel.
- **Polish (Phase 5)**: Depends on both user stories being complete.

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2). No dependency on other stories.
- **User Story 2 (P2)**: Can start after Foundational (Phase 2), but its tests exercise the
  badge introduced by User Story 1, so it should be implemented after Phase 3 in practice even
  though it introduces no new domain logic of its own.

### Within Each User Story

- Tests MUST be written and FAIL before implementation (T004 before T005–T007; T008–T010 before
  T011).
- Utility logic (Foundational) before component wiring (US1) before integration/re-render
  verification (US2).
- Story complete before moving to the next priority.

### Parallel Opportunities

- T004 (US1 tests) can be written in parallel with nothing else in Phase 3 (it is the only test
  task), but does not block starting once Foundational is done.
- T010 (US2, `TodoCard.test.js`) can run in parallel with T008/T009 (US2, `App.test.js`) since
  they touch different files.
- T008 and T009 both edit `App.test.js` and should be done sequentially to avoid merge
  conflicts, even though they are logically independent.
- T012 and T013 (Polish) touch overlapping file sets (tests/lint fixes) and are best run
  sequentially, though they could be parallelized by different contributors if scoped to
  disjoint files.

---

## Parallel Example: User Story 2

```bash
# T010 can be launched in parallel with T008/T009 since it targets a different file:
Task: "Component test for re-opening a completed overdue todo in packages/frontend/src/components/__tests__/TodoCard.test.js"

# T008 and T009 both target App.test.js and should run sequentially:
Task: "Integration test: completing an overdue todo removes the badge in packages/frontend/src/__tests__/App.test.js"
Task: "Integration test: editing an overdue todo's due date removes the badge in packages/frontend/src/__tests__/App.test.js"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001)
2. Complete Phase 2: Foundational (T002–T003) — CRITICAL, blocks both stories
3. Complete Phase 3: User Story 1 (T004–T007)
4. **STOP and VALIDATE**: Run `npm test --workspace=frontend -- TodoCard` and manually verify
   the "Overdue" badge appears/disappears correctly per quickstart.md steps 1–4 and 8
5. Deploy/demo if ready — this alone delivers the requested visual identification of overdue
   todos

### Incremental Delivery

1. Complete Setup + Foundational → shared `isOverdue` logic ready and tested
2. Add User Story 1 (T004–T007) → test independently → deploy/demo (MVP!)
3. Add User Story 2 (T008–T011) → test independently and together with US1 → deploy/demo
4. Complete Polish (T012–T014) → final coverage/lint/manual validation pass
5. Each story adds value without breaking the previous story
