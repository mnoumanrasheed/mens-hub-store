CREATE TABLE "PublicRateLimit" (
    "scope" TEXT NOT NULL,
    "keyHash" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "windowStartedAt" TIMESTAMPTZ(3) NOT NULL,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,
    CONSTRAINT "PublicRateLimit_pkey" PRIMARY KEY ("scope", "keyHash")
);

CREATE INDEX "PublicRateLimit_updatedAt_idx" ON "PublicRateLimit"("updatedAt");
