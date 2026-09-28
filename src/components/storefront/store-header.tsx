"use client";

import { ArrowRight, ChevronDown, ChevronRight, Heart, Menu, MessageCircle, Search, ShoppingBag, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";

import { useCart, useWishlist } from "@/components/storefront/commerce-store";
import { SearchCombobox } from "@/components/storefront/search-combobox";
import type { StorefrontCategory } from "@/data/storefront";
import { cn } from "@/lib/cn";
import { getStorefrontNavigation } from "@/lib/category-navigation";

type HeaderProps = {
  brandName: string;
  categories: Pick<StorefrontCategory, "id" | "name" | "slug">[];
  whatsapp: string;
};

const navigation = [
  { href: "/new-arrivals", label: "New In" },
  { href: "/shop", label: "Shop" },
  { href: "/sale", label: "Sale" },
  { href: "/contact", label: "Contact" },
] as const;

export function StoreHeader({ brandName, categories, whatsapp }: HeaderProps) {
  const categoryNavigation = getStorefrontNavigation(categories);
  const pathname = usePathname();
  const cartCount = useCart().reduce((total, item) => total + item.quantity, 0);
  const wishlistCount = useWishlist().length;
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [accessoryOpen, setAccessoryOpen] = useState(false);
  const [mobileAccessoriesOpen, setMobileAccessoriesOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const menuTrigger = useRef<HTMLButtonElement>(null);
  const searchTrigger = useRef<HTMLButtonElement>(null);
  const dialog = useRef<HTMLDivElement>(null);
  const categoryMenu = useRef<HTMLDivElement>(null);
  const cleanWhatsapp = whatsapp?.replace(/\D/g, "") || "";
  const whatsappHref = `https://wa.me/${cleanWhatsapp}`;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 18);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen && !searchOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, [menuOpen, searchOpen]);

  useEffect(() => {
    if (!categoryOpen) return;
    const dismiss = (event: PointerEvent) => {
      if (!categoryMenu.current?.contains(event.target as Node)) setCategoryOpen(false);
    };
    document.addEventListener("pointerdown", dismiss);
    return () => document.removeEventListener("pointerdown", dismiss);
  }, [categoryOpen]);

  function closeSearch() {
    setSearchOpen(false);
    requestAnimationFrame(() => searchTrigger.current?.focus());
  }

  function handleDialogKeys(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      closeSearch();
      return;
    }
    if (event.key !== "Tab") return;
    const focusable = dialog.current?.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])');
    if (!focusable?.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }

  function isActive(href: string) {
    return pathname === href || (href === "/shop" && pathname.startsWith("/shop/"));
  }

  return (
    <>
      <header className={cn("mh-site-header", isScrolled && "is-scrolled")}>
        <div className="mh-site-header-inner">
          <div className="mh-header-leading">
            <button ref={menuTrigger} type="button" className="mh-header-icon mh-menu-trigger" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} aria-controls="mobile-navigation" onClick={() => setMenuOpen((open) => !open)}>
              {menuOpen ? <X size={19} /> : <Menu size={19} />}
            </button>
            <Link href="/" className="mh-brand-lockup" aria-label={`${brandName} home`}>
              <span className="mh-brand-mark"><Image src="/logo.png" alt="" width={1448} height={1086} priority /></span>
              <span className="mh-brand-name"><strong>{brandName}</strong><small>Premium menswear</small></span>
            </Link>
          </div>

          <nav className="mh-desktop-nav" aria-label="Main navigation">
            {navigation.slice(0, 2).map((item) => <Link key={item.href} href={item.href} className={cn(isActive(item.href) && "is-active")}>{item.label}</Link>)}
            <div ref={categoryMenu} className="mh-category-menu">
              <button type="button" className={cn(categoryOpen && "is-active")} aria-expanded={categoryOpen} aria-controls="desktop-category-menu" onClick={() => { setCategoryOpen((open) => !open); setAccessoryOpen(false); }}>
                Categories <ChevronDown size={14} className={cn(categoryOpen && "rotate-180")} />
              </button>
              <div id="desktop-category-menu" className={cn("mh-category-popover", categoryOpen && "is-open")} aria-hidden={!categoryOpen}>
                <div className="mh-category-popover-heading"><span>Browse the collection</span><Link href="/shop" onClick={() => setCategoryOpen(false)}>View all <ArrowRight size={13} /></Link></div>
                <div className="mh-category-popover-grid">
                  {categoryNavigation.map((category) => category.children.length ? (
                    <div key={category.id} className={cn("mh-category-popover-group", accessoryOpen && "is-open")}>
                      <button type="button" aria-expanded={accessoryOpen} aria-controls="desktop-accessories-submenu" onClick={() => setAccessoryOpen((open) => !open)}>
                        {category.name}<ChevronRight size={13} />
                      </button>
                      <div id="desktop-accessories-submenu" className="mh-category-submenu">
                        <Link href={`/shop/${category.slug}`} onClick={() => setCategoryOpen(false)}>All Accessories<ArrowRight size={13} /></Link>
                        {category.children.map((child) => <Link key={child.id} href={`/shop/${child.slug}`} onClick={() => setCategoryOpen(false)}>{child.name}<ArrowRight size={13} /></Link>)}
                      </div>
                    </div>
                  ) : <Link key={category.id} href={`/shop/${category.slug}`} onClick={() => setCategoryOpen(false)}>{category.name}<ArrowRight size={13} /></Link>)}
                </div>
                <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="mh-category-concierge"><MessageCircle size={14} /> Need a size check? Chat with us</a>
              </div>
            </div>
            {navigation.slice(2).map((item) => <Link key={item.href} href={item.href} className={cn(isActive(item.href) && "is-active", item.href === "/sale" && "is-sale")}>{item.label}</Link>)}
          </nav>

          <div className="mh-header-actions">
            <button ref={searchTrigger} type="button" className="mh-header-icon" aria-label="Search store" aria-haspopup="dialog" onClick={() => { setCategoryOpen(false); setSearchOpen(true); }}><Search size={18} /></button>
            <Link href="/wishlist" className="mh-header-icon mh-wishlist-link" aria-label={`Wishlist, ${wishlistCount} saved pieces`}><Heart size={18} />{wishlistCount ? <span>{wishlistCount}</span> : null}</Link>
            <Link href="/cart" className="mh-header-icon" aria-label={`Shopping bag, ${cartCount} items`}><ShoppingBag size={18} />{cartCount ? <span>{cartCount}</span> : null}</Link>
          </div>
        </div>

        <div id="mobile-navigation" className={cn("mh-mobile-drawer", menuOpen && "is-open")} aria-hidden={!menuOpen} inert={!menuOpen}>
          <nav aria-label="Mobile navigation">
            {navigation.map((item) => <Link key={item.href} href={item.href} className={cn(isActive(item.href) && "is-active", item.href === "/sale" && "is-sale")} onClick={() => setMenuOpen(false)}>{item.label}<ArrowRight size={17} /></Link>)}
          </nav>
          <div className="mh-mobile-categories">
            <p>Categories</p>
            {categoryNavigation.map((category) => category.children.length ? (
              <div key={category.id} className="mh-mobile-category-group">
                <button type="button" className="mh-mobile-category-toggle" aria-expanded={mobileAccessoriesOpen} aria-controls="mobile-accessories-submenu" onClick={() => setMobileAccessoriesOpen((open) => !open)}>
                  {category.name}<span aria-hidden="true">{mobileAccessoriesOpen ? "−" : "+"}</span>
                </button>
                {mobileAccessoriesOpen ? <div id="mobile-accessories-submenu" className="mh-mobile-category-children">
                  <Link href={`/shop/${category.slug}`} onClick={() => setMenuOpen(false)}>All Accessories</Link>
                  {category.children.map((child) => <Link key={child.id} href={`/shop/${child.slug}`} onClick={() => setMenuOpen(false)}>{child.name}</Link>)}
                </div> : null}
              </div>
            ) : <Link key={category.id} href={`/shop/${category.slug}`} onClick={() => setMenuOpen(false)}>{category.name}</Link>)}
          </div>
          <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="mh-mobile-whatsapp"><MessageCircle size={16} /> Chat on WhatsApp</a>
        </div>
      </header>

      {searchOpen ? <div ref={dialog} className="mh-search-dialog" role="dialog" aria-modal="true" aria-labelledby="search-dialog-title" onKeyDown={handleDialogKeys} onMouseDown={(event) => { if (event.target === event.currentTarget) closeSearch(); }}>
        <div className="mh-search-panel">
          <div className="mh-search-heading"><div><p className="mh-eyebrow">Search the collection</p><h2 id="search-dialog-title">Find your next piece.</h2></div><button type="button" className="mh-header-icon" aria-label="Close search" onClick={closeSearch}><X size={19} /></button></div>
          <SearchCombobox onNavigate={closeSearch} />
        </div>
      </div> : null}
    </>
  );
}
