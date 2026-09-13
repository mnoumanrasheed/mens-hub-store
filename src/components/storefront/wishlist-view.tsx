"use client";

import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { addCartLine, removeWishlistProduct, useWishlist } from "@/components/storefront/commerce-store";
import { StoreImage } from "@/components/storefront/store-image";
import type { CommerceProduct } from "@/domain/commerce/storage";

const currency = new Intl.NumberFormat("en-PK", { style: "currency", currency: "PKR", minimumFractionDigits: 0, maximumFractionDigits: 2 });

function WishlistItem({ product }: { product: CommerceProduct }) {
  const [size, setSize] = useState(product.sizes[0] ?? "");
  const [color, setColor] = useState(product.colors[0] ?? "");
  const [notice, setNotice] = useState("");
  const canAdd = product.availableStock > 0 && (!product.sizes.length || size) && (!product.colors.length || color);

  function add(move: boolean) {
    if (!canAdd) return;
    addCartLine({ ...product, productUrl: new URL(product.productUrl, window.location.origin).toString() }, size, color, 1);
    if (move) removeWishlistProduct(product.id);
    else setNotice("Added to cart.");
  }

  return (
    <article className="atelier-wishlist-card grid gap-4 border border-line bg-surface p-3 min-[430px]:p-4 sm:grid-cols-[8rem_minmax(0,1fr)]">
      <Link href={`/product/${product.slug}`} className="relative aspect-[4/5] overflow-hidden bg-surface-raised">
        <StoreImage src={product.imageUrl} alt={product.name} fill sizes="(max-width: 639px) 100vw, 128px" className="object-cover" />
      </Link>
      <div className="min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link href={`/product/${product.slug}`} className="line-clamp-2 font-display text-2xl leading-tight text-ivory hover:text-gold">{product.name}</Link>
            <p className="mt-1 text-[0.62rem] font-bold uppercase tracking-[0.12em] text-subtle">Article {product.sku}</p>
          </div>
          <button type="button" className="store-icon-button shrink-0 text-muted hover:text-critical" aria-label={`Remove ${product.name} from wishlist`} onClick={() => removeWishlistProduct(product.id)}><Trash2 size={17} /></button>
        </div>
        <p className="mt-3 font-bold text-ivory">{currency.format(Number(product.price))}</p>
        <div className="mt-4 grid gap-3 min-[430px]:grid-cols-2 sm:grid-cols-1 xl:grid-cols-2">
          {product.sizes.length ? <label className="grid gap-1 text-xs font-bold uppercase tracking-[0.12em] text-muted">Size<select className="store-filter-input" value={size} onChange={(event) => setSize(event.target.value)}>{product.sizes.map((value) => <option key={value}>{value}</option>)}</select></label> : null}
          {product.colors.length ? <label className="grid gap-1 text-xs font-bold uppercase tracking-[0.12em] text-muted">Color<select className="store-filter-input" value={color} onChange={(event) => setColor(event.target.value)}>{product.colors.map((value) => <option key={value}>{value}</option>)}</select></label> : null}
        </div>
        <div className="mt-4 grid gap-2 min-[430px]:grid-cols-2 sm:grid-cols-1 xl:grid-cols-2">
          <button type="button" disabled={!canAdd} className="store-cta-primary w-full disabled:cursor-not-allowed disabled:opacity-40" onClick={() => add(false)}>Add to cart</button>
          <button type="button" disabled={!canAdd} className="store-cta-secondary w-full disabled:cursor-not-allowed disabled:opacity-40" onClick={() => add(true)}>Move to cart</button>
        </div>
        {product.availableStock === 0 ? <p className="mt-3 text-xs font-bold uppercase tracking-[0.1em] text-critical">Out of stock</p> : null}
        {notice ? <p className="mt-3 text-sm text-gold" role="status">{notice}</p> : null}
      </div>
    </article>
  );
}

export function WishlistView() {
  const products = useWishlist();
  if (!products.length) return <div className="atelier-empty border border-line bg-surface px-5 py-14 text-center sm:px-6 sm:py-16"><Heart className="mx-auto text-gold" /><h1 className="mt-5 font-display text-4xl text-ivory">Your Wishlist</h1><p className="mx-auto mt-3 max-w-md text-sm leading-7 text-muted">Save pieces with the heart icon. Your wishlist stays on this device—no account needed.</p><Link href="/shop" className="store-cta-primary mt-7 w-full min-[390px]:w-auto">Explore collection</Link></div>;

  return <><div className="atelier-bag-heading mb-8 sm:mb-9"><p className="store-eyebrow">Saved on this device</p><h1 className="font-display text-4xl text-ivory sm:text-5xl">Your Wishlist</h1><p className="mt-2 text-sm leading-6 text-muted">Choose any required options, then add or move an item to your cart.</p></div><div className="grid gap-4 lg:grid-cols-2">{products.map((product) => <WishlistItem key={product.id} product={product} />)}</div><Link href="/cart" className="store-cta-secondary mt-8 w-full min-[390px]:w-auto"><ShoppingBag size={17} /> View cart</Link></>;
}
