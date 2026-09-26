import { describe, expect, it } from "vitest";
import { cartLineId, parseCart, readCart, writeCart, type CartLine } from "@/domain/commerce/storage";
function storage() { const values = new Map<string, string>(); return { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => { values.set(key, value); } }; }
const line: CartLine = { lineId: cartLineId("p1", "M", "Black"), id: "p1", name: "Oxford Shirt", imageUrl: "/shirt.jpg", price: "2500.00", availableStock: 3, sizes: ["M"], colors: ["Black"], productUrl: "https://example.com/product/p1", selectedSize: "M", selectedColor: "Black", quantity: 2 };
describe("cart persistence", () => {
  it("restores valid cart lines after a fresh read", () => { const value = storage(); writeCart(value, [line]); expect(readCart(value)).toEqual([line]); });
  it("drops unavailable lines", () => { expect(parseCart(JSON.stringify([{ ...line, availableStock: 0 }]))).toEqual([]); });
});
