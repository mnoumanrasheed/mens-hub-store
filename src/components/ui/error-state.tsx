import type { ReactNode } from "react";
import { TriangleAlert } from "lucide-react";

import { Heading } from "@/components/ui/heading";

type ErrorStateProps = {
  action?: ReactNode;
  description: string;
  eyebrow?: string;
  title: string;
};

export function ErrorState({
  action,
  description,
  eyebrow = "Error",
  title,
}: ErrorStateProps) {
  return (
    <section
      aria-live="polite"
      className="mx-auto max-w-xl rounded-lg border border-line bg-surface p-7 shadow-[var(--mh-shadow-soft)] sm:p-10"
    >
      <TriangleAlert aria-hidden="true" className="mb-6 size-8 text-critical" />
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-critical">
        {eyebrow}
      </p>
      <Heading as="h1" size="lg" className="mt-3">
        {title}
      </Heading>
      <p className="mt-4 text-sm leading-7 text-muted sm:text-base">
        {description}
      </p>
      {action ? <div className="mt-8">{action}</div> : null}
    </section>
  );
}
