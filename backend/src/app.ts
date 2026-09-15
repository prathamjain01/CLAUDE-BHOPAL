import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { corsOptions } from './config/cors.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import { errorHandler } from './middleware/errorHandler.js';
import apiRouter from './routes/index.js';
import { sendError } from './utils/apiResponse.js';

export function createApp(): Express {
  const app = express();

  // Security HTTP headers
  app.use(helmet());

  // CORS setup
  app.use(cors(corsOptions));

  // Request body parsers
  app.use(express.json({ limit: '2mb' }));
  app.use(express.urlencoded({ extended: true, limit: '2mb' }));

  // HTTP request logging
  if (process.env.NODE_ENV !== 'test') {
    app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
  }

  // Apply general rate limiting to API routes
  app.use('/api', apiLimiter);

  // Mount API router
  app.use('/api', apiRouter);

  // 404 Catch-all handler
  app.use((req: Request, res: Response) => {
    sendError(res, `Route not found: ${req.method} ${req.originalUrl}`, 404);
  });

  // Centralized error handler
  app.use(errorHandler);

  return app;
}

export const app = createApp();
export default app;
