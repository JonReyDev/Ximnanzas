# Optional XIMNANZAS API

This Express service is an additive backend for deployments that use PostgreSQL and Drizzle. The existing Supabase/Vercel flow remains available and is not replaced by this service.

## Environment

- `DATABASE_URL` - PostgreSQL connection string
- `PROSPECTS_ACCESS_TOKEN` - bearer token required by private list endpoints
- `PORT` - optional port, default `5000`
- `CORS_ORIGIN` - optional comma-separated allowed origins; configure this in production

## Run

```sh
npm install --prefix api-server
npm run dev --prefix api-server
```

Apply `migrations/0001_create_optional_api_tables.sql` to the PostgreSQL database before starting the service.

Public writes:

- `POST /api/prospects`
- `POST /api/appointments`

Private reads require `Authorization: Bearer <PROSPECTS_ACCESS_TOKEN>`:

- `GET /api/prospects`
- `GET /api/appointments`
