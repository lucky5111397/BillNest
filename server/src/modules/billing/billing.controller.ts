import { Request, Response, NextFunction } from 'express';
import { RecurringBillingService } from './billing.service';

export async function runBillingNow(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { referenceDate } = req.body;
    const refDate = referenceDate ? new Date(referenceDate) : new Date();

    const report = await RecurringBillingService.executeBillingRun(refDate);

    res.json({
      success: true,
      message: `Recurring billing completed: ${report.invoicesCreated} invoices generated, ${report.skippedCount} skipped, ${report.failedCount} failed.`,
      data: report,
    });
  } catch (err) {
    next(err);
  }
}
