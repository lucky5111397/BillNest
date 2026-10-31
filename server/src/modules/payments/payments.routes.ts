import { Router } from 'express';
import { listPayments, recordManualPayment } from './payments.controller';

export const paymentsRouter = Router();

paymentsRouter.get('/', listPayments);
paymentsRouter.post('/', recordManualPayment);

