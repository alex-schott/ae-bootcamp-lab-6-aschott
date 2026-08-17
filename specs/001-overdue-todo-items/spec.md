# Feature Specification: Support for Overdue Todo Items

**Feature Branch**: `001-overdue-todo-items`

**Created**: 2026-08-17

**Status**: Draft

**Input**: User description: "As a todo application user, I want to easily identify and distinguish overdue tasks in my todo list, so that I can prioritize my work and quickly see which tasks are past their due date. Users need a clear, visual way to identify which todos have not been completed by their due date. This helps users quickly spot overdue items without having to manually check dates against today's date. This feature must include automated tests covering the overdue determination logic and its display, following the existing Jest patterns in the repository."

## Clarifications

### Session 2026-08-17

- Q: Should the overdue indicator rely on color alone, or must it also include a non-color cue (such as text/label or icon) so it's accessible to colorblind users and screen readers? → A: Require a non-color cue (text label like "Overdue" and/or icon) in addition to any color styling — accessible to colorblind users and screen readers

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Visually Identify Overdue Todos (Priority: P1)

As a user viewing my todo list, I want incomplete todos whose due date has passed to be
visually distinguished from other todos, so I can immediately spot what needs my attention
without comparing each due date to today's date myself.

**Why this priority**: This is the core value of the feature. Without a visual indicator,
users must manually check every due date against the current date, which is slow and error
prone. This alone delivers the requested value and is a viable MVP.

**Independent Test**: Can be fully tested by creating todos with due dates in the past,
today, and the future (some complete, some incomplete) and verifying only the incomplete,
past-due todos are visually marked as overdue in the list.

**Acceptance Scenarios**:

1. **Given** a todo with a due date earlier than today that is not marked complete, **When**
   the user views the todo list, **Then** that todo is visibly marked as overdue using a
   non-color cue (e.g. an "Overdue" text label or icon), optionally combined with color, so it
   stands out from non-overdue todos and remains identifiable to colorblind users and screen
   reader users.
2. **Given** a todo with a due date of today, **When** the user views the todo list, **Then**
   that todo is NOT marked as overdue.
3. **Given** a todo with a due date in the future, **When** the user views the todo list,
   **Then** that todo is NOT marked as overdue.
4. **Given** a todo with a due date earlier than today that IS marked complete, **When** the
   user views the todo list, **Then** that todo is NOT marked as overdue.
5. **Given** a todo with no due date set, **When** the user views the todo list, **Then** that
   todo is NOT marked as overdue.

---

### User Story 2 - Overdue Status Stays Accurate After Changes (Priority: P2)

As a user, I want a todo's overdue indicator to update immediately when I complete it or
change its due date, so the list always reflects the true, current status of my tasks.

**Why this priority**: Builds on User Story 1 by ensuring the indicator remains trustworthy
as the user interacts with their list, rather than only being correct at initial page load.

**Independent Test**: Can be fully tested by taking an existing overdue todo and (a) marking
it complete, and (b) editing its due date to today or a future date, then verifying the
overdue indicator is removed immediately in both cases without a page refresh.

**Acceptance Scenarios**:

1. **Given** a todo currently marked as overdue, **When** the user marks it complete, **Then**
   the overdue indicator is removed immediately.
2. **Given** a todo currently marked as overdue, **When** the user edits its due date to today
   or a future date, **Then** the overdue indicator is removed immediately.
3. **Given** a completed todo that is re-opened (marked incomplete) and its due date remains
   in the past, **When** the user views the todo list, **Then** the todo is marked as overdue
   again.

### Edge Cases

- A todo has no due date: it must never be marked overdue.
- A todo's due date is exactly today: it is not yet overdue (the user still has the rest of
  today to complete it).
- A todo was completed before its due date passed and is later re-opened after the due date
  has passed: it becomes overdue again once incomplete.
- The user leaves the todo list open across midnight without refreshing: the next time
  overdue status is evaluated (e.g., on next view/refresh), any todo whose due date is now in
  the past and still incomplete is shown as overdue.
- Multiple todos are overdue by different amounts of time (one day vs. several weeks): all
  overdue todos are indicated the same way; the feature does not need to distinguish degrees
  of lateness.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST determine a todo item to be "overdue" when its due date is earlier
  than the current date AND the item is not marked complete.
- **FR-002**: System MUST NOT mark a todo item as overdue if it has no due date set.
- **FR-003**: System MUST NOT mark a todo item as overdue if its due date is today or in the
  future.
- **FR-004**: System MUST NOT mark a todo item as overdue if it is marked complete, even if
  its due date has passed.
- **FR-005**: System MUST visually distinguish overdue todo items from non-overdue todo items
  in the todo list so users can identify them at a glance without reading each due date. The
  distinction MUST include a non-color cue (e.g., an "Overdue" text label or icon), optionally
  combined with color styling, so the indicator remains perceivable to colorblind users and
  compatible with screen readers.
- **FR-006**: System MUST update a todo item's overdue indicator immediately when the user
  toggles its completion status, without requiring a page reload.
- **FR-007**: System MUST update a todo item's overdue indicator immediately when the user
  edits its due date, without requiring a page reload.
- **FR-008**: System MUST re-evaluate every todo's overdue status each time the todo list is
  displayed, using the current date at that time.

### Key Entities

- **Todo Item**: The existing task entity (title, due date, completion status). This feature
  adds a derived, non-persisted "overdue" state computed from the todo's existing due date and
  completion status; no new stored field is introduced.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can identify every overdue todo in their list at a glance, without
  comparing any due date to today's date themselves.
- **SC-002**: 100% of incomplete todos with a due date earlier than today are visually marked
  as overdue.
- **SC-003**: 0% of completed todos, or todos without a due date, are ever shown as overdue.
- **SC-004**: The overdue indicator reflects a todo's true status within 1 second of the user
  completing the todo or changing its due date, with no page reload required.

## Assumptions

- "Current date" is evaluated using the local date on the device viewing the list; due dates
  are treated as calendar dates without a specific time of day, so a todo becomes overdue only
  after its due date has fully passed (a todo due "today" is not overdue).
- The feature does not distinguish degrees of lateness (e.g., "1 day late" vs. "1 month
  late"); a single overdue indicator applies uniformly, consistent with the existing
  requirement that the app avoid priority levels or advanced categorization.
- Overdue todos are not reordered or filtered to the top of the list; existing ordering
  (creation date, newest first, per `docs/functional-requirements.md`) is preserved.
- No new backend data or schema changes are required; overdue status is derived from the
  existing due date and completion fields rather than persisted separately.
- Automated Jest tests will cover the overdue determination logic and its visual display,
  consistent with `docs/testing-guidelines.md` and the coverage expectations defined in the
  project constitution.
