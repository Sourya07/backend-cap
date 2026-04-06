import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { Roles } from '../constants/roles.js';
import { prisma } from './prisma.js';

let bootstrapPromise: Promise<void> | null = null;

export const ensureDatabaseReady = async (): Promise<void> => {
  if (!bootstrapPromise) {
    bootstrapPromise = initializeDatabase();
  }

  try {
    await bootstrapPromise;
  } catch (error) {
    bootstrapPromise = null;
    throw error;
  }
};

const initializeDatabase = async (): Promise<void> => {
  await ensureSqliteParentDirectory();

  // Ensure tables/indexes exist when running in serverless environments.
  await prisma.$executeRawUnsafe(
    'CREATE TABLE IF NOT EXISTS "User" ("id" TEXT NOT NULL PRIMARY KEY, "name" TEXT NOT NULL, "email" TEXT NOT NULL, "role" TEXT NOT NULL CHECK ("role" IN (\'viewer\',\'analyst\',\'admin\')), "isActive" INTEGER NOT NULL DEFAULT 1, "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP)',
  );

  await prisma.$executeRawUnsafe(
    'CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email")',
  );

  await prisma.$executeRawUnsafe(
    'CREATE TABLE IF NOT EXISTS "FinancialRecord" ("id" TEXT NOT NULL PRIMARY KEY, "amount" REAL NOT NULL, "type" TEXT NOT NULL CHECK ("type" IN (\'income\',\'expense\')), "category" TEXT NOT NULL, "date" DATETIME NOT NULL, "description" TEXT, "createdBy" TEXT NOT NULL, "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, "deletedAt" DATETIME, CONSTRAINT "FinancialRecord_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE)',
  );

  await prisma.$executeRawUnsafe(
    'CREATE INDEX IF NOT EXISTS "FinancialRecord_date_idx" ON "FinancialRecord"("date")',
  );
  await prisma.$executeRawUnsafe(
    'CREATE INDEX IF NOT EXISTS "FinancialRecord_category_idx" ON "FinancialRecord"("category")',
  );
  await prisma.$executeRawUnsafe(
    'CREATE INDEX IF NOT EXISTS "FinancialRecord_type_idx" ON "FinancialRecord"("type")',
  );
  await prisma.$executeRawUnsafe(
    'CREATE INDEX IF NOT EXISTS "FinancialRecord_deletedAt_idx" ON "FinancialRecord"("deletedAt")',
  );

  const userCount = await prisma.user.count();

  if (userCount === 0) {
    await prisma.user.createMany({
      data: [
        {
          id: 'usr_admin',
          name: 'System Admin',
          email: 'admin@finance.local',
          role: Roles.Admin,
          isActive: true,
        },
        {
          id: 'usr_analyst',
          name: 'Finance Analyst',
          email: 'analyst@finance.local',
          role: Roles.Analyst,
          isActive: true,
        },
        {
          id: 'usr_viewer',
          name: 'Dashboard Viewer',
          email: 'viewer@finance.local',
          role: Roles.Viewer,
          isActive: true,
        },
      ],
    });
  }
};

const ensureSqliteParentDirectory = async (): Promise<void> => {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl || !databaseUrl.startsWith('file:')) {
    return;
  }

  const sqlitePath = databaseUrl.startsWith('file:/')
    ? databaseUrl.replace('file:', '')
    : path.resolve(process.cwd(), databaseUrl.replace('file:', ''));

  const dirPath = path.dirname(sqlitePath);
  await mkdir(dirPath, { recursive: true });
};
