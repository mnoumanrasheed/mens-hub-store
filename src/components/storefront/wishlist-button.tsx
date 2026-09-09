"use client";

import { Heart } from "lucide-react";
import { toggleWishlist, useWishlist } from "@/components/storefront/commerce-store";
import type { CommerceProduct } from "@/domain/commerce/storage";
import { cn } from "@/lib/cn";

export function WishlistButton({ product, className }: { product: CommerceProduct; className?: string }) {
  const selected = useWishlist().some((item) => item.id === product.id);
  return <button type="button" className={cn("grid size-10 place-items-center rounded-full border border-white/20 bg-black/45 text-white backdrop-blur-sm transition hover:border-gold hover:text-gold", className)} aria-label={selected ? "Remove from wishlist" : "Add to wishlist"} aria-pressed={selected} onClick={() => toggleWishlist(product)}><Heart size={18} fill={selected ? "currentColor" : "none"} /></button>;
}
