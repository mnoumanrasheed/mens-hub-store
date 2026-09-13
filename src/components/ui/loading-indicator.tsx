"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/cn";

type LoadingIndicatorProps = {
  label?: string;
  message?: string;
  className?: string;
};

const ease = [0.22, 1, 0.36, 1] as const;

export function LoadingIndicator({ label = "Preparing the collection", message = "Men's Hub", className }: LoadingIndicatorProps) {
  const reduceMotion = useReducedMotion();

  return (
    <div role="status" aria-live="polite" className={cn("premium-loader", className)}>
      <span className="sr-only">{label}</span>
      <motion.div className="premium-loader-stage" initial={reduceMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: reduceMotion ? 0 : 0.8, ease }}>
        <span className="premium-loader-rule premium-loader-rule-left" aria-hidden="true" />
        <span className="premium-loader-rule premium-loader-rule-right" aria-hidden="true" />
        <motion.div className="premium-loader-mark" initial={reduceMotion ? false : { opacity: 0, y: 12, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: reduceMotion ? 0 : 1, delay: reduceMotion ? 0 : 0.15, ease }}>
          <span className="premium-loader-frame">
            <span className="premium-loader-sweep" aria-hidden="true" />
            <Image src="/logo.png" alt={message} width={1448} height={1086} className="h-full w-full object-contain" priority />
          </span>
        </motion.div>
      </motion.div>
      <motion.div className="premium-loader-copy" initial={reduceMotion ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduceMotion ? 0 : 0.7, delay: reduceMotion ? 0 : 0.55, ease }}>
        <span className="premium-loader-label">{label}</span>
        <span className="premium-loader-caption">A considered collection for the modern gentleman</span>
      </motion.div>
      <motion.div className="premium-loader-track" initial={reduceMotion ? false : { opacity: 0, scaleX: 0.7 }} animate={{ opacity: 1, scaleX: 1 }} transition={{ duration: reduceMotion ? 0 : 0.7, delay: reduceMotion ? 0 : 0.75, ease }} aria-hidden="true">
        <span className="premium-loader-progress" />
      </motion.div>
    </div>
  );
}