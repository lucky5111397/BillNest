import { app } from './app';
import { envConfig } from './config/env';
import { prisma } from './config/database';

const server = app.listen(envConfig.PORT, () => {
  console.log(`[Brightloop API] Listening on port ${envConfig.PORT} (${envConfig.NODE_ENV})`);
  console.log(`[Brightloop API] Health endpoints:`);
  console.log(`  - Liveness:  http://localhost:${envConfig.PORT}/api/v1/health/live`);
  console.log(`  - Readiness: http://localhost:${envConfig.PORT}/api/v1/health/ready`);
});

async function gracefulShutdown(signal: string) {
  console.log(`\nReceived ${signal}. Shutting down gracefully...`);
  server.close(async () => {
    try {
      await prisma.$disconnect();
      console.log('Database connection closed.');
      process.exit(0);
    } catch (err) {
      console.error('Error during shutdown:', err);
      process.exit(1);
    }
  });

  // Force close after 10 seconds if lingering connections remain
  setTimeout(() => {
    console.error('Forced shutdown due to timeout.');
    process.exit(1);
  }, 10000);
}

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
