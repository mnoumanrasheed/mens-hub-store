import { describe, expect, it } from "vitest";
import { createCartInquiryMessage, createProductInquiryMessage, createWhatsAppUrl } from "@/domain/whatsapp/product-inquiry";

describe("WhatsApp order intent", () => {
  it("keeps selections, canonical URL, and encoded content", () => {
    const message = createProductInquiryMessage({ greeting: "Greetings from Men's Hub", statement: "I would like to place this order.", name: "Cotton Shirt", sku: "SH-01", size: "M", color: "Ivory", quantity: 2, unitPrice: "2500.00", productUrl: "https://menshub.example/product/cotton-shirt" });
    expect(message).toContain("Cart Subtotal: PKR 5000.00");
    expect(message).toContain("Article/SKU: SH-01");
    expect(message).not.toContain("Delivery charges");
    expect(decodeURIComponent(createWhatsAppUrl("92 308-1000025", message).split("text=")[1])).toBe(message);
  });
  it("creates a cart message without sale claims", () => {
    const message = createCartInquiryMessage({ greeting: "Greetings from Men’s Hub", statement: "I would like to place this order.", deliveryMessage: "Calculated / Confirmed on WhatsApp", lines: [{ lineId: "line", id: "p1", slug: "shirt", name: "Oxford Shirt", sku: "MH-001", imageUrl: "/shirt.jpg", price: "2500.00", availableStock: 4, sizes: ["M"], colors: ["Black"], productUrl: "https://menshub.example/product/oxford", selectedSize: "M", selectedColor: "Black", quantity: 2 }] });
    expect(message).toContain("Product: Oxford Shirt");
    expect(message).toContain("Cart Subtotal: PKR 5000.00");
    expect(message).toContain("Delivery Charges: Calculated / Confirmed on WhatsApp");
    expect(message).not.toMatch(/order confirmed|paid|payment received/i);
  });
  it("round-trips Unicode and punctuation through the encoded WhatsApp URL", () => {
    const message = createProductInquiryMessage({ greeting: "Greeting from Men’s Hub", statement: "I’d like to place this order.", name: "Kurta & Trouser — Blue", sku: "MH/01-A", quantity: 1, unitPrice: "1.00", productUrl: "https://menshub.example/product/kurta%20set" });
    const url = new URL(createWhatsAppUrl("923081000025", message));
    expect(url.hostname).toBe("wa.me");
    expect(url.pathname).toBe("/923081000025");
    expect(url.searchParams.get("text")).toBe(message);
  });
});
