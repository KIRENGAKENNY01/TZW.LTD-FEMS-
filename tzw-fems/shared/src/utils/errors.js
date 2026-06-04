import { sendError } from './response.js';
import logger from './logger.js';

export class AppError extends Error {
  constructor(message, statusCode, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const globalErrorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Something went wrong';

  logger.error(`${req.method} ${req.originalUrl} - ${err.stack || message}`);

  // Handle Zod Validation Error (returns 422 with field-level details)
  if (err.name === 'ZodError' || err.issues) {
    const fieldErrors = {};
    const issues = err.issues || err.errors || [];
    issues.forEach(issue => {
      const field = issue.path.join('.') || 'body';
      fieldErrors[field] = issue.message;
    });
    return sendError(res, 'Validation failed', fieldErrors, 422);
  }

  // Handle JsonWebToken Errors
  if (err.name === 'JsonWebTokenError') {
    return sendError(res, 'Invalid token. Please log in again.', {}, 401);
  }
  if (err.name === 'TokenExpiredError') {
    return sendError(res, 'Your token has expired. Please log in again.', {}, 401);
  }

  // Handle Prisma Unique Constraint Errors
  if (err.code === 'P2002') {
    const fields = err.meta?.target || [];
    return sendError(res, `Duplicate field value error on: ${fields.join(', ')}`, {}, 400);
  }

  const isProduction = process.env.NODE_ENV === 'production';
  return sendError(
    res, 
    message, 
    err.isOperational || isProduction ? {} : { stack: err.stack }, 
    statusCode
  );
};
