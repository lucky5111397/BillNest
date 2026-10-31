import { Router } from 'express';
import { listTaxRules, createTaxRule, updateTaxRule, deleteTaxRule } from './taxes.controller';

export const taxesRouter = Router();

taxesRouter.get('/', listTaxRules);
taxesRouter.post('/', createTaxRule);
taxesRouter.put('/:id', updateTaxRule);
taxesRouter.delete('/:id', deleteTaxRule);
