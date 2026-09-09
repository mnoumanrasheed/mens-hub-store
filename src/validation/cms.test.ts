import { describe, expect, it } from "vitest";
import { announcementSchema, policySchema, settingsSchema } from "@/validation/cms";

const settings = { brandName: "Men’s Hub", tagline: "Style Made for Men", proprietors: "Taha Soni / Shahzaib Soni", phone: "03081000025", whatsapp: "923081000025", email: "mens.hub919@gmail.com", instagramUrl: "", facebookUrl: "", tiktokUrl: "", address: "", googleMapsUrl: "", storeTiming: "", currency: "PKR", lowStockThreshold: 3, deliveryChargesMessage: "Calculated / Confirmed on WhatsApp", whatsappGreeting: "", whatsappOrderStatement: "", websiteTitle: "Men’s Hub", metaDescription: "", removeOgImage: false };

describe("CMS validation", () => {
  it("preserves authoritative settings and converts absent optional values to null", () => { const result = settingsSchema.parse(settings); expect(result.whatsapp).toBe("923081000025"); expect(result.instagramUrl).toBeNull(); expect(result.address).toBeNull(); });
  it("rejects social impersonation and non-Google map URLs", () => { expect(settingsSchema.safeParse({ ...settings, instagramUrl: "https://example.com/menshub" }).success).toBe(false); expect(settingsSchema.safeParse({ ...settings, googleMapsUrl: "https://example.com/map" }).success).toBe(false); });
  it("requires content before a policy can be published", () => { expect(policySchema.safeParse({ slug: "faq", title: "FAQ", text: "", isPublished: true, seoTitle: "", seoDescription: "" }).success).toBe(false); });
  it("rejects a reversed announcement schedule", () => { expect(announcementSchema.safeParse({ id: null, text: "Notice", linkUrl: null, linkLabel: null, background: "DARK", enabled: true, startAt: new Date("2026-01-02T00:00:00Z"), endAt: new Date("2026-01-01T00:00:00Z") }).success).toBe(false); });
});
