import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShoppingBag } from "lucide-react";

import { HorizontalProductScroller } from "@/components/storefront/horizontal-product-scroller";
import { ProductTrackedLink } from "@/components/storefront/analytics-events";
import { WishlistButton } from "@/components/storefront/wishlist-button";
import { Container } from "@/components/storefront/container";
import type { StorefrontCategoryShelf } from "@/data/storefront";
import type { CmsBlockValue } from "@/types/cms";

// ── Price formatter ─────────────────────────────────────────────
const currency = new Intl.NumberFormat("en-PK", {
  style: "currency",
  currency: "PKR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

// ── "See All" end card ─────────────────────────────────────────
function SeeAllCard({ name, href }: { name: string; href: string }) {
  return (
    <Link
      href={href}
      className="mh-shelf-seeall"
      aria-label={`See all ${name}`}
    >
      <span className="mh-shelf-seeall-icon" aria-hidden="true">
        <ArrowRight size={22} strokeWidth={1.5} />
      </span>
      <span className="mh-shelf-seeall-label">
        See all
        <strong>{name}</strong>
      </span>
    </Link>
  );
}

// ── Inline product card for the shelf ─────────────────────────
function ShelfProductCard({
  product,
  priority,
}: {
  product: StorefrontCategoryShelf["products"][number];
  priority?: boolean;
}) {
  const href = `/product/${product.slug}`;
  const wishlistProduct = {
    id: product.id,
    slug: product.slug,
    name: product.name,
    sku: product.sku,
    imageUrl: product.imageUrl,
    price: product.effectivePrice,
    availableStock: product.availableArticles,
    sizes: product.sizes.map((s) => s.label),
    colors: product.colors.map((c) => c.name),
    productUrl: href,
  };

  return (
    <article className="mh-shelf-card">
      {/* Image area */}
      <div className="mh-shelf-card-image-wrap">
        <ProductTrackedLink
          productId={product.id}
          href={href}
          aria-label={`View ${product.name}`}
          className="mh-shelf-card-image-link"
        >
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 639px) 45vw, (max-width: 1023px) 28vw, 20vw"
            className="mh-shelf-card-img"
            priority={priority}
          />

          {/* Hover overlay */}
          <span className="mh-shelf-card-hover-overlay" aria-hidden="true">
            View Product
          </span>
        </ProductTrackedLink>

        {/* Badges */}
        <div className="mh-shelf-card-badges" aria-hidden="true">
          {product.isNewArrival && (
            <span className="mh-shelf-badge mh-shelf-badge-new">New</span>
          )}
          {product.isSale && product.discountPercent != null && (
            <span className="mh-shelf-badge mh-shelf-badge-sale">
              -{product.discountPercent}%
            </span>
          )}
        </div>

        {/* Wishlist */}
        <WishlistButton product={wishlistProduct} className="mh-shelf-card-wishlist" />
      </div>

      {/* Info */}
      <div className="mh-shelf-card-info">
        <ProductTrackedLink
          productId={product.id}
          href={href}
          className="mh-shelf-card-name"
        >
          {product.name}
        </ProductTrackedLink>
        <div className="mh-shelf-card-price-row">
          <span className="mh-shelf-card-price">
            {currency.format(Number(product.effectivePrice))}
          </span>
          {product.isSale && (
            <span className="mh-shelf-card-original">
              {currency.format(Number(product.originalPrice))}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

// ── One category row ───────────────────────────────────────────
function CategoryRow({
  shelf,
  isFirst,
}: {
  shelf: StorefrontCategoryShelf;
  isFirst: boolean;
}) {
  const shopHref = `/shop/${shelf.slug}`;
  const bannerImage = shelf.bannerImageUrl || shelf.imageUrl;

  return (
    <div className="mh-shelf-row">
      {/* Row header */}
      <div className="mh-shelf-row-header">
        <div className="mh-shelf-row-title-group">
          <h3 className="mh-shelf-row-title">{shelf.name}</h3>
          {shelf.description ? (
            <p className="mh-shelf-row-subtitle">{shelf.description}</p>
          ) : null}
        </div>
        <Link href={shopHref} className="mh-shelf-viewall">
          View all
          <ArrowRight size={14} strokeWidth={2.2} aria-hidden="true" />
        </Link>
      </div>

      {/* Product Scroller OR Category Card Showcase */}
      {shelf.products.length > 0 ? (
        <HorizontalProductScroller label={`${shelf.name} products`}>
          <div className="mh-shelf-rail">
            {shelf.products.map((product, idx) => (
              <div key={product.id} className="mh-shelf-rail-item">
                <ShelfProductCard product={product} priority={isFirst && idx === 0} />
              </div>
            ))}
            {/* See all end card */}
            <div className="mh-shelf-rail-item mh-shelf-rail-item-seeall">
              <SeeAllCard name={shelf.name} href={shopHref} />
            </div>
          </div>
        </HorizontalProductScroller>
      ) : (
        <div className="mh-shelf-empty-box">
          {bannerImage ? (
            <div className="mh-shelf-empty-image">
              <Image
                src={bannerImage}
                alt={shelf.name}
                fill
                sizes="(max-width: 639px) 100vw, 320px"
                className="object-cover"
              />
            </div>
          ) : null}
          <div className="mh-shelf-empty-info">
            <h4 className="mh-shelf-empty-title">Explore {shelf.name}</h4>
            <p className="mh-shelf-empty-desc">
              {shelf.description || `Browse our latest ${shelf.name.toLowerCase()} edit.`}
            </p>
            <Link href={shopHref} className="mh-shelf-empty-btn">
              Shop {shelf.name} Collection
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Default Fallback Categories Grid ───────────────────────────
const FALLBACK_CATEGORIES = [
  { name: "Clothing", slug: "clothing", desc: "Shirts, Trousers & Suits" },
  { name: "Footwear", slug: "footwear", desc: "Formal Shoes & Sneakers" },
  { name: "Accessories", slug: "accessories", desc: "Belts, Watches & Wallets" },
  { name: "New Arrivals", slug: "new-arrivals", desc: "Fresh Season Edit" },
];

function CategoryFallbackGrid() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {FALLBACK_CATEGORIES.map((cat) => (
        <Link
          key={cat.slug}
          href={`/shop/${cat.slug}`}
          className="group flex flex-col justify-between border border-line bg-surface p-6 transition-all hover:border-gold hover:shadow-lg"
        >
          <div>
            <div className="mb-3 text-gold">
              <ShoppingBag size={24} />
            </div>
            <h3 className="font-display text-lg font-bold text-ivory group-hover:text-gold transition-colors">
              {cat.name}
            </h3>
            <p className="mt-1 text-xs text-muted">{cat.desc}</p>
          </div>
          <span className="mt-6 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-gold">
            Shop Category <ArrowRight size={12} />
          </span>
        </Link>
      ))}
    </div>
  );
}

// ── Main exported section ──────────────────────────────────────
export function CategoryProductShelves({
  shelves,
  content,
}: {
  shelves: StorefrontCategoryShelf[];
  content: CmsBlockValue;
}) {
  const heading = content.fields.heading?.trim() || "Shop by Category";
  const description =
    content.fields.description ||
    "Explore our complete range of menswear, footwear, and accessories crafted for modern everyday style.";

  return (
    <section
      id="categories"
      aria-labelledby="category-shelves-heading"
      className="mh-shelves-section"
    >
      <Container size="wide">
        {/* ── Section header ── */}
        <div className="mh-shelves-header">
          <div className="mh-shelves-header-left">
            <h2 id="category-shelves-heading" className="mh-shelves-heading">
              {heading}
            </h2>
            <p className="mh-shelves-subtitle">{description}</p>
          </div>
          <Link href="/shop" className="mh-shelves-explore">
            Explore all categories
            <ArrowRight size={15} strokeWidth={2} aria-hidden="true" className="mh-shelves-explore-arrow" />
          </Link>
        </div>

        {/* ── Category rows or Fallback ── */}
        {shelves.length > 0 ? (
          <div className="mh-shelves-rows">
            {shelves.map((shelf, idx) => (
              <CategoryRow key={shelf.id} shelf={shelf} isFirst={idx === 0} />
            ))}
          </div>
        ) : (
          <CategoryFallbackGrid />
        )}
      </Container>
    </section>
  );
}
