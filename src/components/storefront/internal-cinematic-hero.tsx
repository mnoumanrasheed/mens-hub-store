"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import { Container } from "@/components/storefront/container";
import { StoreImage } from "@/components/storefront/store-image";
import { useHeroEntrance } from "@/components/storefront/hero-motion";

export type InternalHeroVisual = "wardrobe" | "new-arrivals" | "sale" | "category" | "brand-space" | "story";

export type InternalHeroBreadcrumb = {
  label: string;
  href?: string;
};

type InternalCinematicHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  visual: InternalHeroVisual;
  image: string;
  secondaryImage: string;
  imageAlt: string;
  breadcrumbItems?: InternalHeroBreadcrumb[];
  cta?: { label: string; href: string; external?: boolean };
  children?: ReactNode;
};

const visualNotes: Record<InternalHeroVisual, string> = {
  wardrobe: "The considered wardrobe",
  "new-arrivals": "New season / 01",
  sale: "Selected pieces / 02",
  category: "Material / form / function",
  "brand-space": "Client services / 01",
  story: "The house / 01",
};

const visualIndices: Record<InternalHeroVisual, string> = {
  wardrobe: "01",
  "new-arrivals": "02",
  sale: "03",
  category: "04",
  "brand-space": "05",
  story: "06",
};

export function InternalCinematicHero({ eyebrow, title, description, visual, image, secondaryImage, imageAlt, breadcrumbItems, cta, children }: InternalCinematicHeroProps) {
  const reduceMotion = useReducedMotion();
  const reveal = useHeroEntrance();
  const titleLines = title.trim().split(/\s+/).filter(Boolean);

  return (
    <header className={`mh-internal-hero mh-internal-hero-${visual}`} data-store-hero aria-labelledby="internal-hero-title">
      <div className="mh-internal-hero-atmosphere" aria-hidden="true" />
      <div className="mh-internal-hero-grain" aria-hidden="true" />
      <Container size="wide" className="mh-internal-hero-inner">
        {breadcrumbItems?.length ? (
          <motion.nav className="mh-internal-hero-breadcrumb" aria-label="Breadcrumb" {...reveal(.02)}>
            {breadcrumbItems.map((item, index) => (
              <span key={`${item.label}-${index}`}>
                {index ? <i aria-hidden="true">/</i> : null}
                {item.href && index < breadcrumbItems.length - 1 ? <Link href={item.href}>{item.label}</Link> : <span aria-current={index === breadcrumbItems.length - 1 ? "page" : undefined}>{item.label}</span>}
              </span>
            ))}
          </motion.nav>
        ) : null}

        <div className="mh-internal-hero-grid">
          <div className="mh-internal-hero-copy">
            <motion.p className="mh-internal-hero-eyebrow" {...reveal(.08)}><span aria-hidden="true" />{eyebrow}</motion.p>
            <h1 id="internal-hero-title">
              {titleLines.map((line, index) => <span className="mh-internal-hero-title-line" key={`${line}-${index}`}><motion.span {...reveal(.16 + index * .1, "heading")}>{line}</motion.span></span>)}
            </h1>
            <motion.p className="mh-internal-hero-description" {...reveal(.18 + titleLines.length * .1)}>{description}</motion.p>
            {cta ? (
              <motion.div className="mh-internal-hero-cta-row" {...reveal(.28 + titleLines.length * .1)}>
                {cta.external ? <a className="mh-internal-hero-cta" href={cta.href} target="_blank" rel="noopener noreferrer">{cta.label}<ArrowUpRight size={16} aria-hidden="true" /></a> : <Link className="mh-internal-hero-cta" href={cta.href}>{cta.label}<ArrowRight size={16} aria-hidden="true" /></Link>}
              </motion.div>
            ) : null}
            {children ? <motion.div className="mh-internal-hero-slot" {...reveal(.38 + titleLines.length * .1)}>{children}</motion.div> : null}
          </div>

          <motion.div
            className="mh-internal-hero-stage"
            initial={reduceMotion ? false : { opacity: 0, y: 18, scale: .985 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: reduceMotion ? 0 : .9, delay: reduceMotion ? 0 : .1, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              className="mh-internal-hero-depth"
              animate={reduceMotion ? undefined : { y: [0, -6, 0], rotateZ: [0, .3, 0] }}
              transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="mh-internal-hero-backdrop" aria-hidden="true">
                <StoreImage src={secondaryImage} alt="" fill sizes="(max-width: 767px) 58vw, 29vw" className="mh-internal-hero-secondary-image" />
              </div>
              <div className="mh-internal-hero-frame">
                <StoreImage src={image} alt={imageAlt} fill priority sizes="(max-width: 767px) 76vw, 38vw" className="mh-internal-hero-primary-image" />
                <span className="mh-internal-hero-frame-glint" aria-hidden="true" />
              </div>
              <div className="mh-internal-hero-material" aria-hidden="true">
                <span>{visualNotes[visual]}</span>
                <i />
              </div>
              <span className="mh-internal-hero-index" aria-hidden="true">Men&apos;s Hub / {visualIndices[visual]}</span>
            </motion.div>
          </motion.div>
        </div>

        <div className="mh-internal-hero-foot" aria-hidden="true"><span>Menswear / Objects / Details</span><span>Scroll to explore <i /></span></div>
      </Container>
    </header>
  );
}
