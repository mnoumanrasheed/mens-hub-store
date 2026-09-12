import Image from "next/image";

import { cn } from "@/lib/cn";

type LoadingIndicatorProps = {
  label?: string;
  message?: string;
  className?: string;
};

export function LoadingIndicator({
  label = "Preparing the collection",
  message = "Men's Hub",
  className,
}: LoadingIndicatorProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn("premium-loader", className)}
    >
      <span className="sr-only">{label}</span>
      <span className="premium-loader-mark" aria-hidden="true">
        <span className="premium-loader-orbit" />
        <span className="premium-loader-frame"><span className="premium-loader-sweep" aria-hidden="true" />
          <Image
            src="/logo.png"
            alt=""
            width={1448}
            height={1086}
            className="h-full w-full object-contain p-1"
            priority
          />
        </span>
      </span>
      <span className="premium-loader-copy">
        <span className="sr-only">{message}</span>
        <span className="premium-loader-label">{label}</span>
      </span>
      <span className="premium-loader-track" aria-hidden="true">
        <span className="premium-loader-progress" />
      </span>
    </div>
  );
}
