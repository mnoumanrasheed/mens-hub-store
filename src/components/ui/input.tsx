import type { ComponentProps } from "react";

import { cn } from "@/lib/cn";

type InputProps = Omit<ComponentProps<"input">, "id"> & {
  error?: string;
  hint?: string;
  id: string;
  label: string;
};

export function Input({
  className,
  error,
  hint,
  id,
  label,
  ...props
}: InputProps) {
  const descriptionId = error
    ? `${id}-error`
    : hint
      ? `${id}-hint`
      : undefined;

  return (
    <div className="grid gap-2">
      <label
        htmlFor={id}
        className="text-xs font-bold uppercase tracking-[0.14em] text-muted"
      >
        {label}
      </label>
      <input
        id={id}
        aria-describedby={descriptionId}
        aria-invalid={error ? true : undefined}
        className={cn(
          "min-h-12 w-full rounded-sm border border-line bg-surface px-4 text-base text-ivory placeholder:text-subtle transition-colors duration-[var(--mh-motion-fast)] hover:border-muted focus-visible:border-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus disabled:cursor-not-allowed disabled:opacity-50",
          error && "border-critical",
          className,
        )}
        {...props}
      />
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-sm text-critical">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-sm text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
