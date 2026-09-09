export type SiteEventType = "PRODUCT_VIEW" | "PRODUCT_CLICK" | "WHATSAPP_CLICK";

export function trackSiteEvent(type: SiteEventType, productId?: string) {
  void fetch("/api/analytics/events", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type, ...(productId ? { productId } : {}) }), keepalive: true }).catch(() => undefined);
}

export function trackWhatsAppClick(productId?: string) { trackSiteEvent("WHATSAPP_CLICK", productId); }
