"use client";

import { useReducedMotion } from "motion/react";
import Link from "next/link";
import { CollectionCard } from "@/components/storefront/collection-card";
import { Container } from "@/components/storefront/container";
import { ScrollReveal } from "@/components/storefront/scroll-reveal";
import type { StorefrontCategory } from "@/data/storefront";
import type { CmsBlockValue } from "@/types/cms";
import styles from "./category-showcase.module.css";

export function CategoryShowcase({ categories, content }: { categories: StorefrontCategory[]; content: CmsBlockValue }) {
  const reduceMotion = useReducedMotion();
  // Preserve owner-written CMS copy while replacing the original default heading.
  const heading = content.fields.heading?.trim();
  const customHeading = heading && !["Shop by Category", "Find your signature."].includes(heading);
  const reveal = reduceMotion ? undefined : { opacity: [0, 1], y: [25, 0] };

  return (
    <section id="categories" aria-labelledby="collections-heading" className={`${styles.section} scroll-mt-24`}>
      <Container size="wide">
        <header className={styles.header}>
          <div>
            <ScrollReveal whileInView={reduceMotion ? undefined : { opacity: [0, 1] }}>
              <p className={styles.eyebrow}><span aria-hidden="true" />THE MEN’S HUB COLLECTIONS</p>
            </ScrollReveal>
            <ScrollReveal delay={0.08} whileInView={reveal}>
              <h2 id="collections-heading" className={styles.heading}>
                {customHeading ? heading : <>Curated for the<br /><em>Modern Gentleman.</em></>}
              </h2>
            </ScrollReveal>
          </div>
          <ScrollReveal delay={0.16} whileInView={reveal}>
            <p className={styles.description}>
              {content.fields.description || "Explore refined essentials, timeless tailoring and modern accessories selected for every expression of men's style."}
            </p>
          </ScrollReveal>
        </header>
        {categories.length ? <>
          <div className={styles.featured}>
            {categories.slice(0, 3).map((category, index) => (
              <CollectionCard key={category.id} category={category} index={index} featured lead={index === 0} />
            ))}
          </div>
          {categories.length > 3 ? <div className={styles.secondarySection}>
            <ScrollReveal className={styles.divider} whileInView={reveal}>
              <p>EVERY DETAIL, CONSIDERED</p>
              <span aria-hidden="true" />
              <p className={styles.collectionCount}>{String(categories.length).padStart(2, "0")} COLLECTIONS</p>
            </ScrollReveal>
            <div className={styles.secondary}>
              {categories.slice(3).map((category, index) => (
                <CollectionCard key={category.id} category={category} index={index + 3} />
              ))}
            </div>
          </div> : null}
        </> : <div className="border border-line px-6 py-16 text-center">
          <p className="text-sm text-muted">Categories will appear here after they are enabled.</p>
          <Link className="store-cta-secondary mt-6" href="/shop">Browse the collection</Link>
        </div>}
      </Container>
    </section>
  );
}
