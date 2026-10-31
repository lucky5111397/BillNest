import { Router } from 'express';
import { runBillingNow } from './billing.controller';

export const billingRouter = Router();

billingRouter.post('/run', runBillingNow);

