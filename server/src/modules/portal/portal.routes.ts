import { Router } from 'express';
import {
  getPortalOverview,
  getPortalSubscriptions,
  updatePortalSeats,
  togglePortalAddon,
  getPortalQuotations,
  acceptPortalQuotation,
  getPortalInvoices,
} from './portal.controller';

export const portalRouter = Router();

portalRouter.get('/overview', getPortalOverview);
portalRouter.get('/subscriptions', getPortalSubscriptions);
portalRouter.post('/subscriptions/:id/seats', updatePortalSeats);
portalRouter.post('/subscriptions/:id/toggle-addon', togglePortalAddon);
portalRouter.get('/quotations', getPortalQuotations);
portalRouter.post('/quotations/:id/accept', acceptPortalQuotation);
portalRouter.get('/invoices', getPortalInvoices);

