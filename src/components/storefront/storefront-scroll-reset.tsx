"use client";

import { usePathname } from "next/navigation";
import { useLayoutEffect } from "react";

/** Keeps each new storefront route anchored to its own page start. */
export function StorefrontScrollReset() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    // Next performs its own scroll adjustment during a transition. Queue this
    // after that step so a new storefront route always starts at its page top.
    const frame = window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [pathname]);

  return null;
}
