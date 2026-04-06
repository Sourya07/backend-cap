import type { NextFunction, Request, Response } from 'express';

import { userService } from '../services/userService.js';
import { HttpError } from '../utils/httpError.js';

export const authenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.header('x-user-id');

    if (!userId) {
      throw new HttpError(401, 'Missing x-user-id header');
    }

    const user = await userService.getActiveUserById(userId);
    req.currentUser = user;

    next();
  } catch (error) {
    next(error);
  }
};
