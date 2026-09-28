import { describe, expect, it } from "vitest";
import { createCartInquiryMessage, createProductInquiryMessage } from "@/domain/whatsapp/product-inquiry";
describe("WhatsApp order intent", () => {
  it("creates a compact single-product order request", () => {
    const message = createProductInquiryMessage({ name: "Cotton Shirt", size: "xl", color: "black white", quantity: 2, unitPrice: "2500.00", productUrl: "https://mens-hub-store.vercel.app/product/product-1" });

    expect(message).toContain("*MEN\u2019S HUB* | _Premium Menswear_\n*ORDER REQUEST*");
    expect(message).toContain("*ITEM 01*\nCotton Shirt\nSize: XL | Color: Black / White");
    expect(message).toContain("Qty: 2 | Price: PKR 2,500");
    expect(message).toContain("Product: https://mens-hub-store.vercel.app/product/product-1");
    expect(message).toContain("Subtotal: *PKR 5,000*\nDelivery: *PKR 250*\n*TOTAL: PKR 5,250*");
    expect(message).not.toContain("\n\n");
    expect(message).not.toContain(".00");
    expect(message).not.toContain("SKU");
  });

  it("numbers cart items and omits unavailable selections", () => {
    const message = createCartInquiryMessage({ lines: [
      { lineId: "line-1", id: "p1", name: "Oxford Shirt", imageUrl: "/shirt.jpg", price: "2500.00", availableStock: 4, sizes: ["M"], colors: ["Black"], productUrl: "https://mens-hub-store.vercel.app/product/p1", selectedSize: "m", selectedColor: "", quantity: 2 },
      { lineId: "line-2", id: "p2", name: "Leather Belt", imageUrl: "/belt.jpg", price: "4999.50", availableStock: 2, sizes: [], colors: ["Brown"], productUrl: "https://mens-hub-store.vercel.app/product/p2", selectedSize: "", selectedColor: "brown", quantity: 1 },
    ] });

    expect(message).toContain("*ITEM 01*");
    expect(message).toContain("*ITEM 02*");
    expect(message).toContain("Size: M");
    expect(message).toContain("Color: Brown");
    expect(message).toContain("Subtotal: *PKR 9,999.5*\nDelivery: *PKR 250*\n*TOTAL: PKR 10,249.5*");
    expect(message).not.toContain("Not applicable");
  });

  it("uses free delivery at the threshold", () => {
    const message = createProductInquiryMessage({ name: "Wool Overshirt", quantity: 1, unitPrice: "10000", productUrl: "https://mens-hub-store.vercel.app/product/product-3" });

    expect(message).toContain("Subtotal: *PKR 10,000*\nDelivery: *FREE*\n*TOTAL: PKR 10,000*");
  });
});
