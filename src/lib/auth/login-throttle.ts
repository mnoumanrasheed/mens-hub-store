import "server-only";

import { createHmac } from "node:crypto";

import { getPrismaClient } from "@/lib/db/prisma";
import { getSessionSecret } from "@/lib/auth/session-secret";

const WINDOW_MILLISECONDS = 15 * 60 * 1000;
const BLOCK_MILLISECONDS = 15 * 60 * 1000;
const ACCOUNT_SOURCE_ATTEMPT_LIMIT = 5;
const SOURCE_ATTEMPT_LIMIT = 20;
const MAX_PROGRESSIVE_DELAY_MILLISECONDS = 750;

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
      // Scope account throttling to the request source. A stranger who knows an
      // administrator's email cannot lock that account from another network.
      keyHash: hashIdentifier(`account-source:${identity.email}:${identity.source}`),
      limit: ACCOUNT_SOURCE_ATTEMPT_LIMIT,
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

  const attemptsInCurrentWindow = records.reduce((maximum, record) => {
    const inCurrentWindow =
      now.getTime() - record.windowStartedAt.getTime() < WINDOW_MILLISECONDS;
    return inCurrentWindow ? Math.max(maximum, record.attempts) : maximum;
  }, 0);
  if (attemptsInCurrentWindow > 0) {
    await new Promise((resolve) => {
      setTimeout(resolve, Math.min(
        MAX_PROGRESSIVE_DELAY_MILLISECONDS,
        attemptsInCurrentWindow * 150,
      ));
    });
  }

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

  // Serializable transactions prevent concurrent attempts from observing the
  // same counter and both writing a lower value. PostgreSQL may reject a
  // conflicting transaction, so retry its small, idempotent update.
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
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
      }, { isolationLevel: "Serializable" });
      return;
    } catch (error) {
      const isSerializationFailure =
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        error.code === "P2034";
      if (!isSerializationFailure || attempt === 2) throw error;
    }
  }
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
