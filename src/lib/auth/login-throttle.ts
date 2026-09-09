import "server-only";

import { createHmac } from "node:crypto";

import { getPrismaClient } from "@/lib/db/prisma";
import { getSessionSecret } from "@/lib/auth/session-secret";

const WINDOW_MILLISECONDS = 15 * 60 * 1000;
const BLOCK_MILLISECONDS = 15 * 60 * 1000;
const EMAIL_ATTEMPT_LIMIT = 5;
const SOURCE_ATTEMPT_LIMIT = 20;

type ThrottleIdentity = {
  email: string;
  source: string;
};

type ThrottleKey = {
  keyHash: string;
  limit: number;
};

function hashIdentifier(value: string): string {
  return createHmac("sha256", getSessionSecret()).update(value).digest("hex");
}

function getThrottleKeys(identity: ThrottleIdentity): ThrottleKey[] {
  return [
    {
      keyHash: hashIdentifier(`email:${identity.email}`),
      limit: EMAIL_ATTEMPT_LIMIT,
    },
    {
      keyHash: hashIdentifier(`source:${identity.source}`),
      limit: SOURCE_ATTEMPT_LIMIT,
    },
  ];
}

export async function isLoginAllowed(
  identity: ThrottleIdentity,
  now = new Date(),
): Promise<boolean> {
  const keys = getThrottleKeys(identity);
  const records = await getPrismaClient().loginThrottle.findMany({
    where: { keyHash: { in: keys.map(({ keyHash }) => keyHash) } },
  });
  const limits = new Map(keys.map(({ keyHash, limit }) => [keyHash, limit]));

  return records.every((record) => {
    if (record.blockedUntil && record.blockedUntil > now) {
      return false;
    }

    const windowIsCurrent =
      now.getTime() - record.windowStartedAt.getTime() < WINDOW_MILLISECONDS;
    return !windowIsCurrent || record.attempts < (limits.get(record.keyHash) ?? 0);
  });
}

async function recordFailure(
  key: ThrottleKey,
  now: Date,
): Promise<void> {
  const prisma = getPrismaClient();

  await prisma.$transaction(async (transaction) => {
    const current = await transaction.loginThrottle.findUnique({
      where: { keyHash: key.keyHash },
    });
    const startsNewWindow =
      !current ||
      now.getTime() - current.windowStartedAt.getTime() >= WINDOW_MILLISECONDS;
    const attempts = startsNewWindow ? 1 : current.attempts + 1;

    await transaction.loginThrottle.upsert({
      where: { keyHash: key.keyHash },
      create: {
        keyHash: key.keyHash,
        attempts,
        windowStartedAt: now,
        blockedUntil:
          attempts >= key.limit
            ? new Date(now.getTime() + BLOCK_MILLISECONDS)
            : null,
      },
      update: {
        attempts,
        windowStartedAt: startsNewWindow
          ? now
          : (current?.windowStartedAt ?? now),
        blockedUntil:
          attempts >= key.limit
            ? new Date(now.getTime() + BLOCK_MILLISECONDS)
            : (current?.blockedUntil ?? null),
      },
    });
  });
}

export async function recordLoginFailure(
  identity: ThrottleIdentity,
  now = new Date(),
): Promise<void> {
  await Promise.all(
    getThrottleKeys(identity).map((key) => recordFailure(key, now)),
  );
}

export async function clearLoginFailures(
  identity: ThrottleIdentity,
): Promise<void> {
  await getPrismaClient().loginThrottle.deleteMany({
    where: {
      keyHash: {
        in: getThrottleKeys(identity).map(({ keyHash }) => keyHash),
      },
    },
  });
}
