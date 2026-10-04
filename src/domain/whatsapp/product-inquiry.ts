import type { CartLine } from "@/domain/commerce/storage";
import type { WhatsAppCustomer } from "@/validation/whatsapp-checkout";
export type ProductInquiry = { name: string; sku?: string; size?: string; color?: string; quantity: number; unitPrice: string; productUrl: string };
type OrderLine = ProductInquiry;
const currency = new Intl.NumberFormat("en-PK", { maximumFractionDigits: 2 });
function formatPrice(value: string | number) { const amount = Number(value); return currency.format(Number.isFinite(amount) ? amount : 0); }
function formatColour(value: string) { return value.trim().replace(/\b\w/g, (character) => character.toUpperCase()); }
function formatOrderMessage(lines: OrderLine[], customer: WhatsAppCustomer) {
  const subtotal = lines.reduce((total, line) => total + Number(line.unitPrice) * line.quantity, 0);
  const deliveryCharge = subtotal < 10000 ? 250 : 0;
  const grandTotal = subtotal + deliveryCharge;
  const orderDetails = lines.flatMap((line, index) => [
    ...(index ? [""] : []), `Product: ${line.name}`, `Tag No: ${line.sku}`,
    ...(line.size?.trim() ? [`Size: ${line.size.trim().toUpperCase()}`] : []),
    ...(line.color?.trim() ? [`Color: ${formatColour(line.color)}`] : []),
    `Quantity: ${line.quantity}`, `Price: PKR ${formatPrice(line.unitPrice)}`, `Product Link: ${line.productUrl}`,
  ]);
  return [
    "*MEN'S HUB ORDER*", "", "*Customer Details*", `Name: ${customer.fullName}`, `Contact: ${customer.phone}`,
    ...(customer.email ? [`Email: ${customer.email}`] : []), `City: ${customer.city}`, `Address: ${customer.address}`, "",
    "*Order Details*", ...orderDetails, "", `Products Total: PKR ${formatPrice(subtotal)}`,
    `Delivery: ${deliveryCharge ? "PKR " + formatPrice(deliveryCharge) : "FREE"}`, `Total: PKR ${formatPrice(grandTotal)}`,
    ...(customer.notes ? ["", `Order Notes: ${customer.notes}`] : []), "", "Thank you for shopping with Men's Hub.",
  ].join("\n");
}
export function createProductInquiryMessage(input: ProductInquiry, customer: WhatsAppCustomer) { return formatOrderMessage([input], customer); }
export function createCartInquiryMessage(input: { lines: CartLine[]; customer: WhatsAppCustomer }) { return formatOrderMessage(input.lines.map((line) => ({ name: line.name, sku: line.sku, size: line.selectedSize, color: line.selectedColor, quantity: line.quantity, unitPrice: line.price, productUrl: line.productUrl })), input.customer); }
export function createWhatsAppUrl(number: string, message: string) { return "https://wa.me/" + number.replace(/\D/g, "") + "?text=" + encodeURIComponent(message); }
