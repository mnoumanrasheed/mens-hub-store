import { describe, expect, it } from "vitest";

import { loginSchema } from "./auth";

describe("loginSchema", () => {
  it("normalizes a valid administrator email", () => {
    const result = loginSchema.parse({
      email: "  ADMIN@Example.COM ",
      password: "private-password",
    });
    expect(result.email).toBe("admin@example.com");
  });

  it("rejects malformed credentials", () => {
    expect(
      loginSchema.safeParse({ email: "not-an-email", password: "" }).success,
    ).toBe(false);
  });
});
