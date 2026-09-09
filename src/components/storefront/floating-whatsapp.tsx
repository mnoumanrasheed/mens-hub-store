"use client";

import { MessageCircle } from "lucide-react";
import { createWhatsAppUrl, WHATSAPP_NUMBER } from "@/domain/whatsapp/product-inquiry";

export function FloatingWhatsApp({ brandName }: { brandName: string }) {
  const href = createWhatsAppUrl(WHATSAPP_NUMBER, `Greetings from ${brandName}\n\nI would like help placing an order.`);
  return <a href={href} target="_blank" rel="noopener noreferrer" className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-[max(1rem,env(safe-area-inset-right))] z-30 inline-flex min-h-12 items-center gap-2 rounded-full border border-gold/60 bg-[#111512]/95 px-3.5 text-[0.65rem] font-extrabold uppercase tracking-[0.1em] text-ivory shadow-[0_12px_35px_rgb(0_0_0/0.45)] backdrop-blur-md transition hover:border-gold hover:text-gold sm:min-h-13 sm:px-4" aria-label="Chat with Men's Hub on WhatsApp"><MessageCircle size={20} className="text-gold" /><span className="hidden sm:inline">WhatsApp</span></a>;
}
