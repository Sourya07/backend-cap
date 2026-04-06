# API Reference

Base URL: `http://localhost:4000`

Protected routes require header:

```http
x-user-id: <user-id>
```

Seeded users:

- `usr_admin`
- `usr_analyst`
- `usr_viewer`

## Health

### GET `/health`

Returns service liveness.

## Users (Admin)

### GET `/api/users/me`

Returns authenticated user profile.

### GET `/api/users`

List all users.

### GET `/api/users/:userId`

Get single user by ID.

### POST `/api/users`

Create user.

Request body:

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "role": "analyst",
  "isActive": true
}
```

### PATCH `/api/users/:userId`

Update user fields (`name`, `role`, `isActive`).

## Financial Records

### GET `/api/records` (Analyst, Admin)

Supports filters and pagination:

- `type`: `income | expense`
- `category`
- `startDate`
- `endDate`
- `minAmount`
- `maxAmount`
- `page` (default: `1`)
- `pageSize` (default: `20`, max `100`)

Example:

```http
GET /api/records?type=expense&startDate=2026-04-01&page=1&pageSize=10
```

### GET `/api/records/:recordId` (Analyst, Admin)

Get a single financial record.

### POST `/api/records` (Admin)

Create a financial record.

Request body:

```json
{
  "amount": 1250,
  "type": "income",
  "category": "freelance",
  "date": "2026-04-06",
  "description": "Consulting work"
}
```

### PATCH `/api/records/:recordId` (Admin)

Update any editable record field.

### DELETE `/api/records/:recordId` (Admin)

Soft deletes a record (`204 No Content`).

## Dashboard APIs

### GET `/api/dashboard/overview` (Viewer, Analyst, Admin)

Query params:

- `recentLimit` (default `10`, max `50`)

Returns:

- `totals.income`
- `totals.expense`
- `totals.netBalance`
- `categoryTotals[]`
- `recentActivity[]`

### GET `/api/dashboard/trends` (Viewer, Analyst, Admin)

Query params:

- `months` (default `6`, max `24`)

Returns monthly trend points with `income`, `expense`, and `net`.

## Error Response Format

Validation errors:

```json
{
  "error": "ValidationError",
  "message": "Request validation failed",
  "details": {}
}
```

Application/business errors:

```json
{
  "error": "ApplicationError",
  "message": "...",
  "details": null
}
```
