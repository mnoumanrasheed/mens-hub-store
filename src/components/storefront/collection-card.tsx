"use client";

import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { ScrollReveal } from "@/components/storefront/scroll-reveal";
import { StoreImage } from "@/components/storefront/store-image";
import type { StorefrontCategory } from "@/data/storefront";
import styles from "./category-showcase.module.css";

const MotionLink = motion.create(Link);
const ease = [0.22, 1, 0.36, 1] as const;

type CollectionCardProps = {
  category: StorefrontCategory;
  index: number;
  featured?: boolean;
  lead?: boolean;
};

export function CollectionCard({ category, index, featured = false, lead = false }: CollectionCardProps) {
  const reduceMotion = useReducedMotion();
  const image = featured
    ? category.bannerImageUrl || category.imageUrl
    : category.imageUrl || category.bannerImageUrl;
  const transition = { duration: reduceMotion ? 0 : 0.85, ease };
  const delay = (featured ? index : (index - 3) % 4) * 0.08;
  // Match the container gutters and the 7/5 desktop grid split.
  const sizes = lead
    ? "(max-width: 1023px) 92vw, (max-width: 1439px) 53vw, 750px"
    : featured
      ? "(max-width: 639px) 92vw, (max-width: 1023px) 45vw, (max-width: 1439px) 38vw, 532px"
      : "(max-width: 639px) 92vw, (max-width: 1023px) 45vw, (max-width: 1439px) 22vw, 314px";

  return (
    <ScrollReveal
      className={`${styles.cardShell} ${lead ? styles.lead : ""} ${featured ? styles.featuredCard : ""}`}
      whileInView={reduceMotion ? undefined : { opacity: [0, 1], y: [25, 0], scale: [0.985, 1] }}
      transition={{ ...transition, delay: reduceMotion ? 0 : delay }}
    >
      <MotionLink
        href={`/shop/${category.slug}`}
        aria-label={`Explore ${category.name} collection`}
        className={styles.card}
        initial="rest"
        whileHover="active"
        whileFocus="active"
      >
        <motion.div
          className={styles.image}
          variants={{ rest: { scale: 1, y: 0 }, active: { scale: reduceMotion ? 1 : 1.04, y: reduceMotion ? 0 : -3 } }}
          transition={{ ...transition, duration: reduceMotion ? 0 : 1.1 }}
        >
          {image ? <StoreImage src={image} alt={`${category.name} — Men's Hub collection photography`} fill sizes={sizes} loading="lazy" className={`object-cover ${image.startsWith("/seed-media/") && !image.includes("/01-Shirts/") ? styles.seedImage : ""}`} />
            : <div className={styles.imageFallback} aria-hidden="true">MH</div>}
        </motion.div>
        <span className={styles.gradient} aria-hidden="true" />
        <motion.span className={styles.grading} aria-hidden="true" variants={{ rest: { opacity: 0.24 }, active: { opacity: 0.08 } }} transition={transition} />
        <span className={styles.innerBorder} aria-hidden="true" />
        <motion.span className={styles.activeBorder} aria-hidden="true" variants={{ rest: { opacity: 0 }, active: { opacity: 0.65 } }} transition={transition} />
        <span className={styles.number} aria-hidden="true"><span>{String(index + 1).padStart(2, "0")}</span><span>/ THE COLLECTION</span></span>
        <div className={styles.copy}>
          <div className={styles.words}>
            <motion.span className={styles.rule} aria-hidden="true" variants={{ rest: { scaleX: 0.35, opacity: 0.5 }, active: { scaleX: 1, opacity: 1 } }} transition={transition} />
            <motion.h3 className={styles.title} variants={{ rest: { y: 0 }, active: { y: reduceMotion ? 0 : -5 } }} transition={transition}>{category.name}</motion.h3>
            <motion.p className={styles.microcopy} variants={{ rest: { opacity: 0.78 }, active: { opacity: 1 } }} transition={transition}>Discover the collection</motion.p>
          </div>
          <motion.span className={styles.arrow} aria-hidden="true" variants={{ rest: { scale: 1 }, active: { scale: reduceMotion ? 1 : 1.08 } }} transition={transition}>
            <motion.span variants={{ rest: { x: 0, y: 0 }, active: { x: reduceMotion ? 0 : 2.5, y: reduceMotion ? 0 : -2.5 } }} transition={transition}>
              <ArrowUpRight size={20} strokeWidth={1.3} />
            </motion.span>
          </motion.span>
        </div>
      </MotionLink>
    </ScrollReveal>
  );
}
