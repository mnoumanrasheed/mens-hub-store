"use client";

import { ChevronDown, Heart, Menu, MessageCircle, Search, ShoppingBag, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { useCart, useWishlist } from "@/components/storefront/commerce-store";
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
  { href: "/new-arrivals", label: "New Arrivals" },
  { href: "/sale", label: "Sale" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function StoreHeader({ brandName, categories, whatsapp }: HeaderProps) {
  const pathname = usePathname();
  const cart = useCart();
  const wishlist = useWishlist();
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const [menuPath, setMenuPath] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [categoryPath, setCategoryPath] = useState<string | null>(null);
  const categoriesOpen = categoryPath === pathname;
  const categoryMenu = useRef<HTMLDivElement>(null);
  const categoryTrigger = useRef<HTMLButtonElement>(null);
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

  useEffect(() => {
    if (!categoriesOpen) return;
    const dismiss = (event: PointerEvent) => { if (!categoryMenu.current?.contains(event.target as Node)) setCategoryPath(null); };
    document.addEventListener("pointerdown", dismiss);
    return () => document.removeEventListener("pointerdown", dismiss);
  }, [categoriesOpen]);

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
    return pathname === href || (href === "/shop" && pathname.startsWith("/shop/"));
  }

  return (
    <>
      <header
        onKeyDown={(event) => {
          if (!menuOpen) return;
          if (event.key === "Escape") { event.preventDefault(); closeMenu(true); return; }
          if (event.key !== "Tab") return;
          const links = event.currentTarget.querySelectorAll<HTMLElement>("#mobile-navigation a[href]");
          const last = links[links.length - 1];
          if (event.shiftKey && document.activeElement === menuTrigger.current) { event.preventDefault(); last?.focus(); }
          else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); menuTrigger.current?.focus(); }
        }}
        className={cn(
          "atelier-header signature-navbar sticky top-0 z-40 h-[4.25rem] border-b transition-[background-color,border-color,box-shadow,backdrop-filter] duration-500 ease-out",
          overHero && !categoriesOpen
            ? "border-transparent bg-transparent shadow-none"
            : "border-white/10 bg-[#090909]/94 shadow-[0_12px_40px_rgb(0_0_0/0.28)] backdrop-blur-xl",
        )}
      >
        <div className="atelier-header-inner signature-navbar-inner mx-auto grid h-full max-w-[90rem] grid-cols-[1fr_auto_1fr] items-center px-3 sm:px-[var(--mh-container-gutter)] lg:flex lg:gap-7">
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
            className="signature-nav-brand group/logo flex min-w-0 items-center justify-self-center gap-2.5 whitespace-nowrap text-ivory transition-colors hover:text-gold sm:gap-3 lg:mr-auto lg:justify-self-auto"
            aria-label={`${brandName} home`}
            onClick={() => closeMenu()}
          >
            <span className="atelier-brand-mark relative flex h-10 w-24 shrink-0 items-center justify-center shadow-[0_12px_35px_rgb(0_0_0/0.28)] transition duration-300 group-hover/logo:border-gold sm:h-11 sm:w-28">
              <Image
                src="/logo.png"
                alt=""
                width={1448}
                height={1086}
                className="h-full w-full object-contain"
                preload
              />
            </span>
            <span className="atelier-brand-word">
              {brandName}<small>STYLE MADE FOR MEN</small>
            </span>
          </Link>

          <nav aria-label="Main navigation" className="signature-nav-links hidden items-stretch self-stretch lg:flex">
            <Link className={cn("store-nav-link", isActive("/shop") && "store-nav-link-active")} href="/shop" aria-current={isActive("/shop") ? "page" : undefined}>
              Collections
            </Link>
            <div ref={categoryMenu} className="signature-category-menu relative flex" onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setCategoryPath(null); }} onKeyDown={(event) => { if (event.key === "Escape") { setCategoryPath(null); categoryTrigger.current?.focus(); } }}>
              <button ref={categoryTrigger} className={cn("store-nav-link", categoriesOpen && "store-nav-link-active")} type="button" aria-expanded={categoriesOpen} aria-controls="desktop-category-menu" onClick={() => setCategoryPath(categoriesOpen ? null : pathname)}>
                Categories
                <ChevronDown className={cn("transition-transform duration-300", categoriesOpen && "rotate-180")} size={12} />
              </button>
              <div id="desktop-category-menu" className={cn("signature-category-panel", categoriesOpen && "signature-category-panel-open")} inert={!categoriesOpen} aria-hidden={!categoriesOpen}>
                <div className="signature-category-intro"><p className="store-eyebrow">The complete wardrobe</p><h2>Find your<br /><em>signature.</em></h2><Link href="/shop" onClick={() => setCategoryPath(null)}>Explore all collections <span aria-hidden="true">↗</span></Link></div>
                <nav aria-label="Shop by category" className="signature-category-list">{categories.map((category, index) => <Link key={category.id} href={"/shop/" + category.slug} onClick={() => setCategoryPath(null)}><span className="signature-category-number">{String(index + 1).padStart(2, "0")}</span>{category.name}<span className="signature-category-arrow" aria-hidden="true">↗</span></Link>)}</nav>
              </div>
            </div>
            {navigation.slice(1).map((item) => (
              <Link key={item.href} className={cn("store-nav-link", isActive(item.href) && "store-nav-link-active")} href={item.href} aria-current={isActive(item.href) ? "page" : undefined}>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="signature-nav-tools flex items-center justify-self-end lg:gap-1">
            <a className="signature-nav-service" href={whatsappHref} target="_blank" rel="noopener noreferrer"><span>Private service<small>Shop via WhatsApp</small></span><span className="signature-nav-service-icon"><MessageCircle size={17} strokeWidth={1.4} /></span></a>
            <button ref={searchTrigger} className="store-icon-button" type="button" aria-label="Search" aria-haspopup="dialog" onClick={() => { closeMenu(); setCategoryPath(null); setSearchOpen(true); }}>
              <Search size={18} strokeWidth={1.7} />
            </button>
            <Link className="store-icon-button relative hidden sm:inline-grid" href="/wishlist" aria-label={`Wishlist, ${wishlist.length} saved pieces`}><Heart size={18} strokeWidth={1.7} />{wishlist.length > 0 ? <span className="header-count">{wishlist.length}</span> : null}</Link>
            <Link className="store-icon-button relative" href="/cart" aria-label={`Cart, ${cartCount} items`}>
              <ShoppingBag size={18} strokeWidth={1.7} />{cartCount > 0 ? <span className="header-count">{cartCount}</span> : null}
            </Link>
          </div>
        </div>

        <div className={cn("atelier-mobile-menu signature-mobile-backdrop absolute inset-x-0 top-full h-[calc(100svh-4.25rem)] bg-black/60 transition-[opacity,visibility] duration-300 lg:hidden", menuOpen ? "visible opacity-100" : "invisible opacity-0")} aria-hidden={!menuOpen} inert={!menuOpen} onMouseDown={(event) => { if (event.target === event.currentTarget) closeMenu(true); }}>
          <nav
            id="mobile-navigation"
            aria-label="Mobile navigation"
            className={cn("signature-mobile-panel max-h-full overflow-y-auto border-t border-white/10 bg-[#0a0a0b]/98 px-5 pb-8 pt-5 shadow-[0_30px_70px_rgb(0_0_0/0.55)] backdrop-blur-xl transition-transform duration-500 ease-[var(--mh-ease-out)] sm:px-[var(--mh-container-gutter)]", menuOpen ? "translate-y-0" : "-translate-y-4")}
            onKeyDown={(event) => { if (event.key === "Escape") closeMenu(true); }}
          >
            <p className="signature-mobile-eyebrow">Your world. Your wardrobe.</p>
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
          <div className="signature-search-panel mx-auto mt-[12svh] max-w-2xl border border-white/10 bg-[#0f0f10] p-5 shadow-[0_30px_90px_rgb(0_0_0/0.65)] sm:p-8">
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
