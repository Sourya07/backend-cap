import { z } from 'zod';

export const isoDateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
  message: 'Expected date in YYYY-MM-DD format',
});

export const idParamSchema = z.object({
  id: z.string().min(1),
});
