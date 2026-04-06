import { Router } from 'express';

const router = Router();

router.get('/', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'finance-data-backend',
    timestamp: new Date().toISOString(),
  });
});

export { router as healthRoutes };
