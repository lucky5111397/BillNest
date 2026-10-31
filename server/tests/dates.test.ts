import { describe, it, expect } from 'vitest';
import { addBillingInterval, getDaysInMonth, isLeapYear, isBillingDue } from '../src/utils/dates';

describe('Calendar-Aware Billing Interval Calculations', () => {
  it('correctly calculates days in month including leap years', () => {
    expect(getDaysInMonth(2024, 1)).toBe(29); // Feb 2024 (leap year)
    expect(getDaysInMonth(2026, 1)).toBe(28); // Feb 2026 (non-leap year)
    expect(getDaysInMonth(2026, 0)).toBe(31); // Jan
    expect(getDaysInMonth(2026, 3)).toBe(30); // Apr
  });

  it('correctly identifies leap years', () => {
    expect(isLeapYear(2024)).toBe(true);
    expect(isLeapYear(2000)).toBe(true);
    expect(isLeapYear(2026)).toBe(false);
    expect(isLeapYear(2100)).toBe(false);
  });

  it('adds DAILY interval', () => {
    const start = new Date(Date.UTC(2026, 9, 1, 10, 0, 0));
    const next = addBillingInterval(start, 'DAILY', 1);
    expect(next.toISOString()).toBe('2026-10-02T10:00:00.000Z');
  });

  it('adds WEEKLY interval', () => {
    const start = new Date(Date.UTC(2026, 9, 1, 10, 0, 0));
    const next = addBillingInterval(start, 'WEEKLY', 2); // 14 days
    expect(next.toISOString()).toBe('2026-10-15T10:00:00.000Z');
  });

  it('handles monthly boundary clamping without 30-day approximations', () => {
    // Jan 31 + 1 month in non-leap year (2026) must clamp to Feb 28, NOT March 3
    const jan31 = new Date(Date.UTC(2026, 0, 31, 0, 0, 0));
    const febNext = addBillingInterval(jan31, 'MONTHLY', 1);
    expect(febNext.getUTCFullYear()).toBe(2026);
    expect(febNext.getUTCMonth()).toBe(1); // February
    expect(febNext.getUTCDate()).toBe(28);

    // Jan 31 + 1 month in leap year (2024) must clamp to Feb 29
    const jan31_leap = new Date(Date.UTC(2024, 0, 31, 0, 0, 0));
    const febNext_leap = addBillingInterval(jan31_leap, 'MONTHLY', 1);
    expect(febNext_leap.getUTCFullYear()).toBe(2024);
    expect(febNext_leap.getUTCMonth()).toBe(1); // February
    expect(febNext_leap.getUTCDate()).toBe(29);

    // Aug 31 + 1 month must clamp to Sep 30, NOT Oct 1
    const aug31 = new Date(Date.UTC(2026, 7, 31, 0, 0, 0));
    const sepNext = addBillingInterval(aug31, 'MONTHLY', 1);
    expect(sepNext.getUTCFullYear()).toBe(2026);
    expect(sepNext.getUTCMonth()).toBe(8); // September
    expect(sepNext.getUTCDate()).toBe(30);
  });

  it('handles YEARLY intervals across leap boundaries', () => {
    // Feb 29, 2024 + 1 year must clamp to Feb 28, 2025
    const feb29_2024 = new Date(Date.UTC(2024, 1, 29, 12, 0, 0));
    const feb2025 = addBillingInterval(feb29_2024, 'YEARLY', 1);
    expect(feb2025.getUTCFullYear()).toBe(2025);
    expect(feb2025.getUTCMonth()).toBe(1);
    expect(feb2025.getUTCDate()).toBe(28);

    // Normal yearly
    const oct1 = new Date(Date.UTC(2026, 9, 1, 0, 0, 0));
    const oct2027 = addBillingInterval(oct1, 'YEARLY', 1);
    expect(oct2027.toISOString()).toBe('2027-10-01T00:00:00.000Z');
  });

  it('evaluates whether billing is due', () => {
    const past = new Date(Date.now() - 10000);
    const future = new Date(Date.now() + 10000);
    expect(isBillingDue(past)).toBe(true);
    expect(isBillingDue(future)).toBe(false);
  });
});

