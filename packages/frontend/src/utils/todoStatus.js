/**
 * Todo Status Utilities
 * Derives presentation-only status flags (e.g. "overdue") from existing todo fields.
 * No new persisted data is introduced — see specs/001-overdue-todo-items/data-model.md.
 */

/**
 * Determines whether a todo is overdue: its due date's calendar day is strictly
 * before today's calendar day, and it is not marked complete.
 *
 * `today` is accepted as a parameter (defaulting to `new Date()`) rather than read
 * from the system clock internally, so callers (and tests) can inject a fixed
 * reference date for deterministic behavior.
 *
 * @param {Object} todo - Must have `dueDate` (string|null) and `completed` (0|1|boolean).
 * @param {Date} [today] - Reference "now"; defaults to the current date/time.
 * @returns {boolean} true if the todo is overdue, false otherwise (never throws).
 */
export function isOverdue(todo, today = new Date()) {
  const { dueDate, completed } = todo;

  if (!dueDate) {
    return false;
  }

  if (completed) {
    return false;
  }

  const parsedDueDate = new Date(dueDate);
  if (Number.isNaN(parsedDueDate.getTime())) {
    // Malformed due date: never crash the render, just treat as not overdue.
    return false;
  }

  const dueDay = startOfDay(parsedDueDate);
  const todayDay = startOfDay(today);

  return dueDay < todayDay;
}

/**
 * Returns a new Date truncated to the start (midnight) of its calendar day,
 * so comparisons are done at day granularity rather than timestamp granularity.
 */
function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}
