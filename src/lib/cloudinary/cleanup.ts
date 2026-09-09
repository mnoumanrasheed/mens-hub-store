import "server-only";

import { deleteCategoryImage, deleteContentImage, deleteProductImage } from "@/lib/cloudinary/images";
import { getPrismaClient } from "@/lib/db/prisma";

export type ManagedImageKind = "category" | "content" | "product";
const deleters = { category: deleteCategoryImage, content: deleteContentImage, product: deleteProductImage };

function errorText(error: unknown) { return (error instanceof Error ? error.message : "Unknown Cloudinary cleanup failure").slice(0, 1000); }

export async function deleteOrQueueManagedImage(kind: ManagedImageKind, publicId: string): Promise<void> {
  try { await deleters[kind](publicId); await getPrismaClient().mediaCleanupJob.deleteMany({ where: { publicId } }); }
  catch (error) { await getPrismaClient().mediaCleanupJob.upsert({ where: { publicId }, create: { publicId, kind, attempts: 1, lastError: errorText(error), nextAttempt: new Date(Date.now() + 5 * 60_000) }, update: { kind, attempts: { increment: 1 }, lastError: errorText(error), nextAttempt: new Date(Date.now() + 5 * 60_000) } }); }
}

export async function retryDueMediaCleanupJobs(limit = 5): Promise<void> {
  const prisma = getPrismaClient();
  const jobs = await prisma.mediaCleanupJob.findMany({ where: { nextAttempt: { lte: new Date() } }, orderBy: { nextAttempt: "asc" }, take: limit, select: { id: true, publicId: true, kind: true, attempts: true } });
  for (const job of jobs) {
    if (!(job.kind in deleters)) { await prisma.mediaCleanupJob.update({ where: { id: job.id }, data: { attempts: { increment: 1 }, lastError: "Unknown managed image kind", nextAttempt: new Date(Date.now() + 24 * 60 * 60_000) } }); continue; }
    try { await deleters[job.kind as ManagedImageKind](job.publicId); await prisma.mediaCleanupJob.delete({ where: { id: job.id } }); }
    catch (error) { const delayMinutes = Math.min(24 * 60, 5 * 2 ** Math.min(job.attempts, 8)); await prisma.mediaCleanupJob.update({ where: { id: job.id }, data: { attempts: { increment: 1 }, lastError: errorText(error), nextAttempt: new Date(Date.now() + delayMinutes * 60_000) } }); }
  }
}
