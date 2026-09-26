"use client";

import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { useRef } from "react";
import type { PointerEvent } from "react";

import { Container } from "@/components/storefront/container";
import { ProductCard } from "@/components/storefront/product-card";
import { StoreImage } from "@/components/storefront/store-image";
import type { StorefrontCategoryShelf, StorefrontProduct } from "@/data/storefront";

type ImagePosition = "left" | "right";

type CategoriesInFocusProps = {
  shelves: StorefrontCategoryShelf[];
  heading?: string;
  description?: string;
};

type CategoryCollectionSectionProps = {
  category: StorefrontCategoryShelf;
  products: StorefrontProduct[];
  featureImage: string;
  imagePosition: ImagePosition;
  index: number;
};

const preferredCategoryOrder = [
  "shirts",
  "pants",
  "shalwar-qameez",
  "trousers",
  "shoes",
  "watches",
  "perfumes",
  "glasses",
  "accessories",
];

const categoryImageFallbacks: Record<string, string> = {
  shirts: "/seed-media/01-Shirts/shirt-02.jpg",
  pants: "/seed-media/02-Pants/pants-02.jpg",
  "shalwar-qameez": "/seed-media/03-Shalwar-Qameez/shalwar-qameez-02.jpg",
  trousers: "/seed-media/04-Trousers/trousers-02.jpg",
  shoes: "/seed-media/05-Shoes/shoes-02.jpg",
  watches: "/seed-media/06-Watches/watch-02.jpg",
  perfumes: "/seed-media/07-Perfumes/perfume-02.jpg",
  glasses: "/seed-media/08-Glasses/glasses-02.jpg",
  belts: "/seed-media/09-Belts/belt-02.jpg",
  accessories: "/seed-media/10-Accessories/accessories-02.jpg",
  tracksuits: "/seed-media/11-Tracksuits/tracksuit-02.jpg",
};

function orderCategories(shelves: StorefrontCategoryShelf[]) {
  return [...shelves].sort((left, right) => {
    const leftOrder = preferredCategoryOrder.indexOf(left.slug);
    const rightOrder = preferredCategoryOrder.indexOf(right.slug);
    const normalizedLeftOrder = leftOrder === -1 ? preferredCategoryOrder.length : leftOrder;
    const normalizedRightOrder = rightOrder === -1 ? preferredCategoryOrder.length : rightOrder;
    return normalizedLeftOrder - normalizedRightOrder || left.name.localeCompare(right.name);
  });
}

function resolveCategoryImage(category: StorefrontCategoryShelf) {
  return category.bannerImageUrl || category.imageUrl || categoryImageFallbacks[category.slug] || "/images/atelier-campaign.webp";
}

export function CategoriesInFocus({ shelves, heading = "Shop by category", description }: CategoriesInFocusProps) {
  const orderedShelves = orderCategories(shelves);

  if (!orderedShelves.length) return null;

  return (
    <section id="categories" className="mh-category-catalog" aria-labelledby="shop-by-category-heading">
      <Container size="wide">
        <header className="mh-category-catalog-heading">
          <p className="mh-eyebrow">The collection</p>
          <h2 id="shop-by-category-heading">{heading}</h2>
          {description ? <p>{description}</p> : null}
        </header>

        <div className="mh-category-catalog-list">
          {orderedShelves.map((category, index) => (
            <CategoryCollectionSection
              key={category.id}
              category={category}
              products={category.products}
              featureImage={resolveCategoryImage(category)}
              imagePosition={index % 2 === 0 ? "left" : "right"}
              index={index}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}

function CategoryCollectionSection({ category, products, featureImage, imagePosition, index }: CategoryCollectionSectionProps) {
  const reduceMotion = useReducedMotion();
  const headingId = `category-${category.slug}-heading`;

  return (
    <motion.article
      className={`mh-category-collection ${imagePosition === "right" ? "is-reversed" : ""}`}
      aria-labelledby={headingId}
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{ duration: reduceMotion ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <header className="mh-category-collection-heading">
        <div>
          <p className="mh-category-index">{String(index + 1).padStart(2, "0")} / collection</p>
          <h3 id={headingId}>{category.name}</h3>
          {category.description ? <p>{category.description}</p> : null}
        </div>
        <Link href={`/shop/${category.slug}`} className="mh-category-view-all">
          View all <ArrowRight size={15} />
        </Link>
      </header>

      <div className={`mh-category-collection-body ${products.length ? "" : "is-empty"}`}>
        <motion.div
          className="mh-category-feature-image"
          initial={reduceMotion ? false : { opacity: 0, scale: 1.025 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.12 }}
          transition={{ duration: reduceMotion ? 0 : 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <StoreImage
            src={featureImage}
            alt={`${category.name} collection`}
            fill
            sizes="(max-width: 820px) 100vw, 34vw"
            className="mh-category-feature-image-source"
          />
          <span>{category.name}</span>
        </motion.div>

        {products.length ? (
          <CategoryProductRail products={products} label={`${category.name} products`} />
        ) : (
          <div className="mh-category-empty">
            <Link href={`/shop/${category.slug}`} className="mh-category-view-all">Explore collection <ArrowRight size={15} /></Link>
          </div>
        )}
      </div>
    </motion.article>
  );
}

function CategoryProductRail({ products, label }: { products: StorefrontProduct[]; label: string }) {
  const rail = useRef<HTMLDivElement>(null);
  const dragState = useRef<{ startX: number; startScroll: number } | null>(null);
  const reduceMotion = useReducedMotion();

  function scrollBy(direction: "left" | "right") {
    rail.current?.scrollBy({ left: direction === "right" ? rail.current.clientWidth * 0.82 : -rail.current.clientWidth * 0.82, behavior: reduceMotion ? "auto" : "smooth" });
  }

  function startDrag(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse") return;
    dragState.current = { startX: event.clientX, startScroll: event.currentTarget.scrollLeft };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function moveDrag(event: PointerEvent<HTMLDivElement>) {
    if (!rail.current || !dragState.current) return;
    rail.current.scrollLeft = dragState.current.startScroll - (event.clientX - dragState.current.startX);
  }

  function stopDrag(event: PointerEvent<HTMLDivElement>) {
    if (dragState.current && event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    dragState.current = null;
  }

  return (
    <div className="mh-category-product-rail-wrap">
      <button type="button" className="mh-category-rail-arrow is-left" aria-label={`Scroll ${label} left`} onClick={() => scrollBy("left")}><ChevronLeft size={17} /></button>
      <div
        ref={rail}
        className="mh-category-product-rail"
        role="region"
        aria-label={label}
        tabIndex={0}
        onPointerDown={startDrag}
        onPointerMove={moveDrag}
        onPointerUp={stopDrag}
        onPointerCancel={stopDrag}
        onPointerLeave={stopDrag}
      >
        {products.map((product) => (
          <div key={product.id} className="mh-category-product-slot">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
      <button type="button" className="mh-category-rail-arrow is-right" aria-label={`Scroll ${label} right`} onClick={() => scrollBy("right")}><ChevronRight size={17} /></button>
    </div>
  );
}
