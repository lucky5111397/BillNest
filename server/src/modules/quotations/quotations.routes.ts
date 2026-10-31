import { Router } from 'express';
import {
  listQuotations,
  getQuotationById,
  createQuotation,
  confirmQuotation,
  cancelQuotation,
  convertQuotationToSubscription,
} from './quotations.controller';

export const quotationsRouter = Router();

quotationsRouter.get('/', listQuotations);
quotationsRouter.get('/:id', getQuotationById);
quotationsRouter.post('/', createQuotation);
quotationsRouter.post('/:id/confirm', confirmQuotation);
quotationsRouter.post('/:id/cancel', cancelQuotation);
quotationsRouter.post('/:id/convert-to-subscription', convertQuotationToSubscription);

