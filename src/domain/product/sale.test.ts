import { describe, expect, it } from "vitest";
import { getSalePresentation, isSaleActive } from "@/domain/product/sale";
describe("sale presentation", () => {
  it("derives a valid sale from sale price", () => { const sale = { originalPrice: "100.00", salePrice: "75.00" }; expect(isSaleActive(sale)).toBe(true); expect(getSalePresentation(sale).discountPercent).toBe(25); });
  it("rejects missing, zero, and non-discounted prices", () => { expect(isSaleActive({ originalPrice: "100.00", salePrice: null })).toBe(false); expect(isSaleActive({ originalPrice: "100.00", salePrice: "0" })).toBe(false); expect(isSaleActive({ originalPrice: "100.00", salePrice: "100.00" })).toBe(false); });
});
