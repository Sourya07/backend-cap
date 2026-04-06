import type { User } from '../domain/models.js';

declare global {
  namespace Express {
    interface Request {
      currentUser?: User;
    }
  }
}

export {};
