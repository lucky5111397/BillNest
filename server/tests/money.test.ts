import { describe, it, expect } from 'vitest';
import {
  toMinorUnits,
  fromMinorUnits,
  addMoney,
  subtractMoney,
  multiplyMoney,
  calculatePercentage,
  formatMoney,
} from '../src/utils/money';

describe('Money Safety & Minor Unit Calculations', () => {
  it('converts decimal amounts to integer minor units without float inaccuracies', () => {
    expect(toMinorUnits(19.99)).toBe(1999);
    expect(toMinorUnits('148920.00')).toBe(14892000);
    expect(toMinorUnits(0)).toBe(0);
    expect(toMinorUnits(0.01)).toBe(1);
    expect(toMinorUnits(2560.5)).toBe(256050);
  });

  it('converts minor units back to decimal', () => {
    expect(fromMinorUnits(1999)).toBe(19.99);
    expect(fromMinorUnits(14892000)).toBe(148920.0);
    expect(fromMinorUnits(0)).toBe(0);
  });

  it('safely performs integer addition and subtraction', () => {
    const total = addMoney(1999, 500, 250);
    expect(total).toBe(2749);

    const balance = subtractMoney(2749, 1000);
    expect(balance).toBe(1749);
  });

  it('multiplies minor units by quantity and rounds accurately', () => {
    // 10 seats @ $1,760.00 = 10 * 176000 cents = 1760000 cents ($17,600.00)
    expect(multiplyMoney(176000, 10)).toBe(1760000);
    // Additive variant pricing: base 200000 cents ($2,000.00) + 56000 cents ($560.00) = 256000 cents ($2,560.00)
    const base = toMinorUnits(2000);
    const adjustment = toMinorUnits(560);
    expect(addMoney(base, adjustment)).toBe(toMinorUnits(2560));
  });

  it('calculates percentage discounts and taxes with correct integer rounding', () => {
    // 18% tax on $100.00 (10000 cents) = 1800 cents ($18.00)
    expect(calculatePercentage(10000, 18)).toBe(1800);
    // 15% discount on $2,560.00 (256000 cents) = 38400 cents ($384.00)
    expect(calculatePercentage(256000, 15)).toBe(38400);
  });

  it('formats minor units into currency strings', () => {
    expect(formatMoney(14892000, 'USD')).toBe('$148,920.00');
    expect(formatMoney(838000, 'USD')).toBe('$8,380.00');
  });
});

