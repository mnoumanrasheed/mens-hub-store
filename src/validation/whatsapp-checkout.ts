import { z } from "zod";

const requiredText = (label: string, max: number) => z.string().trim().min(1, label + " is required.").max(max);

export const whatsappCustomerSchema = z.object({
  fullName: requiredText("Full name", 120),
  phone: z.string().trim().regex(/^(?:03\d{9}|\+923\d{9})$/, "Enter a valid Pakistani contact number."),
  address: requiredText("Delivery address", 300),
  city: requiredText("City", 100),
  email: z.string().trim().max(254).optional().transform((value) => value || undefined).pipe(z.string().email("Enter a valid email address.").optional()),
  notes: z.string().trim().max(500, "Order notes must be 500 characters or fewer.").optional().transform((value) => value || undefined),
});

export type WhatsAppCustomer = z.infer<typeof whatsappCustomerSchema>;
