import "server-only";

import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "@/generated/prisma/client";
import { databaseEnvSchema } from "@/validation/env";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: Pool | undefined;
};

function createPrismaClient(): PrismaClient {
  const { DATABASE_URL } = databaseEnvSchema.parse(process.env);
  const connectionString = withVerifiedSsl(DATABASE_URL);

  const pool = new Pool({
    connectionString,
    max: 10,
    idleTimeoutMillis: 20000,
    connectionTimeoutMillis: 10000,
    keepAlive: true,
  });

  pool.on("error", (err) => {
    console.warn("[Prisma DB Pool] Background connection error handled:", err.message);
  });

  globalForPrisma.pool = pool;

  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

function withVerifiedSsl(connectionString: string) {
  try {
    const url = new URL(connectionString);
    if (url.protocol === "postgresql:" || url.protocol === "postgres:") {
      url.searchParams.set("sslmode", "verify-full");
      return url.toString();
    }
  } catch {
    // Preserve existing validation behavior for malformed URLs.
  }
  return connectionString;
}

export function getPrismaClient(): PrismaClient {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createPrismaClient();
  }

  return globalForPrisma.prisma;
}
