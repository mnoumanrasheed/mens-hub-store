import { describe, expect, it } from "vitest";
import { productFormSchema } from "@/validation/product-admin";

const valid = { name: "Oxford Shirt", sku: "OX-101", categoryId: "category", subcategoryId: null, originalPrice: "2500", salePrice: null, stock: 3, isPublished: false, isFeatured: false, isNewArrival: false, sizes: [], colors: [] };

describe("product admin SKU validation", () => {
  it("requires a tag number", () => {
    expect(productFormSchema.safeParse({ ...valid, sku: "" }).success).toBe(false);
  });
  it("rejects a whitespace-only tag number", () => {
    const result = productFormSchema.safeParse({ ...valid, sku: "   " });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.issues[0]?.message).toBe("SKU / Tag Number is required.");
  });
});
