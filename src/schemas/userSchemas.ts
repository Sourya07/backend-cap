import { z } from 'zod';

import { Roles } from '../constants/roles.js';

const roleSchema = z.enum([Roles.Viewer, Roles.Analyst, Roles.Admin]);

export const userIdParamSchema = z.object({
  userId: z.string().min(1),
});

export const getUserSchema = z.object({
  params: userIdParamSchema,
});

export const createUserSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(100),
    email: z.string().trim().email(),
    role: roleSchema,
    isActive: z.boolean().optional(),
  }),
});

export const updateUserSchema = z.object({
  params: userIdParamSchema,
  body: z
    .object({
      name: z.string().trim().min(2).max(100).optional(),
      role: roleSchema.optional(),
      isActive: z.boolean().optional(),
    })
    .refine((value) => Object.keys(value).length > 0, {
      message: 'At least one field must be provided',
    }),
});
