import { describe, expect, it } from "vitest";

import { ADMIN_SESSION_SECONDS } from "./constants";
import {
  signAdminSessionToken,
  verifyAdminSessionToken,
} from "./session-token";

const secret = new TextEncoder().encode(
  "test-only-session-secret-with-at-least-32-characters",
);
const otherSecret = new TextEncoder().encode(
  "different-test-session-secret-at-least-32-characters",
);
const issuedAt = new Date("2026-09-08T12:00:00.000Z");

describe("admin session tokens", () => {
  it("signs and verifies the minimal admin claims", async () => {
    const token = await signAdminSessionToken(
      { adminId: "admin_1", tokenVersion: 3 },
      secret,
      issuedAt,
    );
    const claims = await verifyAdminSessionToken(token, secret, issuedAt);

    expect(claims).toMatchObject({
      sub: "admin_1",
      role: "admin",
      tokenVersion: 3,
    });
  });

  it("rejects tampered signatures and expired tokens", async () => {
    const token = await signAdminSessionToken(
      { adminId: "admin_1", tokenVersion: 0 },
      secret,
      issuedAt,
    );
    const afterExpiry = new Date(
      issuedAt.getTime() + (ADMIN_SESSION_SECONDS + 1) * 1000,
    );

    expect(await verifyAdminSessionToken(token, otherSecret, issuedAt)).toBeNull();
    expect(await verifyAdminSessionToken(token, secret, afterExpiry)).toBeNull();
  });
});
