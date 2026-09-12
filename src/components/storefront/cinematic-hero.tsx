"use client";

import type { PointerEvent, ReactNode } from "react";
import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform, type MotionValue } from "motion/react";

import { StoreImage } from "@/components/storefront/store-image";

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
  immersiveLayer?: ReactNode;
};

const ease = [0.22, 1, 0.36, 1] as const;
const editorialLines = ["Designed", "for the", "Modern", "Gentleman"];

export function CinematicHero(props: Props) {
  const reduceMotion = useReducedMotion();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const springX = useSpring(pointerX, { stiffness: 42, damping: 24, mass: 0.8 });
  const springY = useSpring(pointerY, { stiffness: 42, damping: 24, mass: 0.8 });
  const imageX = useTransform(springX, [-1, 1], [-14, 14]);
  const imageY = useTransform(springY, [-1, 1], [-10, 10]);
  const imageScale = useTransform(springX, [-1, 1], [1.02, 1.06]);

  function move(event: PointerEvent<HTMLElement>) {
    if (reduceMotion || event.pointerType === "touch") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - bounds.left) / bounds.width * 2 - 1);
    pointerY.set((event.clientY - bounds.top) / bounds.height * 2 - 1);
  }

  function reset() {
    pointerX.set(0);
    pointerY.set(0);
  }

  const useEditorialCopy = !props.heading || props.heading === "Elevate Your Everyday Style";
  const description = props.description || "Premium menswear crafted with confidence, elegance and timeless style.";

  return (
    <section
      className="relative -mt-[4.25rem] min-h-[100svh] overflow-hidden border-b border-white/10 bg-[#070707]"
      aria-labelledby="hero-title"
      onPointerMove={move}
      onPointerLeave={reset}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_76%_48%,rgba(210,173,69,.11),transparent_24%),linear-gradient(120deg,#070707_0%,#0c0c0d_52%,#151311_100%)]" aria-hidden="true" />
      <div className="absolute inset-0 opacity-35 [background-image:radial-gradient(rgba(255,255,255,.14)_0.5px,transparent_0.5px)] [background-size:5px_5px]" aria-hidden="true" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,.64)_100%)]" aria-hidden="true" />

      <div className="relative z-10 mx-auto grid min-h-[100svh] w-full max-w-[90rem] items-center gap-10 px-[var(--mh-container-gutter)] pb-20 pt-[7.5rem] lg:grid-cols-[minmax(0,0.88fr)_minmax(28rem,1.12fr)] lg:gap-8 lg:pb-10 lg:pt-[6.5rem]">
        <motion.div
          className="relative z-20 max-w-[34rem]"
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.9, delay: reduceMotion ? 0 : 0.1, ease }}
        >
          <div className="mb-6 flex items-center gap-3 text-[0.6rem] font-bold uppercase tracking-[0.28em] text-gold sm:mb-8">
            <span className="h-px w-10 bg-gold shadow-[0_0_14px_rgb(210_173_69/0.65)]" aria-hidden="true" />
            The house of Men&apos;s Hub
          </div>

          <p className="mb-4 text-[0.58rem] font-bold uppercase tracking-[0.38em] text-ivory/45">{props.tagline || "The modern wardrobe"}</p>
          <motion.h1 id="hero-title" className="max-w-[8ch] font-display text-[clamp(3.65rem,7.2vw,7.3rem)] font-semibold leading-[0.83] tracking-[-0.055em] text-ivory" initial={reduceMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: reduceMotion ? 0 : 0.4, delay: reduceMotion ? 0 : 0.25 }}>
            {useEditorialCopy ? editorialLines.map((line, index) => <motion.span key={line} className="block overflow-hidden" initial={reduceMotion ? false : { y: "110%", opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: reduceMotion ? 0 : 0.75, delay: reduceMotion ? 0 : 0.3 + index * 0.1, ease }}>{line}</motion.span>) : props.heading}
          </motion.h1>

          <motion.div className="mt-7 h-px w-20 bg-gold/70 sm:mt-9" initial={reduceMotion ? false : { scaleX: 0, transformOrigin: "left" }} animate={{ scaleX: 1 }} transition={{ duration: reduceMotion ? 0 : 0.8, delay: reduceMotion ? 0 : 0.72, ease }} aria-hidden="true" />
          <motion.p className="mt-6 max-w-md text-sm leading-7 text-ivory/70 sm:mt-7 sm:text-base sm:leading-8" initial={reduceMotion ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduceMotion ? 0 : 0.7, delay: reduceMotion ? 0 : 0.78, ease }}>{description}</motion.p>

          <motion.div className="mt-8 flex flex-col gap-3 min-[390px]:flex-row sm:mt-10" initial={reduceMotion ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduceMotion ? 0 : 0.7, delay: reduceMotion ? 0 : 0.9, ease }}>
            <Link className="store-cta-primary min-w-44 shadow-[0_16px_40px_rgb(210_173_69/0.13)]" href={props.primaryLink}>{useEditorialCopy ? "Explore Collection" : props.primaryLabel}<ArrowUpRight size={15} /></Link>
            <Link className="store-cta-secondary min-w-44 border-white/30 bg-white/[0.025] backdrop-blur-sm" href={props.secondaryLink}>{useEditorialCopy ? "New Arrivals" : props.secondaryLabel}</Link>
          </motion.div>
        </motion.div>

        <HeroFashionVisual image={props.mainImage} secondaryImages={props.secondaryImages} immersiveLayer={props.immersiveLayer} reduceMotion={Boolean(reduceMotion)} imageX={imageX} imageY={imageY} imageScale={imageScale} />
      </div>

      <div className="pointer-events-none absolute inset-x-[var(--mh-container-gutter)] bottom-6 z-20 flex items-center justify-between text-[0.56rem] font-bold uppercase tracking-[0.2em] text-ivory/40">
        <span className="hidden md:inline">Collection 01 / 2026</span>
        <span className="ml-auto flex items-center gap-3">Discover more <ArrowDown size={13} /></span>
      </div>
    </section>
  );
}

