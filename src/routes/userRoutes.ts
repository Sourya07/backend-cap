import { Router } from 'express';

import { Roles } from '../constants/roles.js';
import { authorize } from '../middlewares/authorize.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { createUserSchema, getUserSchema, updateUserSchema } from '../schemas/userSchemas.js';
import { userService } from '../services/userService.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { HttpError } from '../utils/httpError.js';

const router = Router();

router.get(
  '/me',
  asyncHandler(async (req, res) => {
    if (!req.currentUser) {
      throw new HttpError(401, 'Authentication required');
    }

    res.status(200).json({ data: req.currentUser });
  }),
);

router.get(
  '/',
  authorize(Roles.Admin),
  asyncHandler(async (_req, res) => {
    const users = await userService.listUsers();
    res.status(200).json({ data: users });
  }),
);

router.get(
  '/:userId',
  authorize(Roles.Admin),
  validateRequest(getUserSchema),
  asyncHandler(async (req, res) => {
    const user = await userService.getUserById(req.params.userId);
    res.status(200).json({ data: user });
  }),
);

router.post(
  '/',
  authorize(Roles.Admin),
  validateRequest(createUserSchema),
  asyncHandler(async (req, res) => {
    const user = await userService.createUser(req.body);
    res.status(201).json({ data: user });
  }),
);

router.patch(
  '/:userId',
  authorize(Roles.Admin),
  validateRequest(updateUserSchema),
  asyncHandler(async (req, res) => {
    const user = await userService.updateUser(req.params.userId, req.body);
    res.status(200).json({ data: user });
  }),
);

export { router as userRoutes };
