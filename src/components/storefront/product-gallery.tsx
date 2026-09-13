"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Maximize2, X } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { StoreImage } from "@/components/storefront/store-image";

const ease = [0.22, 1, 0.36, 1] as const;

export function ProductGallery({ imageUrl, name }: { imageUrl: string; name: string }) {
  const reduceMotion = useReducedMotion();
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [open]);
  return (
    <>
      <motion.figure className="atelier-gallery relative overflow-hidden border border-line bg-surface lg:sticky lg:top-28"
        initial={false} whileInView={reduceMotion ? undefined : { opacity: [0.6, 1], y: [24, 0] }} viewport={{ once: true }}
        transition={{ duration: 0.8, ease }}>
        <div className="atelier-gallery-visual group relative aspect-[4/5] overflow-hidden">
          <StoreImage src={imageUrl} alt={name} fill preload sizes="(max-width: 1023px) 100vw, 56vw"
            className="object-cover transition duration-[1200ms] ease-[var(--mh-ease-out)] motion-safe:group-hover:scale-[1.025]" />
          <button type="button" className="absolute right-4 top-4 grid size-11 place-items-center rounded-full border border-ivory/30 bg-canvas/75 text-ivory backdrop-blur-sm transition-colors hover:bg-gold hover:text-gold-ink"
            aria-label={`Enlarge image of ${name}`} aria-haspopup="dialog" onClick={() => { dialog.current?.showModal(); setOpen(true); }}><Maximize2 size={17} /></button>
          <figcaption className="absolute bottom-4 left-4 border border-line bg-canvas/75 px-3 py-2 text-[0.56rem] uppercase tracking-[0.2em] text-ivory backdrop-blur-sm">
            Product view <span className="mx-1 text-gold">/</span> 01
          </figcaption>
        </div>
        <div className="atelier-gallery-note"><span>The details make the difference</span><span>01 / 01</span></div>
      </motion.figure>
      <dialog ref={dialog} className="product-zoom" aria-label={`Enlarged image of ${name}`} onClose={() => setOpen(false)} onClick={(event) => { if (event.target === event.currentTarget) dialog.current?.close(); }}>
        <div className="product-zoom-inner">
          <button type="button" autoFocus className="store-icon-button absolute right-3 top-3 z-10 rounded-full border border-line bg-canvas" aria-label="Close enlarged image" onClick={() => dialog.current?.close()}><X size={21} /></button>
          {open ? <StoreImage src={imageUrl} alt={name} fill sizes="90vw" className="object-contain" /> : null}
        </div>
        <p className="mt-4 text-center text-xs tracking-wide text-ivory">{name}</p>
      </dialog>
    </>
  );
}

export function ProductDetailReveal({ children }: { children: ReactNode }) {
  const reduceMotion = useReducedMotion();
  return <motion.div initial={false} whileInView={reduceMotion ? undefined : { opacity: [0.6, 1], y: [24, 0] }} viewport={{ once: true, amount: 0.05 }} transition={{ duration: 0.8, ease }}>{children}</motion.div>;
}
