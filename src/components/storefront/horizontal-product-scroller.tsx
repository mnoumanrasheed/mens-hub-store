"use client";

import {
  useRef,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface HorizontalProductScrollerProps {
  children: ReactNode;
  /** Accessible label for this rail (e.g. "Shirts products") */
  label: string;
}

export function HorizontalProductScroller({
  children,
  label,
}: HorizontalProductScrollerProps) {
  const railRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const syncArrows = useCallback(() => {
    const el = railRef.current;
    if (!el) return;
    // Small epsilon to handle sub-pixel rounding
    setCanScrollLeft(el.scrollLeft > 2);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 2);
  }, []);

  useEffect(() => {
    const el = railRef.current;
    if (!el) return;
    syncArrows();
    el.addEventListener("scroll", syncArrows, { passive: true });
    const ro = new ResizeObserver(syncArrows);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", syncArrows);
      ro.disconnect();
    };
  }, [syncArrows]);

  const scrollBy = useCallback((direction: "left" | "right") => {
    const el = railRef.current;
    if (!el) return;
    // Scroll by ~80% of the visible width
    const delta = el.clientWidth * 0.8;
    el.scrollBy({ left: direction === "right" ? delta : -delta, behavior: "smooth" });
  }, []);

  return (
    <div className="mh-scroller-wrap">
      {/* Left arrow */}
      <button
        type="button"
        className="mh-scroller-arrow mh-scroller-arrow-left"
        aria-label="Scroll left"
        aria-hidden={!canScrollLeft}
        tabIndex={canScrollLeft ? 0 : -1}
        onClick={() => scrollBy("left")}
        disabled={!canScrollLeft}
      >
        <ChevronLeft size={18} strokeWidth={2} />
      </button>

      {/* Scrollable rail */}
      <div
        ref={railRef}
        className="mh-scroller-rail"
        aria-label={label}
        role="region"
        tabIndex={0}
      >
        {children}
      </div>

      {/* Right arrow */}
      <button
        type="button"
        className="mh-scroller-arrow mh-scroller-arrow-right"
        aria-label="Scroll right"
        aria-hidden={!canScrollRight}
        tabIndex={canScrollRight ? 0 : -1}
        onClick={() => scrollBy("right")}
        disabled={!canScrollRight}
      >
        <ChevronRight size={18} strokeWidth={2} />
      </button>
    </div>
  );
}
