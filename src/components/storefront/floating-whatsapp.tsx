"use client";

import { MessageCircle } from "lucide-react";
import { createWhatsAppUrl, WHATSAPP_NUMBER } from "@/domain/whatsapp/product-inquiry";

export function FloatingWhatsApp({ brandName }: { brandName: string }) {
  const href = createWhatsAppUrl(
    WHATSAPP_NUMBER,
    `Greetings from ${brandName}\n\nI would like help placing an order.`
  );

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-[max(1.25rem,env(safe-area-inset-right))] z-40 group inline-flex min-h-11 items-center gap-2.5 rounded-full border border-gold/70 bg-[#0b0d0c]/95 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-white shadow-[0_12px_35px_rgba(0,0,0,0.65)] backdrop-blur-xl transition-all duration-300 hover:border-gold hover:bg-[#121613] hover:text-gold hover:shadow-[0_15px_40px_rgba(197,155,39,0.25)] hover:scale-105 active:scale-95"
      aria-label="Chat with Men's Hub on WhatsApp"
    >
      <div className="relative flex size-5 items-center justify-center text-gold">
        <MessageCircle size={18} className="transition-transform duration-300 group-hover:scale-110" />
      </div>
      <span className="font-sans font-extrabold text-[0.7rem] tracking-[0.16em]">
        WhatsApp
      </span>
    </a>
  );
}
