"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductShowroomScene } from "@/components/storefront/product-showroom-scene";

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

export function CinematicHero(props: Props) {
  const headingText = props.heading || "Style Starts Here.";
  const taglineText = props.tagline || "NEW SEASON / MEN’S HUB";
  const descriptionText =
    props.description || "Explore menswear, footwear and accessories selected for every day.";

  const primaryBtnLabel = props.primaryLabel || "Shop New In";
  const primaryBtnLink = props.primaryLink || "/new-arrivals";
  const secondaryBtnLabel = props.secondaryLabel || "Explore Categories";
  const secondaryBtnLink = props.secondaryLink || "/shop";

  return (
    <section
      aria-labelledby="hero-title"
      className="relative w-full h-[580px] sm:h-[640px] lg:h-[680px] overflow-hidden bg-[radial-gradient(ellipse_at_75%_45%,#2d2d33_0%,#18181b_60%,#0f0f11_100%)] text-white"
    >
      {/* 3D Luxury Product Showroom Scene (No human models or portraits) */}
      <ProductShowroomScene />

      {/* Ambient gradient overlay to sharpen text contrast on left side */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 bg-gradient-to-r from-[#0f0f11] via-[#0f0f11]/80 to-transparent max-w-3xl"
      />

      {/* Hero CMS Content overlay aligned to bottom-left */}
      <div className="relative z-10 mx-auto flex h-full max-w-[90rem] flex-col justify-center px-4 sm:px-8 lg:px-12">
        <div className="max-w-xl">
          {taglineText ? (
            <p className="mb-3 text-xs sm:text-sm font-semibold uppercase tracking-[0.22em] text-gray-300">
              {taglineText}
            </p>
          ) : null}

          <h1
            id="hero-title"
            className="font-sans text-3xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl line-clamp-2 mb-4"
          >
            {headingText}
          </h1>

          <p className="mb-8 max-w-lg text-sm sm:text-base font-normal leading-relaxed text-gray-300 line-clamp-2">
            {descriptionText}
          </p>

          <div className="flex flex-wrap items-center gap-5 sm:gap-6">
            {/* Primary CTA: Solid white button with black text */}
            <Link
              href={primaryBtnLink}
              className="inline-flex min-h-[3rem] items-center gap-2 bg-white px-7 text-xs font-bold uppercase tracking-wider text-black transition-colors hover:bg-neutral-200"
            >
              {primaryBtnLabel}
              <ArrowRight size={15} />
            </Link>

            {/* Secondary CTA: Simple text link with underline */}
            <Link
              href={secondaryBtnLink}
              className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-white underline underline-offset-4 transition-colors hover:text-gray-300"
            >
              {secondaryBtnLabel}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
