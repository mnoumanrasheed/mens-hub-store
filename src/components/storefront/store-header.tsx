"use client";

import { ChevronDown, Heart, Menu, MessageCircle, Search, ShoppingBag, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { SearchCombobox } from "@/components/storefront/search-combobox";
import type { StorefrontCategory } from "@/data/storefront";
import { cn } from "@/lib/cn";

type HeaderProps = {
  brandName: string;
  categories: Pick<StorefrontCategory, "id" | "name" | "slug">[];
  whatsapp: string;
};

const navigation = [
  { href: "/shop", label: "Collections" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function StoreHeader({ brandName, categories, whatsapp }: HeaderProps) {
  const pathname = usePathname();
  const [menuPath, setMenuPath] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuTrigger = useRef<HTMLButtonElement>(null);
  const searchTrigger = useRef<HTMLButtonElement>(null);
  const dialog = useRef<HTMLDivElement>(null);
  const menuOpen = menuPath === pathname;
  const overHero = pathname === "/" && !scrolled && !menuOpen;
  const whatsappHref = `https://wa.me/${whatsapp.replace(/\D/g, "")}`;

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 24);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  useEffect(() => {
    if (!menuOpen && !searchOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [menuOpen, searchOpen]);

  function closeMenu(restoreFocus = false) {
    setMenuPath(null);
    if (restoreFocus) requestAnimationFrame(() => menuTrigger.current?.focus());
  }

  function closeSearch() {
    setSearchOpen(false);
    requestAnimationFrame(() => searchTrigger.current?.focus());
  }

  function handleDialogKeys(event: React.KeyboardEvent) {
    if (event.key === "Escape") {
      event.preventDefault();
      closeSearch();
      return;
    }
    if (event.key !== "Tab") return;
    const focusable = dialog.current?.querySelectorAll<HTMLElement>(
      'button:not([disabled]), input:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
    );
    if (!focusable?.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function isActive(href: string) {
    return pathname === href || (href === "/shop" && (pathname === "/new-arrivals" || pathname === "/sale"));
  }

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 h-[4.25rem] border-b transition-[background-color,border-color,box-shadow,backdrop-filter] duration-500 ease-out",
          overHero
            ? "border-transparent bg-transparent shadow-none"
            : "border-white/10 bg-[#090909]/94 shadow-[0_12px_40px_rgb(0_0_0/0.28)] backdrop-blur-xl",
        )}
      >
        <div className="mx-auto grid h-full max-w-[90rem] grid-cols-[1fr_auto_1fr] items-center px-3 sm:px-[var(--mh-container-gutter)] lg:flex lg:gap-7">
          <button
            ref={menuTrigger}
            type="button"
            className="store-icon-button lg:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => (menuOpen ? closeMenu() : setMenuPath(pathname))}
          >
            <span className="relative block size-5">
              <Menu className={cn("absolute inset-0 transition duration-300", menuOpen && "rotate-90 opacity-0")} size={20} />
              <X className={cn("absolute inset-0 -rotate-90 opacity-0 transition duration-300", menuOpen && "rotate-0 opacity-100")} size={20} />
            </span>
          </button>

          <Link
            href="/"
            className="group/logo flex min-w-0 items-center justify-self-center gap-2.5 whitespace-nowrap text-ivory transition-colors hover:text-gold sm:gap-3 lg:mr-auto lg:justify-self-auto"
            aria-label={`${brandName} home`}
            onClick={() => closeMenu()}
          >
            <span className="relative flex h-10 w-24 shrink-0 items-center justify-center shadow-[0_12px_35px_rgb(0_0_0/0.28)] transition duration-300 group-hover/logo:border-gold sm:h-11 sm:w-28">
              <Image
                src="/logo.png"
                alt=""
                width={1448}
                height={1086}
                className="h-full w-full object-contain"
                priority
              />
            </span>
            <span className="hidden font-display text-xl font-bold uppercase tracking-[0.16em] sm:inline sm:text-2xl">
              {brandName}
            </span>
          </Link>

          <nav aria-label="Main navigation" className="hidden items-stretch self-stretch lg:flex">
            <Link className={cn("store-nav-link", isActive("/shop") && "store-nav-link-active")} href="/shop" aria-current={isActive("/shop") ? "page" : undefined}>
              Collections
            </Link>
            <div className="group relative flex">
              <button className={cn("store-nav-link", pathname.startsWith("/shop/") && "store-nav-link-active")} type="button" aria-haspopup="true">
                Categories
                <ChevronDown className="transition-transform duration-300 group-hover:rotate-180 group-focus-within:rotate-180" size={13} />
              </button>
              <div className="invisible absolute left-1/2 top-[calc(100%_-_0.25rem)] w-64 -translate-x-1/2 translate-y-3 border border-white/10 bg-[#0d0d0e]/98 p-2 opacity-0 shadow-[0_24px_70px_rgb(0_0_0/0.5)] backdrop-blur-xl transition-all duration-300 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                <p className="px-3 pb-2 pt-3 text-[0.58rem] font-bold uppercase tracking-[0.22em] text-gold">Shop by category</p>
                <div className="max-h-[min(28rem,70vh)] overflow-y-auto pb-1">
                  {categories.map((category) => (
                    <Link key={category.id} className="group/item flex min-h-11 items-center justify-between border-t border-white/[0.06] px-3 text-sm text-muted transition-colors hover:bg-white/[0.035] hover:text-ivory" href={`/shop/${category.slug}`}>
                      {category.name}
                      <span className="text-gold opacity-0 transition-opacity group-hover/item:opacity-100" aria-hidden="true">→</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            {navigation.slice(1).map((item) => (
              <Link key={item.href} className={cn("store-nav-link", isActive(item.href) && "store-nav-link-active")} href={item.href} aria-current={isActive(item.href) ? "page" : undefined}>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center justify-self-end lg:gap-1">
            <button ref={searchTrigger} className="store-icon-button" type="button" aria-label="Search" aria-haspopup="dialog" onClick={() => setSearchOpen(true)}>
              <Search size={18} strokeWidth={1.7} />
            </button>
            <Link className="store-icon-button" href="/cart" aria-label="Cart">
              <ShoppingBag size={18} strokeWidth={1.7} />
            </Link>
            <a className="ml-2 hidden min-h-10 items-center gap-2 border border-gold/70 px-4 text-[0.62rem] font-extrabold uppercase tracking-[0.14em] text-gold transition duration-300 hover:bg-gold hover:text-gold-ink lg:inline-flex" href={whatsappHref} target="_blank" rel="noopener noreferrer">
              <MessageCircle size={15} strokeWidth={1.8} />
              Order on WhatsApp
            </a>
          </div>
        </div>

        <div className={cn("absolute inset-x-0 top-full h-[calc(100svh-4.25rem)] bg-black/60 transition-[opacity,visibility] duration-300 lg:hidden", menuOpen ? "visible opacity-100" : "invisible opacity-0")} aria-hidden={!menuOpen} inert={!menuOpen} onMouseDown={(event) => { if (event.target === event.currentTarget) closeMenu(true); }}>
          <nav
            id="mobile-navigation"
            aria-label="Mobile navigation"
            className={cn("max-h-full overflow-y-auto border-t border-white/10 bg-[#0a0a0b]/98 px-5 pb-8 pt-5 shadow-[0_30px_70px_rgb(0_0_0/0.55)] backdrop-blur-xl transition-transform duration-500 ease-[var(--mh-ease-out)] sm:px-[var(--mh-container-gutter)]", menuOpen ? "translate-y-0" : "-translate-y-4")}
            onKeyDown={(event) => { if (event.key === "Escape") closeMenu(true); }}
          >
            <div className="grid">
              {navigation.map((item, index) => (
                <Link key={item.href} className="group flex min-h-14 items-center justify-between border-b border-white/[0.08] font-display text-2xl font-semibold text-ivory transition-colors hover:text-gold" href={item.href} onClick={() => closeMenu()}>
                  <span><span className="mr-4 font-sans text-[0.58rem] font-bold tracking-[0.16em] text-subtle">0{index + 1}</span>{item.label}</span>
                  <span className="text-sm text-gold" aria-hidden="true">↗</span>
                </Link>
              ))}
            </div>
            <div className="mt-7">
              <p className="text-[0.6rem] font-bold uppercase tracking-[0.22em] text-gold">Categories</p>
              <div className="mt-3 grid grid-cols-2 gap-x-6">
                {categories.map((category) => (
                  <Link key={category.id} className="flex min-h-11 items-center border-b border-white/[0.06] text-sm text-muted transition-colors hover:text-ivory" href={`/shop/${category.slug}`} onClick={() => closeMenu()}>
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>
            <div className="mt-7 grid gap-3 min-[390px]:grid-cols-2">
              <a className="store-cta-primary" href={whatsappHref} target="_blank" rel="noopener noreferrer"><MessageCircle size={16} /> Order on WhatsApp</a>
              <Link className="store-cta-secondary" href="/wishlist" onClick={() => closeMenu()}><Heart size={16} /> Saved pieces</Link>
            </div>
          </nav>
        </div>
      </header>

      {searchOpen ? (
        <div ref={dialog} className="fixed inset-0 z-50 bg-black/80 p-4 backdrop-blur-md" role="dialog" aria-modal="true" aria-labelledby="search-dialog-title" onKeyDown={handleDialogKeys} onMouseDown={(event) => { if (event.target === event.currentTarget) closeSearch(); }}>
          <div className="mx-auto mt-[12svh] max-w-2xl border border-white/10 bg-[#0f0f10] p-5 shadow-[0_30px_90px_rgb(0_0_0/0.65)] sm:p-8">
            <div className="mb-5 flex items-center justify-between">
              <div><p className="store-eyebrow">Discover</p><h2 id="search-dialog-title" className="font-display text-3xl text-ivory">Search the collection</h2></div>
              <button className="store-icon-button" type="button" aria-label="Close search" onClick={closeSearch}><X size={20} /></button>
            </div>
            <SearchCombobox onNavigate={closeSearch} />
          </div>
        </div>
      ) : null}
    </>
  );
}
