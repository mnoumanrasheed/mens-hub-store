import { describe, expect, it } from "vitest";
import { createCartInquiryMessage, createProductInquiryMessage } from "@/domain/whatsapp/product-inquiry";

const customer = { fullName: "Muhammad Ali", phone: "03001234567", address: "House 10, DHA", city: "Lahore", email: undefined, notes: undefined };

describe("WhatsApp order intent", () => {
  it("places the tag directly below the product and includes customer details", () => {
    const message = createProductInquiryMessage({ name: "Cotton Shirt", sku: "WW-104", size: "xl", color: "black", quantity: 2, unitPrice: "2500.00", productUrl: "https://mens-hub-store.vercel.app/product/product-1" }, customer);
    expect(message).toContain("Name: Muhammad Ali");
    expect(message).toContain("Product: Cotton Shirt\nTag No: WW-104\nSize: XL\nColor: Black\nQuantity: 2\nPrice: PKR 2,500\nProduct Link: https://mens-hub-store.vercel.app/product/product-1");
    expect(message).not.toContain("Email:");
    expect(message).not.toContain("Order Notes:");
  });

  it("keeps selected options and calculates a cart total", () => {
    const message = createCartInquiryMessage({ customer: { ...customer, email: "ali@example.com", notes: "Call first" }, lines: [
      { lineId: "line-1", id: "p1", name: "Oxford Shirt", sku: "OX-1", imageUrl: "/shirt.jpg", price: "2500.00", availableStock: 4, sizes: ["M"], colors: ["Black"], productUrl: "https://mens-hub-store.vercel.app/product/p1", selectedSize: "m", selectedColor: "", quantity: 2 },
      { lineId: "line-2", id: "p2", name: "Leather Belt", sku: "LB-2", imageUrl: "/belt.jpg", price: "4999.50", availableStock: 2, sizes: [], colors: ["Brown"], productUrl: "https://mens-hub-store.vercel.app/product/p2", selectedSize: "", selectedColor: "brown", quantity: 1 },
    ] });
    expect(message).toContain("Email: ali@example.com");
    expect(message).toContain("Tag No: OX-1");
    expect(message).toContain("Color: Brown");
    expect(message).toContain("Products Total: PKR 9,999.5");
    expect(message).toContain("Total: PKR 10,249.5");
    expect(message).toContain("Order Notes: Call first");
  });

  it("uses free delivery at the threshold", () => {
    const message = createProductInquiryMessage({ name: "Wool Overshirt", sku: "WO-3", quantity: 1, unitPrice: "10000", productUrl: "https://mens-hub-store.vercel.app/product/product-3" }, customer);
    expect(message).toContain("Delivery: FREE\nTotal: PKR 10,000");
  });
});
