import { mkdirSync } from 'node:fs';
import path from 'node:path';
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = process.env.VERCEL ? 'file:/tmp/dev.db' : 'file:./prisma/dev.db';
}

normalizeSqliteDatabaseUrl();

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

function normalizeSqliteDatabaseUrl(): void {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl || !databaseUrl.startsWith('file:')) {
    return;
  }

  const sqlitePath = resolveSqlitePath(databaseUrl);
  const dirPath = path.dirname(sqlitePath);

  try {
    mkdirSync(dirPath, { recursive: true });
  } catch {
    // Render services without a mounted disk cannot write to /var/data.
    // Fallback to /tmp to keep the API available.
    process.env.DATABASE_URL = 'file:/tmp/dev.db';
  }
}

function resolveSqlitePath(databaseUrl: string): string {
  return databaseUrl.startsWith('file:/')
    ? databaseUrl.replace('file:', '')
    : path.resolve(process.cwd(), databaseUrl.replace('file:', ''));
}
