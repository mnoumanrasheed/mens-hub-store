import "server-only";

import { getPrismaClient } from "@/lib/db/prisma";
import { AdminAuditAction } from "@/generated/prisma/enums";

export type AdminCredentials = {
  id: string;
  email: string;
  passwordHash: string;
  isActive: boolean;
  tokenVersion: number;
};

export type AuthenticatedAdmin = {
  id: string;
  email: string;
  displayName: string | null;
  tokenVersion: number;
};

export async function findAdminCredentialsByEmail(
  email: string,
): Promise<AdminCredentials | null> {
  return getPrismaClient().adminUser.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      passwordHash: true,
      isActive: true,
      tokenVersion: true,
    },
  });
}

export async function confirmAdminLogin(
  id: string,
  tokenVersion: number,
): Promise<boolean> {
  const result = await getPrismaClient().adminUser.updateMany({
    where: { id, isActive: true, tokenVersion },
    data: { lastLoginAt: new Date() },
  });
  return result.count === 1;
}

export async function findActiveAdminById(
  id: string,
): Promise<AuthenticatedAdmin | null> {
  return getPrismaClient().adminUser.findFirst({
    where: { id, isActive: true },
    select: {
      id: true,
      email: true,
      displayName: true,
      tokenVersion: true,
    },
  });
}

export async function revokeAdminSessions(
  id: string,
  tokenVersion: number,
): Promise<boolean> {
  const result = await getPrismaClient().adminUser.updateMany({
    where: { id, isActive: true, tokenVersion },
    data: { tokenVersion: { increment: 1 } },
  });
  return result.count === 1;
}

export async function recordAdminAudit(
  action: AdminAuditAction,
  adminId?: string,
  entityId?: string,
): Promise<void> {
  await getPrismaClient().adminAuditLog.create({
    data: { action, adminId, entityId },
  });
}
