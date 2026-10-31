import { Router } from 'express';
import {
  listSubscriptions,
  getSubscriptionById,
  createSubscription,
  pauseSubscription,
  resumeSubscription,
  closeSubscription,
  updateSubscriptionQuantity,
} from './subscriptions.controller';

export const subscriptionsRouter = Router();

subscriptionsRouter.get('/', listSubscriptions);
subscriptionsRouter.get('/:id', getSubscriptionById);
subscriptionsRouter.post('/', createSubscription);
subscriptionsRouter.post('/:id/pause', pauseSubscription);
subscriptionsRouter.post('/:id/resume', resumeSubscription);
subscriptionsRouter.post('/:id/close', closeSubscription);
subscriptionsRouter.post('/:id/update-quantity', updateSubscriptionQuantity);

