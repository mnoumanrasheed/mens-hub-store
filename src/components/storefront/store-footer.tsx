import Image from "next/image";
import Link from "next/link";
import { Mail, Phone, MessageCircle, ArrowUpRight } from "lucide-react";
import { FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa";

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

  const socials = [
    { label: "Instagram", href: settings.instagramUrl, icon: FaInstagram },
    { label: "Facebook", href: settings.facebookUrl, icon: FaFacebookF },
    { label: "TikTok", href: settings.tiktokUrl, icon: FaTiktok },
  ].filter((item): item is typeof item & { href: string } => Boolean(item.href));

  return (
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
            {settings.proprietors ? (
              <small className="mh-footer-proprietors">{settings.proprietors}</small>
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

          {/* Column 4 — Contact */}
          <div className="mh-footer-column mh-footer-contact-col">
            <h3>Contact</h3>
            <div className="mh-footer-contact-list">
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
        </div>
      </div>
    </footer>
  );
}
