import type { CartLine } from "@/domain/commerce/storage";

type RequestedLine = Pick<CartLine, "id" | "selectedSize" | "selectedColor" | "quantity">;

type InquiryResponse = {
  url: string;
  lines: CartLine[];
};

export async function prepareWhatsAppInquiry(lines: RequestedLine[]): Promise<InquiryResponse> {
  const response = await fetch("/api/commerce/whatsapp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ lines: lines.map((line) => ({ productId: line.id, selectedSize: line.selectedSize, selectedColor: line.selectedColor, quantity: line.quantity })) }),
  });
  const payload: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const message = payload && typeof payload === "object" && "error" in payload && typeof payload.error === "string" ? payload.error : "The inquiry could not be prepared. Please try again.";
    throw new Error(message);
  }
  if (!payload || typeof payload !== "object" || !("url" in payload) || typeof payload.url !== "string" || !("lines" in payload) || !Array.isArray(payload.lines)) throw new Error("The inquiry response was invalid. Please try again.");
  return payload as InquiryResponse;
}
