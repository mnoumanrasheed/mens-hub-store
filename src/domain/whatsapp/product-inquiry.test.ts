import { describe, expect, it } from "vitest";
import { createCartInquiryMessage, createProductInquiryMessage } from "@/domain/whatsapp/product-inquiry";
describe("WhatsApp order intent", () => {
  it("keeps product selections without SKU fields", () => { const message = createProductInquiryMessage({ greeting: "Greetings from Men's Hub", statement: "I would like to place this order.", name: "Cotton Shirt", size: "M", color: "Ivory", quantity: 2, unitPrice: "2500.00", productUrl: "https://menshub.example/product/product-1" }); expect(message).toContain("Product: Cotton Shirt"); expect(message).toContain("Size: M"); expect(message).not.toContain("SKU"); });
  it("includes cart lines", () => { const message = createCartInquiryMessage({ greeting: "Hello", statement: "Order", lines: [{ lineId: "line", id: "p1", name: "Oxford Shirt", imageUrl: "/shirt.jpg", price: "2500.00", availableStock: 4, sizes: ["M"], colors: ["Black"], productUrl: "https://example.com/product/p1", selectedSize: "M", selectedColor: "Black", quantity: 2 }] }); expect(message).toContain("Product: Oxford Shirt"); expect(message).toContain("Cart Subtotal: PKR 5000.00"); });
});
