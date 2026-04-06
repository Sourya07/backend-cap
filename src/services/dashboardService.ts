import type { FinancialRecord } from '../domain/models.js';
import { recordRepository } from '../repositories/recordRepository.js';

interface TrendPoint {
  period: string;
  income: number;
  expense: number;
  net: number;
}

interface DashboardOverview {
  totals: {
    income: number;
    expense: number;
    netBalance: number;
  };
  categoryTotals: Array<{
    category: string;
    income: number;
    expense: number;
    net: number;
  }>;
  recentActivity: FinancialRecord[];
}

export class DashboardService {
  async getOverview(limit = 10): Promise<DashboardOverview> {
    const records = await recordRepository.listActive();

    const totals = records.reduce(
      (acc, record) => {
        if (record.type === 'income') {
          acc.income += record.amount;
        } else {
          acc.expense += record.amount;
        }

        return acc;
      },
      { income: 0, expense: 0 },
    );

    const categoryMap = new Map<string, { income: number; expense: number }>();

    for (const record of records) {
      const key = record.category.trim().toLowerCase();
      const existing = categoryMap.get(key) ?? { income: 0, expense: 0 };

      if (record.type === 'income') {
        existing.income += record.amount;
      } else {
        existing.expense += record.amount;
      }

      categoryMap.set(key, existing);
    }

    const categoryTotals = Array.from(categoryMap.entries())
      .map(([category, value]) => ({
        category,
        income: value.income,
        expense: value.expense,
        net: value.income - value.expense,
      }))
      .sort((a, b) => b.net - a.net);

    const recentActivity = [...records]
      .sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt))
      .slice(0, limit);

    return {
      totals: {
        income: roundCurrency(totals.income),
        expense: roundCurrency(totals.expense),
        netBalance: roundCurrency(totals.income - totals.expense),
      },
      categoryTotals: categoryTotals.map((entry) => ({
        category: entry.category,
        income: roundCurrency(entry.income),
        expense: roundCurrency(entry.expense),
        net: roundCurrency(entry.net),
      })),
      recentActivity,
    };
  }

  async getMonthlyTrends(months = 6): Promise<TrendPoint[]> {
    const records = await recordRepository.listActive();
    const monthly = new Map<string, { income: number; expense: number }>();

    for (const record of records) {
      const period = record.date.slice(0, 7);
      const existing = monthly.get(period) ?? { income: 0, expense: 0 };

      if (record.type === 'income') {
        existing.income += record.amount;
      } else {
        existing.expense += record.amount;
      }

      monthly.set(period, existing);
    }

    return Array.from(monthly.entries())
      .map(([period, totals]) => ({
        period,
        income: roundCurrency(totals.income),
        expense: roundCurrency(totals.expense),
        net: roundCurrency(totals.income - totals.expense),
      }))
      .sort((a, b) => a.period.localeCompare(b.period))
      .slice(-months);
  }
}

const roundCurrency = (value: number): number => Math.round(value * 100) / 100;

export const dashboardService = new DashboardService();
