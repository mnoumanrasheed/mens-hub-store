"use client";

import { useEffect } from "react";
import { trackWhatsAppClick } from "@/lib/analytics";

export function WhatsAppClickObserver() {
  useEffect(() => { const onClick = (event: MouseEvent) => { const anchor = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href]") : null; if (!anchor || anchor.dataset.whatsappTracked === "true") return; try { if (new URL(anchor.href).hostname === "wa.me") trackWhatsAppClick(); } catch { /* Ignore malformed third-party links. */ } }; document.addEventListener("click", onClick, { capture: true }); return () => document.removeEventListener("click", onClick, { capture: true }); }, []);
  return null;
}
