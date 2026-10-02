import Image from "next/image";
import Link from "next/link";
import { Mail, Phone, MessageCircle, ArrowUpRight, MapPin } from "lucide-react";
import { FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa";

import type { StorefrontCategory } from "@/data/storefront";

type Settings = {
  brandName: string;
  tagline: string;
  proprietors: string;
  phone: string;
  whatsapp: string;
  email: string;
  address?: string | null;
  googleMapsUrl?: string | null;
  instagramUrl: string | null;
  facebookUrl: string | null;
  tiktokUrl: string | null;
};

const exploreLinks = [
  ["Shop All", "/shop"],
  ["New Arrivals", "/new-arrivals"],
  ["Sale", "/sale"],
  ["Our Story", "/about"],
] as const;

const supportLinks = [
  ["Contact", "/contact"],
  ["Shipping & Returns", "/shipping-returns"],
] as const;

export function StoreFooter({
  settings,
}: {
  settings: Settings;
  categories?: Pick<StorefrontCategory, "id" | "name" | "slug">[];
  content?: Record<string, string>;
}) {
  const brandName = settings.brandName || "Men's Hub";
  const cleanWhatsapp = settings.whatsapp?.replace(/\D/g, "") || "";
  const tiktokHref = settings.tiktokUrl || "https://www.tiktok.com/@mens.hub919";

  const socials = [
    { label: "Instagram", href: settings.instagramUrl, icon: FaInstagram },
    { label: "Facebook", href: settings.facebookUrl, icon: FaFacebookF },
  ].filter((item): item is typeof item & { href: string } => Boolean(item.href));

  const marqueeItems = [
    { text: "Style for Men", highlight: true },
    { text: "Premium Menswear" },
    { text: "Confidence in Every Thread", highlight: true },
    { text: "Crafted for the Modern Man" },
    { text: "Elegance Redefined", highlight: true },
    { text: "Bhalwal · Punjab · Pakistan" },
    { text: "Wear Your Ambition", highlight: true },
    { text: "New Arrivals · Every Season" },
    { text: "Fashion Meets Tradition", highlight: true },
    { text: "Men's Hub — Est. Excellence" },
  ];

  return (
    <>
      {/* ── Pre-footer Marquee Strip ── */}
      <div className="mh-marquee-strip" aria-hidden="true">
        <div className="mh-marquee-track">
          {[0, 1].map((copyIdx) => (
            <div key={copyIdx} className="mh-marquee-set">
              {marqueeItems.map((item, i) => (
                <span
                  key={i}
                  className={`mh-marquee-item${item.highlight ? " mh-marquee-item--highlight" : ""}`}
                >
                  {item.text}
                  <span className="mh-marquee-dot" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <footer className="mh-site-footer" aria-label="Store footer">
      <div className="mh-site-footer-inner">

        {/* ── Main grid ── */}
        <div className="mh-footer-top">

          {/* Column 1 — Brand */}
          <div className="mh-footer-brand">
            <Link href="/" className="mh-footer-lockup" aria-label={`${brandName} home`}>
              <span className="mh-footer-logo-wrap">
                <Image src="/logo.png" alt="" width={1448} height={1086} />
              </span>
              <span className="mh-footer-brand-text">
                <strong>{brandName}</strong>
                <small>Style Made for Men</small>
              </span>
            </Link>
            <p>
              Menswear, footwear, and finishing details curated for confident everyday style.
            </p>
            <a
              href={tiktokHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mh-footer-tiktok"
              aria-label="Follow Men's Hub on TikTok"
            >
              <FaTiktok size={14} />
              <span>TikTok</span>
              <strong>@mens.hub919</strong>
              <ArrowUpRight size={12} strokeWidth={1.8} />
            </a>
            {settings.proprietors ? (
              <div className="mh-footer-leadership-card">
                <span className="mh-leadership-title">Proprietors</span>
                <strong className="mh-leadership-names">                  {settings.proprietors.split("/").map((name) => name.trim()).filter(Boolean).map((name, index) => (
                    <span key={name} className="mh-proprietor-name">
                      <small>{String(index + 1).padStart(2, "0")}</small>
                      <span>{name}</span>
                    </span>
                  ))}</strong>
              </div>
            ) : null}
          </div>

          {/* Column 2 — Explore */}
          <div className="mh-footer-column">
            <h3>Explore</h3>
            <nav aria-label="Footer explore links">
              {exploreLinks.map(([label, href]) => (
                <Link key={href} href={href}>
                  {label}
                  <ArrowUpRight size={12} strokeWidth={1.8} />
                </Link>
              ))}
            </nav>
          </div>

          {/* Column 3 — Support */}
          <div className="mh-footer-column">
            <h3>Support</h3>
            <nav aria-label="Footer support links">
              {supportLinks.map(([label, href]) => (
                <Link key={href} href={href}>
                  {label}
                  <ArrowUpRight size={12} strokeWidth={1.8} />
                </Link>
              ))}
            </nav>
          </div>

          {/* Column 4 — Contact & Address */}
          <div className="mh-footer-column mh-footer-contact-col">
            <h3>Contact &amp; Location</h3>
            <div className="mh-footer-contact-list">
              <a
                href={settings.googleMapsUrl || "https://maps.app.goo.gl/4TY7B5eArRLybFUZA"}
                target="_blank"
                rel="noopener noreferrer"
                className="mh-footer-contact-item mh-footer-address"
                aria-label="View store location on Google Maps"
              >
                <MapPin size={14} strokeWidth={1.8} className="flex-shrink-0" />
                <span>{settings.address || "Liaqat Shaheed Rd, Chak No. 8 NB, Bhalwal, Punjab, Pakistan"}</span>
              </a>

              {settings.phone ? (
                <a
                  href={`tel:${settings.phone.replace(/[^+\d]/g, "")}`}
                  className="mh-footer-contact-item"
                  aria-label={`Call us: ${settings.phone}`}
                >
                  <Phone size={14} strokeWidth={1.8} />
                  <span>{settings.phone}</span>
                </a>
              ) : null}

              {settings.email ? (
                <a
                  href={`mailto:${settings.email}`}
                  className="mh-footer-contact-item"
                  aria-label={`Email us: ${settings.email}`}
                >
                  <Mail size={14} strokeWidth={1.8} />
                  <span>{settings.email}</span>
                </a>
              ) : null}

              {cleanWhatsapp ? (
                <a
                  href={`https://wa.me/${cleanWhatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mh-footer-contact-item mh-footer-whatsapp"
                  aria-label="Chat on WhatsApp"
                >
                  <MessageCircle size={14} strokeWidth={1.8} />
                  <span>WhatsApp</span>
                </a>
              ) : null}
            </div>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="mh-footer-bottom">
          <p>© {new Date().getFullYear()} {brandName}. All rights reserved.</p>
          <div className="mh-footer-bottom-actions">
            {socials.length ? (
              <div className="mh-footer-socials">
                {socials.map(({ label, href, icon: Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    title={label}
                  >
                    <Icon size={13} />
                  </a>
                ))}
              </div>
            ) : null}
            <a
              href="https://mnoumanrasheed.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="mh-footer-dev-btn"
              aria-label="Developer Portfolio"
            >
              <strong>Developer Portfolio</strong>
              <ArrowUpRight size={13} strokeWidth={1.8} />
            </a>
          </div>
        </div>
      </div>
    </footer>
    </>
  );
}
