import { describe, expect, it } from "vitest";
import { whatsappCustomerSchema } from "@/validation/whatsapp-checkout";

const valid = { fullName: "Muhammad Ali", phone: "03001234567", address: "House 10, DHA", city: "Lahore", email: "", notes: "" };

describe("WhatsApp checkout customer validation", () => {
  it("requires full name, phone, address, and city", () => {
    expect(whatsappCustomerSchema.safeParse({ ...valid, fullName: " " }).success).toBe(false);
    expect(whatsappCustomerSchema.safeParse({ ...valid, phone: "" }).success).toBe(false);
    expect(whatsappCustomerSchema.safeParse({ ...valid, address: "" }).success).toBe(false);
    expect(whatsappCustomerSchema.safeParse({ ...valid, city: "" }).success).toBe(false);
  });
  it("allows blank email but rejects an invalid entered email", () => {
    expect(whatsappCustomerSchema.safeParse(valid).success).toBe(true);
    expect(whatsappCustomerSchema.safeParse({ ...valid, email: "not-an-email" }).success).toBe(false);
  });
  it("accepts supported Pakistani phone formats", () => {
    expect(whatsappCustomerSchema.safeParse({ ...valid, phone: "+923001234567" }).success).toBe(true);
  });
});
