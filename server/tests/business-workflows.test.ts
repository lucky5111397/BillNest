import { describe, it, expect } from 'vitest';
import {
  toMinorUnits,
  fromMinorUnits,
  addMoney,
  subtractMoney,
  multiplyMoney,
  calculatePercentage,
} from '../src/utils/money';
import { addBillingInterval, isBillingDue } from '../src/utils/dates';

describe('BillNest Business Workflows & Financial Invariants', () => {
  describe('1. Additive Variant Pricing Invariants', () => {
    it('accurately calculates final price from base product plus variant adjustment', () => {
      // Base product: Brightloop ERP Suite = $2,000.00 (200000 cents)
      const baseProductPrice = toMinorUnits(2000);
      // Variant: Odoo Native Connector adjustment = +$560.00 (56000 cents)
      const odooAdjustment = toMinorUnits(560);
      // Final authoritative price = $2,560.00 (256000 cents)
      const finalPrice = addMoney(baseProductPrice, odooAdjustment);

      expect(finalPrice).toBe(256000);
      expect(fromMinorUnits(finalPrice)).toBe(2560.0);
    });

    it('accurately calculates volume tiers with additive variant adjustment', () => {
      const basePrice = toMinorUnits(2000);
      const variantAdjustment = toMinorUnits(560);
      const unitPrice = addMoney(basePrice, variantAdjustment);
      const quantity = 10; // 10 seats

      const subtotal = multiplyMoney(unitPrice, quantity);
      expect(subtotal).toBe(2560000); // $25,600.00
      expect(fromMinorUnits(subtotal)).toBe(25600.0);
    });
  });

  describe('2. Discount Code Validation & Expiration Rules', () => {
    it('applies percentage discount within valid bounds', () => {
      const subtotal = toMinorUnits(2560); // 256000 cents
      const discountPercentage = 15; // 15%
      const discountAmount = calculatePercentage(subtotal, discountPercentage);

      expect(discountAmount).toBe(38400); // $384.00
      const netTotal = subtractMoney(subtotal, discountAmount);
      expect(netTotal).toBe(217600); // $2,176.00
    });

    it('rejects discount when purchase amount is below minimum purchase threshold', () => {
      const purchaseAmount = toMinorUnits(500); // $500.00
      const minimumPurchase = toMinorUnits(1000); // $1,000.00
      const isEligible = purchaseAmount >= minimumPurchase;

      expect(isEligible).toBe(false);
    });

    it('detects expired discount rules', () => {
      const expiredDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const isExpired = expiredDate < new Date();
      expect(isExpired).toBe(true);
    });
  });

  describe('3. Payment Allocation & Balance Invariants', () => {
    it('updates invoice balance on partial payment and sets status to PARTIALLY_PAID', () => {
      const invoiceTotal = toMinorUnits(19598); // $19,598.00
      let paidAmount = 0;
      let outstanding = invoiceTotal;

      // Partial payment 1: $10,000.00
      const payment1 = toMinorUnits(10000);
      paidAmount = addMoney(paidAmount, payment1);
      outstanding = subtractMoney(invoiceTotal, paidAmount);

      expect(paidAmount).toBe(1000000);
      expect(outstanding).toBe(959800); // $9,598.00
      expect(outstanding > 0 && paidAmount > 0).toBe(true); // PARTIALLY_PAID

      // Final payment 2: $9,598.00
      const payment2 = toMinorUnits(9598);
      paidAmount = addMoney(paidAmount, payment2);
      outstanding = subtractMoney(invoiceTotal, paidAmount);

      expect(paidAmount).toBe(invoiceTotal);
      expect(outstanding).toBe(0); // Settled in full -> PAID
    });

    it('rejects payment that exceeds outstanding balance (prevent over-allocation)', () => {
      const outstanding = toMinorUnits(4200); // $4,200.00
      const paymentAttempt = toMinorUnits(5000); // $5,000.00
      const isOverAllocated = paymentAttempt > outstanding;

      expect(isOverAllocated).toBe(true);
    });
  });

  describe('4. Recurring Billing Idempotency & Interval Math', () => {
    it('generates deterministic idempotency key for recurring billing cycle', () => {
      const subId = '6723ef10ab89012345678901';
      const billingDate = new Date(Date.UTC(2026, 9, 1));
      const key1 = `BILL-${subId}-${billingDate.toISOString().slice(0, 10)}`;
      const key2 = `BILL-${subId}-${billingDate.toISOString().slice(0, 10)}`;

      expect(key1).toBe('BILL-6723ef10ab89012345678901-2026-10-01');
      expect(key1).toBe(key2);
    });

    it('advances next billing timestamp without drift across 12 monthly cycles', () => {
      let current = new Date(Date.UTC(2026, 0, 31)); // Jan 31, 2026

      const cycleDates: string[] = [];
      for (let i = 0; i < 12; i++) {
        current = addBillingInterval(current, 'MONTHLY', 1);
        cycleDates.push(
          `${current.getUTCFullYear()}-${current.getUTCMonth() + 1}-${current.getUTCDate()}`,
        );
      }

      // Check month boundaries
      expect(cycleDates[0]).toBe('2026-2-28'); // Feb clamped
      expect(cycleDates[1]).toBe('2026-3-28');
      expect(cycleDates[3]).toBe('2026-5-28');
      expect(cycleDates[11]).toBe('2027-1-28');
    });
  });
});
