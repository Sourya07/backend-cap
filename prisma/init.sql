PRAGMA foreign_keys = OFF;
DROP TABLE IF EXISTS "FinancialRecord";
DROP TABLE IF EXISTS "User";
PRAGMA foreign_keys = ON;

CREATE TABLE "User" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "role" TEXT NOT NULL CHECK ("role" IN ('viewer','analyst','admin')),
  "isActive" INTEGER NOT NULL DEFAULT 1,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

CREATE TABLE "FinancialRecord" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "amount" REAL NOT NULL,
  "type" TEXT NOT NULL CHECK ("type" IN ('income','expense')),
  "category" TEXT NOT NULL,
  "date" DATETIME NOT NULL,
  "description" TEXT,
  "createdBy" TEXT NOT NULL,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" DATETIME,
  CONSTRAINT "FinancialRecord_createdBy_fkey"
    FOREIGN KEY ("createdBy")
    REFERENCES "User" ("id")
    ON DELETE RESTRICT
    ON UPDATE CASCADE
);

CREATE INDEX "FinancialRecord_date_idx" ON "FinancialRecord"("date");
CREATE INDEX "FinancialRecord_category_idx" ON "FinancialRecord"("category");
CREATE INDEX "FinancialRecord_type_idx" ON "FinancialRecord"("type");
CREATE INDEX "FinancialRecord_deletedAt_idx" ON "FinancialRecord"("deletedAt");
