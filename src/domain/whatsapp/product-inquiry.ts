import type { CartLine } from "@/domain/commerce/storage";

export const WHATSAPP_NUMBER = "923081000025";

export type ProductInquiry = { greeting: string; statement: string; deliveryMessage?: string; name: string; sku: string; size?: string; color?: string; quantity: number; unitPrice: string; productUrl: string };

export function createProductInquiryMessage(input: ProductInquiry) {
  const subtotal = (Number(input.unitPrice) * input.quantity).toFixed(2);
  return [input.greeting, "", `Product: ${input.name}`, `Article/SKU: ${input.sku}`, input.size ? `Size: ${input.size}` : null, input.color ? `Color: ${input.color}` : null, `Quantity: ${input.quantity}`, `Price: PKR ${input.unitPrice}`, `Product URL: ${input.productUrl}`, "", `Cart Subtotal: PKR ${subtotal}`, input.deliveryMessage ? `Delivery Charges: ${input.deliveryMessage}` : null, "", input.statement].filter((line) => line !== null).join("\n");
}

export function createCartInquiryMessage(input: { greeting: string; statement: string; deliveryMessage?: string; lines: CartLine[] }) {
  const total = input.lines.reduce((sum, line) => sum + Number(line.price) * line.quantity, 0);
  const products = input.lines.flatMap((line, index) => [`Item ${index + 1}`, `Product: ${line.name}`, `Article/SKU: ${line.sku}`, `Size: ${line.selectedSize || "Not applicable"}`, `Color: ${line.selectedColor || "Not applicable"}`, `Quantity: ${line.quantity}`, `Price: PKR ${line.price}`, `Product URL: ${line.productUrl}`, ""]);
  return [input.greeting, "", ...products, `Cart Subtotal: PKR ${total.toFixed(2)}`, ...(input.deliveryMessage ? [`Delivery Charges: ${input.deliveryMessage}`] : []), "", input.statement].join("\n");
}
export function createWhatsAppUrl(number: string, message: string) { return `https://wa.me/${number.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`; }
