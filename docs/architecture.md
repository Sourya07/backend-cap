# Architecture

## Overview

This backend follows a layered structure:

1. **Routes**: HTTP endpoint definitions and response shaping
2. **Middleware**: Authentication, authorization, validation, and centralized errors
3. **Services**: Business logic and rule enforcement
4. **Repositories**: Data access logic over Prisma ORM
5. **Database**: SQLite persistence in `prisma/dev.db`

The design keeps request handling, business rules, and persistence concerns cleanly separated.

## Tech Stack

- Node.js + Express
- TypeScript (strict mode)
- Prisma ORM
- Zod for validation
- SQLite persistence (`prisma/dev.db`)

## Access Control Model

Roles:

- `viewer`: dashboard/insight read access only
- `analyst`: viewer permissions + financial record read access
- `admin`: full access (users + records + dashboard)

Authorization is enforced server-side using middleware on each route.

## Data Model

### User

- `id`
- `name`
- `email`
- `role` (`viewer | analyst | admin`)
- `isActive`
- `createdAt`
- `updatedAt`

### FinancialRecord

- `id`
- `amount`
- `type` (`income | expense`)
- `category`
- `date` (`YYYY-MM-DD`)
- `description` (optional)
- `createdBy`
- `createdAt`
- `updatedAt`
- `deletedAt` (optional, soft delete)

## Request Flow

1. Incoming request hits route
2. Validation middleware parses and normalizes inputs
3. Authentication reads `x-user-id` and loads active user context
4. Authorization checks role permissions
5. Service executes business logic
6. Repository persists or fetches data
7. Standardized JSON response is returned

## Reliability Patterns

- Centralized error handling with consistent error shape
- Input validation for `body`, `params`, and `query`
- Soft delete for records
- Repository abstraction to isolate data access from API/business layers
