import app from './src/app.js';
import { connectDB, disconnectDB } from './src/config/db.js';
import { config } from './src/config/env.js';
import { logger } from './src/utils/logger.js';

async function startServer() {
  try {
    // Attempt database connection
    await connectDB();

    const server = app.listen(config.port, () => {
      logger.info(`=================================================`);
      logger.info(`🚀 PathPilot API server is running on port ${config.port}`);
      logger.info(`🌍 Environment: ${config.nodeEnv}`);
      logger.info(`📡 Health check: http://localhost:${config.port}/api/health`);
      logger.info(`=================================================`);
    });

    // Graceful shutdown handlers
    const shutdown = async (signal: string) => {
      logger.info(`[Server] Received ${signal}. Starting graceful shutdown...`);
      server.close(async () => {
        await disconnectDB();
        logger.info('[Server] HTTP server closed. Exiting process.');
        process.exit(0);
      });

      // Force exit after 10s if connections linger
      setTimeout(() => {
        logger.error('[Server] Could not close connections in time, forcefully shutting down');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (error) {
    logger.error('[Server] Fatal startup error:', error);
    process.exit(1);
  }
}

startServer();
