import { Subscription, ISubscription } from '../../models/subscription.model';
import { Invoice } from '../../models/invoice.model';
import { BillingCycle } from '../../models/billing-cycle.model';
import { addBillingInterval } from '../../utils/dates';
import { addMoney, multiplyMoney, calculatePercentage } from '../../utils/money';

export interface BillingRunResult {
  runAt: Date;
  processedCount: number;
  invoicesCreated: number;
  skippedCount: number;
  failedCount: number;
  details: Array<{
    subscriptionId: string;
    subscriptionNumber: string;
    customerName?: string;
    status: 'INVOICE_CREATED' | 'SKIPPED' | 'FAILED';
    invoiceNumber?: string;
    reason?: string;
  }>;
}

export class RecurringBillingService {
  /**
   * Processes all active subscriptions currently due for recurring invoice generation.
   * Completely idempotent: guarded by unique compound idempotency key.
   */
  public static async executeBillingRun(
    referenceDate: Date = new Date(),
  ): Promise<BillingRunResult> {
    const dueSubscriptions = await Subscription.find({
      status: 'ACTIVE',
      nextBillingAt: { $lte: referenceDate },
    }).populate('customerId', 'businessName contactName');

    const result: BillingRunResult = {
      runAt: referenceDate,
      processedCount: dueSubscriptions.length,
      invoicesCreated: 0,
      skippedCount: 0,
      failedCount: 0,
      details: [],
    };

    for (const sub of dueSubscriptions) {
      try {
        const cycleResult = await this.processSubscriptionCycle(sub, referenceDate);
        if (cycleResult.status === 'INVOICE_CREATED') {
          result.invoicesCreated++;
        } else if (cycleResult.status === 'SKIPPED') {
          result.skippedCount++;
        } else {
          result.failedCount++;
        }
        result.details.push(cycleResult);
      } catch (err) {
        result.failedCount++;
        result.details.push({
          subscriptionId: sub._id.toString(),
          subscriptionNumber: sub.subscriptionNumber,
          status: 'FAILED',
          reason: err instanceof Error ? err.message : String(err),
        });
      }
    }

    return result;
  }

  /**
   * Processes a single subscription billing cycle.
   */
  public static async processSubscriptionCycle(
    sub: ISubscription,
    referenceDate: Date = new Date(),
  ): Promise<{
    subscriptionId: string;
    subscriptionNumber: string;
    customerName?: string;
    status: 'INVOICE_CREATED' | 'SKIPPED' | 'FAILED';
    invoiceNumber?: string;
    reason?: string;
  }> {
    const customer = sub.customerId as unknown as { businessName?: string; contactName?: string };
    const customerName = customer?.businessName || customer?.contactName || 'Valued Customer';

    // 1. Determine billing period
    const periodStart = new Date(sub.nextBillingAt.getTime());
    const periodEnd = addBillingInterval(periodStart, sub.billingInterval, sub.intervalCount);

    // 2. Compute deterministic idempotency key
    const idempotencyKey = `BILL-${sub._id.toString()}-${periodStart.toISOString().slice(0, 10)}`;

    // 3. Check for existing billing cycle (idempotency guard)
    const existingCycle = await BillingCycle.findOne({ idempotencyKey });
    if (existingCycle && existingCycle.status === 'PROCESSED') {
      return {
        subscriptionId: sub._id.toString(),
        subscriptionNumber: sub.subscriptionNumber,
        customerName,
        status: 'SKIPPED',
        reason: `Billing cycle already completed for period ${periodStart.toISOString().slice(0, 10)} (idempotent)`,
      };
    }

    // 4. Check auto-close expiration policy
    if (sub.expiryDate && sub.expiryDate <= referenceDate && sub.lifecyclePolicies.autoClose) {
      sub.status = 'CLOSED';
      sub.closedAt = new Date();
      sub.closeReason = 'Subscription reached scheduled expiry under auto-close policy';
      await sub.save();

      return {
        subscriptionId: sub._id.toString(),
        subscriptionNumber: sub.subscriptionNumber,
        customerName,
        status: 'SKIPPED',
        reason: 'Subscription reached expiry date and auto-closed',
      };
    }

    // 5. Generate unique invoice number: INV-YYYY-XXXX
    const invoiceCount = await Invoice.countDocuments({ organizationId: sub.organizationId });
    const invoiceNumber = `INV-${new Date().getFullYear()}-${String(invoiceCount + 1).padStart(4, '0')}`;

    // 6. Calculate snapshot line items
    let subtotalMinor = 0;
    const itemSnapshots = sub.items.map((item) => {
      const lineSubtotal = multiplyMoney(item.unitPrice, item.quantity);
      subtotalMinor = addMoney(subtotalMinor, lineSubtotal);
      return {
        productId: item.productId,
        variantId: item.variantId,
        name: item.name,
        description: item.description,
        unitPrice: item.unitPrice,
        quantity: item.quantity,
        subtotal: lineSubtotal,
        discount: 0,
        tax: 0,
        total: lineSubtotal,
      };
    });

    // 7. Calculate discounts and taxes
    let discountTotalMinor = 0;
    if (sub.discountConfig?.value) {
      if (sub.discountConfig.type === 'PERCENTAGE') {
        discountTotalMinor = calculatePercentage(subtotalMinor, sub.discountConfig.value);
      } else {
        discountTotalMinor = Math.min(sub.discountConfig.value, subtotalMinor);
      }
    }

    let taxTotalMinor = 0;
    if (sub.taxConfig?.rate && !sub.taxConfig.inclusive) {
      const taxableBase = subtotalMinor - discountTotalMinor;
      taxTotalMinor = calculatePercentage(taxableBase, sub.taxConfig.rate);
    }

    const totalMinor = addMoney(subtotalMinor - discountTotalMinor, taxTotalMinor);

    const dueDate = new Date(periodStart.getTime() + 14 * 24 * 60 * 60 * 1000); // 14 days payment window

    // 8. Create Invoice
    const invoice = await Invoice.create({
      organizationId: sub.organizationId,
      invoiceNumber,
      customerId: sub.customerId,
      subscriptionId: sub._id,
      billingPeriodStart: periodStart,
      billingPeriodEnd: periodEnd,
      issueDate: referenceDate,
      dueDate,
      itemSnapshots,
      subtotal: subtotalMinor,
      discountTotal: discountTotalMinor,
      taxTotal: taxTotalMinor,
      total: totalMinor,
      paidAmount: 0,
      outstandingBalance: totalMinor,
      currency: sub.currency,
      idempotencyKey,
      status: 'CONFIRMED',
      notes: `Automated recurring billing cycle for subscription ${sub.subscriptionNumber}`,
    });

    // 9. Record completed BillingCycle
    await BillingCycle.findOneAndUpdate(
      { idempotencyKey },
      {
        subscriptionId: sub._id,
        periodStart,
        periodEnd,
        idempotencyKey,
        status: 'PROCESSED',
        invoiceId: invoice._id,
        attemptCount: 1,
      },
      { upsert: true, returnDocument: 'after' },
    );

    // 10. Advance nextBillingAt on Subscription
    sub.nextBillingAt = periodEnd;
    await sub.save();

    return {
      subscriptionId: sub._id.toString(),
      subscriptionNumber: sub.subscriptionNumber,
      customerName,
      status: 'INVOICE_CREATED',
      invoiceNumber: invoice.invoiceNumber,
    };
  }
}