function HeroFashionVisual({ image, secondaryImages, immersiveLayer, reduceMotion, imageX, imageY, imageScale }: { image?: HeroImage; secondaryImages?: HeroImage[]; immersiveLayer?: ReactNode; reduceMotion: boolean; imageX: MotionValue<number>; imageY: MotionValue<number>; imageScale: MotionValue<number> }) {
  const secondary = secondaryImages?.[0];
  return (
    <div className="relative min-h-[24rem] overflow-visible sm:min-h-[34rem] lg:min-h-[min(78vh,49rem)]">
      <motion.div className="absolute inset-x-[-8%] inset-y-[-5%]" style={{ x: reduceMotion ? undefined : imageX, y: reduceMotion ? undefined : imageY, scale: reduceMotion ? undefined : imageScale }} initial={reduceMotion ? false : { opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: reduceMotion ? 1 : 1.04 }} transition={reduceMotion ? { duration: 0 } : { opacity: { duration: 1.1, delay: 0.18, ease }, scale: { duration: 20, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" } }}>
        {image ? <StoreImage src={image.url} alt={image.alt} fill preload quality={92} sizes="(max-width: 1023px) 100vw, 58vw" className="object-cover object-center grayscale-[0.12]" /> : <div className="h-full bg-[#151413]" />}
      </motion.div>
      <div className="absolute inset-0 bg-[linear-gradient(90deg,#070707_0%,transparent_28%,transparent_74%,#070707_100%),linear-gradient(0deg,#070707_0%,transparent_28%,rgba(0,0,0,.22)_100%)]" aria-hidden="true" />
      <div className="absolute left-[18%] top-[9%] h-[82%] w-px rotate-[12deg] bg-gradient-to-b from-transparent via-gold/35 to-transparent blur-[1px]" aria-hidden="true" />
      <div className="absolute bottom-[8%] left-[12%] h-px w-1/2 bg-gradient-to-r from-gold/60 to-transparent" aria-hidden="true" />
      {secondary ? <motion.div className="absolute bottom-[8%] right-[-3%] hidden w-28 border border-white/20 bg-black/30 p-1.5 shadow-[0_20px_50px_rgb(0_0_0/0.45)] sm:block lg:w-36" initial={reduceMotion ? false : { opacity: 0, y: 22, rotate: 3 }} animate={reduceMotion ? undefined : { opacity: 1, y: [0, -8, 0], rotate: 3 }} transition={reduceMotion ? { duration: 0 } : { opacity: { duration: 0.9, delay: 0.85 }, y: { duration: 6, repeat: Infinity, ease: "easeInOut" } }}><div className="relative aspect-[3/4]"><StoreImage src={secondary.url} alt={secondary.alt} fill quality={80} sizes="9rem" className="object-cover" /></div><p className="px-1 py-2 text-[0.5rem] font-bold uppercase tracking-[0.16em] text-ivory/60">The detail / 01</p></motion.div> : null}
      {immersiveLayer ? <div className="absolute inset-0">{immersiveLayer}</div> : null}
    </div>
  );
}