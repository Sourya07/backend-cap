import cors from 'cors';
import express from 'express';
import type { RequestHandler } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'node:path';

import { authenticate } from './middlewares/authenticate.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFound.js';
import { apiRoutes } from './routes/index.js';
import { healthRoutes } from './routes/healthRoutes.js';

export const app = express();

type HelmetFactory = (options?: unknown) => RequestHandler;
const helmetFactory: HelmetFactory =
  typeof helmet === 'function'
    ? (helmet as unknown as HelmetFactory)
    : ((helmet as unknown as { default: HelmetFactory }).default);

app.use(helmetFactory());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json({ limit: '1mb' }));

app.get('/', (_req, res) => {
  res.status(200).json({
    service: 'Finance Data Processing and Access Control Backend',
    docs: '/docs',
    health: '/health',
  });
});

app.use('/health', healthRoutes);
app.use('/docs', express.static(path.resolve(process.cwd(), 'docs')));
app.use('/api', authenticate, apiRoutes);

app.use(notFoundHandler);
app.use(errorHandler);
