import { type FinancialRecord as PrismaFinancialRecord, type RecordType as PrismaRecordType } from '@prisma/client';
import type { FinancialRecord, RecordType } from '../domain/models.js';
import { prisma } from '../lib/prisma.js';

interface CreateRecordInput {
  amount: number;
  type: RecordType;
  category: string;
  date: string;
  description?: string;
  createdBy: string;
}

interface UpdateRecordInput {
  amount?: number;
  type?: RecordType;
  category?: string;
  date?: string;
  description?: string;
}

export class RecordRepository {
  async listActive(): Promise<FinancialRecord[]> {
    const records = await prisma.financialRecord.findMany({
      where: { deletedAt: null },
      orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
    });

    return records.map(mapRecord);
  }

  async findById(recordId: string): Promise<FinancialRecord | undefined> {
    const record = await prisma.financialRecord.findFirst({
      where: {
        id: recordId,
        deletedAt: null,
      },
    });

    return record ? mapRecord(record) : undefined;
  }

  async create(input: CreateRecordInput): Promise<FinancialRecord> {
    const record = await prisma.financialRecord.create({
      data: {
        amount: input.amount,
        type: input.type as PrismaRecordType,
        category: input.category,
        date: toDbDate(input.date),
        description: input.description,
        createdBy: input.createdBy,
      },
    });

    return mapRecord(record);
  }

  async update(recordId: string, input: UpdateRecordInput): Promise<FinancialRecord | undefined> {
    const existing = await prisma.financialRecord.findFirst({
      where: {
        id: recordId,
        deletedAt: null,
      },
    });

    if (!existing) {
      return undefined;
    }

    const record = await prisma.financialRecord.update({
      where: { id: recordId },
      data: {
        ...(input.amount !== undefined ? { amount: input.amount } : {}),
        ...(input.type !== undefined ? { type: input.type as PrismaRecordType } : {}),
        ...(input.category !== undefined ? { category: input.category } : {}),
        ...(input.date !== undefined ? { date: toDbDate(input.date) } : {}),
        ...(input.description !== undefined ? { description: input.description } : {}),
      },
    });

    return mapRecord(record);
  }

  async softDelete(recordId: string): Promise<boolean> {
    const existing = await prisma.financialRecord.findFirst({
      where: {
        id: recordId,
        deletedAt: null,
      },
    });

    if (!existing) {
      return false;
    }

    await prisma.financialRecord.update({
      where: { id: recordId },
      data: {
        deletedAt: new Date(),
      },
    });

    return true;
  }
}

export const recordRepository = new RecordRepository();

const mapRecord = (record: PrismaFinancialRecord): FinancialRecord => ({
  id: record.id,
  amount: Number(record.amount),
  type: record.type as RecordType,
  category: record.category,
  date: toApiDate(record.date),
  description: record.description ?? undefined,
  createdBy: record.createdBy,
  createdAt: record.createdAt.toISOString(),
  updatedAt: record.updatedAt.toISOString(),
  deletedAt: record.deletedAt?.toISOString(),
});

const toDbDate = (date: string): Date => new Date(`${date}T00:00:00.000Z`);
const toApiDate = (date: Date): string => date.toISOString().slice(0, 10);
