import { describe, expect, it } from "vitest";

import { getSalePresentation, isSaleActive, type SaleWindow } from "./sale";

const now = new Date("2026-09-08T12:00:00.000Z");
const validSale: SaleWindow = {
  originalPrice: "5000.00",
  salePrice: "4000.00",
  saleEnabled: true,
  saleStartAt: null,
  saleEndAt: null,
};

describe("isSaleActive", () => {
  it("accepts a valid enabled sale without a time window", () => {
    expect(isSaleActive(validSale, now)).toBe(true);
  });

  it("treats start and end instants as inclusive UTC boundaries", () => {
    expect(
      isSaleActive(
        { ...validSale, saleStartAt: now, saleEndAt: now },
        now,
      ),
    ).toBe(true);
  });

  it("rejects disabled, missing, non-positive, and non-discounted prices", () => {
    expect(isSaleActive({ ...validSale, saleEnabled: false }, now)).toBe(false);
    expect(isSaleActive({ ...validSale, salePrice: null }, now)).toBe(false);
    expect(isSaleActive({ ...validSale, salePrice: "0" }, now)).toBe(false);
    expect(isSaleActive({ ...validSale, salePrice: "5000" }, now)).toBe(false);
  });

  it("rejects sales before their start or after their end", () => {
    expect(
      isSaleActive(
        { ...validSale, saleStartAt: new Date("2026-09-09T00:00:00Z") },
        now,
      ),
    ).toBe(false);
    expect(
      isSaleActive(
        { ...validSale, saleEndAt: new Date("2026-09-07T23:59:59Z") },
        now,
      ),
    ).toBe(false);
  });

  it("derives effective price and rounded discount without stored percentages", () => {
    expect(getSalePresentation(validSale, now)).toEqual({
      active: true,
      effectivePrice: "4000.00",
      discountPercent: 20,
    });
  });
});
