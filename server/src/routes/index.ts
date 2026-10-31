import { Router } from 'express';
import { healthRouter } from './health.routes';
import { authRouter } from '../modules/auth';
import { productsRouter } from '../modules/products';
import { plansRouter } from '../modules/plans';
import { taxesRouter } from '../modules/taxes';
import { discountsRouter } from '../modules/discounts';
import { customersRouter } from '../modules/customers';
import { quotationsRouter } from '../modules/quotations';
import { subscriptionsRouter } from '../modules/subscriptions';
import { billingRouter } from '../modules/billing';
import { invoicesRouter } from '../modules/invoices';
import { paymentsRouter } from '../modules/payments';
import { reconciliationRouter } from '../modules/reconciliation';
import { reportsRouter } from '../modules/reports';
import { portalRouter } from '../modules/portal';

export const apiRouter = Router();

apiRouter.use('/health', healthRouter);
apiRouter.use('/auth', authRouter);
apiRouter.use('/products', productsRouter);
apiRouter.use('/plans', plansRouter);
apiRouter.use('/taxes', taxesRouter);
apiRouter.use('/discounts', discountsRouter);
apiRouter.use('/customers', customersRouter);
apiRouter.use('/quotations', quotationsRouter);
apiRouter.use('/subscriptions', subscriptionsRouter);
apiRouter.use('/billing', billingRouter);
apiRouter.use('/invoices', invoicesRouter);
apiRouter.use('/payments', paymentsRouter);
apiRouter.use('/reconciliation', reconciliationRouter);
apiRouter.use('/reports', reportsRouter);
apiRouter.use('/portal', portalRouter);

// Root api v1 information endpoint
apiRouter.get('/', (_req, res) => {
  res.json({
    service: 'Brightloop API',
    version: 'v1',
    status: 'running',
    endpoints: {
      liveness: '/api/v1/health/live',
      readiness: '/api/v1/health/ready',
      auth: '/api/v1/auth',
      products: '/api/v1/products',
      plans: '/api/v1/plans',
      taxes: '/api/v1/taxes',
      discounts: '/api/v1/discounts',
      customers: '/api/v1/customers',
      quotations: '/api/v1/quotations',
      subscriptions: '/api/v1/subscriptions',
      billing: '/api/v1/billing',
      invoices: '/api/v1/invoices',
      payments: '/api/v1/payments',
      reconciliation: '/api/v1/reconciliation',
      reports: '/api/v1/reports',
      portal: '/api/v1/portal',
    },
  });
});
