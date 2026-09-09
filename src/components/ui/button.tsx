import type { ComponentProps } from "react";

import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

const variants: Record<ButtonVariant, string> = {
  primary:
    "border-gold bg-gold text-gold-ink hover:border-gold-strong hover:bg-gold-strong",
  secondary:
    "border-line bg-surface-raised text-ivory hover:border-gold/60 hover:text-gold",
  ghost: "border-transparent bg-transparent text-ivory hover:bg-surface-raised",
  danger:
    "border-critical bg-critical-surface text-ivory hover:bg-critical hover:text-white",
};

const sizes: Record<ButtonSize, string> = {
  sm: "min-h-10 px-4 text-xs",
  md: "min-h-11 px-5 text-sm",
  lg: "min-h-12 px-6 text-sm",
};

type ButtonStyleOptions = {
  className?: string;
  size?: ButtonSize;
  variant?: ButtonVariant;
};

export function buttonStyles({
  className,
  size = "md",
  variant = "primary",
}: ButtonStyleOptions = {}) {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-sm border font-bold uppercase tracking-[0.12em] transition-[background-color,border-color,color,transform] duration-[var(--mh-motion-fast)] ease-[var(--mh-ease-out)] disabled:cursor-not-allowed disabled:opacity-45 active:translate-y-px",
    variants[variant],
    sizes[size],
    className,
  );
}

type ButtonProps = ComponentProps<"button"> & ButtonStyleOptions;

export function Button({
  className,
  size,
  type = "button",
  variant,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonStyles({ className, size, variant })}
      {...props}
    />
  );
}
