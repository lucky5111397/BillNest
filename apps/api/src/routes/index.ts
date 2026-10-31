import { Router } from 'express';
import { healthRouter } from './health.routes';

export const apiRouter = Router();

apiRouter.use('/health', healthRouter);

// Root api v1 information endpoint
apiRouter.get('/', (_req, res) => {
  res.json({
    service: 'Brightloop API',
    version: 'v1',
    status: 'running',
    endpoints: {
      liveness: '/api/v1/health/live',
      readiness: '/api/v1/health/ready',
    },
  });
});
