import { describe, expect, it } from "vitest";

import { getAdminSessionCookieOptions } from "./constants";
import { sessionMatchesAdmin } from "./authorization";

describe("admin authorization", () => {
  const session = { sub: "admin_1", tokenVersion: 2 };

  it("accepts only the matching current token version", () => {
    expect(
      sessionMatchesAdmin(session, { id: "admin_1", tokenVersion: 2 }),
    ).toBe(true);
    expect(
      sessionMatchesAdmin(session, { id: "admin_1", tokenVersion: 3 }),
    ).toBe(false);
  });

  it("rejects a missing or different administrator", () => {
    expect(sessionMatchesAdmin(session, null)).toBe(false);
    expect(
      sessionMatchesAdmin(session, { id: "admin_2", tokenVersion: 2 }),
    ).toBe(false);
  });
});

describe("admin session cookie options", () => {
  it("uses the required production security attributes", () => {
    expect(getAdminSessionCookieOptions("production")).toEqual({
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      path: "/",
      priority: "high",
    });
  });

  it("permits local HTTP development without weakening production", () => {
    expect(getAdminSessionCookieOptions("development").secure).toBe(false);
  });
});
