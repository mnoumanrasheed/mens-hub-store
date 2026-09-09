import type { ComponentProps } from "react";

import { cn } from "@/lib/cn";

type ContainerSize = "standard" | "wide" | "narrow";

const sizes: Record<ContainerSize, string> = {
  narrow: "max-w-4xl",
  standard: "max-w-7xl",
  wide: "max-w-[90rem]",
};

type ContainerProps = ComponentProps<"div"> & {
  size?: ContainerSize;
};

export function Container({
  className,
  size = "standard",
  ...props
}: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-[var(--mh-container-gutter)]",
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}
