import { describe, expect, it } from "vitest";

import { normalizeProductSizeOptions } from "@/domain/product/size-options";

describe("normalizeProductSizeOptions", () => {
  it("splits packed size labels into individually selectable options", () => {
    expect(normalizeProductSizeOptions(["m,l,xl", "S | M"])).toEqual([
      "M",
      "L",
      "XL",
      "S",
    ]);
  });

  it("supports semicolon and whitespace separators while preserving One Size", () => {
    expect(normalizeProductSizeOptions(["XS; S M", "One Size"])).toEqual([
      "XS",
      "S",
      "M",
      "ONE SIZE",
    ]);
  });

  it("handles absent and duplicate option values safely", () => {
    expect(normalizeProductSizeOptions([" M  L ", "m"])).toEqual(["M", "L"]);
    expect(normalizeProductSizeOptions(null)).toEqual([]);
  });
});
