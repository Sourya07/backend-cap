import { Router } from 'express';

import { Roles } from '../constants/roles.js';
import { authorize } from '../middlewares/authorize.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { dashboardOverviewQuerySchema, dashboardTrendsQuerySchema } from '../schemas/dashboardSchemas.js';
import { dashboardService } from '../services/dashboardService.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.get(
  '/overview',
  authorize(Roles.Viewer, Roles.Analyst, Roles.Admin),
  validateRequest(dashboardOverviewQuerySchema),
  asyncHandler(async (req, res) => {
    const query = req.query as unknown as {
      recentLimit: number;
    };

    const data = await dashboardService.getOverview(query.recentLimit);
    res.status(200).json({ data });
  }),
);

router.get(
  '/trends',
  authorize(Roles.Viewer, Roles.Analyst, Roles.Admin),
  validateRequest(dashboardTrendsQuerySchema),
  asyncHandler(async (req, res) => {
    const query = req.query as unknown as {
      months: number;
    };

    const data = await dashboardService.getMonthlyTrends(query.months);
    res.status(200).json({ data });
  }),
);

export { router as dashboardRoutes };
