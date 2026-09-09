export const ADMIN_SESSION_COOKIE = "mh_admin_session";
export const ADMIN_SESSION_SECONDS = 10 * 60 * 60;
export const ADMIN_SESSION_ISSUER = "mens-hub-web";
export const ADMIN_SESSION_AUDIENCE = "mens-hub-admin";
export const ADMIN_SESSION_ALGORITHM = "HS256";

export function getAdminSessionCookieOptions(
  environment = process.env.NODE_ENV,
) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: environment === "production",
    path: "/",
    priority: "high" as const,
  };
}
