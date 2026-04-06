import { z } from 'zod';

export const dashboardOverviewQuerySchema = z.object({
  query: z.object({
    recentLimit: z.coerce.number().int().min(1).max(50).default(10),
  }),
});

export const dashboardTrendsQuerySchema = z.object({
  query: z.object({
    months: z.coerce.number().int().min(1).max(24).default(6),
  }),
});
