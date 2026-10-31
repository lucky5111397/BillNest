import { Router } from 'express';
import {
  listBankTransactions,
  importBankStatementCsv,
  runAutoMatcher,
  confirmBankMatch,
} from './reconciliation.controller';

export const reconciliationRouter = Router();

reconciliationRouter.get('/transactions', listBankTransactions);
reconciliationRouter.post('/import-csv', importBankStatementCsv);
reconciliationRouter.post('/auto-match', runAutoMatcher);
reconciliationRouter.post('/confirm-match', confirmBankMatch);

