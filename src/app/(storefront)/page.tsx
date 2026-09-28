import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";

import { CategoriesInFocus } from "@/components/storefront/categories-in-focus";
import { AnnouncementBar } from "@/components/storefront/announcement-bar";
import { CinematicHero } from "@/components/storefront/cinematic-hero";
import { Container } from "@/components/storefront/container";
import { ProductCard } from "@/components/storefront/product-card";
import {
  getCategoryShelvesData,
  getHomepageData,
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
  const categoryBlock = block("shop-by-category");
  const essentials = data.featuredProducts.length ? data.featuredProducts : data.saleProducts;

  return (
    <main className="mh-homepage">
      <AnnouncementBar />
      <CinematicHero
        heading={"DRESS WITH\nDISTINCTION."}
        tagline="MEN'S HUB — PREMIUM MENSWEAR"
        description="Modern menswear, footwear and accessories selected for everyday confidence."
        primaryLabel="Shop collection"
        primaryLink="/shop"
        secondaryLabel="New arrivals"
        secondaryLink="/new-arrivals"
      />

      <TrustStrip deliveryMessage={data.settings.deliveryChargesMessage} />

      <CategoriesInFocus
        shelves={shelves}
        heading="Shop by category"
        description={categoryBlock.fields.description || undefined}
      />

      <ProductCollection
        eyebrow="Just in"
        heading={block("new-arrivals").fields.heading || "New arrivals"}
        description={block("new-arrivals").fields.description}
        products={data.newProducts}
        href="/new-arrivals"
      />

      {essentials.length ? (
        <ProductCollection
          eyebrow="The essentials"
          heading={block("featured").fields.heading || "Essentials"}
          description={block("featured").fields.description}
          products={essentials}
         href="/shop"
        />
      ) : null}

      <WhatsAppHelpSection whatsapp={data.settings.whatsapp} />
    </main>
  );
}

function TrustStrip({ deliveryMessage }: { deliveryMessage: string }) {
  return (
    <section className="mh-trust-strip" aria-label="Men's Hub service highlights">
      <Container size="wide">
        <div>
          <span>01</span>
          <p>Curated menswear</p>
        </div>
        <div>
          <span>02</span>
          <p>Personal sizing guidance</p>
        </div>
        <div>
          <span>03</span>
          <p>{deliveryMessage || "Order by WhatsApp"}</p>
        </div>
      </Container>
    </section>
  );
}

function ProductCollection({
  eyebrow,
  heading,
  description,
  products,
  href,
}: {
  eyebrow: string;
  heading: string;
  description?: string;
  products: StorefrontProduct[];
  href: string;
}) {
  if (!products.length) return null;

  return (
    <section className="mh-home-section mh-product-collection" aria-labelledby={`${heading.toLowerCase().replaceAll(" ", "-")}-heading`}>
      <Container size="wide">
        <div className="mh-section-heading">
          <div>
            <p className="mh-eyebrow">{eyebrow}</p>
            <h2 id={`${heading.toLowerCase().replaceAll(" ", "-")}-heading`}>{heading}</h2>
            {description ? <p>{description}</p> : null}
          </div>
          {products.length ? <Link href={href} className="mh-text-link">View all <ArrowRight size={15} /></Link> : null}
        </div>
        <div className="mh-product-collection-grid">
          {products.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </Container>
    </section>
  );
}

function WhatsAppHelpSection({ whatsapp }: { whatsapp: string }) {
  const cleanNumber = whatsapp.replace(/\D/g, "");
  const href = `https://wa.me/${cleanNumber}`;

  return (
    <section className="mh-whatsapp-section" aria-labelledby="whatsapp-heading">
      <Container size="narrow">
        <p className="mh-eyebrow">Need a second opinion?</p>
        <h2 id="whatsapp-heading">Let&apos;s find your fit.</h2>
        <p>Chat with Men&apos;s Hub about sizing, availability, and product inquiries.</p>
        <a href={href} target="_blank" rel="noopener noreferrer" className="mh-button mh-button-dark"><MessageCircle size={17} /> Chat on WhatsApp</a>
      </Container>
    </section>
  );
}
