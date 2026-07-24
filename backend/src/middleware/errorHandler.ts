import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response';
import logger from '../config/logger';
import { ZodError } from 'zod';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error(`${err.message} - ${req.method} ${req.url}`, {
    stack: err.stack,
    body: req.body,
    params: req.params,
    query: req.query,
  });

  if (err instanceof ZodError) {
    const formattedErrors = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    return sendError(res, 'Validation failed', formattedErrors, 400);
  }

  if (err.name === 'UnauthorizedError') {
    return sendError(res, 'Unauthorized access', [], 401);
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  sendError(res, message, [], statusCode);
};
