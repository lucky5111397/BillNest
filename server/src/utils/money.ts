/**
 * BillNest Money & Financial Calculation Utility
 *
 * Enforces integer minor currency units (cents / paise) throughout the platform.
 * JavaScript floating-point arithmetic is never used for financial calculations or database persistence.
 */

export const MAX_SAFE_FINANCIAL_INTEGER = 9007199254740991; // Number.MAX_SAFE_INTEGER

/**
 * Converts major currency units (e.g. 19.99 dollars) to integer minor units (1999 cents).
 */
export function toMinorUnits(amount: number | string): number {
  if (typeof amount === 'string') {
    amount = parseFloat(amount.trim());
  }
  if (!Number.isFinite(amount)) {
    throw new TypeError(`Invalid financial amount: ${amount}`);
  }
  // Round to closest integer minor unit to avoid float representation artifacts
  const minor = Math.round(amount * 100);
  if (Math.abs(minor) > MAX_SAFE_FINANCIAL_INTEGER) {
    throw new RangeError(`Financial amount exceeds safe integer range: ${amount}`);
  }
  return minor;
}

/**
 * Converts minor currency units (1999 cents) to major decimal number (19.99) for display/export.
 */
export function fromMinorUnits(minorUnits: number): number {
  if (!Number.isSafeInteger(minorUnits)) {
    throw new TypeError(`Minor units must be a safe integer: ${minorUnits}`);
  }
  return minorUnits / 100;
}

/**
 * Safely adds financial minor units.
 */
export function addMoney(...amounts: number[]): number {
  return amounts.reduce((acc, curr) => {
    if (!Number.isSafeInteger(curr)) {
      throw new TypeError(`Financial operand must be a safe integer: ${curr}`);
    }
    const result = acc + curr;
    if (!Number.isSafeInteger(result)) {
      throw new RangeError('Financial addition resulted in unsafe integer overflow');
    }
    return result;
  }, 0);
}

/**
 * Safely subtracts subtrahend from minuend.
 */
export function subtractMoney(minuend: number, subtrahend: number): number {
  if (!Number.isSafeInteger(minuend) || !Number.isSafeInteger(subtrahend)) {
    throw new TypeError('Financial operands must be safe integers');
  }
  const result = minuend - subtrahend;
  if (!Number.isSafeInteger(result)) {
    throw new RangeError('Financial subtraction resulted in unsafe integer overflow');
  }
  return result;
}

/**
 * Safely multiplies money minor units by a quantity or factor.
 * Rounds to nearest minor unit integer.
 */
export function multiplyMoney(minorUnits: number, factor: number): number {
  if (!Number.isSafeInteger(minorUnits)) {
    throw new TypeError(`Minor units must be a safe integer: ${minorUnits}`);
  }
  if (!Number.isFinite(factor)) {
    throw new TypeError(`Factor must be a finite number: ${factor}`);
  }
  const result = Math.round(minorUnits * factor);
  if (!Number.isSafeInteger(result)) {
    throw new RangeError('Financial multiplication resulted in unsafe integer overflow');
  }
  return result;
}

/**
 * Calculates percentage discount or tax.
 * rate can be a percentage (e.g. 18 for 18%) or basis points if specified.
 */
export function calculatePercentage(
  baseMinorUnits: number,
  rate: number,
  isBasisPoints = false,
): number {
  if (!Number.isSafeInteger(baseMinorUnits)) {
    throw new TypeError(`Base minor units must be a safe integer: ${baseMinorUnits}`);
  }
  const divisor = isBasisPoints ? 10000 : 100;
  return Math.round((baseMinorUnits * rate) / divisor);
}

/**
 * Formats minor currency units into standard ISO 4217 display string.
 */
export function formatMoney(minorUnits: number, currency = 'USD'): string {
  const decimal = fromMinorUnits(minorUnits);
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(decimal);
}

