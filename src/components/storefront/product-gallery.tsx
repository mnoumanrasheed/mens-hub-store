"use client";

import { Maximize2, X } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";

import { StoreImage } from "@/components/storefront/store-image";

const ease = [0.22, 1, 0.36, 1] as const;

export function ProductGallery({ imageUrl, name }: { imageUrl: string; name: string }) {
  const reduceMotion = useReducedMotion();
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  function openZoom() {
    dialog.current?.showModal();
    setOpen(true);
  }

  return (
    <>
      <motion.figure
        className="mh-pdp-gallery"
        initial={reduceMotion ? false : { opacity: 0, y: 18 }}
        animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease }}
      >
        <div className="mh-pdp-gallery-visual">
          <StoreImage
            src={imageUrl}
            alt={name}
            fill
            preload
            sizes="(max-width: 1023px) 100vw, (max-width: 1360px) 56vw, 720px"
            className="mh-pdp-gallery-image"
          />
          {/* Corner accent lines — editorial frame effect */}
          <span className="mh-pdp-gallery-corner mh-pdp-gallery-corner--tl" aria-hidden="true" />
          <span className="mh-pdp-gallery-corner mh-pdp-gallery-corner--br" aria-hidden="true" />
          <button
            type="button"
            className="mh-pdp-zoom-control"
            aria-label={`Enlarge image of ${name}`}
            aria-haspopup="dialog"
            onClick={openZoom}
          >
            <Maximize2 size={16} />
          </button>
        </div>
      </motion.figure>

      <dialog
        ref={dialog}
        className="product-zoom"
        aria-label={`Enlarged image of ${name}`}
        onClose={() => setOpen(false)}
        onClick={(event) => {
          if (event.target === event.currentTarget) dialog.current?.close();
        }}
      >
        <div className="product-zoom-inner">
          <button
            type="button"
            autoFocus
            className="mh-pdp-zoom-close"
            aria-label="Close enlarged image"
            onClick={() => dialog.current?.close()}
          >
            <X size={20} />
          </button>
          {open ? <StoreImage src={imageUrl} alt={name} fill sizes="90vw" className="object-contain" /> : null}
        </div>
        <p>{name}</p>
      </dialog>
    </>
  );
}

export function ProductDetailReveal({ children }: { children: ReactNode }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 18 }}
      animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.65, delay: reduceMotion ? 0 : 0.08, ease }}
    >
      {children}
    </motion.div>
  );
}
