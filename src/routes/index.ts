import { Router } from 'express';

import { dashboardRoutes } from './dashboardRoutes.js';
import { recordRoutes } from './recordRoutes.js';
import { userRoutes } from './userRoutes.js';

const router = Router();

router.use('/users', userRoutes);
router.use('/records', recordRoutes);
router.use('/dashboard', dashboardRoutes);

export { router as apiRoutes };
