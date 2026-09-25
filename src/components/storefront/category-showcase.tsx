"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

import { Container } from "@/components/storefront/container";
import { ScrollReveal } from "@/components/storefront/scroll-reveal";
import type { StorefrontCategory } from "@/data/storefront";
import type { CmsBlockValue } from "@/types/cms";
import styles from "./category-showcase.module.css";

// ── Bento tile size types ──────────────────────────────────────
type TileSize = "feature" | "wide" | "standard";

interface BentoSlot {
  /** slug of the category this slot is for (matched case-insensitively) */
  slug: string;
  size: TileSize;
  /**
   * Optional pill label shown only on the feature tile.
   * Only display if meaningful – do NOT invent labels.
   */
  pill?: string;
}

/**
 * BENTO LAYOUT DEFINITION
 * ──────────────────────────────────────────────────────────────
 * Desktop 4-column grid, 4 rows = 16 cells.
 * 1 feature (2×2 = 4 cells) + 2 wide (2×1 = 2 cells each, 4 total)
 * + 8 standard (1×1 = 8 cells) → exactly 16 cells. No orphans.
 *
 * Rendering order sets grid flow. With CSS grid-auto-flow: dense
 * the browser packs tiles tightly. We use explicit column/row
 * spans via class names, no explicit grid-column placements, so
 * the grid self-heals when fewer than 11 categories are returned.
 *
 * Priority slugs: add the exact category slugs used in your DB.
 * Any category not listed here falls back to "standard".
 */
const BENTO_SLOTS: BentoSlot[] = [
  // Feature tile — most iconic category (2 cols × 2 rows)
  { slug: "shalwar-qameez",   size: "feature" },
  // Wide tiles — strong horizontal images (2 cols × 1 row)
  { slug: "shoes",            size: "wide" },
  { slug: "watches",          size: "wide" },
  // Everything else rendered as standard 1×1
  { slug: "t-shirts",         size: "standard" },
  { slug: "jeans",            size: "standard" },
  { slug: "jackets",          size: "standard" },
  { slug: "fragrances",       size: "standard" },
  { slug: "belts",            size: "standard" },
  { slug: "sunglasses",       size: "standard" },
  { slug: "wallets",          size: "standard" },
  { slug: "accessories",      size: "standard" },
];

/** Return tile size for a given category slug, case-insensitively. */
function getTileSize(slug: string): TileSize {
  const match = BENTO_SLOTS.find(
    (s) => s.slug.toLowerCase() === slug.toLowerCase(),
  );
  return match?.size ?? "standard";
}

function getPill(slug: string): string | undefined {
  return BENTO_SLOTS.find(
    (s) => s.slug.toLowerCase() === slug.toLowerCase(),
  )?.pill;
}

// ── Sizes hint for next/image ──────────────────────────────────
const IMAGE_SIZES: Record<TileSize, string> = {
  feature:  "(max-width:767px) 100vw, (max-width:1023px) 50vw, 33vw",
  wide:     "(max-width:767px) 100vw, (max-width:1023px) 100vw, 60vw",
  standard: "(max-width:767px) 50vw, (max-width:1023px) 25vw, 22vw",
};

// ── Stagger delay per tile index ───────────────────────────────
function staggerDelay(index: number): number {
  return index * 0.07;
}

// ── Tile component ─────────────────────────────────────────────
function BentoTile({
  category,
  index,
}: {
  category: StorefrontCategory;
  index: number;
}) {
  const size = getTileSize(category.slug);
  const pill = getPill(category.slug);
  const image = category.bannerImageUrl || category.imageUrl;
  const href = `/shop/${category.slug}`;
  const isFeature = size === "feature";

  const shellClass =
    size === "feature"
      ? styles.tileFeature
      : size === "wide"
        ? styles.tileWide
        : styles.tileStandard;

  return (
    <li className={`${styles.tileShell} ${shellClass}`}>
      <ScrollReveal delay={staggerDelay(index)} style={{ height: "100%" }}>
        <Link href={href} className={styles.tile} aria-label={category.name}>
          {/* Image */}
          <div className={styles.imageWrap}>
            {image ? (
              <Image
                src={image}
                alt={category.name}
                fill
                sizes={IMAGE_SIZES[size]}
                priority={isFeature}
                className="object-cover"
                style={{ objectPosition: "center center" }}
              />
            ) : (
              <div className={styles.noImage} aria-hidden="true">
                <span className={styles.noImageInitial}>
                  {category.name.charAt(0)}
                </span>
              </div>
            )}
          </div>

          {/* Warm colour grade over image */}
          <div className={styles.warmOverlay} aria-hidden="true" />

          {/* Bottom fade gradient */}
          <div className={styles.gradient} aria-hidden="true" />

          {/* Feature-only top-left pill */}
          {isFeature && pill ? (
            <span className={styles.pill}>{pill}</span>
          ) : null}

          {/* Bottom copy row */}
          <div className={styles.copy}>
            <div className={styles.words}>
              <span className={styles.name}>{category.name}</span>
              <span className={styles.shopLabel}>Shop now</span>
            </div>

            {/* Circular glass arrow button */}
            <span className={styles.arrowBtn} aria-hidden="true">
              <ArrowRight size={16} strokeWidth={1.8} />
            </span>
          </div>
        </Link>
      </ScrollReveal>
    </li>
  );
}

// ── Main section ───────────────────────────────────────────────
export function CategoryShowcase({
  categories,
  content,
}: {
  categories: StorefrontCategory[];
  content: CmsBlockValue;
}) {
  const heading =
    content.fields.heading?.trim() || "Shop by Category";
  const description =
    content.fields.description ||
    "Explore our complete range of menswear, footwear, and accessories crafted for modern everyday style.";

  if (!categories.length) return null;

  /**
   * Sort categories so that feature & wide tiles come first,
   * preserving the original DB order within each tier.
   * This ensures CSS grid-auto-flow: dense fills the bento correctly.
   */
  const sorted = [...categories].sort((a, b) => {
    const order: Record<TileSize, number> = { feature: 0, wide: 1, standard: 2 };
    return order[getTileSize(a.slug)] - order[getTileSize(b.slug)];
  });

  return (
    <section
      id="categories"
      aria-labelledby="categories-heading"
      className={styles.section}
    >
      <Container size="wide">
        {/* ── Section header ── */}
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <p className={styles.eyebrow} aria-hidden="true">
              <span className={styles.eyebrowLine} />
              Collections
            </p>
            <h2 id="categories-heading" className={styles.heading}>
              {heading}
            </h2>
            <p className={styles.description}>{description}</p>
          </div>

          <Link href="/shop" className={styles.exploreLink}>
            Explore all categories
            <span className={styles.exploreLinkArrow}>
              <ArrowRight size={15} strokeWidth={2} aria-hidden="true" />
            </span>
          </Link>
        </header>

        {/* ── Bento grid ── */}
        <ul
          className={styles.grid}
          style={{ gridAutoFlow: "dense" }}
          aria-label="Product categories"
        >
          {sorted.map((category, index) => (
            <BentoTile key={category.id} category={category} index={index} />
          ))}
        </ul>
      </Container>
    </section>
  );
}
