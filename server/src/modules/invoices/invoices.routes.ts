import { Router } from 'express';
import {
  listInvoices,
  getInvoiceById,
  chaseAllOverdueInvoices,
  voidInvoice,
} from './invoices.controller';

export const invoicesRouter = Router();

invoicesRouter.get('/', listInvoices);
invoicesRouter.post('/chase-all', chaseAllOverdueInvoices);
invoicesRouter.get('/:id', getInvoiceById);
invoicesRouter.post('/:id/void', voidInvoice);

