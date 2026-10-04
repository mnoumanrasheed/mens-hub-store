import { MessageCircle } from "lucide-react";
import { createWhatsAppUrl } from "@/domain/whatsapp/product-inquiry";

export function FloatingWhatsApp({
  brandName,
  whatsapp,
}: {
  brandName: string;
  whatsapp: string;
}) {
  const href = createWhatsAppUrl(
    whatsapp,
    `Greetings from ${brandName}\n\nI would like help placing an order.`
  );

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="mh-floating-whatsapp group"
      aria-label="Chat with Men's Hub on WhatsApp"
    >
      <div className="relative flex size-5 items-center justify-center">
        <MessageCircle size={18} />
      </div>
      <span className="font-sans font-extrabold text-[0.7rem] tracking-[0.16em]">
        WhatsApp
      </span>
    </a>
  );
}
