import { Request, Response, NextFunction } from 'express';
import { AppError, sendError } from '../utils/apiResponse.js';
import { logger } from '../utils/logger.js';
import { ZodError } from 'zod';

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void {
  logger.error(`[Error] ${req.method} ${req.originalUrl}:`, err);

  // Custom AppError
  if (err instanceof AppError) {
    sendError(res, err.message, err.statusCode, err.errors);
    return;
  }

  // Zod Validation Error
  if (err instanceof ZodError) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of err.issues) {
      fieldErrors[issue.path.join('.') || 'general'] = issue.message;
    }
    sendError(res, 'Validation error', 400, fieldErrors);
    return;
  }

  // Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    sendError(res, `Invalid resource identifier: ${err.value}`, 400);
    return;
  }

  // Mongoose duplicate key error (code 11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    sendError(res, `Duplicate value entered for ${field}. Please use another value.`, 409);
    return;
  }

  // Mongoose ValidationError
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors || {}).map((e: any) => e.message);
    sendError(res, `Database validation failed: ${messages.join(', ')}`, 400);
    return;
  }

  // JWT Token Errors
  if (err.name === 'JsonWebTokenError') {
    sendError(res, 'Invalid authentication token. Please log in again.', 401);
    return;
  }

  if (err.name === 'TokenExpiredError') {
    sendError(res, 'Authentication token has expired. Please log in again.', 401);
    return;
  }

  // Default fallback for unexpected errors
  const isDev = process.env.NODE_ENV === 'development';
  sendError(
    res,
    isDev ? err.message || 'Internal Server Error' : 'An unexpected error occurred. Please try again later.',
    500,
    isDev ? { stack: err.stack } : undefined
  );
}
