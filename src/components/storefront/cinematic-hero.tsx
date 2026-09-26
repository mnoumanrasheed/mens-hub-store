"use client";

import { ArrowDown, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { useHeroEntrance } from "./hero-motion";

type HeroImage = { url: string; alt: string };

type Props = {
  heading: string;
  tagline?: string;
  description: string;
  primaryLabel: string;
  primaryLink: string;
  secondaryLabel: string;
  secondaryLink: string;
  mainImage?: HeroImage;
  secondaryImages?: HeroImage[];
};

export function CinematicHero({
  heading,
  tagline = "NEW SEASON / MEN'S HUB",
  description,
  primaryLabel,
  primaryLink,
  secondaryLabel,
  secondaryLink,
  mainImage,
}: Props) {
  const reduceMotion = useReducedMotion();
  const reveal = useHeroEntrance();
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : 80]);
  const headingLines = heading.trim().split(/\s+/).filter(Boolean);

  return (
    <section ref={heroRef} aria-labelledby="hero-title" className="mh-campaign-hero">
      <motion.div className="mh-campaign-media" style={{ y: imageY }} aria-hidden="true">
        <Image
          src={mainImage?.url || "/images/atelier-campaign.webp"}
          alt={mainImage?.alt || "Men's Hub editorial campaign"}
          fill
          priority
          sizes="100vw"
          className="mh-campaign-image"
        />
        <video
          className="mh-campaign-video"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={mainImage?.url || "/images/atelier-campaign.webp"}
          tabIndex={-1}
        >
          <source src="/video.mp4" type="video/mp4" />
        </video>
      </motion.div>
      <div className="mh-campaign-shade" aria-hidden="true" />

      <div className="mh-campaign-inner">
        <div className="mh-campaign-copy">
          <motion.p className="mh-campaign-eyebrow" {...reveal(.04)}><span />{tagline}</motion.p>
          <h1 id="hero-title">
            {headingLines.map((line, index) => <motion.span key={`${line}-${index}`} {...reveal(.14 + index * .1, "heading")}>{line}</motion.span>)}
          </h1>
          <motion.p className="mh-campaign-description" {...reveal(.14 + headingLines.length * .1 + .1)}>{description}</motion.p>
          <motion.div className="mh-campaign-actions" {...reveal(.14 + headingLines.length * .1 + .2)}>
            <Link href={primaryLink} className="mh-button mh-button-light">
              {primaryLabel} <ArrowRight size={15} />
            </Link>
            <Link href={secondaryLink} className="mh-campaign-text-link">
              {secondaryLabel}
            </Link>
          </motion.div>
        </div>

        <div className="mh-campaign-footer">
          <a href="#categories" className="mh-campaign-scroll">
            <span>Scroll to explore</span>
            <span className="mh-campaign-scroll-icon"><ArrowDown size={15} /></span>
          </a>
          <p>Everyday foundations, <em>considered.</em></p>
          <span className="mh-campaign-index">01 <i /> 03</span>
        </div>
      </div>
    </section>
  );
}
