import Image from "next/image";
import Link from "next/link";
import { Mail, Phone, ArrowUpRight } from "lucide-react";
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
  ["Shop all", "/shop"],
  ["New arrivals", "/new-arrivals"],
  ["Sale", "/sale"],
  ["Our story", "/about"],
] as const;

const supportLinks = [
  ["Contact", "/contact"],
] as const;

export function StoreFooter({ settings }: { settings: Settings; categories?: Pick<StorefrontCategory, "id" | "name" | "slug">[]; content?: Record<string, string> }) {
  const brandName = settings.brandName || "Men's Hub";
  const socials = [
    { label: "Instagram", href: settings.instagramUrl, icon: FaInstagram },
    { label: "Facebook", href: settings.facebookUrl, icon: FaFacebookF },
    { label: "TikTok", href: settings.tiktokUrl, icon: FaTiktok },
  ].filter((item): item is typeof item & { href: string } => Boolean(item.href));

  return (
    <footer className="mh-site-footer" aria-label="Store footer">
      <div className="mh-site-footer-inner">
        <div className="mh-footer-top">
          <div className="mh-footer-brand">
            <Link href="/" className="mh-footer-lockup" aria-label={`${brandName} home`}>
              <Image src="/logo.png" alt="" width={1448} height={1086} />
              <span><strong>{brandName}</strong><small>{settings.tagline || "Premium menswear"}</small></span>
            </Link>
            <p>Menswear, footwear, and finishing details curated for confident everyday style.</p>
            {settings.proprietors ? <small className="mh-footer-proprietors">{settings.proprietors}</small> : null}
          </div>

          <div className="mh-footer-column"><h2>Explore</h2><nav aria-label="Footer explore links">{exploreLinks.map(([label, href]) => <Link key={href} href={href}>{label}<ArrowUpRight size={13} /></Link>)}</nav></div>
          <div className="mh-footer-column"><h2>Support</h2><nav aria-label="Footer support links">{supportLinks.map(([label, href]) => <Link key={href} href={href}>{label}<ArrowUpRight size={13} /></Link>)}</nav></div>
        </div>

        <div className="mh-footer-contact">
          {settings.phone ? <a href={`tel:${settings.phone.replace(/[^+\d]/g, "")}`}><Phone size={14} />{settings.phone}</a> : null}
          {settings.email ? <a href={`mailto:${settings.email}`}><Mail size={14} />{settings.email}</a> : null}
        </div>

        <div className="mh-footer-bottom">
          <p>© {new Date().getFullYear()} {brandName}. All rights reserved.</p>
          {socials.length ? <div className="mh-footer-socials">{socials.map(({ label, href, icon: Icon }) => <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}><Icon size={13} /></a>)}</div> : null}
        </div>
      </div>
    </footer>
  );
}
