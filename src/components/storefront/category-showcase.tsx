"use client";

import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { Container } from "@/components/storefront/container";
import { StoreImage } from "@/components/storefront/store-image";
import type { StorefrontCategory } from "@/data/storefront";
import type { CmsBlockValue } from "@/types/cms";

export function CategoryShowcase({ categories, content }: { categories: StorefrontCategory[]; content: CmsBlockValue }) {
  const reduceMotion = useReducedMotion();
  return (
    <section id="categories" className="atelier-categories store-section scroll-mt-24 border-b border-line">
      <Container size="wide">
        <header className="atelier-section-heading mb-10 grid gap-6 sm:grid-cols-[1fr_23rem] sm:items-end">
          <div><p className="store-eyebrow">01 / A wardrobe, considered</p><h2 className="store-section-title">{content.fields.heading || "Find your signature."}</h2></div>
          <p className="text-sm leading-7 text-muted">{content.fields.description || "From everyday foundations to the finishing touches. Explore every side of your style."}</p>
        </header>
        {categories.length ? <>
          <div className="category-editorials">
            {categories.slice(0, 3).map((category, index) => (
              <motion.article className="category-editorial" key={category.id} initial={false} whileInView={reduceMotion ? undefined : { y: [28, 0], opacity: [0.6, 1] }} viewport={{ once: true, amount: 0.1 }} transition={{ duration: 0.85, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}>
                <Link href={`/shop/${category.slug}`} className="group">
                  <div className="category-editorial-image">
                    {category.bannerImageUrl || category.imageUrl ? <StoreImage src={(category.bannerImageUrl || category.imageUrl)!} alt={`${category.name} collection`} fill sizes="(max-width: 639px) 100vw, 33vw" className="object-cover" /> : <div className="grid h-full place-items-center font-display text-4xl text-gold">{category.name}</div>}
                    <span className="category-number">0{index + 1} / THE COLLECTION</span>
                  </div>
                  <div className="category-copy"><div><h3>{category.name}</h3><p>{category.description || "Discover the collection."}</p></div><span className="category-arrow" aria-hidden="true"><ArrowUpRight size={18} /></span></div>
                </Link>
              </motion.article>
            ))}
          </div>
          {categories.length > 3 ? <div className="category-directory">{categories.slice(3).map((category) => <Link className="category-directory-item" href={`/shop/${category.slug}`} key={category.id}>
            {category.imageUrl || category.bannerImageUrl ? <div className="category-directory-image"><StoreImage src={(category.imageUrl || category.bannerImageUrl)!} alt="" fill sizes="64px" className="object-cover" /></div> : null}
            <div><h3>{category.name}</h3><p>{category.description || "Explore the collection."}</p></div><span className="category-arrow" aria-hidden="true"><ArrowUpRight size={16} /></span>
          </Link>)}</div> : null}
        </> : <div className="atelier-empty border border-line text-center"><p className="text-sm text-muted">Categories will appear here after they are enabled.</p><Link className="store-cta-secondary mt-6" href="/shop">Browse the collection</Link></div>}
      </Container>
    </section>
  );
}
