# Data Model: Support for Overdue Todo Items

## Entities

### Todo Item (existing — unchanged persisted shape)

Source of truth: `packages/backend` SQLite `todos` table / `GET /api/todos` response, already
consumed by the frontend. No fields are added, removed, or changed on this entity.

| Field | Type | Notes |
|---|---|---|
| `id` | integer | Existing primary key. |
| `title` | string | Existing, max 255 chars. |
| `dueDate` | string (ISO date) \| `null` | Existing, optional calendar date. |
| `completed` | 0 \| 1 | Existing boolean-as-integer completion flag. |
| `createdAt` | string (ISO timestamp) | Existing, used for list ordering. |

### Overdue Status (new — derived, not persisted)

Not a stored entity or database field. A boolean computed at render/read time from the existing
`Todo Item` fields above, using the rule:

```
isOverdue = (dueDate is not null)
        AND (calendar day of dueDate < calendar day of today)
        AND (completed is falsy)
```

- **Computed by**: `isOverdue(todo, today = new Date())` in
  `packages/frontend/src/utils/todoStatus.js` (see
  [contracts/is-overdue-contract.md](/workspaces/ae-bootcamp-lab-6-aschott/specs/001-overdue-todo-items/contracts/is-overdue-contract.md)).
- **Lifecycle**: Recomputed on every render; never written back to state, storage, or the API.
  It has no independent lifecycle beyond the `Todo Item`'s own `dueDate` and `completed` values.
- **Relationships**: 1:1 derived attribute of a single `Todo Item`; no relationships to other
  entities.

## Validation Rules

- No new validation rules on `Todo Item` creation/update — `dueDate` and `title` validation are
  unchanged (out of scope for this feature).
- `isOverdue` MUST treat a missing/`null`/empty-string `dueDate` as "never overdue" (FR-002).
- `isOverdue` MUST treat `completed` truthy (`1` or `true`) as "never overdue" regardless of
  `dueDate` (FR-004).
- `isOverdue` MUST compare at calendar-day granularity in the viewer's local time zone, not
  timestamp granularity (see research.md Decision 2).

## State Transitions

The derived `isOverdue` value can change only as a side effect of existing `Todo Item`
transitions — no new transitions are introduced:

| Trigger (existing) | Effect on derived overdue status |
|---|---|
| User toggles `completed` from incomplete → complete | `isOverdue` becomes `false` (FR-004, FR-006) |
| User toggles `completed` from complete → incomplete | `isOverdue` re-evaluated against current `dueDate` (may become `true` again) |
| User edits `dueDate` to today or a future date | `isOverdue` becomes `false` (FR-007) |
| User edits `dueDate` to a past date while incomplete | `isOverdue` becomes `true` |
| Calendar day advances past an incomplete todo's `dueDate` (app reloaded/revisited) | `isOverdue` becomes `true` (FR-008) |
