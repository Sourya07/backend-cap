import { z } from 'zod';

import { RecordTypes } from '../domain/models.js';
import { isoDateSchema } from './commonSchemas.js';

const recordTypeSchema = z.enum([RecordTypes.Income, RecordTypes.Expense]);

export const recordIdParamSchema = z.object({
  recordId: z.string().min(1),
});

export const getRecordSchema = z.object({
  params: recordIdParamSchema,
});

export const createRecordSchema = z.object({
  body: z.object({
    amount: z.number().positive(),
    type: recordTypeSchema,
    category: z.string().trim().min(2).max(100),
    date: isoDateSchema,
    description: z.string().trim().max(500).optional(),
  }),
});

export const updateRecordSchema = z.object({
  params: recordIdParamSchema,
  body: z
    .object({
      amount: z.number().positive().optional(),
      type: recordTypeSchema.optional(),
      category: z.string().trim().min(2).max(100).optional(),
      date: isoDateSchema.optional(),
      description: z.string().trim().max(500).optional(),
    })
    .refine((value) => Object.keys(value).length > 0, {
      message: 'At least one field must be provided',
    }),
});

export const listRecordsQuerySchema = z.object({
  query: z.object({
    type: recordTypeSchema.optional(),
    category: z.string().trim().min(1).optional(),
    startDate: isoDateSchema.optional(),
    endDate: isoDateSchema.optional(),
    minAmount: z.coerce.number().positive().optional(),
    maxAmount: z.coerce.number().positive().optional(),
    page: z.coerce.number().int().min(1).default(1),
    pageSize: z.coerce.number().int().min(1).max(100).default(20),
  }),
});
