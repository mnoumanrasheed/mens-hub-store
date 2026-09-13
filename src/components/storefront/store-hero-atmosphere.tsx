"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { cn } from "@/lib/cn";
import { useHeroEntrance, useLiveHero } from "./hero-motion";

export function StoreHeroAtmosphere({ className }: { className?: string }) {
  const { ref, compact, active } = useLiveHero();
  const reveal = useHeroEntrance();
  const loop = (duration: number) => active
    ? { duration, ease: "easeInOut" as const, repeat: Infinity }
    : { duration: 0 };
  return (
    <div ref={ref} className={cn("store-hero-atmosphere", className)} aria-hidden="true" data-live={active}>
      <motion.div className="store-hero-depth" initial={false}
        animate={active ? { scale: [1, compact ? 1.01 : 1.025, 1], opacity: [.45, .65, .45] } : { scale: 1, opacity: .45 }} transition={loop(34)} />
      <motion.div className="store-hero-ambient" initial={false}
        animate={active ? { x: ["0%", compact ? "3%" : "7%", "0%"], y: ["0%", compact ? "-2%" : "-5%", "0%"] } : { x: "0%", y: "0%" }} transition={loop(28)} />
      <motion.div className="store-hero-brand-mark" initial={false}
        animate={active ? { x: [0, compact ? 4 : 12, 0], y: [0, compact ? -3 : -8, 0] } : { x: 0, y: 0 }} transition={loop(32)}>
        <Image src="/logo.png" alt="" fill sizes="(max-width: 767px) 352px, 50vw" className="object-contain" />
      </motion.div>
      <motion.span className="store-hero-light-sweep" initial={false}
        animate={active ? { x: ["0%", "185%", "370%"], opacity: [0, compact ? .045 : .075, 0] } : { x: "0%", opacity: 0 }} transition={loop(38)} />
      <motion.span className="store-hero-divider" {...reveal(.24, "divider")} />
    </div>
  );
}
