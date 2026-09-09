import type { ComponentProps } from "react";

import { cn } from "@/lib/cn";

type BadgeTone = "gold" | "neutral" | "sale";

const tones: Record<BadgeTone, string> = {
  gold: "border-gold/40 bg-gold/10 text-gold",
  neutral: "border-line bg-surface-raised text-muted",
  sale: "border-critical/40 bg-critical-surface text-critical",
};

type BadgeProps = ComponentProps<"span"> & {
  tone?: BadgeTone;
};

export function Badge({
  className,
  tone = "gold",
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex min-h-7 items-center rounded-sm border px-2.5 py-1 text-[0.6875rem] font-bold uppercase tracking-[0.18em]",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
