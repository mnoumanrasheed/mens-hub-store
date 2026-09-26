"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import { Container } from "@/components/storefront/container";
import { useHeroEntrance } from "@/components/storefront/hero-motion";

export type InternalHeroVisual = "wardrobe" | "new-arrivals" | "sale" | "category" | "brand-space" | "story";
export type InternalHeroBreadcrumb = { label: string; href?: string };

type InternalCinematicHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  visual: InternalHeroVisual;
  breadcrumbItems?: InternalHeroBreadcrumb[];
  cta?: { label: string; href: string; external?: boolean };
  children?: ReactNode;
};

export function InternalCinematicHero({ eyebrow, title, description, visual, breadcrumbItems, cta, children }: InternalCinematicHeroProps) {
  const reduceMotion = useReducedMotion();
  const reveal = useHeroEntrance();

  return (
    <header className={`mh-internal-hero mh-internal-hero-${visual}`} data-store-hero aria-labelledby="internal-hero-title">
      <div className="mh-internal-hero-atmosphere" aria-hidden="true">
        <motion.span className="mh-internal-hero-ambient-light" animate={reduceMotion ? undefined : { x: [0, 28, 0], y: [0, -16, 0], scale: [1, 1.04, 1] }} transition={{ duration: 21, repeat: Infinity, ease: "easeInOut" }} />
        <motion.span className="mh-internal-hero-ambient-fabric mh-internal-hero-ambient-fabric-primary" animate={reduceMotion ? undefined : { x: [0, -26, 0], y: [0, 12, 0], rotate: [-8, -5, -8] }} transition={{ duration: 23, repeat: Infinity, ease: "easeInOut" }} />
        <motion.span className="mh-internal-hero-ambient-fabric mh-internal-hero-ambient-fabric-secondary" animate={reduceMotion ? undefined : { x: [0, 20, 0], y: [0, -10, 0], rotate: [11, 7, 11] }} transition={{ duration: 19, repeat: Infinity, ease: "easeInOut" }} />
        <svg className="mh-internal-hero-seam" viewBox="0 0 900 560" fill="none" preserveAspectRatio="none">
          <motion.path d="M-40 480C150 360 235 490 390 340C530 204 640 120 940 34" initial={reduceMotion ? { pathLength: 1 } : { pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: reduceMotion ? 0 : 1.6, delay: reduceMotion ? 0 : .35, ease: [0.22, 1, 0.36, 1] }} />
        </svg>
      </div>
      <Container size="wide" className="mh-internal-hero-inner">
        {breadcrumbItems?.length ? <motion.nav className="mh-internal-hero-breadcrumb" aria-label="Breadcrumb" {...reveal(.02)}>
          {breadcrumbItems.map((item, index) => <span key={`${item.label}-${index}`}>{index ? <i aria-hidden="true">/</i> : null}{item.href && index < breadcrumbItems.length - 1 ? <Link href={item.href}>{item.label}</Link> : <span aria-current={index === breadcrumbItems.length - 1 ? "page" : undefined}>{item.label}</span>}</span>)}
        </motion.nav> : null}

        <div className="mh-internal-hero-grid">
          <div className="mh-internal-hero-copy">
            <motion.p className="mh-internal-hero-eyebrow" {...reveal(.08)}>{eyebrow}</motion.p>
            <h1 id="internal-hero-title"><span className="mh-internal-hero-title-line"><motion.span {...reveal(.16, "heading")}>{title}</motion.span></span></h1>
            <motion.p className="mh-internal-hero-description" {...reveal(.28)}>{description}</motion.p>
            {cta ? <motion.div className="mh-internal-hero-cta-row" {...reveal(.38)}>{cta.external ? <a className="mh-internal-hero-cta" href={cta.href} target="_blank" rel="noopener noreferrer">{cta.label}<ArrowUpRight size={16} aria-hidden="true" /></a> : <Link className="mh-internal-hero-cta" href={cta.href}>{cta.label}<ArrowRight size={16} aria-hidden="true" /></Link>}</motion.div> : null}
            {children ? <motion.div className="mh-internal-hero-slot" {...reveal(.46)}>{children}</motion.div> : null}
          </div>
        </div>
      </Container>
    </header>
  );
}
