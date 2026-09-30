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

  // Handle Escape key globally for drawer
  useEffect(() => {
    if (!menuOpen) return;
    const handleKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        menuTrigger.current?.focus();
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [menuOpen]);

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
        {/* ── Desktop inner ── */}
        <div className="mh-site-header-inner">

          {/* LEFT — Brand lockup */}
          <div className="mh-header-leading">
            <button
              ref={menuTrigger}
              type="button"
              className="mh-header-icon mh-menu-trigger"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
            </button>

            <Link href="/" className="mh-brand-lockup" aria-label={`${brandName} home`}>
              <span className="mh-brand-mark">
                <Image src="/logo.png" alt="" width={1448} height={1086} priority />
              </span>
              <span className="mh-brand-name">
                <strong>{brandName}</strong>
                <small>Premium Menswear</small>
              </span>
            </Link>
          </div>

          {/* CENTER — Navigation */}
          <nav className="mh-desktop-nav" aria-label="Main navigation">
            {navigation.slice(0, 2).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(isActive(item.href) && "is-active")}
              >
                {item.label}
              </Link>
            ))}

            {/* Categories dropdown */}
            <div ref={categoryMenu} className="mh-category-menu">
              <button
                type="button"
                className={cn(categoryOpen && "is-active")}
                aria-expanded={categoryOpen}
                aria-controls="desktop-category-menu"
                aria-haspopup="true"
                onClick={() => { setCategoryOpen((open) => !open); setAccessoryOpen(false); }}
              >
                Categories
                <ChevronDown size={13} strokeWidth={1.8} className={cn("mh-chevron", categoryOpen && "is-open")} />
              </button>

              <div
                id="desktop-category-menu"
                className={cn("mh-category-popover", categoryOpen && "is-open")}
                aria-hidden={!categoryOpen}
                role="region"
                aria-label="Product categories"
              >
                <div className="mh-category-popover-heading">
                  <span>Browse the collection</span>
                  <Link href="/shop" onClick={() => setCategoryOpen(false)}>
                    View all <ArrowRight size={12} strokeWidth={1.8} />
                  </Link>
                </div>
                <div className="mh-category-popover-grid">
                  {categoryNavigation.map((category) =>
                    category.children.length ? (
                      <div key={category.id} className={cn("mh-category-popover-group", accessoryOpen && "is-open")}>
                        <button
                          type="button"
                          aria-expanded={accessoryOpen}
                          aria-controls="desktop-accessories-submenu"
                          onClick={() => setAccessoryOpen((open) => !open)}
                        >
                          {category.name}
                          <ChevronRight size={12} strokeWidth={1.8} />
                        </button>
                        <div id="desktop-accessories-submenu" className="mh-category-submenu">
                          <Link href={`/shop/${category.slug}`} onClick={() => setCategoryOpen(false)}>
                            All Accessories <ArrowRight size={12} strokeWidth={1.8} />
                          </Link>
                          {category.children.map((child) => (
                            <Link key={child.id} href={`/shop/${child.slug}`} onClick={() => setCategoryOpen(false)}>
                              {child.name} <ArrowRight size={12} strokeWidth={1.8} />
                            </Link>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <Link key={category.id} href={`/shop/${category.slug}`} onClick={() => setCategoryOpen(false)}>
                        {category.name} <ArrowRight size={12} strokeWidth={1.8} />
                      </Link>
                    )
                  )}
                </div>
                <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="mh-category-concierge">
                  <MessageCircle size={13} strokeWidth={1.8} /> Need a size check? Chat with us
                </a>
              </div>
            </div>

            {navigation.slice(2).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  isActive(item.href) && "is-active",
                  item.href === "/sale" && "is-sale"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* RIGHT — Action icons */}
          <div className="mh-header-actions">
            <button
              ref={searchTrigger}
              type="button"
              className="mh-header-icon"
              aria-label="Search store"
              aria-haspopup="dialog"
              title="Search"
              onClick={() => { setCategoryOpen(false); setSearchOpen(true); }}
            >
              <Search size={19} strokeWidth={1.6} />
            </button>

            <Link
              href="/wishlist"
              className="mh-header-icon mh-wishlist-link"
              aria-label={`Wishlist, ${wishlistCount} saved pieces`}
              title="Wishlist"
            >
              <Heart size={19} strokeWidth={1.6} />
              {wishlistCount ? <span aria-hidden="true">{wishlistCount}</span> : null}
            </Link>

            <Link
              href="/cart"
              className="mh-header-icon"
              aria-label={`Shopping bag, ${cartCount} items`}
              title="Shopping bag"
            >
              <ShoppingBag size={19} strokeWidth={1.6} />
              {cartCount ? <span aria-hidden="true">{cartCount}</span> : null}
            </Link>
          </div>
        </div>

        {/* ── Mobile Drawer ── */}
        <div
          id="mobile-navigation"
          className={cn("mh-mobile-drawer", menuOpen && "is-open")}
          aria-hidden={!menuOpen}
          inert={!menuOpen}
          role="dialog"
          aria-label="Mobile navigation"
          aria-modal="true"
        >
          {/* Primary nav links */}
          <nav aria-label="Mobile primary navigation">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  isActive(item.href) && "is-active",
                  item.href === "/sale" && "is-sale"
                )}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
                <ArrowRight size={16} strokeWidth={1.5} />
              </Link>
            ))}
          </nav>

          {/* Category section */}
          <div className="mh-mobile-categories">
            <p>Categories</p>
            {categoryNavigation.map((category) =>
              category.children.length ? (
                <div key={category.id} className="mh-mobile-category-group">
                  <button
                    type="button"
                    className="mh-mobile-category-toggle"
                    aria-expanded={mobileAccessoriesOpen}
                    aria-controls="mobile-accessories-submenu"
                    onClick={() => setMobileAccessoriesOpen((open) => !open)}
                  >
                    {category.name}
                    <span aria-hidden="true">{mobileAccessoriesOpen ? "−" : "+"}</span>
                  </button>
                  {mobileAccessoriesOpen ? (
                    <div id="mobile-accessories-submenu" className="mh-mobile-category-children">
                      <Link href={`/shop/${category.slug}`} onClick={() => setMenuOpen(false)}>All Accessories</Link>
                      {category.children.map((child) => (
                        <Link key={child.id} href={`/shop/${child.slug}`} onClick={() => setMenuOpen(false)}>
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </div>
              ) : (
                <Link key={category.id} href={`/shop/${category.slug}`} onClick={() => setMenuOpen(false)}>
                  {category.name}
                </Link>
              )
            )}
          </div>

          {/* WhatsApp CTA */}
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mh-mobile-whatsapp"
          >
            <MessageCircle size={16} strokeWidth={1.6} /> Chat on WhatsApp
          </a>
        </div>
      </header>

      {/* ── Search dialog ── */}
      {searchOpen ? (
        <div
          ref={dialog}
          className="mh-search-dialog"
          role="dialog"
          aria-modal="true"
          aria-labelledby="search-dialog-title"
          onKeyDown={handleDialogKeys}
          onMouseDown={(event) => { if (event.target === event.currentTarget) closeSearch(); }}
        >
          <div className="mh-search-panel">
            <div className="mh-search-heading">
              <div>
                <p className="mh-eyebrow">Search the collection</p>
                <h2 id="search-dialog-title">Find your next piece.</h2>
              </div>
              <button type="button" className="mh-header-icon" aria-label="Close search" onClick={closeSearch}>
                <X size={19} strokeWidth={1.5} />
              </button>
            </div>
            <SearchCombobox onNavigate={closeSearch} />
          </div>
        </div>
      ) : null}
    </>
  );
}
