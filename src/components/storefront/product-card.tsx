import { ArrowRight } from "lucide-react";

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
    <article className="group relative flex flex-col overflow-hidden rounded-sm border border-line bg-surface transition-all duration-300 hover:border-gray-300 hover:shadow-md">
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-surface-raised">
        <ProductTrackedLink
          productId={product.id}
          href={href}
          aria-label={`View ${product.name}`}
          className="block size-full"
        >
          <StoreImage
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 429px) 50vw, (max-width: 639px) 50vw, (max-width: 1023px) 33vw, 25vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </ProductTrackedLink>

        <div className="pointer-events-none absolute left-2.5 top-2.5 flex flex-wrap gap-1">
          {product.isNewArrival ? (
            <span className="rounded-xs bg-gold px-2 py-0.5 text-[0.6rem] font-black uppercase tracking-wider text-gold-ink">
              New
            </span>
          ) : null}
          {product.isSale ? (
            <span className="rounded-xs bg-black px-2 py-0.5 text-[0.6rem] font-black uppercase tracking-wider text-white">
              -{product.discountPercent}%
            </span>
          ) : null}
        </div>

        <WishlistButton product={wishlistProduct} className="absolute right-2.5 top-2.5" />
      </div>

      <div className="flex flex-1 flex-col justify-between p-3.5 sm:p-4">
        <div>
          <p className="text-[0.6rem] font-bold uppercase tracking-widest text-muted">
            {product.sku || "Men’s Hub"}
          </p>
          <ProductTrackedLink
            productId={product.id}
            href={href}
            className="mt-1 block text-sm font-bold text-ivory transition-colors hover:text-gold line-clamp-2"
          >
            {product.name}
          </ProductTrackedLink>
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-line pt-3">
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-black text-ivory">
              {currency.format(Number(product.effectivePrice))}
            </span>
            {product.isSale ? (
              <span className="text-xs text-subtle line-through">
                {currency.format(Number(product.originalPrice))}
              </span>
            ) : null}
          </div>

          <ProductTrackedLink
            productId={product.id}
            href={href}
            className="inline-flex items-center gap-1 text-[0.65rem] font-extrabold uppercase tracking-wider text-gold hover:text-ivory"
            aria-label={`View ${product.name}`}
          >
            View
            <ArrowRight size={12} />
          </ProductTrackedLink>
        </div>
      </div>
    </article>
  );
}
