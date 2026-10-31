import { Router } from 'express';
import {
  listCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
} from './customers.controller';

export const customersRouter = Router();

customersRouter.get('/', listCustomers);
customersRouter.get('/:id', getCustomerById);
customersRouter.post('/', createCustomer);
customersRouter.put('/:id', updateCustomer);

