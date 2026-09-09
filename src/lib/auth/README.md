# Authentication boundary

Phase 3 implements signed-token primitives, server-only cookie/session helpers, PostgreSQL-backed login throttling, and database-backed `requireAdmin()` here. `src/proxy.ts` imports only token verification, constants, and environment validation; it never imports Prisma or the database-backed authorization helper.
