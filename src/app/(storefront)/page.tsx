import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";

import { CategoryProductShelves } from "@/components/storefront/category-product-shelves";
import { CinematicHero } from "@/components/storefront/cinematic-hero";
import { Container } from "@/components/storefront/container";
import { ProductCard } from "@/components/storefront/product-card";
import {
  getHomepageData,
  getCategoryShelvesData,
  type StorefrontProduct,
} from "@/data/storefront";
import type { CmsBlockValue } from "@/types/cms";

export const metadata: Metadata = {
  title: { absolute: "Men's Hub — Premium Men's Fashion" },
  description:
    "Premium men's fashion crafted for confidence, from modern wardrobe foundations to finishing details.",
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const data = await getHomepageData();
  const shelves = await getCategoryShelvesData(data.settings.lowStockThreshold);
  const block = (key: string): CmsBlockValue => data.blocks[key] ?? { fields: {} };
  const hero = block("hero");

  return (
    <main className="bg-canvas">
      {/* 1. 3D Showroom Hero */}
      <CinematicHero
        heading={hero.fields.heading || "Style Starts Here."}
        tagline={hero.fields.tagline || data.settings.tagline || "NEW SEASON / MEN'S HUB"}
        description={hero.fields.description || "Explore menswear, footwear and accessories selected for every day."}
        primaryLabel={hero.fields.primaryCtaLabel || "Shop New In"}
        primaryLink={hero.fields.primaryCtaLink || "/new-arrivals"}
        secondaryLabel={hero.fields.secondaryCtaLabel || "Explore Categories"}
        secondaryLink={hero.fields.secondaryCtaLink || "/shop"}
        mainImage={hero.imageUrl ? { url: hero.imageUrl, alt: "Men's Hub collection" } : undefined}
      />

      {/* 2. Category Product Shelves */}
      <CategoryProductShelves
        shelves={shelves}
        content={block("shop-by-category")}
      />

      {/* 3. New Arrivals */}
      <CollectionSection
        eyebrow="Latest Arrivals"
        content={block("new-arrivals")}
        fallbackHeading="New Arrivals"
        products={data.newProducts}
        href="/new-arrivals"
        empty="New arrivals will appear here when published."
      />

      {/* 4. Featured Products (only if DB has featured products) */}
      {data.featuredProducts.length > 0 ? (
        <CollectionSection
          eyebrow="Featured Edit"
          content={block("featured")}
          fallbackHeading="Featured Products"
          products={data.featuredProducts}
          href="/shop"
          empty=""
        />
      ) : null}

      {/* 5. WhatsApp Help Strip */}
      <WhatsAppHelpSection whatsapp={data.settings.whatsapp} />
    </main>
  );
}

function SectionHeader({
  eyebrow,
  heading,
  description,
  href,
}: {
  eyebrow: string;
  heading: string;
  description?: string;
  href?: string;
}) {
  return (
    <header className="mb-8 flex flex-col gap-4 border-b border-line pb-6 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="store-eyebrow text-gold font-bold uppercase tracking-widest text-xs">{eyebrow}</p>
        <h2 className="font-display text-3xl font-bold text-ivory sm:text-4xl">{heading}</h2>
        {description ? <p className="mt-2 max-w-xl text-sm text-muted">{description}</p> : null}
      </div>
      {href ? (
        <Link
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gold transition-colors hover:text-ivory"
          href={href}
        >
          View all
          <ArrowRight size={14} />
        </Link>
      ) : null}
    </header>
  );
}

function CollectionSection({
  eyebrow,
  content,
  fallbackHeading,
  products,
  href,
  empty,
}: {
  eyebrow: string;
  content: CmsBlockValue;
  fallbackHeading: string;
  products: StorefrontProduct[];
  href: string;
  empty: string;
}) {
  return (
    <section className="py-14 sm:py-20 border-b border-line bg-canvas">
      <Container size="wide">
        <SectionHeader
          eyebrow={eyebrow}
          heading={content.fields.heading || fallbackHeading}
          description={content.fields.description}
          href={products.length ? href : undefined}
        />
        {products.length ? (
          <div className="grid grid-cols-2 gap-3 min-[430px]:gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="border border-dashed border-line bg-surface/50 px-5 py-12 text-center">
            <p className="text-sm text-muted">{empty}</p>
            <Link href="/shop" className="store-cta-secondary mt-5 inline-flex text-xs font-bold uppercase tracking-wider">
              Browse Store
            </Link>
          </div>
        )}
      </Container>
    </section>
  );
}

function WhatsAppHelpSection({ whatsapp }: { whatsapp: string }) {
  const cleanNumber = whatsapp.replace(/\D/g, "");
  const href = `https://wa.me/${cleanNumber}`;

  return (
    <section className="py-14 sm:py-20 border-b border-line bg-surface text-center">
      <Container size="wide">
        <div className="mx-auto max-w-2xl px-4">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-gold/15 text-gold">
            <MessageCircle size={24} />
          </div>
          <h2 className="font-display text-2xl font-bold text-ivory sm:text-3xl">
            Need help with size, availability, or placing an inquiry?
          </h2>
          <p className="mt-3 text-sm text-muted">
            Chat directly with Men&apos;s Hub on WhatsApp for sizing advice, product availability, and order inquiries.
          </p>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="store-cta-primary mt-6 inline-flex"
          >
            <MessageCircle size={18} /> Chat with Men&apos;s Hub on WhatsApp
          </a>
        </div>
      </Container>
    </section>
  );
}
