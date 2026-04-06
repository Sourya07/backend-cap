import { Router } from 'express';

import { Roles } from '../constants/roles.js';
import { authorize } from '../middlewares/authorize.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import {
  createRecordSchema,
  getRecordSchema,
  listRecordsQuerySchema,
  updateRecordSchema,
} from '../schemas/recordSchemas.js';
import { recordService } from '../services/recordService.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.get(
  '/',
  authorize(Roles.Analyst, Roles.Admin),
  validateRequest(listRecordsQuerySchema),
  asyncHandler(async (req, res) => {
    const query = req.query as unknown as {
      type?: 'income' | 'expense';
      category?: string;
      startDate?: string;
      endDate?: string;
      minAmount?: number;
      maxAmount?: number;
      page: number;
      pageSize: number;
    };

    const result = await recordService.listRecords(
      {
        type: query.type,
        category: query.category,
        startDate: query.startDate,
        endDate: query.endDate,
        minAmount: query.minAmount,
        maxAmount: query.maxAmount,
      },
      {
        page: query.page,
        pageSize: query.pageSize,
      },
    );

    res.status(200).json({ data: result });
  }),
);

router.get(
  '/:recordId',
  authorize(Roles.Analyst, Roles.Admin),
  validateRequest(getRecordSchema),
  asyncHandler(async (req, res) => {
    const record = await recordService.getRecordById(req.params.recordId);
    res.status(200).json({ data: record });
  }),
);

router.post(
  '/',
  authorize(Roles.Admin),
  validateRequest(createRecordSchema),
  asyncHandler(async (req, res) => {
    const createdBy = req.currentUser?.id as string;
    const record = await recordService.createRecord(req.body, createdBy);
    res.status(201).json({ data: record });
  }),
);

router.patch(
  '/:recordId',
  authorize(Roles.Admin),
  validateRequest(updateRecordSchema),
  asyncHandler(async (req, res) => {
    const updated = await recordService.updateRecord(req.params.recordId, req.body);
    res.status(200).json({ data: updated });
  }),
);

router.delete(
  '/:recordId',
  authorize(Roles.Admin),
  validateRequest(getRecordSchema),
  asyncHandler(async (req, res) => {
    await recordService.deleteRecord(req.params.recordId);
    res.status(204).send();
  }),
);

export { router as recordRoutes };
