CREATE TABLE "MediaCleanupJob" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "lastError" TEXT,
    "nextAttempt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,
    CONSTRAINT "MediaCleanupJob_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "MediaCleanupJob_publicId_key" ON "MediaCleanupJob"("publicId");
CREATE INDEX "MediaCleanupJob_nextAttempt_idx" ON "MediaCleanupJob"("nextAttempt");
