"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";
import { StoreHeroAtmosphere } from "@/components/storefront/store-hero-atmosphere";
import { useHeroEntrance } from "./hero-motion";

export function AnimatedCollectionHero({ eyebrow, title, description, children }: { eyebrow: string; title: string; description: string; children?: ReactNode }) {
  const reveal = useHeroEntrance();
  return (
    <header data-store-hero className="atelier-collection-header animated-collection-hero mb-8 grid gap-7 border-b border-line pb-8 sm:mb-10 sm:pb-10 lg:grid-cols-[minmax(0,1fr)_minmax(17rem,28rem)] lg:items-end">
      <StoreHeroAtmosphere />
      <div className="animated-collection-hero-main">
        <motion.p className="store-eyebrow" {...reveal(.04)}>{eyebrow}</motion.p>
        <div className="animated-collection-title-mask">
          <motion.h1 className="break-words font-display text-5xl font-semibold leading-[0.9] tracking-[-0.035em] text-ivory sm:text-7xl" {...reveal(.14, "heading")}>{title}</motion.h1>
        </div>
      </div>
      <div className="animated-collection-hero-copy lg:justify-self-end">
        <motion.p className="max-w-xl text-sm leading-7 text-muted sm:text-base" {...reveal(.3)}>{description}</motion.p>
        {children ? <motion.div {...reveal(.42)}>{children}</motion.div> : null}
      </div>
    </header>
  );
}
