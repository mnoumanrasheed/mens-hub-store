"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";

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
  secondaryCta?: { label: string; href: string; external?: boolean };
  children?: ReactNode;
};

export function InternalCinematicHero({ eyebrow, title, description, visual, breadcrumbItems, cta, secondaryCta, children }: InternalCinematicHeroProps) {
  const reveal = useHeroEntrance();

  return (
    <header className={`mh-internal-hero mh-internal-hero-${visual}`} data-store-hero aria-labelledby="internal-hero-title">
      <div className="mh-minimal-hero-ambient" aria-hidden="true"><span /></div>
      <Container size="wide" className="mh-internal-hero-inner">
        {breadcrumbItems?.length ? <motion.nav className="mh-internal-hero-breadcrumb" aria-label="Breadcrumb" {...reveal(.02)}>
          {breadcrumbItems.map((item, index) => <span key={`${item.label}-${index}`}>{index ? <i aria-hidden="true">/</i> : null}{item.href && index < breadcrumbItems.length - 1 ? <Link href={item.href}>{item.label}</Link> : <span aria-current={index === breadcrumbItems.length - 1 ? "page" : undefined}>{item.label}</span>}</span>)}
        </motion.nav> : null}

        <div className="mh-internal-hero-grid">
          <div className="mh-internal-hero-copy">
            <motion.p className="mh-internal-hero-eyebrow" {...reveal(.08)}>{eyebrow}</motion.p>
            <h1 id="internal-hero-title"><span className="mh-internal-hero-title-line"><motion.span {...reveal(.16, "heading")}>{title}</motion.span></span></h1>
            <motion.p className="mh-internal-hero-description" {...reveal(.28)}>{description}</motion.p>
            {cta || secondaryCta ? <motion.div className="mh-internal-hero-cta-row" {...reveal(.38)}>
              {cta ? (cta.external ? <a className="mh-internal-hero-cta" href={cta.href} target="_blank" rel="noopener noreferrer">{cta.label}<ArrowUpRight size={16} aria-hidden="true" /></a> : <Link className="mh-internal-hero-cta" href={cta.href}>{cta.label}<ArrowRight size={16} aria-hidden="true" /></Link>) : null}
              {secondaryCta ? (secondaryCta.external ? <a className="mh-internal-hero-secondary-cta" href={secondaryCta.href} target="_blank" rel="noopener noreferrer">{secondaryCta.label}<ArrowUpRight size={16} aria-hidden="true" /></a> : <Link className="mh-internal-hero-secondary-cta" href={secondaryCta.href}>{secondaryCta.label}<ArrowRight size={16} aria-hidden="true" /></Link>) : null}
            </motion.div> : null}
            {children ? <motion.div className="mh-internal-hero-slot" {...reveal(.46)}>{children}</motion.div> : null}
          </div>
        </div>
      </Container>
    </header>
  );
}
