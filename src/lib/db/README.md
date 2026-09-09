# Database boundary

`prisma.ts` owns the server-only Prisma 7 client. It uses the PostgreSQL driver adapter with pooled `DATABASE_URL` and reuses one development client across hot reloads. Data-access modules may import it; React Client Components must not.
