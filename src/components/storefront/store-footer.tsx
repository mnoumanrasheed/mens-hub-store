import Image from "next/image";
import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa";

import { ScrollReveal } from "@/components/storefront/scroll-reveal";
import type { StorefrontCategory } from "@/data/storefront";

type Settings = {
  brandName: string;
  tagline: string;
  proprietors: string;
  phone: string;
  whatsapp: string;
  email: string;
  instagramUrl: string | null;
  facebookUrl: string | null;
  tiktokUrl: string | null;
};

type CategoryItem = Pick<StorefrontCategory, "id" | "name" | "slug">;

const exploreLinks = [
  ["Shop", "/shop"],
  ["New Arrivals", "/new-arrivals"],
  ["Categories", "/shop"],
  ["Sale", "/sale"],
] as const;

const supportColumnLeft = [
  ["Contact", "/contact"],
  ["Shipping Information", "/shipping-policy"],
  ["Size Guide", "/size-guide"],
] as const;

const supportColumnRight = [
  ["How to Order", "/how-to-order"],
  ["Returns & Exchange", "/return-exchange-policy"],
  ["FAQs", "/faq"],
] as const;

export function StoreFooter({
  settings,
  categories = [],
}: {
  settings: Settings;
  categories?: CategoryItem[];
  content?: Record<string, string>;
}) {
  const brandName = settings.brandName || "Men's Hub";
  const tagline = settings.tagline || "STYLE MADE FOR MEN";
  const proprietors = settings.proprietors || "TAHA SONI / SHAHZAIB SONI";
  const phone = settings.phone || "03081000025";
  const email = settings.email || "mens.hub919@gmail.com";

  const socials = [
    { label: "Instagram", href: settings.instagramUrl, icon: FaInstagram },
    { label: "Facebook", href: settings.facebookUrl, icon: FaFacebookF },
    { label: "TikTok", href: settings.tiktokUrl, icon: FaTiktok },
  ].filter((item): item is typeof item & { href: string } => Boolean(item.href));

  return (
    <footer className="w-full bg-[#070809] text-[#ece8de] border-t border-[#1c1d20]" aria-label="Store footer">
      <div className="mx-auto max-w-[92rem] px-6 py-16 sm:px-10 lg:py-20">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
          
          {/* LEFT: Brand Identity, Tagline, Bio & Proprietors (5 cols) */}
          <ScrollReveal className="flex flex-col justify-between lg:col-span-5 pr-0 lg:pr-8">
            <div>
              <Link href="/" aria-label={`${brandName} home`} className="group inline-flex items-center gap-3.5">
                <div className="relative flex h-11 w-12 shrink-0 items-center justify-center transition-transform duration-300 group-hover:scale-105">
                  <Image
                    src="/logo.png"
                    alt=""
                    width={1448}
                    height={1086}
                    className="h-full w-full object-contain filter drop-shadow-sm"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-display text-2xl font-medium tracking-wide text-white transition-colors group-hover:text-gold">
                    {brandName}
                  </span>
                  <span className="text-[0.62rem] font-bold uppercase tracking-[0.26em] text-gold">
                    {tagline}
                  </span>
                </div>
              </Link>

              <p className="mt-6 max-w-md text-sm leading-relaxed text-[#9ca3af]">
                Modern menswear, footwear and accessories curated for confidence and effortless everyday style.
              </p>
            </div>

            {proprietors ? (
              <p className="mt-8 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#6b7280]">
                {proprietors}
              </p>
            ) : null}
          </ScrollReveal>

          {/* MIDDLE: Explore Links (3 cols) */}
          <ScrollReveal className="lg:col-span-3" delay={0.06}>
            <h3 className="mb-6 text-xs font-bold uppercase tracking-[0.24em] text-gold">
              Explore
            </h3>
            <nav aria-label="Footer explore links" className="flex flex-col gap-3.5">
              {exploreLinks.map(([label, href]) => (
                <Link
                  key={label}
                  href={href}
                  className="text-sm font-normal text-[#d1d5db] transition-colors duration-200 hover:text-gold hover:translate-x-0.5"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </ScrollReveal>

          {/* RIGHT: Support Links & Direct Contact Strip (4 cols) */}
          <ScrollReveal className="lg:col-span-4 flex flex-col justify-between" delay={0.12}>
            <div>
              <h3 className="mb-6 text-xs font-bold uppercase tracking-[0.24em] text-gold">
                Support
              </h3>
              <div className="grid grid-cols-2 gap-4 sm:gap-6">
                <nav aria-label="Support links left" className="flex flex-col gap-3.5">
                  {supportColumnLeft.map(([label, href]) => (
                    <Link
                      key={label}
                      href={href}
                      className="text-sm font-normal text-[#d1d5db] transition-colors duration-200 hover:text-gold hover:translate-x-0.5"
                    >
                      {label}
                    </Link>
                  ))}
                </nav>
                <nav aria-label="Support links right" className="flex flex-col gap-3.5">
                  {supportColumnRight.map(([label, href]) => (
                    <Link
                      key={label}
                      href={href}
                      className="text-sm font-normal text-[#d1d5db] transition-colors duration-200 hover:text-gold hover:translate-x-0.5"
                    >
                      {label}
                    </Link>
                  ))}
                </nav>
              </div>
            </div>

            {/* Support Contact Line */}
            <div className="mt-8 border-t border-[#26272b] pt-6 flex flex-wrap items-center gap-6 text-xs text-[#9ca3af]">
              {phone ? (
                <a
                  href={`tel:${phone.replace(/[^+\d]/g, "")}`}
                  className="group inline-flex items-center gap-2 text-xs font-medium text-[#d1d5db] transition-colors hover:text-gold"
                >
                  <Phone size={14} className="text-gold transition-transform group-hover:scale-110" />
                  <span>{phone}</span>
                </a>
              ) : null}
              {email ? (
                <a
                  href={`mailto:${email}`}
                  className="group inline-flex items-center gap-2 text-xs font-medium text-[#d1d5db] transition-colors hover:text-gold"
                >
                  <Mail size={14} className="text-gold transition-transform group-hover:scale-110" />
                  <span>{email}</span>
                </a>
              ) : null}
            </div>
          </ScrollReveal>
        </div>

        {/* BOTTOM STRIP: Copyright & Policy Links */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-[#1e2023] pt-8 text-xs text-[#6b7280] sm:flex-row">
          <p>&copy; {new Date().getFullYear()} {brandName}. All rights reserved.</p>
          
          <div className="flex items-center gap-6">
            <Link href="/privacy-policy" className="transition-colors hover:text-[#d1d5db]">
              Privacy
            </Link>
            <Link href="/terms-and-conditions" className="transition-colors hover:text-[#d1d5db]">
              Terms
            </Link>
          </div>

          {socials.length > 0 ? (
            <div className="flex items-center gap-3">
              {socials.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex size-7 items-center justify-center rounded-full border border-[#2a2c30] text-[#9ca3af] transition-colors hover:border-gold hover:text-gold"
                >
                  <Icon size={12} />
                </a>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </footer>
  );
}
