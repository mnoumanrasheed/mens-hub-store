import { jwtVerify, SignJWT } from "jose";
import { z } from "zod";

import {
  ADMIN_SESSION_ALGORITHM,
  ADMIN_SESSION_AUDIENCE,
  ADMIN_SESSION_ISSUER,
  ADMIN_SESSION_SECONDS,
} from "./constants";

const adminSessionClaimsSchema = z.object({
  sub: z.string().min(1),
  role: z.literal("admin"),
  tokenVersion: z.number().int().nonnegative(),
  jti: z.string().min(1),
  iat: z.number().int(),
  exp: z.number().int(),
});

export type AdminSessionIdentity = {
  adminId: string;
  tokenVersion: number;
};

export type AdminSessionClaims = z.infer<typeof adminSessionClaimsSchema>;

export async function signAdminSessionToken(
  identity: AdminSessionIdentity,
  secret: Uint8Array,
  now = new Date(),
): Promise<string> {
  const issuedAt = Math.floor(now.getTime() / 1000);

  return new SignJWT({
    role: "admin",
    tokenVersion: identity.tokenVersion,
  })
    .setProtectedHeader({ alg: ADMIN_SESSION_ALGORITHM, typ: "JWT" })
    .setSubject(identity.adminId)
    .setIssuer(ADMIN_SESSION_ISSUER)
    .setAudience(ADMIN_SESSION_AUDIENCE)
    .setJti(crypto.randomUUID())
    .setIssuedAt(issuedAt)
    .setExpirationTime(issuedAt + ADMIN_SESSION_SECONDS)
    .sign(secret);
}

export async function verifyAdminSessionToken(
  token: string,
  secret: Uint8Array,
  now = new Date(),
): Promise<AdminSessionClaims | null> {
  try {
    const { payload } = await jwtVerify(token, secret, {
      algorithms: [ADMIN_SESSION_ALGORITHM],
      audience: ADMIN_SESSION_AUDIENCE,
      issuer: ADMIN_SESSION_ISSUER,
      currentDate: now,
    });
    const result = adminSessionClaimsSchema.safeParse(payload);
    return result.success ? result.data : null;
  } catch {
    return null;
  }
}
