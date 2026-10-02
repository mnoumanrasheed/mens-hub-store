"use client";

import { ImageIcon } from "lucide-react";
import Image, { type ImageProps } from "next/image";
import { useEffect, useRef, useState } from "react";

type StoreImageProps = Omit<ImageProps, "onError" | "onLoad"> & {
  fallbackLabel?: string;
  onError?: ImageProps["onError"];
  onLoad?: ImageProps["onLoad"];
};

export function StoreImage({ alt, fallbackLabel, onError, onLoad, ...props }: StoreImageProps) {
  const sourceKey = typeof props.src === "string" ? props.src : "src" in props.src ? props.src.src : props.src.default.src;

  const [failedSource, setFailedSource] = useState<string | null>(null);
  const failed = failedSource === sourceKey;
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // Visibility is not gated on this state; it only selects an error fallback.

    // A browser cache can settle before React attaches image event handlers.
    const image = imageRef.current;
    if (image?.complete && image.naturalWidth === 0) setFailedSource(sourceKey);
  }, [sourceKey]);

  if (failed) {
    return (
      <div className="mh-image-fallback absolute inset-0 grid place-items-center px-4 text-center" role="img" aria-label={fallbackLabel || alt}>
        <div>
          <ImageIcon className="mx-auto text-gold/70" size={22} strokeWidth={1.4} aria-hidden="true" />
          <p className="mt-3 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-muted">Image unavailable</p>
        </div>
      </div>
    );
  }

  return (
    <Image
      {...props}
      ref={imageRef}
      alt={alt}
      onLoad={(event) => { setFailedSource(null); onLoad?.(event); }}
      onError={(event) => { setFailedSource(sourceKey); onError?.(event); }}
    />
  );
}
