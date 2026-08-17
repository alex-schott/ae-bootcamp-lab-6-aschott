# Phase 0 Research: Support for Overdue Todo Items

All Technical Context fields were resolvable from the existing codebase and project
documentation — there are no unresolved `NEEDS CLARIFICATION` items. This document instead
records the implementation-pattern decisions made to keep the feature consistent, simple, and
reliably testable.

## Decision 1: How to determine "overdue" in a testable way

- **Decision**: Implement a small, pure function `isOverdue(todo, today = new Date())` in a new
  `packages/frontend/src/utils/todoStatus.js` module. It takes the current date as an injectable
  parameter (defaulting to `new Date()` at call time) rather than reading the system clock
  internally.
- **Rationale**: Dependency-injecting "now" (per the Dependency Inversion guidance in
  `docs/coding-guidelines.md`) lets unit tests pass fixed reference dates for boundary cases
  (yesterday, today, tomorrow) without mocking global `Date`/timers, keeping tests fast,
  deterministic, and easy to read — directly satisfying the constitution's Test-First principle.
- **Alternatives considered**:
  - Mocking `Date` globally with `jest.useFakeTimers()`/`jest.setSystemTime()` in every test —
    rejected as more boilerplate-heavy and harder to read than passing an explicit parameter.
  - Inlining the date comparison directly inside `TodoCard.js` — rejected because it would not
    be independently unit-testable and would duplicate logic if another component ever needed
    the same determination (violates DRY).

## Decision 2: Where the comparison boundary sits (due today vs. overdue)

- **Decision**: A todo is overdue only when its due date's calendar day is strictly before
  today's calendar day (i.e., comparing at day granularity, ignoring time-of-day), and the todo
  is not completed. A todo due "today" is not overdue.
- **Rationale**: Matches the spec's Assumptions section and is the standard convention for
  date-only (no time-of-day) due dates in todo apps; avoids surprising users who still have the
  rest of the day to finish a task.
- **Alternatives considered**: Treating "overdue" as due date < current timestamp (i.e., overdue
  as soon as midnight starts the due day) — rejected as inconsistent with the due date being a
  calendar date without a time component, and inconsistent with the clarified spec Assumptions.

## Decision 3: Visual/accessible presentation of the indicator

- **Decision**: Render a small badge/label inside `TodoCard.js` containing visible text (e.g.,
  "⚠ Overdue") styled with the existing `--danger-color` design token from
  `packages/frontend/src/styles/theme.css`, shown only when `isOverdue(...)` is true. The badge
  text itself is the non-color cue (not solely relying on background/text color), satisfying the
  clarification and the constitution's WCAG AA / ARIA-label requirements.
- **Rationale**: Reuses established design tokens (light/dark mode aware) instead of introducing
  new colors, keeping the change minimal and consistent with `docs/ui-guidelines.md`. Visible
  text (rather than an icon-only cue) is inherently accessible to screen readers without needing
  extra `aria-label` plumbing, and keeps implementation simple (YAGNI/KISS).
- **Alternatives considered**:
  - Icon-only cue (e.g., a warning glyph with no text) — rejected because icon-only cues still
    require a descriptive `aria-label` to be screen-reader accessible and are more ambiguous to
    sighted users than a text label.
  - New dedicated "overdue" color token — rejected as unnecessary; the existing danger color
    already carries "attention/negative" semantics in the design system and reusing it avoids
    scope creep into the design system itself.

## Decision 4: Where re-evaluation happens (no polling/timers)

- **Decision**: `isOverdue` is a pure function called during each render of `TodoCard` (and any
  parent list render). No `setInterval`/timer is introduced to "watch" for the moment a todo
  becomes overdue while the app is idle in the background.
- **Rationale**: React already re-renders `TodoCard` whenever its `todo` prop changes (toggle,
  edit) or the list is reloaded, which covers all functional requirements (FR-006, FR-007,
  FR-008). Adding a background timer would introduce complexity, extra test surface, and battery
  usage for a single-user app with no such requirement in the spec — violating the Simplicity &
  Scope Discipline principle (YAGNI).
- **Alternatives considered**: A `setInterval` that re-checks overdue status every minute so the
  badge appears in a still-open tab exactly at midnight without any user interaction — rejected
  as out of scope; the spec's edge case only requires correctness "the next time overdue status
  is evaluated (e.g., on next view/refresh)", not real-time midnight ticking.

## Output

All decisions above resolve the technical approach with no outstanding unknowns. Proceeding to
Phase 1 design (data-model.md, contracts/, quickstart.md).
