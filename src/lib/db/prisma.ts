import "server-only";

import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "@/generated/prisma/client";
import { databaseEnvSchema } from "@/validation/env";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  const { DATABASE_URL } = databaseEnvSchema.parse(process.env);
  const adapter = new PrismaPg({ connectionString: withVerifiedSsl(DATABASE_URL) });

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
