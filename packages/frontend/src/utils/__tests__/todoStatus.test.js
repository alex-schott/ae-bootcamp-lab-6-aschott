/**
 * Tests for isOverdue()
 * Verifies the overdue-determination logic against the behavioral guarantees
 * documented in specs/001-overdue-todo-items/contracts/is-overdue-contract.md
 */

import { isOverdue } from '../todoStatus';

describe('isOverdue', () => {
  // Fixed reference date so tests are deterministic regardless of when they run.
  const today = new Date('2026-06-15T10:00:00');

  it('returns false when dueDate is null', () => {
    expect(isOverdue({ dueDate: null, completed: 0 }, today)).toBe(false);
  });

  it('returns false when dueDate is an empty string', () => {
    expect(isOverdue({ dueDate: '', completed: 0 }, today)).toBe(false);
  });

  it('returns false when dueDate is today', () => {
    expect(isOverdue({ dueDate: '2026-06-15', completed: 0 }, today)).toBe(false);
  });

  it('returns true when dueDate is in the past and todo is incomplete', () => {
    expect(isOverdue({ dueDate: '2026-06-10', completed: 0 }, today)).toBe(true);
  });

  it('returns false when dueDate is in the past but todo is completed (completed: 1)', () => {
    expect(isOverdue({ dueDate: '2026-06-10', completed: 1 }, today)).toBe(false);
  });

  it('returns false when dueDate is in the past but todo is completed (completed: true)', () => {
    expect(isOverdue({ dueDate: '2026-06-10', completed: true }, today)).toBe(false);
  });

  it('returns false when dueDate is in the future, regardless of completion', () => {
    expect(isOverdue({ dueDate: '2026-06-20', completed: 0 }, today)).toBe(false);
    expect(isOverdue({ dueDate: '2026-06-20', completed: 1 }, today)).toBe(false);
  });

  it('does not throw and returns false for a malformed dueDate', () => {
    expect(() => isOverdue({ dueDate: 'not-a-date', completed: 0 }, today)).not.toThrow();
    expect(isOverdue({ dueDate: 'not-a-date', completed: 0 }, today)).toBe(false);
  });

  it('is pure: identical inputs produce identical output', () => {
    const todo = { dueDate: '2026-06-01', completed: 0 };
    expect(isOverdue(todo, today)).toBe(isOverdue(todo, today));
  });

  it('defaults "today" to the current date when not provided', () => {
    const pastDueTodo = { dueDate: '2000-01-01', completed: 0 };
    expect(isOverdue(pastDueTodo)).toBe(true);
  });
});
