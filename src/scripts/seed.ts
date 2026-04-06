import { prisma } from '../lib/prisma.js';
import { Roles } from '../constants/roles.js';
import { RecordTypes } from '../domain/models.js';

const users = [
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
];

const records = [
  {
    id: 'rec_salary_mar',
    amount: 5000,
    type: RecordTypes.Income,
    category: 'salary',
    date: '2026-03-01',
    description: 'Monthly salary credit',
    createdBy: 'usr_admin',
  },
  {
    id: 'rec_freelance_mar',
    amount: 1300,
    type: RecordTypes.Income,
    category: 'freelance',
    date: '2026-03-12',
    description: 'Consulting payout',
    createdBy: 'usr_admin',
  },
  {
    id: 'rec_rent_mar',
    amount: 1200,
    type: RecordTypes.Expense,
    category: 'rent',
    date: '2026-03-05',
    description: 'Monthly house rent',
    createdBy: 'usr_admin',
  },
  {
    id: 'rec_grocery_mar',
    amount: 340,
    type: RecordTypes.Expense,
    category: 'groceries',
    date: '2026-03-10',
    description: 'Weekly grocery shopping',
    createdBy: 'usr_admin',
  },
  {
    id: 'rec_salary_apr',
    amount: 5000,
    type: RecordTypes.Income,
    category: 'salary',
    date: '2026-04-01',
    description: 'Monthly salary credit',
    createdBy: 'usr_admin',
  },
  {
    id: 'rec_dividend_apr',
    amount: 420,
    type: RecordTypes.Income,
    category: 'investments',
    date: '2026-04-04',
    description: 'Dividend received',
    createdBy: 'usr_admin',
  },
  {
    id: 'rec_utilities_apr',
    amount: 190,
    type: RecordTypes.Expense,
    category: 'utilities',
    date: '2026-04-03',
    description: 'Electricity and internet bill',
    createdBy: 'usr_admin',
  },
  {
    id: 'rec_transport_apr',
    amount: 140,
    type: RecordTypes.Expense,
    category: 'transport',
    date: '2026-04-05',
    description: 'Commute and ride-share',
    createdBy: 'usr_admin',
  },
];

const toDbDate = (date: string): Date => new Date(`${date}T00:00:00.000Z`);

const run = async (): Promise<void> => {
  await prisma.financialRecord.deleteMany();
  await prisma.user.deleteMany();

  await prisma.user.createMany({
    data: users,
  });

  await prisma.financialRecord.createMany({
    data: records.map((record) => ({
      ...record,
      date: toDbDate(record.date),
    })),
  });

  console.log('Seeded Prisma database at prisma/dev.db');
};

run()
  .catch((error) => {
    console.error('Failed to seed data:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
