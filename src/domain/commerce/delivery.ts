export const STANDARD_DELIVERY_MESSAGE =
  "Delivery is PKR 250. Orders of PKR 10,000 or more qualify for free delivery.";

const LEGACY_DELIVERY_MESSAGE =
  /(?:calculated\s*\/?\s*confirmed|discussed|confirmed separately).*whatsapp/i;

export function formatDeliveryMessage(value?: string | null): string {
  const message = value?.trim();
  return !message || LEGACY_DELIVERY_MESSAGE.test(message)
    ? STANDARD_DELIVERY_MESSAGE
    : message;
}
