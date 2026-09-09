import { describe, expect, it } from "vitest";
import { cartLineId, readCart, writeCart, type CartLine, type StorageLike } from "@/domain/commerce/storage";

function memoryStorage(): StorageLike {
  const values = new Map<string, string>();
  return { getItem: (key) => values.get(key) ?? null, setItem: (key, value) => { values.set(key, value); } };
}

const line: CartLine = { lineId: cartLineId("p1", "M", "Black"), id: "p1", slug: "shirt", name: "Oxford Shirt", sku: "MH-01", imageUrl: "/shirt.jpg", price: "2500.00", availableStock: 3, sizes: ["M"], colors: ["Black"], productUrl: "https://example.com/product/shirt", selectedSize: "M", selectedColor: "Black", quantity: 2 };

describe("cart persistence", () => {
  it("restores valid cart lines after a fresh read", () => { const storage = memoryStorage(); writeCart(storage, [line]); expect(readCart(storage)).toEqual([line]); });
  it("uses product, size, and color for line identity", () => { expect(cartLineId("p1", "M", "Black")).not.toBe(cartLineId("p1", "L", "Black")); expect(cartLineId("p1", "M", "Black")).not.toBe(cartLineId("p1", "M", "Blue")); });
  it("clamps unsafe quantities to available stock and never below one", () => { const storage = memoryStorage(); storage.setItem("mens-hub:cart:v1", JSON.stringify([{ ...line, quantity: 99 }, { ...line, selectedColor: "Blue", quantity: -4 }])); expect(readCart(storage).map((item) => item.quantity)).toEqual([3, 1]); });
  it("fails closed for corrupt browser storage", () => { const storage = memoryStorage(); storage.setItem("mens-hub:cart:v1", "not-json"); expect(readCart(storage)).toEqual([]); });
});
