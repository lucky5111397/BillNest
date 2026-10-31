import { Router, Request, Response } from 'express';
import { checkDatabaseConnection } from '../config/database';

export const healthRouter = Router();

/**
 * Liveness Probe: Verifies process is actively responding to requests.
 * GET /api/v1/health/live
 */
healthRouter.get('/live', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
  });
});

/**
 * Readiness Probe: Verifies critical infrastructure dependencies (PostgreSQL).
 * GET /api/v1/health/ready
 */
healthRouter.get('/ready', async (_req: Request, res: Response) => {
  const dbStatus = await checkDatabaseConnection();

  if (!dbStatus.connected) {
    res.status(503).json({
      status: 'degraded',
      timestamp: new Date().toISOString(),
      dependencies: {
        database: {
          status: 'down',
          error: dbStatus.error,
        },
      },
    });
    return;
  }

  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    dependencies: {
      database: {
        status: 'healthy',
        latencyMs: dbStatus.latencyMs,
      },
    },
  });
});
