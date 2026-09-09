import type { ComponentProps } from "react";

import { cn } from "@/lib/cn";

export function Card({ className, ...props }: ComponentProps<"article">) {
  return (
    <article
      className={cn(
        "rounded-lg border border-line bg-surface shadow-[var(--mh-shadow-soft)]",
        className,
      )}
      {...props}
    />
  );
}

export function CardContent({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("p-6 sm:p-8", className)} {...props} />;
}
