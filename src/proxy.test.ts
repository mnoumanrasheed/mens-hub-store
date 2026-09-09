import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { NextRequest } from "next/server";

import { ADMIN_SESSION_COOKIE } from "@/lib/auth/constants";
import { signAdminSessionToken } from "@/lib/auth/session-token";
import { proxy } from "./proxy";

const sessionSecret = "test-proxy-session-secret-with-at-least-32-characters";
const encodedSecret = new TextEncoder().encode(sessionSecret);
const originalSecret = process.env.SESSION_SECRET;

beforeEach(() => {
  process.env.SESSION_SECRET = sessionSecret;
});

afterEach(() => {
  if (originalSecret === undefined) {
    delete process.env.SESSION_SECRET;
  } else {
    process.env.SESSION_SECRET = originalSecret;
  }
});

describe("admin proxy", () => {
  it.each(["/admin", "/admin/products"])(
    "redirects an anonymous request for %s to login",
    async (pathname) => {
      const response = await proxy(
        new NextRequest(`https://mens-hub.example${pathname}`),
      );
      expect(response.status).toBe(307);
      expect(response.headers.get("location")).toBe(
        "https://mens-hub.example/admin/login",
      );
    },
  );

  it("allows a request carrying a valid signed session", async () => {
    const token = await signAdminSessionToken(
      { adminId: "admin_1", tokenVersion: 0 },
      encodedSecret,
    );
    const request = new NextRequest("https://mens-hub.example/admin", {
      headers: { cookie: `${ADMIN_SESSION_COOKIE}=${token}` },
    });
    const response = await proxy(request);

    expect(response.status).toBe(200);
    expect(response.headers.get("x-middleware-next")).toBe("1");
  });

  it("redirects an authenticated admin away from the login screen", async () => {
    const token = await signAdminSessionToken(
      { adminId: "admin_1", tokenVersion: 0 },
      encodedSecret,
    );
    const request = new NextRequest("https://mens-hub.example/admin/login", {
      headers: { cookie: `${ADMIN_SESSION_COOKIE}=${token}` },
    });
    const response = await proxy(request);

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(
      "https://mens-hub.example/admin",
    );
  });
});
