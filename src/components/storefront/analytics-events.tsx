"use client";

import Link from "next/link";
import { useEffect, useRef, type ComponentProps } from "react";
import { trackSiteEvent } from "@/lib/analytics";

export function ProductViewEvent({ productId }: { productId: string }) {
  const sent = useRef(false);
  useEffect(() => { if (!sent.current) { sent.current = true; trackSiteEvent("PRODUCT_VIEW", productId); } }, [productId]);
  return null;
}

export function ProductTrackedLink({ productId, onClick, ...props }: ComponentProps<typeof Link> & { productId: string }) {
  return <Link {...props} onClick={(event) => { trackSiteEvent("PRODUCT_CLICK", productId); onClick?.(event); }} />;
}
