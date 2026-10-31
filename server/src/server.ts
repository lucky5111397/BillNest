import { app } from './app';
import { envConfig } from './config/env';
import { connectDatabase, disconnectDatabase, classifyDatabaseError } from './config/database';

let isShuttingDown = false;

async function bootstrap() {
  if (!envConfig.MONGODB_URI) {
    if (envConfig.NODE_ENV === 'production') {
      console.error('[Startup Error] MONGODB_URI is required in production environment.');
      process.exit(1);
    } else {
      console.warn(
        '[Database Notice] MONGODB_URI is not configured. Server starting in DEGRADED mode.',
      );
      console.warn(
        '                   Liveness probe (/health/live) will pass; Readiness (/health/ready) will return 503.',
      );
    }
  } else {
    try {
      console.log('[Database] Connecting to MongoDB Atlas...');
      await connectDatabase(envConfig.MONGODB_URI);
      console.log('[Database] Successfully connected to MongoDB Atlas.');
    } catch (err: unknown) {
      const classified = classifyDatabaseError(err);
      console.error(
        `[Database Warning] Initial MongoDB connection failed (${classified.category}): ${classified.message}`,
      );
      if (envConfig.NODE_ENV === 'production') {
        process.exit(1);
      }
      console.warn(
        '[Database Notice] Continuing in DEGRADED mode. Server will serve requests but /health/ready will return 503.',
      );
    }
  }

  const server = app.listen(envConfig.PORT, () => {
    console.log(`[BillNest API] Listening on port ${envConfig.PORT} (${envConfig.NODE_ENV})`);
    console.log(`[BillNest API] Health endpoints:`);
    console.log(`  - Liveness:  http://localhost:${envConfig.PORT}/api/v1/health/live`);
    console.log(`  - Readiness: http://localhost:${envConfig.PORT}/api/v1/health/ready`);
  });

  async function gracefulShutdown(signal: string) {
    if (isShuttingDown) return;
    isShuttingDown = true;

    console.log(`\nReceived ${signal}. Shutting down gracefully...`);

    const forceExitTimer = setTimeout(() => {
      console.error('Forced shutdown due to timeout (10s elapsed).');
      process.exit(1);
    }, 10000);
    forceExitTimer.unref();

    server.close(async () => {
      try {
        await disconnectDatabase();
        console.log('Database connection cleanly closed.');
        process.exit(0);
      } catch (err) {
        console.error('Error during database disconnect:', err);
        process.exit(1);
      }
    });
  }

  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
}

bootstrap().catch((err) => {
  console.error('[Fatal Startup Error]:', err);
  process.exit(1);
});
