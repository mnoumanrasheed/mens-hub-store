import { describe, expect, it } from "vitest";
import { getProductUrl } from "@/lib/product-url";

describe("product URL", () => {
  it("uses the real product detail route and encodes its id", () => {
    expect(getProductUrl({ id: "shirt / blue" }, new URL("https://shop.example.com/base/"))).toBe("https://shop.example.com/product/shirt%20%2F%20blue");
  });
  it("returns an absolute URL without double slashes from a trailing-slash origin", () => {
    const url = getProductUrl({ id: "p-1" }, new URL("https://shop.example.com/"));
    expect(new URL(url).origin).toBe("https://shop.example.com");
    expect(url).toBe("https://shop.example.com/product/p-1");
  });
  it("never falls back to localhost when supplied a production origin", () => {
    expect(getProductUrl({ id: "p-1" }, new URL("https://shop.example.com"))).toBe("https://shop.example.com/product/p-1");
  });
});
