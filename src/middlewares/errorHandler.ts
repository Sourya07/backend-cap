import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

import { HttpError } from '../utils/httpError.js';

export const errorHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  if (error instanceof ZodError) {
    res.status(400).json({
      error: 'ValidationError',
      message: 'Request validation failed',
      details: error.flatten(),
    });
    return;
  }

  if (error instanceof HttpError) {
    res.status(error.statusCode).json({
      error: 'ApplicationError',
      message: error.message,
      details: error.details,
    });
    return;
  }

  console.error('Unexpected error:', error);
  res.status(500).json({
    error: 'InternalServerError',
    message: 'Something went wrong',
  });
};
