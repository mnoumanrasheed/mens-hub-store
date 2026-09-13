import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Mail, MessageCircle, Phone } from "lucide-react";
import { FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa";

import { ScrollReveal } from "@/components/storefront/scroll-reveal";

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
  ["Shop", "/shop"],
  ["New Arrivals", "/new-arrivals"],
  ["Categories", "/shop"],
  ["Sale", "/sale"],
  ["About", "/about"],
] as const;

const supportLinks = [
  ["Contact", "/contact"],
  ["How to Order", "/how-to-order"],
  ["Shipping Information", "/shipping-policy"],
  ["Returns & Exchange", "/return-exchange-policy"],
  ["Size Guide", "/size-guide"],
  ["FAQs", "/faq"],
] as const;

const marqueeText = "STYLE MADE FOR MEN  •  MODERN ESSENTIALS  •  TIMELESS DETAIL  •  PERSONAL SERVICE  •  ";

export function StoreFooter({ settings }: {
  settings: Settings;
  content?: Record<string, string>;
}) {
  const whatsappHref = `https://wa.me/${settings.whatsapp.replace(/\D/g, "")}`;
  const socials = [
    { label: "Instagram", href: settings.instagramUrl, icon: FaInstagram },
    { label: "Facebook", href: settings.facebookUrl, icon: FaFacebookF },
    { label: "TikTok", href: settings.tiktokUrl, icon: FaTiktok },
  ].filter((item): item is typeof item & { href: string } => Boolean(item.href));

  return (
    <footer className="minimal-footer" aria-label="Store footer">
      <div className="minimal-footer-inner">
        <section className="minimal-footer-cta" aria-labelledby="footer-cta-title">
          <div className="minimal-footer-cta-copy">
            <ScrollReveal><p className="minimal-footer-eyebrow">Men&apos;s Hub</p></ScrollReveal>
            <div className="minimal-footer-heading-mask">
              <ScrollReveal delay={0.06}><h2 id="footer-cta-title">Style should feel <em>effortless.</em></h2></ScrollReveal>
            </div>
          </div>
          <div className="minimal-footer-cta-side">
            <ScrollReveal delay={0.12}><p>Discover pieces made for the modern man.</p></ScrollReveal>
            <ScrollReveal className="minimal-footer-actions" delay={0.18}>
              <Link href="/shop" className="minimal-footer-primary">Explore Store <ArrowUpRight size={17} /></Link>
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="minimal-footer-secondary"><MessageCircle size={16} /> Chat on WhatsApp <ArrowUpRight size={15} /></a>
            </ScrollReveal>
          </div>
        </section>
      </div>

      <div className="minimal-footer-marquee" aria-label="Style made for men, modern essentials, timeless detail, personal service">
        <div aria-hidden="true"><span>{marqueeText}</span><span>{marqueeText}</span></div>
      </div>

      <div className="minimal-footer-inner">
        <div className="minimal-footer-directory">
          <ScrollReveal className="minimal-footer-brand">
            <Link href="/" aria-label={`${settings.brandName} home`} className="minimal-footer-brand-lockup">
              <Image src="/logo.png" alt="" width={1448} height={1086} className="minimal-footer-logo" />
              <span>{settings.brandName}<small>{settings.tagline || "Style Made for Men."}</small></span>
            </Link>
            <p>Modern menswear, footwear and accessories curated for confidence and effortless everyday style.</p>
            {settings.proprietors ? <small className="minimal-footer-proprietors">{settings.proprietors}</small> : null}
          </ScrollReveal>

          <ScrollReveal className="minimal-footer-column" delay={0.08}>
            <h3>Explore</h3>
            <nav aria-label="Footer explore links">
              {exploreLinks.map(([label, href]) => <Link key={label} href={href}>{label}</Link>)}
            </nav>
          </ScrollReveal>

          <ScrollReveal className="minimal-footer-column minimal-footer-support" delay={0.16}>
            <h3>Support</h3>
            <nav aria-label="Footer support links">
              {supportLinks.map(([label, href]) => <Link key={label} href={href}>{label}</Link>)}
            </nav>
            <div className="minimal-footer-contact">
              <a href={`tel:${settings.phone.replace(/[^+\d]/g, "")}`}><Phone size={14} /><span>{settings.phone}</span></a>
              <a href={`mailto:${settings.email}`}><Mail size={14} /><span>{settings.email}</span></a>
            </div>
          </ScrollReveal>
        </div>

        <div className="minimal-footer-bottom">
          <div><p>&copy; {new Date().getFullYear()} {settings.brandName}. All rights reserved.</p><nav aria-label="Legal"><Link href="/privacy-policy">Privacy</Link><Link href="/terms-and-conditions">Terms</Link></nav></div>
          <div className="minimal-footer-socials">
            {socials.map(({ label, href, icon: Icon }) => <a key={label} href={href} aria-label={label} target="_blank" rel="noopener noreferrer"><Icon size={14} /></a>)}
          </div>
        </div>
      </div>
    </footer>
  );
}
