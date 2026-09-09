import Link from "next/link";

import type { StorefrontCategory } from "@/data/storefront";

type Settings = {
  brandName: string;
  tagline: string;
  proprietors: string;
  phone: string;
  email: string;
  instagramUrl: string | null;
  facebookUrl: string | null;
  tiktokUrl: string | null;
};

const currentYear = new Date().getUTCFullYear();

export function StoreFooter({
  settings,
  categories,
  content,
}: {
  settings: Settings;
  categories: Pick<StorefrontCategory, "id" | "name" | "slug">[];
  content?: Record<string, string>;
}) {
  const social = [
    ["Instagram", settings.instagramUrl],
    ["Facebook", settings.facebookUrl],
    ["TikTok", settings.tiktokUrl],
  ].filter((item): item is [string, string] => Boolean(item[1]));

  return (
    <footer className="border-t border-line bg-[#080809] pt-16 sm:pt-20">
      <div className="mx-auto grid max-w-[90rem] gap-12 px-[var(--mh-container-gutter)] pb-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_1fr_1fr]">
        <div>
          <Link
            href="/"
            className="font-display text-3xl font-semibold uppercase tracking-[0.1em] text-ivory"
          >
            {settings.brandName}
          </Link>
          <p className="mt-3 text-sm font-semibold text-gold">{settings.tagline}</p>
          <p className="mt-2 text-sm text-muted">{settings.proprietors}</p>
          {content?.description ? (
            <p className="mt-5 max-w-sm whitespace-pre-line text-sm leading-7 text-muted">
              {content.description}
            </p>
          ) : null}
        </div>
        <FooterList
          title="Explore"
          links={[
            ["Shop", "/shop"],
            ["New Arrivals", "/new-arrivals"],
            ["Sale", "/sale"],
            ["About", "/about"],
            ["Contact", "/contact"],
          ]}
        />
        <FooterList
          title="Categories"
          links={categories.map((category) => [category.name, `/shop/${category.slug}`])}
        />
        <div>
          <p className="footer-title">Information</p>
          <div className="mt-4 grid gap-2">
            <a className="footer-link" href={`tel:${settings.phone}`}>
              {settings.phone}
            </a>
            <a className="footer-link break-all" href={`mailto:${settings.email}`}>
              {settings.email}
            </a>
            {social.map(([label, href]) => (
              <a
                className="footer-link"
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-line px-[var(--mh-container-gutter)] py-5">
        <div className="mx-auto flex max-w-[90rem] flex-col gap-3 text-xs text-subtle sm:flex-row sm:items-center sm:justify-between">
          <p>© {currentYear} {settings.brandName}</p>
          <nav className="flex flex-wrap gap-x-4 gap-y-2" aria-label="Policies">
            <Link href="/how-to-order">How to Order</Link>
            <Link href="/size-guide">Size Guide</Link>
            <Link href="/faq">FAQ</Link>
            <Link href="/shipping-policy">Shipping</Link>
            <Link href="/return-exchange-policy">Returns & Exchanges</Link>
            <Link href="/privacy-policy">Privacy</Link>
            <Link href="/terms-and-conditions">Terms</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}

function FooterList({ title, links }: { title: string; links: string[][] }) {
  return (
    <div>
      <p className="footer-title">{title}</p>
      <nav className="mt-4 grid gap-2">
        {links.map(([label, href]) => (
          <Link className="footer-link" href={href} key={href}>
            {label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
