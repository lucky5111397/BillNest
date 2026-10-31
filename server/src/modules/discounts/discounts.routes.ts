import { Router } from 'express';
import {
  listDiscountRules,
  createDiscountRule,
  updateDiscountRule,
  validateDiscountCode,
} from './discounts.controller';

export const discountsRouter = Router();

discountsRouter.get('/', listDiscountRules);
discountsRouter.post('/', createDiscountRule);
discountsRouter.post('/validate', validateDiscountCode);
discountsRouter.put('/:id', updateDiscountRule);

