import { ArrowUpRight, MessageCircle } from "lucide-react";

import { ProductTrackedLink } from "@/components/storefront/analytics-events";
import { StoreImage } from "@/components/storefront/store-image";
import { WishlistButton } from "@/components/storefront/wishlist-button";
import type { StorefrontProduct } from "@/data/storefront";

const currency = new Intl.NumberFormat("en-PK", {
  style: "currency",
  currency: "PKR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export function ProductCard({ product }: { product: StorefrontProduct }) {
  const href = `/product/${product.slug}`;
  const wishlistProduct = {
    id: product.id,
    slug: product.slug,
    name: product.name,
    sku: product.sku,
    imageUrl: product.imageUrl,
    price: product.effectivePrice,
    availableStock: product.availableArticles,
    sizes: product.sizes.map((item) => item.label),
    colors: product.colors.map((item) => item.name),
    productUrl: href,
  };

  return (
    <article className="atelier-product group min-w-0 transition duration-500 ease-[var(--mh-ease-out)] motion-safe:hover:-translate-y-1">
      <div className="atelier-product-visual relative aspect-[4/5] overflow-hidden bg-surface-raised shadow-[0_16px_45px_rgb(0_0_0/0)] transition-shadow duration-500 group-hover:shadow-[0_20px_55px_rgb(0_0_0/0.32)]">
        <ProductTrackedLink
          productId={product.id}
          href={href}
          aria-label={`View ${product.name}`}
          className="block h-full"
        >
          <StoreImage
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 429px) 100vw, (max-width: 639px) 50vw, (max-width: 1023px) 33vw, 25vw"
            className="object-cover transition duration-[900ms] ease-[var(--mh-ease-out)] motion-safe:group-hover:scale-[1.045]"
          />
          <span className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/10" aria-hidden="true" />
        </ProductTrackedLink>

        <div className="pointer-events-none absolute left-3 top-3 flex max-w-[calc(100%-4.5rem)] flex-wrap gap-1.5 sm:left-4 sm:top-4">
          <span className="product-badge border border-white/20 bg-black/65 text-ivory backdrop-blur-md">Premium</span>
          {product.isNewArrival ? <span className="product-badge bg-gold text-gold-ink">New arrival</span> : null}
          {product.isSale ? <span className="product-badge border border-gold/45 bg-black/70 text-gold backdrop-blur-md">Save {product.discountPercent}%</span> : null}
        </div>

        <WishlistButton product={wishlistProduct} className="absolute right-3 top-3 sm:right-4 sm:top-4" />
      </div>

      <div className="atelier-product-details border-x border-b border-white/[0.08] bg-[#101011] p-4 transition-colors duration-500 group-hover:border-white/15 group-hover:bg-[#121213] sm:p-5">
        <p className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-gold">Men’s Hub Collection</p>
        <ProductTrackedLink
          productId={product.id}
          href={href}
          className="atelier-product-title mt-2 block min-h-[2.8rem] font-display text-[1.45rem] font-semibold leading-[1.05] text-ivory transition-colors hover:text-gold sm:text-[1.65rem]"
        >
          {product.name}
        </ProductTrackedLink>

        <div className="mt-3 flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
          <span className="text-sm font-bold tracking-wide text-ivory">{currency.format(Number(product.effectivePrice))}</span>
          {product.isSale ? <span className="text-xs text-subtle line-through">{currency.format(Number(product.originalPrice))}</span> : null}
        </div>

        <p className="atelier-product-options">{product.availableArticles === 0 ? "Out of stock" : product.sizes.length ? product.sizes.map((size) => size.label).join(" / ") : "Available now"}{product.colors.length ? ` · ${product.colors.length} ${product.colors.length === 1 ? "color" : "colors"}` : ""}</p>
        <ProductTrackedLink
          productId={product.id}
          href={href}
          className="atelier-product-order mt-5 flex min-h-12 items-center justify-between border-t border-white/10 pt-4 text-[0.62rem] font-extrabold uppercase tracking-[0.12em] text-ivory transition-colors duration-300 hover:text-gold"
          aria-label={`Order ${product.name} on WhatsApp`}
        >
          <span className="flex items-center gap-2"><MessageCircle size={15} strokeWidth={1.7} /> Order on WhatsApp</span>
          <ArrowUpRight className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" size={15} />
        </ProductTrackedLink>
      </div>
    </article>
  );
}
