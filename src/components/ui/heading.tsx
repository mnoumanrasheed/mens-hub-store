import type { ComponentProps } from "react";

import { cn } from "@/lib/cn";

type HeadingTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
type HeadingSize = "display" | "xl" | "lg" | "md" | "sm";

const sizes: Record<HeadingSize, string> = {
  display: "text-5xl leading-[0.92] sm:text-7xl lg:text-8xl",
  xl: "text-4xl leading-tight sm:text-5xl lg:text-6xl",
  lg: "text-3xl leading-tight sm:text-4xl",
  md: "text-2xl leading-tight sm:text-3xl",
  sm: "text-xl leading-snug sm:text-2xl",
};

type HeadingProps = ComponentProps<"h2"> & {
  as?: HeadingTag;
  size?: HeadingSize;
};

export function Heading({
  as: Tag = "h2",
  className,
  size = "lg",
  ...props
}: HeadingProps) {
  return (
    <Tag
      className={cn(
        "text-balance font-display font-semibold tracking-[-0.02em] text-ivory",
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}
