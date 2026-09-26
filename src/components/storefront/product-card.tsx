import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { StoreImage } from "@/components/storefront/store-image";
import { WishlistButton } from "@/components/storefront/wishlist-button";
import type { StorefrontProduct } from "@/data/storefront";

const currency = new Intl.NumberFormat("en-PK", { style: "currency", currency: "PKR", minimumFractionDigits: 0, maximumFractionDigits: 2 });

export function ProductCard({ product, priority = false }: { product: StorefrontProduct; priority?: boolean }) {
  const href = `/product/${product.id}`;
  const wishlistProduct = { id: product.id, name: product.name, imageUrl: product.imageUrl, price: product.effectivePrice, availableStock: product.stock, sizes: product.sizes.map((item) => item.label), colors: product.colors.map((item) => item.name), productUrl: href };
  return <article className="mh-product-card group"><div className="mh-product-card-media"><Link href={href} aria-label={`View ${product.name}`} className="block size-full"><StoreImage src={product.imageUrl} alt={product.name} fill priority={priority} sizes="(max-width: 639px) 76vw, (max-width: 1023px) 34vw, 24vw" className="mh-product-card-image" /><span className="mh-product-card-view" aria-hidden="true">View Product <ArrowUpRight size={14} strokeWidth={1.7} /></span></Link><div className="mh-product-card-badges" aria-hidden="true">{product.isNewArrival ? <span>New</span> : null}{product.isSale && product.discountPercent != null ? <span>-{product.discountPercent}%</span> : null}</div><WishlistButton product={wishlistProduct} className="mh-product-card-wishlist" /></div><div className="mh-product-card-info"><div className="min-w-0"><p className="mh-product-card-meta">{product.isSale ? "Sale edit" : "Men’s Hub"}</p><Link href={href} className="mh-product-card-name">{product.name}</Link></div><div className="mh-product-card-price-row"><span className="mh-product-card-price">{currency.format(Number(product.effectivePrice))}</span>{product.isSale ? <span className="mh-product-card-original">{currency.format(Number(product.originalPrice))}</span> : null}</div></div></article>;
}
