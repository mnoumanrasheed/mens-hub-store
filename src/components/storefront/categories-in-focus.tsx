"use client";

import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { useRef } from "react";
import type { MouseEvent, PointerEvent } from "react";

import { Container } from "@/components/storefront/container";
import { ProductCard } from "@/components/storefront/product-card";
import { StoreImage } from "@/components/storefront/store-image";
import type { StorefrontCategoryShelf, StorefrontProduct } from "@/data/storefront";
import { getTopLevelStorefrontCategories } from "@/lib/category-navigation";

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

const categoryImageVersion = "20261002";

const categoryImageFallbacks: Record<string, string> = {
  shirts: `/category-heroes/shirts.jpg?v=${categoryImageVersion}`,
  pants: `/category-heroes/pants-premium.png?v=${categoryImageVersion}`,
  trousers: `/category-heroes/trousers-premium.jpg?v=${categoryImageVersion}`,
  tracksuits: `/category-heroes/tracksuits-premium.jpg?v=${categoryImageVersion}`,
  jackets: `/category-heroes/jackets-internet.jpg?v=${categoryImageVersion}`,
  sweaters: `/category-heroes/sweaters-internet.jpg?v=${categoryImageVersion}`,
  "shalwar-qameez": `/category-heroes/shalwar-qameez-premium.png?v=${categoryImageVersion}`,
  perfumes: `/category-heroes/perfumes-premium.png?v=${categoryImageVersion}`,
  shoes: `/category-heroes/shoes.jpg?v=${categoryImageVersion}`,
  watches: `/category-heroes/watches.jpg?v=${categoryImageVersion}`,
  glasses: `/category-heroes/glasses.jpg?v=${categoryImageVersion}`,
  belts: `/category-heroes/belts.jpg?v=${categoryImageVersion}`,
  accessories: `/category-heroes/accessories.png?v=${categoryImageVersion}`,
};

function resolveCategoryImage(category: StorefrontCategoryShelf) {
  return categoryImageFallbacks[category.slug] || category.bannerImageUrl || category.imageUrl || "/images/atelier-campaign.webp";
}

export function CategoriesInFocus({ shelves, heading = "Shop by category", description }: CategoriesInFocusProps) {
  const orderedShelves = getTopLevelStorefrontCategories(shelves);

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
      initial={reduceMotion ? false : { y: 24 }}
      whileInView={reduceMotion ? undefined : { y: 0 }}
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
          initial={reduceMotion ? false : { scale: 1.025 }}
          whileInView={reduceMotion ? undefined : { scale: 1 }}
          viewport={{ once: true, amount: 0.12 }}
          transition={{ duration: reduceMotion ? 0 : 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <StoreImage
            src={featureImage}
            alt={`${category.name} collection`}
            fill
            unoptimized
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

const DRAG_START_THRESHOLD = 6;

type RailDragState = {
  startX: number;
  startY: number;
  startScroll: number;
  pointerId: number;
  isDragging: boolean;
};

function CategoryProductRail({ products, label }: { products: StorefrontProduct[]; label: string }) {
  const rail = useRef<HTMLDivElement>(null);
  const dragState = useRef<RailDragState | null>(null);
  const suppressNextClick = useRef(false);
  const clickResetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reduceMotion = useReducedMotion();

  function scrollBy(direction: "left" | "right") {
    rail.current?.scrollBy({ left: direction === "right" ? rail.current.clientWidth * 0.82 : -rail.current.clientWidth * 0.82, behavior: reduceMotion ? "auto" : "smooth" });
  }

  function startDrag(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse" || event.button !== 0) return;

    dragState.current = {
      startX: event.clientX,
      startY: event.clientY,
      startScroll: event.currentTarget.scrollLeft,
      pointerId: event.pointerId,
      isDragging: false,
    };
  }

  function moveDrag(event: PointerEvent<HTMLDivElement>) {
    const state = dragState.current;
    if (!rail.current || !state || event.pointerId !== state.pointerId) return;

    const deltaX = event.clientX - state.startX;
    const deltaY = event.clientY - state.startY;

    if (!state.isDragging) {
      if (Math.abs(deltaX) < DRAG_START_THRESHOLD) return;
      if (Math.abs(deltaX) <= Math.abs(deltaY)) {
        dragState.current = null;
        return;
      }

      state.isDragging = true;
      event.currentTarget.setPointerCapture(event.pointerId);
      event.currentTarget.dataset.dragging = "true";
    }

    event.preventDefault();
    rail.current.scrollLeft = state.startScroll - deltaX;
  }

  function clearDrag(event: PointerEvent<HTMLDivElement>, suppressClick: boolean) {
    const state = dragState.current;
    if (!state || event.pointerId !== state.pointerId) return;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    delete event.currentTarget.dataset.dragging;
    dragState.current = null;

    if (!suppressClick || !state.isDragging) return;

    suppressNextClick.current = true;
    if (clickResetTimer.current) clearTimeout(clickResetTimer.current);
    clickResetTimer.current = setTimeout(() => {
      suppressNextClick.current = false;
      clickResetTimer.current = null;
    }, 0);
  }

  function stopDrag(event: PointerEvent<HTMLDivElement>) {
    clearDrag(event, true);
  }

  function cancelDrag(event: PointerEvent<HTMLDivElement>) {
    clearDrag(event, false);
  }

  function leaveRail() {
    if (!dragState.current?.isDragging) dragState.current = null;
  }

  function preventClickAfterDrag(event: MouseEvent<HTMLDivElement>) {
    if (!suppressNextClick.current) return;

    event.preventDefault();
    event.stopPropagation();
    suppressNextClick.current = false;
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
        onPointerCancel={cancelDrag}
        onPointerLeave={leaveRail}
        onClickCapture={preventClickAfterDrag}
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
