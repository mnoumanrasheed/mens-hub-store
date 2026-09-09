import "server-only";

import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "@/generated/prisma/client";
import { databaseEnvSchema } from "@/validation/env";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  const { DATABASE_URL } = databaseEnvSchema.parse(process.env);
  const adapter = new PrismaPg({ connectionString: DATABASE_URL });

  return new PrismaClient({ adapter });
}

export function getPrismaClient(): PrismaClient {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createPrismaClient();
  }

  return globalForPrisma.prisma;
}
