import { LoaderCircle } from "lucide-react";

type LoadingIndicatorProps = {
  label?: string;
};

export function LoadingIndicator({
  label = "Loading",
}: LoadingIndicatorProps) {
  return (
    <div
      role="status"
      className="inline-flex min-h-11 items-center gap-3 text-sm font-semibold text-muted"
    >
      <LoaderCircle aria-hidden="true" className="size-5 animate-spin text-gold" />
      <span>{label}</span>
    </div>
  );
}
