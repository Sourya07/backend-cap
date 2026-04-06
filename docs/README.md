# Finance Data Backend Documentation

This folder contains project documentation for the **Finance Data Processing and Access Control Backend** assignment.

## Contents

- `architecture.md` - High-level system design and folder structure
- `api.md` - Endpoint reference with request/response examples
- `assumptions-and-tradeoffs.md` - Design decisions and implementation assumptions

## Quick Start

1. Install dependencies:

```bash
npm install
```

2. Initialize SQLite schema:

```bash
npm run db:init
```

3. Seed sample data:

```bash
npm run seed
```

4. Start dev server:

```bash
npm run dev
```

5. Health check:

```bash
curl http://localhost:4000/health
```

6. Call protected endpoint with mock user context:

```bash
curl -H "x-user-id: usr_admin" http://localhost:4000/api/dashboard/overview
```
