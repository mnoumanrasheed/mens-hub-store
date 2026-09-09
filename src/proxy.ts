import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import {
  ADMIN_SESSION_COOKIE,
  getAdminSessionCookieOptions,
} from "@/lib/auth/constants";
import { verifyAdminSessionToken } from "@/lib/auth/session-token";
import { sessionEnvSchema } from "@/validation/env";

const LOGIN_PATH = "/admin/login";

function getProxySessionSecret(): Uint8Array | null {
  const result = sessionEnvSchema.safeParse(process.env);
  return result.success
    ? new TextEncoder().encode(result.data.SESSION_SECRET)
    : null;
}

function expireSessionCookie(response: NextResponse): void {
  response.cookies.set(ADMIN_SESSION_COOKIE, "", {
    ...getAdminSessionCookieOptions(),
    maxAge: 0,
  });
}

export async function proxy(request: NextRequest): Promise<NextResponse> {
  const isLoginRoute = request.nextUrl.pathname === LOGIN_PATH;
  const mustReauthenticate =
    isLoginRoute && request.nextUrl.searchParams.get("reauth") === "1";
  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;

  if (mustReauthenticate) {
    request.cookies.delete(ADMIN_SESSION_COOKIE);
    const response = NextResponse.next();
    expireSessionCookie(response);
    return response;
  }

  const secret = token ? getProxySessionSecret() : null;
  const session =
    token && secret ? await verifyAdminSessionToken(token, secret) : null;

  if (isLoginRoute) {
    if (session) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    const response = NextResponse.next();
    if (token) {
      expireSessionCookie(response);
    }
    return response;
  }

  if (!session) {
    const response = NextResponse.redirect(new URL(LOGIN_PATH, request.url));
    if (token) {
      expireSessionCookie(response);
    }
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
