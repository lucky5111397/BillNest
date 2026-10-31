import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { envConfig } from './config/env';
import { apiRouter } from './routes';
import { notFoundMiddleware } from './middleware/not-found.middleware';
import { errorMiddleware } from './middleware/error.middleware';

export function createApp(): Express {
  const app = express();

  // Security headers
  app.use(helmet());

  // CORS configuration
  app.use(
    cors({
      origin: envConfig.CORS_ORIGIN,
      credentials: true,
    }),
  );

  // Request logging (disabled in test environment)
  if (envConfig.NODE_ENV !== 'test') {
    app.use(morgan(envConfig.NODE_ENV === 'development' ? 'dev' : 'combined'));
  }

  // Body parsing
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Root landing check
  app.get('/', (_req, res) => {
    res.json({
      service: 'Brightloop Subscription Management API',
      status: 'online',
      docs: '/api/v1',
    });
  });

  // Versioned API Routes
  app.use('/api/v1', apiRouter);

  // 404 Handler
  app.use(notFoundMiddleware);

  // Central Error Handler
  app.use(errorMiddleware);

  return app;
}

export const app = createApp();
