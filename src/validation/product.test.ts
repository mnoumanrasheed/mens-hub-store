import { describe, expect, it } from "vitest";
import { inventorySchema } from "@/validation/product";
describe("stock validation", () => {
  it("accepts non-negative stock", () => { expect(inventorySchema.safeParse({ stock: 10 }).success).toBe(true); });
  it("rejects negative stock", () => { expect(inventorySchema.safeParse({ stock: -1 }).success).toBe(false); });
});
