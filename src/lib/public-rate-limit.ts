import "server-only";

import { createHmac } from "node:crypto";
import { getPrismaClient } from "@/lib/db/prisma";
import { sessionEnvSchema } from "@/validation/env";

type RateLimitRow = { count: number };

function requestKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const address = forwarded || request.headers.get("x-real-ip")?.trim() || "unknown";
  const { SESSION_SECRET } = sessionEnvSchema.parse(process.env);
  return createHmac("sha256", SESSION_SECRET).update(address).digest("base64url");
}

export async function acceptPublicRequest(
  request: Request,
  scope: "analytics" | "search" | "whatsapp",
  maximum: number,
  windowMs = 60_000,
): Promise<boolean> {
  const prisma = getPrismaClient();
  const now = new Date();
  const cutoff = new Date(now.getTime() - windowMs);
  const rows = await prisma.$queryRaw<RateLimitRow[]>`
    INSERT INTO "PublicRateLimit" ("scope", "keyHash", "count", "windowStartedAt", "updatedAt")
    VALUES (${scope}, ${requestKey(request)}, 1, ${now}, ${now})
    ON CONFLICT ("scope", "keyHash") DO UPDATE SET
      "count" = CASE
        WHEN "PublicRateLimit"."windowStartedAt" <= ${cutoff} THEN 1
        ELSE "PublicRateLimit"."count" + 1
      END,
      "windowStartedAt" = CASE
        WHEN "PublicRateLimit"."windowStartedAt" <= ${cutoff} THEN ${now}
        ELSE "PublicRateLimit"."windowStartedAt"
      END,
      "updatedAt" = ${now}
    RETURNING "count"
  `;
  return (rows[0]?.count ?? maximum + 1) <= maximum;
}
