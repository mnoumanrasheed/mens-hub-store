"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { compare } from "bcryptjs";

import {
  confirmAdminLogin,
  findAdminCredentialsByEmail,
  recordAdminAudit,
  revokeAdminSessions,
} from "@/data/admin";
import { AdminAuditAction } from "@/generated/prisma/enums";
import {
  clearLoginFailures,
  isLoginAllowed,
  recordLoginFailure,
} from "@/lib/auth/login-throttle";
import { requireAdmin } from "@/lib/auth/require-admin";
import {
  createAdminSession,
  deleteAdminSession,
} from "@/lib/auth/session";
import { loginSchema } from "@/validation/auth";

const INVALID_CREDENTIALS = "Invalid email or password";
const DUMMY_PASSWORD_HASH =
  "$2b$12$pMtDNSrqB12C6GPiD1V0Pe8YhlruCIBZy2s7SDR.J6cRKETMHvuH2";

export type LoginActionState = {
  error: string | null;
};

function normalizeThrottleEmail(value: FormDataEntryValue | null): string {
  return typeof value === "string"
    ? value.trim().toLowerCase().slice(0, 254)
    : "invalid";
}

async function getRequestSource(): Promise<string> {
  const requestHeaders = await headers();
  const forwardedFor = requestHeaders.get("x-forwarded-for")?.split(",")[0];
  return (forwardedFor?.trim() || "unknown").slice(0, 64);
}

export async function loginAction(
  _state: LoginActionState,
  formData: FormData,
): Promise<LoginActionState> {
  const rawEmail = formData.get("email");
  const rawPassword = formData.get("password");
  const throttleIdentity = {
    email: normalizeThrottleEmail(rawEmail),
    source: await getRequestSource(),
  };

  try {
    if (!(await isLoginAllowed(throttleIdentity))) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return { error: INVALID_CREDENTIALS };
    }

    const parsed = loginSchema.safeParse({
      email: rawEmail,
      password: rawPassword,
    });

    if (!parsed.success) {
      const password = typeof rawPassword === "string" ? rawPassword.slice(0, 256) : "";
      await compare(password, DUMMY_PASSWORD_HASH);
      await recordLoginFailure(throttleIdentity);
      await recordAdminAudit(AdminAuditAction.LOGIN_FAILURE);
      return { error: INVALID_CREDENTIALS };
    }

    const admin = await findAdminCredentialsByEmail(parsed.data.email);
    const passwordMatches = await compare(
      parsed.data.password,
      admin?.passwordHash ?? DUMMY_PASSWORD_HASH,
    );

    if (!admin || !admin.isActive || !passwordMatches) {
      await recordLoginFailure(throttleIdentity);
      await recordAdminAudit(AdminAuditAction.LOGIN_FAILURE, admin?.id);
      return { error: INVALID_CREDENTIALS };
    }

    const loginConfirmed = await confirmAdminLogin(admin.id, admin.tokenVersion);
    if (!loginConfirmed) {
      await recordLoginFailure(throttleIdentity);
      await recordAdminAudit(AdminAuditAction.LOGIN_FAILURE, admin.id);
      return { error: INVALID_CREDENTIALS };
    }

    await clearLoginFailures(throttleIdentity);
    await recordAdminAudit(AdminAuditAction.LOGIN_SUCCESS, admin.id);
    await createAdminSession({
      adminId: admin.id,
      tokenVersion: admin.tokenVersion,
    });
  } catch {
    return { error: INVALID_CREDENTIALS };
  }

  redirect("/admin");
}

export async function logoutAction(): Promise<never> {
  const admin = await requireAdmin();
  try {
    await revokeAdminSessions(admin.id, admin.tokenVersion);
    await recordAdminAudit(AdminAuditAction.LOGOUT, admin.id);
  } catch {
    // Cookie deletion still completes even if database revocation is unavailable.
  }
  await deleteAdminSession();
  redirect("/admin/login");
}
