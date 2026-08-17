# Contract: Overdue Determination & Display

This feature has no new backend API surface (no new endpoints, request/response shapes, or
schema changes — it consumes the existing `GET /api/todos` payload as-is). The "contract" here
is the internal frontend function signature and the UI-facing rendering contract that tests and
future contributors should treat as stable.

## Function Contract: `isOverdue`

**Module**: `packages/frontend/src/utils/todoStatus.js`

```text
isOverdue(todo, today = new Date()) -> boolean
```

**Inputs**:

| Name | Type | Required | Notes |
|---|---|---|---|
| `todo` | `{ dueDate: string \| null, completed: 0 \| 1 \| boolean }` | yes | Only `dueDate` and `completed` are read; extra fields are ignored. |
| `today` | `Date` | no (defaults to `new Date()`) | Injected reference "now" for deterministic testing. |

**Output**: `boolean` — `true` if the todo is overdue, `false` otherwise. Never throws for
well-formed input; malformed/unparseable `dueDate` values MUST be treated as `false` (never
overdue) rather than throwing, to avoid crashing the todo list render.

**Behavioral guarantees (must hold in tests)**:

1. `dueDate: null` → always `false`, regardless of `completed` or `today`.
2. `dueDate` is today's calendar date → `false`.
3. `dueDate` is any past calendar date and `completed` is falsy → `true`.
4. `dueDate` is any past calendar date and `completed` is truthy (`1` or `true`) → `false`.
5. `dueDate` is any future calendar date → `false`, regardless of `completed`.
6. Pure function: calling twice with identical inputs returns identical output (no hidden
   state, no reliance on ambient global `Date` unless `today` is omitted).

## UI Rendering Contract: `TodoCard`

**Module**: `packages/frontend/src/components/TodoCard.js`

- When `isOverdue(todo)` is `true`, `TodoCard` MUST render a visible, non-color text/icon cue
  (e.g., an "⚠ Overdue" badge) inside the card, in addition to any color styling applied.
- When `isOverdue(todo)` is `false`, no overdue badge/cue is rendered.
- The badge's presence MUST be queryable in tests via visible text (e.g.,
  `screen.getByText(/overdue/i)`), not solely via a CSS class, so tests validate the same signal
  a real user (or screen reader) perceives.
- Re-rendering `TodoCard` with a different `todo` prop (e.g., after toggling completion or
  editing the due date) MUST update the badge's presence on the very next render — no caching of
  the previous overdue result across renders.
