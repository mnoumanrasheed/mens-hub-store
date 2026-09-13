"use client";

import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { StoreImage } from "@/components/storefront/store-image";
import { AtelierScene } from "@/components/storefront/atelier-scene";

type HeroImage = { url: string; alt: string };
type Props = {
  heading: string; tagline?: string; description: string;
  primaryLabel: string; primaryLink: string; secondaryLabel: string; secondaryLink: string;
  mainImage?: HeroImage; secondaryImages?: HeroImage[]; immersiveLayer?: ReactNode;
};

export function CinematicHero(props: Props) {
  const root = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  useEffect(() => {
    if (reduceMotion) return;
    let cancelled = false;
    let revert: (() => void) | undefined;
    void Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([{ gsap }, { ScrollTrigger }]) => {
      if (cancelled || !root.current) return;
      gsap.registerPlugin(ScrollTrigger);
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.to(".campaign-photo", { yPercent: 12, ease: "none", scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: 0.8 } });
        gsap.to(".campaign-watermark", { xPercent: -8, ease: "none", scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: 1.2 } });
      }, root);
      revert = () => media.revert();
    }).catch(() => { /* The static campaign remains available. */ });
    return () => { cancelled = true; revert?.(); };
  }, [reduceMotion]);
  return (
    <section ref={root} className="campaign-hero" aria-labelledby="hero-title">
      <div className="campaign-photo"><StoreImage src={props.mainImage?.url || "/images/atelier-campaign.webp"} alt={props.mainImage?.alt || "Men’s Hub monochrome menswear campaign"} fill preload sizes="100vw" className="object-cover" /></div>
      <div className="campaign-shade" aria-hidden="true" />
      <AtelierScene />{props.immersiveLayer}
      <div className="campaign-topline"><span>{props.tagline || "Style made for men"}</span><span>Menswear · Footwear · Accessories</span></div>
      <div className="campaign-content">
        <p className="store-eyebrow"><span className="campaign-dash" />{props.heading}</p>
        <h1 id="hero-title" className="campaign-title">
          {["Presence.", "Without a word."].map((line, index) => <span className="campaign-line" key={line}><motion.span initial={false} className={index === 1 ? "campaign-title-italic" : undefined} whileInView={reduceMotion ? undefined : { y: [28, 0], opacity: [0.5, 1] }} viewport={{ once: true }} transition={{ duration: 1.1, delay: index * 0.13, ease: [0.22, 1, 0.36, 1] }}>{line}</motion.span></span>)}
        </h1>
        <p className="campaign-description">{props.description}</p>
        <div className="campaign-actions"><Link className="store-cta-primary" href={props.primaryLink}>{props.primaryLabel}<ArrowUpRight size={17} /></Link><Link className="campaign-text-link" href={props.secondaryLink}>{props.secondaryLabel}<ArrowUpRight size={16} /></Link></div>
      </div>
      <div className="campaign-watermark" aria-hidden="true">MEN’S HUB</div>
      <div className="campaign-bottomline">
        <a href="#categories" className="campaign-scroll"><span className="campaign-scroll-icon"><ArrowDown size={17} /></span>Discover the collection</a>
        <span className="campaign-caption">An expression of individuality.<br /><span>A wardrobe of possibilities.</span></span>
        <span className="campaign-index"><b>01</b><span />THE SIGNATURE EDIT</span>
      </div>
    </section>
  );
}
