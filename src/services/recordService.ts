import type {
  FinancialRecord,
  PaginatedResult,
  Pagination,
  RecordFilters,
  RecordType,
} from '../domain/models.js';
import { recordRepository } from '../repositories/recordRepository.js';
import { userService } from './userService.js';
import { HttpError } from '../utils/httpError.js';

interface CreateRecordPayload {
  amount: number;
  type: RecordType;
  category: string;
  date: string;
  description?: string;
}

interface UpdateRecordPayload {
  amount?: number;
  type?: RecordType;
  category?: string;
  date?: string;
  description?: string;
}

export class RecordService {
  async createRecord(payload: CreateRecordPayload, createdBy: string): Promise<FinancialRecord> {
    await userService.getActiveUserById(createdBy);
    return recordRepository.create({ ...payload, createdBy });
  }

  async getRecordById(recordId: string): Promise<FinancialRecord> {
    const record = await recordRepository.findById(recordId);

    if (!record) {
      throw new HttpError(404, 'Record not found');
    }

    return record;
  }

  async listRecords(
    filters: RecordFilters,
    pagination: Pagination,
  ): Promise<PaginatedResult<FinancialRecord>> {
    const records = await recordRepository.listActive();

    const filtered = records
      .filter((record) => {
        if (filters.type && record.type !== filters.type) {
          return false;
        }

        if (filters.category && record.category.toLowerCase() !== filters.category.toLowerCase()) {
          return false;
        }

        if (filters.startDate && record.date < filters.startDate) {
          return false;
        }

        if (filters.endDate && record.date > filters.endDate) {
          return false;
        }

        if (filters.minAmount !== undefined && record.amount < filters.minAmount) {
          return false;
        }

        if (filters.maxAmount !== undefined && record.amount > filters.maxAmount) {
          return false;
        }

        return true;
      })
      .sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt));

    const { page, pageSize } = pagination;
    const total = filtered.length;
    const totalPages = total === 0 ? 0 : Math.ceil(total / pageSize);
    const start = (page - 1) * pageSize;
    const items = filtered.slice(start, start + pageSize);

    return {
      items,
      total,
      page,
      pageSize,
      totalPages,
    };
  }

  async updateRecord(recordId: string, payload: UpdateRecordPayload): Promise<FinancialRecord> {
    const updated = await recordRepository.update(recordId, payload);

    if (!updated) {
      throw new HttpError(404, 'Record not found');
    }

    return updated;
  }

  async deleteRecord(recordId: string): Promise<void> {
    const deleted = await recordRepository.softDelete(recordId);

    if (!deleted) {
      throw new HttpError(404, 'Record not found');
    }
  }
}

export const recordService = new RecordService();
