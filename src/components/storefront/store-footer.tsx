"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ChevronDown, Mail, MessageCircle, Phone } from "lucide-react";
import { FaFacebookF, FaInstagram } from "react-icons/fa";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";

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

const currentYear = new Date().getFullYear();
const ease = [0.22, 1, 0.36, 1] as const;

type FooterLink = [string, string];

export function StoreFooter({
  settings,
  categories,
  content,
}: {
  settings: Settings;
  categories: Pick<StorefrontCategory, "id" | "name" | "slug">[];
  content?: Record<string, string>;
}) {
  const reduceMotion = useReducedMotion();
  const shopLinks: FooterLink[] = [
    ["New Arrivals", "/new-arrivals"],
    ["Collections", "/shop"],
    ...categories.slice(0, 4).map((category) => [category.name, `/shop/${category.slug}`] as FooterLink),
  ];
  const careLinks: FooterLink[] = [
    ["Contact", "/contact"],
    ["Order on WhatsApp", `https://wa.me/${settings.whatsapp.replace(/\D/g, "")}`],
    ["Shipping Information", "/shipping-policy"],
    ["Returns Policy", "/return-exchange-policy"],
    ["FAQs", "/faq"],
  ];
  const socials = [
    { label: "Instagram", href: settings.instagramUrl, icon: FaInstagram },
    { label: "Facebook", href: settings.facebookUrl, icon: FaFacebookF },
    { label: "WhatsApp", href: `https://wa.me/${settings.whatsapp.replace(/\D/g, "")}`, icon: MessageCircle },
  ].filter((social): social is typeof social & { href: string } => Boolean(social.href));

  return (
    <footer className="luxury-footer relative isolate overflow-hidden border-t border-gold/30 bg-[#050505] text-ivory">
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.13] [background-image:radial-gradient(circle_at_20%_10%,rgba(210,173,69,.18),transparent_28%),radial-gradient(circle_at_85%_70%,rgba(255,255,255,.08),transparent_26%)]" aria-hidden="true" />
      <div className="pointer-events-none absolute left-1/2 top-24 -z-10 -translate-x-1/2 whitespace-nowrap font-display text-[clamp(7rem,24vw,25rem)] font-semibold uppercase leading-none tracking-[-0.08em] text-white/[0.025]" aria-hidden="true">Men&apos;s Hub</div>
      <div className="mx-auto max-w-[90rem] px-[var(--mh-container-gutter)]">
        <motion.div
          className="relative border-b border-white/10 py-16 sm:py-24 lg:py-28"
          initial={reduceMotion ? false : { opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: reduceMotion ? 0 : 0.8, ease }}
        >
          <div className="absolute left-0 top-0 h-px w-24 bg-gold shadow-[0_0_18px_rgb(210_173_69/0.8)]" aria-hidden="true" />
          <p className="store-eyebrow">The house of Men&apos;s Hub</p>
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,34rem)] lg:items-end">
            <h2 className="max-w-[12ch] font-display text-[clamp(3rem,7vw,7rem)] font-semibold leading-[0.86] tracking-[-0.05em] text-ivory">Designed for the Modern Gentleman</h2>
            <div className="lg:pb-2">
              <p className="max-w-md text-sm leading-7 text-muted sm:text-base">Premium men&apos;s fashion crafted with confidence, elegance and timeless style.</p>
              <a className="store-cta-secondary mt-7 self-start border-white/25" href={`https://wa.me/${settings.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer"><MessageCircle size={16} /> Speak with our team <ArrowUpRight size={15} /></a>
            </div>
          </div>
        </motion.div>

        <div className="grid gap-0 border-b border-white/10 py-10 sm:grid-cols-2 sm:gap-x-10 sm:py-14 lg:grid-cols-[1.35fr_1fr_1.15fr_1fr] lg:gap-12">
          <motion.div className="hidden sm:block" initial={reduceMotion ? false : { opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: reduceMotion ? 0 : 0.65, delay: reduceMotion ? 0 : 0.05, ease }}>
            <Link href="/" className="group flex items-center font-display text-4xl font-semibold uppercase tracking-[0.1em] text-ivory transition-colors hover:text-gold"><Image src="/logo.png" alt={settings.brandName} width={1448} height={1086} className="h-16 w-44 object-contain object-left transition-transform duration-500 group-hover:scale-[1.02]" /></Link>
            <p className="mt-4 max-w-xs text-sm leading-7 text-muted">{content?.description || "Style Made for Men. Premium clothing and accessories for the modern lifestyle."}</p>
            <p className="mt-8 text-[0.62rem] font-bold uppercase tracking-[0.18em] text-gold">{settings.proprietors}</p>
          </motion.div>
          <FooterSection title="Shop" links={shopLinks} index={1} reduceMotion={Boolean(reduceMotion)} />
          <FooterSection title="Customer Care" links={careLinks} index={2} reduceMotion={Boolean(reduceMotion)} externalPrefix="https://wa.me/" />
          <motion.div className="hidden lg:block" initial={reduceMotion ? false : { opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: reduceMotion ? 0 : 0.65, delay: reduceMotion ? 0 : 0.25, ease }}>
            <p className="footer-title">Connect</p>
            <div className="mt-5 grid gap-3">
              <a className="footer-link gap-3" href={`tel:${settings.phone.replace(/[^+\d]/g, "")}`}><Phone size={15} className="text-gold" />{settings.phone}</a>
              <a className="footer-link gap-3 break-all" href={`mailto:${settings.email}`}><Mail size={15} className="text-gold" />{settings.email}</a>
            </div>
            <div className="mt-7 flex gap-2">
              {socials.map(({ label, href, icon: Icon }) => <a key={label} className="grid size-10 place-items-center border border-white/15 text-muted transition-all hover:border-gold hover:bg-gold hover:text-gold-ink hover:shadow-[0_0_20px_rgb(210_173_69/0.22)]" href={href} aria-label={label} target="_blank" rel="noopener noreferrer"><Icon size={16} strokeWidth={1.6} /></a>)}
            </div>
          </motion.div>
          <div className="lg:hidden"><FooterSection title="Connect" index={3} reduceMotion={Boolean(reduceMotion)} links={[]}><div className="grid gap-3 pb-5 pt-2"><a className="footer-link gap-3" href={`tel:${settings.phone.replace(/[^+\d]/g, "")}`}><Phone size={15} className="text-gold" />{settings.phone}</a><a className="footer-link gap-3 break-all" href={`mailto:${settings.email}`}><Mail size={15} className="text-gold" />{settings.email}</a><div className="flex gap-2 pt-2">{socials.map(({ label, href, icon: Icon }) => <a key={label} className="grid size-10 place-items-center border border-white/15 text-muted transition-all hover:border-gold hover:bg-gold hover:text-gold-ink" href={href} aria-label={label} target="_blank" rel="noopener noreferrer"><Icon size={16} /></a>)}</div></div></FooterSection></div>
        </div>

        <div className="flex flex-col gap-5 py-6 text-[0.62rem] font-bold uppercase tracking-[0.11em] text-subtle sm:flex-row sm:items-center sm:justify-between">
          <p>© {currentYear} {settings.brandName}. All Rights Reserved.</p>
          <nav className="flex flex-wrap gap-x-5 gap-y-2" aria-label="Legal"><Link className="footer-link min-h-0 text-[0.62rem] uppercase tracking-[0.11em]" href="/privacy-policy">Privacy Policy</Link><Link className="footer-link min-h-0 text-[0.62rem] uppercase tracking-[0.11em]" href="/terms-and-conditions">Terms</Link></nav>
          <div className="flex items-center gap-2" aria-label="Accepted payment methods"><span className="text-[0.55rem] tracking-[0.16em] text-subtle">Secure checkout</span><span className="border border-white/15 px-2 py-1 text-[0.6rem] tracking-[0.08em] text-ivory/75">COD</span><span className="border border-white/15 px-2 py-1 text-[0.6rem] tracking-[0.08em] text-ivory/75">VISA</span><span className="border border-white/15 px-2 py-1 text-[0.6rem] tracking-[0.08em] text-ivory/75">MC</span></div>
        </div>
      </div>
    </footer>
  );
}

function FooterSection({ title, links, index, reduceMotion, children }: { title: string; links: FooterLink[]; index: number; reduceMotion: boolean; externalPrefix?: string; children?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return <motion.div initial={reduceMotion ? false : { opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: reduceMotion ? 0 : 0.65, delay: reduceMotion ? 0 : index * 0.08, ease }}>
    <button className="flex min-h-14 w-full items-center justify-between border-b border-white/10 text-left lg:pointer-events-none lg:min-h-0 lg:border-0" type="button" aria-expanded={open} onClick={() => setOpen((value) => !value)}><span className="footer-title">{title}</span><ChevronDown className={`text-gold transition-transform duration-300 lg:hidden ${open ? "rotate-180" : ""}`} size={16} /></button>
    <div className="hidden lg:block"><FooterLinks links={links} />{children}</div>
    <AnimatePresence initial={false}>{open ? <motion.div className="overflow-hidden lg:hidden" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: reduceMotion ? 0 : 0.35, ease }}><FooterLinks links={links} />{children}</motion.div> : null}</AnimatePresence>
  </motion.div>;
}

function FooterLinks({ links }: { links: FooterLink[] }) {
  return <nav className="grid gap-1 py-3" aria-label="Footer links">{links.map(([label, href]) => <Link key={href} className="footer-link group w-fit gap-2" href={href} target={href.startsWith("https://") ? "_blank" : undefined} rel={href.startsWith("https://") ? "noopener noreferrer" : undefined}>{label}<ArrowUpRight className="size-3 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" /></Link>)}</nav>;
}