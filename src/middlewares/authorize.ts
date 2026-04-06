import type { NextFunction, Request, Response } from 'express';

import type { Role } from '../constants/roles.js';
import { HttpError } from '../utils/httpError.js';

export const authorize = (...allowedRoles: Role[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const user = req.currentUser;

    if (!user) {
      throw new HttpError(401, 'Authentication required');
    }

    if (!allowedRoles.includes(user.role)) {
      throw new HttpError(403, 'You do not have permission to perform this action');
    }

    next();
  };
};
