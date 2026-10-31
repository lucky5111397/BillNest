/**
 * BillNest Calendar-Aware Billing Date Calculations
 *
 * Implements strict calendar math for recurring subscriptions.
 * NEVER approximates months as 30 days. Accurately handles leap years,
 * 28/29/30/31 month boundaries, and month-end clamping.
 */

export type BillingInterval = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';

/**
 * Returns the exact number of days in the specified month of a year.
 * @param year Full year (e.g. 2026)
 * @param monthZeroBased 0 for January, 1 for February, etc.
 */
export function getDaysInMonth(year: number, monthZeroBased: number): number {
  // Day 0 of month + 1 returns the last day of month
  return new Date(Date.UTC(year, monthZeroBased + 1, 0)).getUTCDate();
}

/**
 * Checks if a year is a leap year.
 */
export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/**
 * Calculates the next billing timestamp given a start date, interval, and count.
 * Preserves the original day-of-month anchoring wherever possible and clamps
 * to the last day of shorter target months.
 */
export function addBillingInterval(startDate: Date, interval: BillingInterval, count = 1): Date {
  const result = new Date(startDate.getTime());

  switch (interval) {
    case 'DAILY':
      result.setUTCDate(result.getUTCDate() + count);
      return result;

    case 'WEEKLY':
      result.setUTCDate(result.getUTCDate() + count * 7);
      return result;

    case 'MONTHLY': {
      const originalDay = result.getUTCDate();
      const currentMonth = result.getUTCMonth();
      const currentYear = result.getUTCFullYear();

      // Compute target year and month
      const totalMonths = currentMonth + count;
      const targetYear = currentYear + Math.floor(totalMonths / 12);
      const targetMonth = ((totalMonths % 12) + 12) % 12;

      // Determine days in target month
      const maxDaysInTargetMonth = getDaysInMonth(targetYear, targetMonth);
      const clampedDay = Math.min(originalDay, maxDaysInTargetMonth);

      // Construct target date keeping original time
      return new Date(
        Date.UTC(
          targetYear,
          targetMonth,
          clampedDay,
          startDate.getUTCHours(),
          startDate.getUTCMinutes(),
          startDate.getUTCSeconds(),
          startDate.getUTCMilliseconds(),
        ),
      );
    }

    case 'YEARLY': {
      const originalDay = startDate.getUTCDate();
      const originalMonth = startDate.getUTCMonth();
      const targetYear = startDate.getUTCFullYear() + count;

      // Leap year boundary check (Feb 29 -> Feb 28 on non-leap years)
      const clampedDay =
        originalMonth === 1 && originalDay === 29 && !isLeapYear(targetYear) ? 28 : originalDay;

      return new Date(
        Date.UTC(
          targetYear,
          originalMonth,
          clampedDay,
          startDate.getUTCHours(),
          startDate.getUTCMinutes(),
          startDate.getUTCSeconds(),
          startDate.getUTCMilliseconds(),
        ),
      );
    }

    default:
      throw new Error(`Unsupported billing interval: ${interval}`);
  }
}

/**
 * Validates whether a target date is due relative to reference timestamp (now).
 */
export function isBillingDue(nextBillingAt: Date, referenceDate: Date = new Date()): boolean {
  return nextBillingAt.getTime() <= referenceDate.getTime();
}
