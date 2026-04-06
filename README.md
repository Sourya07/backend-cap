# Finance Data Processing and Access Control Backend

A senior-style backend implementation for the internship assignment using **Express + TypeScript** with role-based access control, validation, persistence, and dashboard analytics.

## Features

- User management with role assignment and active/inactive status
- Role-based access control (`viewer`, `analyst`, `admin`)
- Financial record CRUD with filtering and pagination
- Dashboard APIs for totals, category summaries, trends, and recent activity
- Input validation using Zod
- Consistent error handling and status codes
- Prisma ORM with SQLite persistence (`prisma/dev.db`)
- Clear architecture with routes/services/repositories separation

## Tech Stack

- Express (ES module imports)
- TypeScript (strict)
- Prisma ORM
- Zod
- Node.js

## Project Structure

```text
src/
  app.ts
  server.ts
  config/
  constants/
  domain/
  middlewares/
  repositories/
  routes/
  schemas/
  scripts/
  services/
  types/
  utils/
docs/
prisma/
```

## Setup

```bash
npm install
npm run db:init
npm run seed
npm run dev
```

Server runs on `http://localhost:4000` by default.

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Compile TypeScript to `dist`
- `npm run start` - Run compiled server
- `npm run check` - Type-check project
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:push` - Sync Prisma schema to SQLite
- `npm run prisma:migrate` - Run migration workflow
- `npm run db:init` - Initialize SQLite schema from SQL bootstrap file
- `npm run seed` - Seed demo users and financial records

## Authentication (Mock)

Protected APIs expect:

```http
x-user-id: <user-id>
```

Seeded users:

- `usr_admin`
- `usr_analyst`
- `usr_viewer`

## API Docs

See:

- `docs/README.md`
- `docs/architecture.md`
- `docs/api.md`
- `docs/assumptions-and-tradeoffs.md`

## Assignment Mapping

1. User and Role Management: Implemented under `/api/users` with role/status updates.
2. Financial Records Management: Implemented under `/api/records` with full CRUD + filtering.
3. Dashboard Summary APIs: Implemented under `/api/dashboard`.
4. Access Control Logic: Enforced through `authenticate` and `authorize` middleware.
5. Validation and Error Handling: Implemented through Zod + centralized error middleware.
6. Data Persistence: Prisma ORM with SQLite at `prisma/dev.db`.
