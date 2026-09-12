import type { Metadata } from "next";
import { Check, RefreshCcw, ShieldCheck, Truck } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Container } from "@/components/storefront/container";
import { ProductCard } from "@/components/storefront/product-card";
import { ProductDetailReveal, ProductGallery } from "@/components/storefront/product-gallery";
import { ProductPurchasePanel } from "@/components/storefront/product-purchase-panel";
import { RecentlyViewed } from "@/components/storefront/recently-viewed";
import { createProductMetadata } from "@/domain/seo/product";
import { getStorefrontProduct } from "@/data/storefront";
import { getSiteUrl } from "@/lib/site-url";

const currency = new Intl.NumberFormat("en-PK", {
  style: "currency",
  currency: "PKR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getStorefrontProduct(slug);
  return product
    ? createProductMetadata(product)
    : { title: "Product not found", robots: { index: false, follow: false } };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getStorefrontProduct(slug);
  if (!product) notFound();

  const productUrl = new URL(`/product/${product.slug}`, getSiteUrl()).toString();
  const stock = product.availableArticles === 0
    ? "Out of stock"
    : product.availableArticles <= product.lowStockThreshold
      ? `Only ${product.availableArticles} left`
      : "Available now";

  return (
    <main className="pb-24 pt-8 sm:pb-32 sm:pt-12">
      <Container size="wide">
        <nav aria-label="Breadcrumb" className="mb-7 flex flex-wrap items-center gap-2 text-[0.65rem] font-bold uppercase tracking-[0.12em] text-subtle sm:mb-9">
          <Link className="transition-colors hover:text-gold" href="/shop">Collections</Link>
          <span className="text-line">/</span>
          <Link className="transition-colors hover:text-gold" href={`/shop/${product.category.slug}`}>{product.category.name}</Link>
          {product.subcategory ? (
            <>
              <span className="text-line">/</span>
              <Link className="transition-colors hover:text-gold" href={`/shop/${product.category.slug}/${product.subcategory.slug}`}>{product.subcategory.name}</Link>
            </>
          ) : null}
        </nav>

        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1.08fr)_minmax(23rem,0.92fr)] lg:gap-14 xl:gap-20">
          <ProductGallery imageUrl={product.imageUrl} name={product.name} />

          <ProductDetailReveal>
            <div className="lg:py-4">
              <p className="store-eyebrow">{product.subcategory?.name || product.category.name}</p>
              <h1 className="max-w-[12ch] break-words text-balance font-display text-[clamp(2.8rem,12vw,5.7rem)] font-semibold leading-[0.88] tracking-[-0.04em] text-ivory sm:text-[clamp(3.1rem,6vw,5.7rem)]">
                {product.name}
              </h1>
              <p className="mt-4 text-[0.62rem] font-bold uppercase tracking-[0.18em] text-subtle">Article {product.sku}</p>

              <div className="mt-7 flex flex-wrap items-baseline gap-3 border-b border-white/10 pb-7">
                <p className="text-xl font-bold tracking-tight text-ivory sm:text-2xl">{currency.format(Number(product.effectivePrice))}</p>
                {product.isSale ? (
                  <>
                    <p className="text-sm text-subtle line-through">{currency.format(Number(product.originalPrice))}</p>
                    <span className="product-badge border border-gold/45 bg-black/60 text-gold">Save {product.discountPercent}%</span>
                  </>
                ) : null}
              </div>

              <div className="border-b border-white/10 py-7">
                <p className="text-sm leading-7 text-muted whitespace-pre-line">{product.description}</p>
              </div>

              <section className="border-b border-white/10 py-7" aria-labelledby="product-highlights">
                <p className="store-eyebrow">The details</p>
                <h2 id="product-highlights" className="font-display text-2xl font-semibold text-ivory">Product highlights</h2>
                <ul className="mt-5 grid gap-3 text-sm leading-6 text-muted min-[430px]:grid-cols-2">
                  <Highlight>{product.productType || `Designed for the ${product.category.name} collection`}</Highlight>
                  <Highlight>{product.material || "Selected for a refined finish and confident wear"}</Highlight>
                  <Highlight>{product.subcategory ? `Part of our ${product.subcategory.name} edit` : "Curated by Men’s Hub"}</Highlight>
                  <Highlight>Personal sizing and order support on WhatsApp</Highlight>
                </ul>
              </section>

              <dl className="grid border-b border-white/10 py-2 text-sm min-[430px]:grid-cols-2">
                <ProductFact label="Category">
                  <Link className="text-ivory transition-colors hover:text-gold" href={`/shop/${product.category.slug}`}>{product.category.name}</Link>
                </ProductFact>
                <ProductFact label="Availability">
                  <span className={product.availableArticles === 0 ? "text-critical" : "text-gold"}>{stock}</span>
                </ProductFact>
                {product.productType ? <ProductFact label="Product type">{product.productType}</ProductFact> : null}
                {product.material ? <ProductFact label="Material / fabric">{product.material}</ProductFact> : null}
              </dl>

              <ProductPurchasePanel product={product} ordering={product.ordering} productUrl={productUrl} />

              <section aria-label="Shopping assurances" className="mt-9 grid border-y border-white/10 min-[430px]:grid-cols-3">
                <TrustItem icon={<ShieldCheck size={18} />} label="Quality Checked" detail="Reviewed before dispatch" />
                <TrustItem icon={<Truck size={18} />} label="Fast Delivery" detail="Confirmed on WhatsApp" />
                <TrustItem icon={<RefreshCcw size={18} />} label="Easy Exchange" detail="Fit support available" />
              </section>

              <div className="mt-6 flex items-start gap-3 text-xs leading-6 text-subtle">
                <Check className="mt-1 shrink-0 text-gold" size={14} />
                <p>{product.ordering.deliveryMessage}</p>
              </div>
            </div>
          </ProductDetailReveal>
        </div>

        {product.relatedProducts.length ? (
          <section className="mt-24 border-t border-line pt-14 sm:mt-32 sm:pt-16">
            <p className="store-eyebrow">Continue the edit</p>
            <h2 className="font-display text-4xl text-ivory sm:text-5xl">Related products</h2>
            <div className="mt-8 grid grid-cols-1 gap-6 min-[430px]:grid-cols-2 min-[430px]:gap-3 sm:grid-cols-4 sm:gap-5">
              {product.relatedProducts.map((item) => <ProductCard key={item.id} product={item} />)}
            </div>
          </section>
        ) : null}

        <RecentlyViewed current={{ id: product.id, slug: product.slug, name: product.name, sku: product.sku, imageUrl: product.imageUrl, price: product.effectivePrice }} />
      </Container>
    </main>
  );
}

function ProductFact({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-white/10 py-5 first:border-t-0 min-[430px]:border-t-0 min-[430px]:odd:pr-4 min-[430px]:even:border-l min-[430px]:even:pl-4">
      <dt className="text-[0.58rem] font-bold uppercase tracking-[0.16em] text-subtle">{label}</dt>
      <dd className="mt-2 text-sm text-muted">{children}</dd>
    </div>
  );
}

function Highlight({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <Check className="mt-1 shrink-0 text-gold" size={14} />
      <span>{children}</span>
    </li>
  );
}

function TrustItem({ icon, label, detail }: { icon: React.ReactNode; label: string; detail: string }) {
  return (
    <div className="flex min-h-24 items-start gap-3 border-t border-white/10 py-5 text-gold first:border-t-0 min-[430px]:justify-center min-[430px]:border-l min-[430px]:border-t-0 min-[430px]:px-3 min-[430px]:first:border-l-0">
      {icon}
      <span>
        <span className="block text-[0.6rem] font-bold uppercase tracking-[0.12em] text-ivory">{label}</span>
        <span className="mt-1 block text-[0.65rem] leading-5 text-subtle">{detail}</span>
      </span>
    </div>
  );
}
