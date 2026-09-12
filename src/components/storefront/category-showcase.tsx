"use client";

import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";

import { Container } from "@/components/storefront/container";
import { StoreImage } from "@/components/storefront/store-image";
import type { StorefrontCategory } from "@/data/storefront";
import type { CmsBlockValue } from "@/types/cms";

type Category = StorefrontCategory;

const featuredOrder = [
  "shirts",
  "pants",
  "shalwar-qameez",
  "shoes",
  "watches",
  "perfumes",
  "accessories",
];

const fallbackDescriptions: Record<string, string> = {
  shirts: "Refined shirts for a considered everyday wardrobe.",
  pants: "Modern foundations cut for effortless confidence.",
  "shalwar-qameez": "Contemporary tradition, finished with quiet distinction.",
  shoes: "Polished footwear for every decisive step.",
  watches: "Timeless details with a modern point of view.",
  perfumes: "Distinctive scents designed to leave an impression.",
  accessories: "The finishing pieces that define the look.",
};

const layouts = [
  "sm:col-span-2 lg:col-span-7 lg:min-h-[42rem]",
  "lg:col-span-5 lg:min-h-[42rem]",
  "lg:col-span-5 lg:min-h-[36rem]",
  "lg:col-span-7 lg:min-h-[36rem]",
  "lg:col-span-4 lg:min-h-[31rem]",
  "lg:col-span-4 lg:min-h-[31rem]",
  "lg:col-span-4 lg:min-h-[31rem]",
];

function orderCategories(categories: Category[]) {
  const priority = new Map(featuredOrder.map((slug, index) => [slug, index]));
  return categories.filter((category) => priority.has(category.slug)).sort((left, right) => {
    const leftPriority = priority.get(left.slug) ?? featuredOrder.length;
    const rightPriority = priority.get(right.slug) ?? featuredOrder.length;
    return leftPriority - rightPriority;
  });
}

export function CategoryShowcase({ categories, content }: { categories: Category[]; content: CmsBlockValue }) {
  const reduceMotion = useReducedMotion();
  const orderedCategories = orderCategories(categories);

  return (
    <section id="categories" className="store-section scroll-mt-16 overflow-hidden border-b border-line bg-[#0d0d0e]">
      <Container size="wide">
        <header className="mb-10 grid gap-6 border-b border-white/10 pb-9 sm:mb-14 sm:grid-cols-[minmax(0,1fr)_minmax(16rem,30rem)] sm:items-end sm:pb-12">
          <div>
            <p className="store-eyebrow">The complete wardrobe</p>
            <h2 className="store-section-title">{content.fields.heading || "Shop by Category"}</h2>
          </div>
          <p className="text-sm leading-7 text-muted sm:justify-self-end sm:text-base">
            {content.fields.description || "A curated study in modern menswear, from everyday foundations to the details that complete the look."}
          </p>
        </header>

        {orderedCategories.length ? (
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-12 lg:gap-6">
            {orderedCategories.map((category, index) => {
              const image = category.bannerImageUrl || category.imageUrl;
              const description = category.description || fallbackDescriptions[category.slug] || "Explore the collection.";
              const layout = layouts[index] || "lg:col-span-6 lg:min-h-[34rem]";

              return (
                <motion.article
                  key={category.id}
                  className={`group relative min-h-[30rem] overflow-hidden bg-surface-raised sm:min-h-[34rem] ${layout}`}
                  initial={reduceMotion ? false : { opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.16 }}
                  transition={{ duration: reduceMotion ? 0 : 0.75, delay: reduceMotion ? 0 : Math.min(index * 0.055, 0.25), ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link href={`/shop/${category.slug}`} className="absolute inset-0 block" aria-label={`Explore ${category.name}`}>
                    {image ? (
                      <StoreImage
                        src={image}
                        alt={`${category.name} collection`}
                        fill
                        quality={90}
                        sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 58vw"
                        className="object-cover transition duration-[1200ms] ease-[var(--mh-ease-out)] motion-safe:group-hover:scale-[1.045]"
                      />
                    ) : (
                      <div className="h-full bg-surface-raised" />
                    )}
                    <div className="absolute inset-0 bg-black/10 transition-colors duration-700 group-hover:bg-black/20" aria-hidden="true" />
                    <div className="absolute inset-x-0 bottom-0 h-2/3 bg-[linear-gradient(0deg,rgba(7,7,8,.9)_0%,rgba(7,7,8,.48)_42%,transparent_100%)]" aria-hidden="true" />

                    <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-5 p-6 sm:p-8 lg:p-9">
                      <div className="max-w-xl">
                        <span className="mb-3 block text-[0.58rem] font-bold uppercase tracking-[0.22em] text-gold">Collection {String(index + 1).padStart(2, "0")}</span>
                        <h3 className="font-display text-4xl font-semibold leading-none text-white sm:text-5xl">{category.name}</h3>
                        <p className="mt-3 line-clamp-2 max-w-md text-sm leading-6 text-white/68">{description}</p>
                      </div>
                      <span className="grid size-11 shrink-0 place-items-center border border-white/30 text-white transition duration-300 group-hover:border-gold group-hover:bg-gold group-hover:text-gold-ink" aria-hidden="true">
                        <ArrowUpRight size={17} />
                      </span>
                    </div>
                  </Link>
                </motion.article>
              );
            })}
          </div>
        ) : (
          <div className="border border-dashed border-line bg-surface/45 px-5 py-16 text-center">
            <p className="text-sm leading-7 text-muted">Categories will appear here after they are enabled.</p>
            <Link href="/shop" className="store-cta-secondary mt-6">Browse the collection</Link>
          </div>
        )}
      </Container>
    </section>
  );
}
