import type { NextFunction, Request, Response } from 'express';
import type { AnyZodObject } from 'zod';

export const validateRequest = (schema: AnyZodObject) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const parsed = schema.parse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (parsed.body) {
      req.body = parsed.body;
    }

    if (parsed.params) {
      req.params = parsed.params;
    }

    if (parsed.query) {
      req.query = parsed.query;
    }

    next();
  };
};
