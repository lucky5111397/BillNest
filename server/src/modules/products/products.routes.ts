import { Router } from 'express';
import {
  listProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from './products.controller';

export const productsRouter = Router();

productsRouter.get('/', listProducts);
productsRouter.get('/:id', getProductById);
productsRouter.post('/', createProduct);
productsRouter.put('/:id', updateProduct);
productsRouter.delete('/:id', deleteProduct);

