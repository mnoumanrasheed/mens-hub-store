"use client";

import { useRef, useSyncExternalStore, type ReactNode } from "react";
import { motion, useInView } from "motion/react";

const ease = [0.22, 1, 0.36, 1] as const;
const serverFalse = () => false;
const serverTrue = () => true;
const compactQuery = "(max-width: 767px)";
const reducedQuery = "(prefers-reduced-motion: reduce)";
const isReduced = () => window.matchMedia(reducedQuery).matches;
const isCompact = () => window.matchMedia(compactQuery).matches;
const isVisible = () => document.visibilityState === "visible";
const isReady = () => !document.querySelector(".initial-storefront-loader");

function subscribeCompact(notify: () => void) {
  const query = window.matchMedia(compactQuery);
  query.addEventListener("change", notify);
  return () => query.removeEventListener("change", notify);
}
function subscribeReduced(notify: () => void) {
  const query = window.matchMedia(reducedQuery);
  query.addEventListener("change", notify);
  return () => query.removeEventListener("change", notify);
}
function subscribeVisibility(notify: () => void) {
  document.addEventListener("visibilitychange", notify);
  return () => document.removeEventListener("visibilitychange", notify);
}
function subscribeReady(notify: () => void) {
  if (isReady()) return () => {};
  // Reveal after the existing opening screen finishes, including direct visits.
  const observer = new MutationObserver(() => {
    if (isReady()) { notify(); observer.disconnect(); }
  });
  observer.observe(document.body, { childList: true, subtree: true });
  return () => observer.disconnect();
}

export function useHeroEntrance() {
  const ready = useSyncExternalStore(subscribeReady, isReady, serverFalse);
  const reduceMotion = useSyncExternalStore(subscribeReduced, isReduced, serverTrue);
  const compact = useSyncExternalStore(subscribeCompact, isCompact, serverTrue);
  const animate = ready && reduceMotion === false;
  return (delay = 0, kind: "text" | "heading" | "divider" = "text") => ({
    "data-hero-reveal": kind,
    initial: reduceMotion ? false as const : kind === "divider" ? { scaleX: 0 } : { opacity: 0, y: compact ? 8 : 16 },
    animate: kind === "divider"
      ? { scaleX: animate ? [0, 1] : 1 }
      : {
          opacity: animate ? [0, 1] : 1,
          y: animate ? [compact ? 8 : 16, 0] : 0,
          ...(kind === "heading" ? { clipPath: animate ? ["inset(0 0 100% 0)", "inset(-15% -3% -25% -3%)"] : "inset(-15% -3% -25% -3%)" } : {}),
        },
    transition: { duration: animate ? (kind === "heading" ? 1.15 : .9) : 0, delay: animate ? delay : 0, ease },
  });
}

export function useLiveHero() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "60px" });
  const reduceMotion = useSyncExternalStore(subscribeReduced, isReduced, serverTrue);
  const compact = useSyncExternalStore(subscribeCompact, isCompact, serverTrue);
  const visible = useSyncExternalStore(subscribeVisibility, isVisible, serverTrue);
  return { ref, compact, active: reduceMotion === false && inView && visible };
}

export function HeroDepth({ children, className }: { children: ReactNode; className?: string }) {
  const { ref, compact, active } = useLiveHero();
  return <motion.div ref={ref} className={className} data-hero-depth data-live={active} initial={false}
    animate={active ? { x: [0, compact ? 2 : 5, 0], scale: [1, compact ? 1.008 : 1.018, 1] } : { x: 0, scale: 1 }}
    transition={active ? { duration: 32, ease: "easeInOut", repeat: Infinity } : { duration: 0 }}>
    {children}
  </motion.div>;
}
