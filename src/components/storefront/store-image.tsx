"use client";

import { ImageIcon } from "lucide-react";
import Image, { type ImageProps } from "next/image";
import { useState } from "react";

type StoreImageProps = Omit<ImageProps, "onError"> & {
  fallbackLabel?: string;
};

export function StoreImage({ alt, fallbackLabel, ...props }: StoreImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="absolute inset-0 grid place-items-center bg-[#171718] px-4 text-center" role="img" aria-label={fallbackLabel || alt}>
        <div>
          <ImageIcon className="mx-auto text-gold/70" size={22} strokeWidth={1.4} aria-hidden="true" />
          <p className="mt-3 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-muted">Image unavailable</p>
        </div>
      </div>
    );
  }

  return <Image {...props} alt={alt} onError={() => setFailed(true)} />;
}
