import "server-only";

import { cookies } from "next/headers";

import {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_SECONDS,
  getAdminSessionCookieOptions,
} from "@/lib/auth/constants";
import { getSessionSecret } from "@/lib/auth/session-secret";
import {
  signAdminSessionToken,
  verifyAdminSessionToken,
  type AdminSessionClaims,
  type AdminSessionIdentity,
} from "@/lib/auth/session-token";

export async function readAdminSession(): Promise<AdminSessionClaims | null> {
  const token = (await cookies()).get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) {
    return null;
  }

  return verifyAdminSessionToken(token, getSessionSecret());
}

export async function createAdminSession(
  identity: AdminSessionIdentity,
): Promise<void> {
  const token = await signAdminSessionToken(identity, getSessionSecret());
  const cookieStore = await cookies();

  cookieStore.set(ADMIN_SESSION_COOKIE, token, {
    ...getAdminSessionCookieOptions(),
    maxAge: ADMIN_SESSION_SECONDS,
  });
}

export async function deleteAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, "", {
    ...getAdminSessionCookieOptions(),
    maxAge: 0,
  });
}
