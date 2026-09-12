"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

import { StoreImage } from "@/components/storefront/store-image";

const ease = [0.22, 1, 0.36, 1] as const;

export function ProductGallery({ imageUrl, name }: { imageUrl: string; name: string }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.figure
      className="relative overflow-hidden border border-white/[0.08] bg-surface lg:sticky lg:top-24"
      initial={reduceMotion ? false : { opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.8, ease }}
    >
      <div className="group relative aspect-[4/5] min-h-[32rem] overflow-hidden sm:min-h-[42rem] lg:min-h-0">
        <StoreImage
          src={imageUrl}
          alt={name}
          fill
          preload
          quality={92}
          sizes="(max-width: 1023px) 100vw, 56vw"
          className="object-cover transition duration-[1200ms] ease-[var(--mh-ease-out)] motion-safe:group-hover:scale-[1.025]"
        />
        <div className="absolute inset-0 ring-1 ring-inset ring-white/10" aria-hidden="true" />
        <figcaption className="absolute bottom-4 left-4 border border-white/10 bg-black/65 px-3 py-2 text-[0.56rem] font-bold uppercase tracking-[0.2em] text-ivory/80 backdrop-blur-md sm:bottom-5 sm:left-5">
          Product view <span className="mx-1 text-gold">/</span> 01
        </figcaption>
      </div>
    </motion.figure>
  );
}

export function ProductDetailReveal({ children }: { children: ReactNode }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 34 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.8, delay: reduceMotion ? 0 : 0.12, ease }}
    >
      {children}
    </motion.div>
  );
}
