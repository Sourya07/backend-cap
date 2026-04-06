# Assumptions and Tradeoffs

## Assumptions

- Authentication is mocked via `x-user-id` header for assignment simplicity.
- `viewer` can access dashboard insights but cannot access raw records.
- `analyst` can read records and dashboard insights.
- `admin` can manage users and full record lifecycle.
- Dates are accepted in `YYYY-MM-DD` format.

## Tradeoffs

- SQLite with Prisma was chosen for a balance of simplicity and real ORM patterns.
- A repository layer is retained so DB technology can still be swapped later.
- Token-based auth (JWT/session) is intentionally omitted to keep focus on core assignment goals.

## What To Improve For Production

- Move to PostgreSQL or MySQL with migrations.
- Add real authentication + password handling.
- Add request rate limiting and audit logs.
- Add automated tests (unit + integration).
- Add OpenAPI spec and request tracing.
