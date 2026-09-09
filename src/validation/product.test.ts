import { describe, expect, it } from "vitest";

import { inventorySchema } from "./product";

describe("inventorySchema", () => {
  it("accepts unallocated inventory", () => {
    expect(
      inventorySchema.safeParse({
        totalArticles: 10,
        availableArticles: 6,
        soldArticles: 3,
      }).success,
    ).toBe(true);
  });

  it("rejects negative and internally inconsistent inventory", () => {
    expect(
      inventorySchema.safeParse({
        totalArticles: 10,
        availableArticles: 8,
        soldArticles: 3,
      }).success,
    ).toBe(false);
    expect(
      inventorySchema.safeParse({
        totalArticles: -1,
        availableArticles: 0,
        soldArticles: 0,
      }).success,
    ).toBe(false);
  });
});
