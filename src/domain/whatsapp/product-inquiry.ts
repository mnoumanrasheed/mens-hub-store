import type { CartLine } from "@/domain/commerce/storage";

export const WHATSAPP_NUMBER = "923081000025";
export type ProductInquiry = {
  name: string;
  size?: string;
  color?: string;
  quantity: number;
  unitPrice: string;
  productUrl: string;
};

type OrderLine = ProductInquiry;

const currency = new Intl.NumberFormat("en-PK", {
  maximumFractionDigits: 2,
});

const singleWordColours = new Set([
  "black",
  "white",
  "grey",
  "gray",
  "brown",
  "beige",
  "red",
  "green",
  "blue",
  "yellow",
  "orange",
  "pink",
  "purple",
]);

function formatPrice(value: string | number) {
  const amount = Number(value);
  return currency.format(Number.isFinite(amount) ? amount : 0);
}

function formatColour(value: string) {
  const trimmed = value.trim();
  const parts = trimmed.toLowerCase().split(/\s+/).filter(Boolean);
  const displayParts = parts.length > 1 && parts.every((part) => singleWordColours.has(part))
    ? parts
    : [trimmed.toLowerCase()];

  return displayParts
    .map((part) => part.replace(/\b\w/g, (character) => character.toUpperCase()))
    .join(" / ");
}

function formatOrderMessage(lines: OrderLine[]) {
  const subtotal = lines.reduce((total, line) => total + Number(line.unitPrice) * line.quantity, 0);
  const orderDetails = lines.flatMap((line, index) => [
    `Item ${String(index + 1).padStart(2, "0")}`,
    "",
    `Product: ${line.name}`,
    ...(line.size?.trim() ? [`Size: ${line.size.trim().toUpperCase()}`] : []),
    ...(line.color?.trim() ? [`Color: ${formatColour(line.color)}`] : []),
    `Quantity: ${line.quantity}`,
    `Price: PKR ${formatPrice(line.unitPrice)}`,
    "",
    "Product Link:",
    line.productUrl,
    ...(index < lines.length - 1 ? ["", "---", ""] : []),
  ]);

  return [
    "MEN’S HUB",
    "Order Request",
    "",
    "Thank you for shopping with Men’s Hub.",
    "",
    "---",
    "",
    "ORDER DETAILS",
    "",
    ...orderDetails,
    "",
    "---",
    "",
    "ORDER SUMMARY",
    "",
    `Products Subtotal: PKR ${formatPrice(subtotal)}`,
    "",
    "Delivery Charges: Not Included",
    "Delivery charges will be calculated separately and confirmed on WhatsApp before the order is finalized.",
    "",
    `Total Before Delivery: PKR ${formatPrice(subtotal)}`,
    "",
    "I would like to place this order. Please confirm product availability and applicable delivery charges.",
    "",
    "Thank you.",
    "MEN’S HUB",
    "Premium Menswear",
  ].join("\n");
}

export function createProductInquiryMessage(input: ProductInquiry) {
  return formatOrderMessage([input]);
}

export function createCartInquiryMessage(input: { lines: CartLine[] }) {
  return formatOrderMessage(input.lines.map((line) => ({
    name: line.name,
    size: line.selectedSize,
    color: line.selectedColor,
    quantity: line.quantity,
    unitPrice: line.price,
    productUrl: line.productUrl,
  })));
}

export function createWhatsAppUrl(number: string, message: string) { return `https://wa.me/${number.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`; }
