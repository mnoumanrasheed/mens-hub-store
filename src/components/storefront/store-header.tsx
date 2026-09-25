"use client";

import {
  ArrowRight,
  ChevronDown,
  Flame,
  Heart,
  Menu,
  MessageCircle,
  Search,
  ShoppingBag,
  Sparkles,
  X,
} from "lucide-react";
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
  { href: "/new-arrivals", label: "New In", isSpecial: false },
  { href: "/shop", label: "Shop", isSpecial: false },
  { href: "/sale", label: "Sale", isSpecial: true },
  { href: "/contact", label: "Contact", isSpecial: false },
];

export function StoreHeader({ brandName, categories, whatsapp }: HeaderProps) {
  const pathname = usePathname();
  const cart = useCart();
  const wishlist = useWishlist();
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);

  const categoryMenu = useRef<HTMLDivElement>(null);
  const categoryTrigger = useRef<HTMLButtonElement>(null);
  const menuTrigger = useRef<HTMLButtonElement>(null);
  const searchTrigger = useRef<HTMLButtonElement>(null);
  const dialog = useRef<HTMLDivElement>(null);

  // Scroll listener for dynamic luxury blur and height
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMenuOpen(false);
    setCategoryDropdownOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu or search dialog is open
  useEffect(() => {
    if (!menuOpen && !searchOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [menuOpen, searchOpen]);

  // Close categories on outside click
  useEffect(() => {
    if (!categoryDropdownOpen) return;
    const dismiss = (event: PointerEvent) => {
      if (!categoryMenu.current?.contains(event.target as Node)) {
        setCategoryDropdownOpen(false);
      }
    };
    document.addEventListener("pointerdown", dismiss);
    return () => document.removeEventListener("pointerdown", dismiss);
  }, [categoryDropdownOpen]);

  function closeMenu(restoreFocus = false) {
    setMenuOpen(false);
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

  const cleanWhatsapp = whatsapp?.replace(/\D/g, "") || "";
  const whatsappHref = `https://wa.me/${cleanWhatsapp}`;

  return (
    <>
      {/* Top Gold Shimmer Border Accent */}
      <div className="fixed top-0 inset-x-0 z-50 h-[2px] bg-gradient-to-r from-transparent via-gold/60 to-transparent pointer-events-none" />

      <header
        onKeyDown={(event) => {
          if (!menuOpen) return;
          if (event.key === "Escape") {
            event.preventDefault();
            closeMenu(true);
            return;
          }
          if (event.key !== "Tab") return;
          const links = event.currentTarget.querySelectorAll<HTMLElement>("#mobile-navigation a[href]");
          const last = links[links.length - 1];
          if (event.shiftKey && document.activeElement === menuTrigger.current) {
            event.preventDefault();
            last?.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            menuTrigger.current?.focus();
          }
        }}
        className={cn(
          "sticky top-0 z-40 w-full transition-all duration-500 ease-in-out",
          isScrolled
            ? "h-16 bg-surface/90 backdrop-blur-xl border-b border-line/80 shadow-[0_8px_30px_rgb(0,0,0,0.06)]"
            : "h-20 bg-surface/95 backdrop-blur-md border-b border-line/40 shadow-xs"
        )}
      >
        <div className="mx-auto flex h-full max-w-[92rem] items-center justify-between px-4 sm:px-8">
          
          {/* LEFT: Mobile Menu Toggle + Brand Logo */}
          <div className="flex items-center gap-3 sm:gap-6">
            <button
              ref={menuTrigger}
              type="button"
              className={cn(
                "group relative inline-flex size-10 items-center justify-center rounded-full border border-line/70 bg-surface/60 text-ivory transition-all duration-300 hover:border-gold/60 hover:bg-gold/10 hover:text-gold active:scale-95 lg:hidden"
              )}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              onClick={() => setMenuOpen((prev) => !prev)}
            >
              <span className="relative block size-5">
                <Menu
                  className={cn(
                    "absolute inset-0 transition-all duration-300",
                    menuOpen ? "rotate-90 opacity-0 scale-75" : "rotate-0 opacity-100 scale-100"
                  )}
                  size={20}
                />
                <X
                  className={cn(
                    "absolute inset-0 transition-all duration-300",
                    menuOpen ? "rotate-0 opacity-100 scale-100 text-gold" : "-rotate-90 opacity-0 scale-75"
                  )}
                  size={20}
                />
              </span>
            </button>

            {/* Brand Logo & Wordmark with Hover Animation */}
            <Link
              href="/"
              className="group flex items-center gap-3.5 whitespace-nowrap py-1 focus-visible:outline-none"
              aria-label={`${brandName} home`}
              onClick={() => closeMenu()}
            >
              <div className="relative flex h-10 w-24 shrink-0 items-center justify-center transition-transform duration-500 ease-out group-hover:scale-105 sm:h-12 sm:w-28">
                <div className="absolute inset-0 rounded-full bg-gold/10 opacity-0 blur-md transition-opacity duration-500 group-hover:opacity-100" />
                <Image
                  src="/logo.png"
                  alt="Men's Hub"
                  width={1448}
                  height={1086}
                  className="relative h-full w-full object-contain filter drop-shadow-sm transition-all duration-300 group-hover:brightness-110"
                  priority
                />
              </div>
              <div className="hidden flex-col sm:flex">
                <span className="font-display text-xl font-bold tracking-[0.18em] text-ivory transition-colors duration-300 group-hover:text-gold">
                  {brandName}
                </span>
                <span className="text-[0.55rem] font-bold uppercase tracking-[0.26em] text-gold/90 transition-opacity duration-300">
                  Premium Menswear
                </span>
              </div>
            </Link>
          </div>

          {/* CENTER: Desktop Navigation with Animated Indicators & Mega Menu */}
          <nav
            aria-label="Main navigation"
            className="hidden items-center gap-1 lg:flex xl:gap-2"
          >
            {/* New In */}
            <Link
              href="/new-arrivals"
              className={cn(
                "group relative inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-extrabold uppercase tracking-[0.16em] transition-all duration-300 hover:bg-gold/5",
                isActive("/new-arrivals")
                  ? "text-gold font-black"
                  : "text-muted hover:text-ivory"
              )}
            >
              <Sparkles size={13} className={cn("transition-transform duration-300 group-hover:rotate-12", isActive("/new-arrivals") ? "text-gold" : "text-muted/60 group-hover:text-gold")} />
              <span>New In</span>
              <span
                className={cn(
                  "absolute inset-x-4 bottom-0.5 h-[2px] rounded-full bg-gradient-to-r from-gold/60 via-gold to-gold/60 transition-transform duration-300 ease-out",
                  isActive("/new-arrivals") ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                )}
              />
            </Link>

            {/* Shop */}
            <Link
              href="/shop"
              className={cn(
                "group relative inline-flex items-center rounded-full px-4 py-2 text-xs font-extrabold uppercase tracking-[0.16em] transition-all duration-300 hover:bg-gold/5",
                isActive("/shop")
                  ? "text-gold font-black"
                  : "text-muted hover:text-ivory"
              )}
            >
              <span>Shop</span>
              <span
                className={cn(
                  "absolute inset-x-4 bottom-0.5 h-[2px] rounded-full bg-gradient-to-r from-gold/60 via-gold to-gold/60 transition-transform duration-300 ease-out",
                  isActive("/shop") ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                )}
              />
            </Link>

            {/* Categories (Mega Dropdown) */}
            <div
              ref={categoryMenu}
              className="relative"
              onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                  setCategoryDropdownOpen(false);
                }
              }}
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  setCategoryDropdownOpen(false);
                  categoryTrigger.current?.focus();
                }
              }}
            >
              <button
                ref={categoryTrigger}
                type="button"
                aria-expanded={categoryDropdownOpen}
                aria-controls="desktop-category-menu"
                onClick={() => setCategoryDropdownOpen((prev) => !prev)}
                className={cn(
                  "group relative inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-extrabold uppercase tracking-[0.16em] transition-all duration-300 hover:bg-gold/5",
                  categoryDropdownOpen || pathname.startsWith("/shop/")
                    ? "text-gold font-black"
                    : "text-muted hover:text-ivory"
                )}
              >
                <span>Categories</span>
                <ChevronDown
                  className={cn(
                    "transition-transform duration-300 ease-out",
                    categoryDropdownOpen ? "rotate-180 text-gold" : "text-muted/60 group-hover:text-ivory"
                  )}
                  size={14}
                />
                <span
                  className={cn(
                    "absolute inset-x-4 bottom-0.5 h-[2px] rounded-full bg-gradient-to-r from-gold/60 via-gold to-gold/60 transition-transform duration-300 ease-out",
                    categoryDropdownOpen || pathname.startsWith("/shop/")
                      ? "scale-x-100"
                      : "scale-x-0 group-hover:scale-x-100"
                  )}
                />
              </button>

              {/* Animated Mega Dropdown Card */}
              <div
                id="desktop-category-menu"
                className={cn(
                  "absolute top-full left-1/2 mt-3 -translate-x-1/2 w-[32rem] rounded-2xl border border-line/80 bg-surface/98 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.2)] backdrop-blur-2xl transition-all duration-300 ease-out",
                  categoryDropdownOpen
                    ? "visible opacity-100 translate-y-0 scale-100 pointer-events-auto"
                    : "invisible opacity-0 -translate-y-3 scale-95 pointer-events-none"
                )}
                inert={!categoryDropdownOpen}
                aria-hidden={!categoryDropdownOpen}
              >
                <div className="mb-4 flex items-center justify-between border-b border-line pb-3">
                  <div className="flex items-center gap-2">
                    <span className="flex size-2 rounded-full bg-gold animate-pulse" />
                    <span className="text-[0.68rem] font-extrabold uppercase tracking-[0.2em] text-gold">
                      Curated Collections
                    </span>
                  </div>
                  <Link
                    href="/shop"
                    onClick={() => setCategoryDropdownOpen(false)}
                    className="group/all inline-flex items-center gap-1 text-[0.65rem] font-bold uppercase tracking-wider text-muted hover:text-gold transition-colors"
                  >
                    <span>View All</span>
                    <ArrowRight size={12} className="transition-transform duration-300 group-hover/all:translate-x-0.5" />
                  </Link>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/shop/${category.slug}`}
                      className="group/item flex items-center justify-between rounded-xl border border-transparent bg-canvas/60 px-4 py-3 text-xs font-semibold text-ivory transition-all duration-300 hover:border-gold/30 hover:bg-gold/10 hover:text-gold hover:shadow-xs"
                      onClick={() => setCategoryDropdownOpen(false)}
                    >
                      <span className="font-medium tracking-wide">{category.name}</span>
                      <ArrowRight
                        size={14}
                        className="opacity-0 -translate-x-2 text-gold transition-all duration-300 group-hover/item:opacity-100 group-hover/item:translate-x-0"
                      />
                    </Link>
                  ))}
                </div>

                <div className="mt-4 flex items-center justify-between rounded-xl bg-surface-raised/70 border border-line/60 px-4 py-3 text-xs">
                  <span className="text-muted text-[0.72rem]">Need personal styling guidance?</span>
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-bold text-gold hover:underline text-[0.72rem] tracking-wider uppercase"
                  >
                    <MessageCircle size={13} />
                    <span>WhatsApp VIP</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Sale Link (with Animated Flame Pulse) */}
            <Link
              href="/sale"
              className={cn(
                "group relative inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-extrabold uppercase tracking-[0.16em] transition-all duration-300 hover:bg-rose-500/5",
                isActive("/sale")
                  ? "text-rose-500 font-black"
                  : "text-rose-500/90 hover:text-rose-500"
              )}
            >
              <Flame size={13} className="text-rose-500 transition-transform duration-300 group-hover:scale-125" />
              <span>Sale</span>
              <span className="flex size-1.5 rounded-full bg-rose-500 animate-ping opacity-75" />
              <span
                className={cn(
                  "absolute inset-x-4 bottom-0.5 h-[2px] rounded-full bg-gradient-to-r from-rose-400 via-rose-500 to-rose-400 transition-transform duration-300 ease-out",
                  isActive("/sale") ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                )}
              />
            </Link>

            {/* Contact */}
            <Link
              href="/contact"
              className={cn(
                "group relative inline-flex items-center rounded-full px-4 py-2 text-xs font-extrabold uppercase tracking-[0.16em] transition-all duration-300 hover:bg-gold/5",
                isActive("/contact")
                  ? "text-gold font-black"
                  : "text-muted hover:text-ivory"
              )}
            >
              <span>Contact</span>
              <span
                className={cn(
                  "absolute inset-x-4 bottom-0.5 h-[2px] rounded-full bg-gradient-to-r from-gold/60 via-gold to-gold/60 transition-transform duration-300 ease-out",
                  isActive("/contact") ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                )}
              />
            </Link>
          </nav>

          {/* RIGHT: Action Icons (Search, Wishlist, Cart) with Luxury Animations */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Button */}
            <button
              ref={searchTrigger}
              className="group relative inline-flex size-10 items-center justify-center rounded-full border border-line/60 bg-surface/50 text-ivory transition-all duration-300 hover:border-gold/60 hover:bg-gold/10 hover:text-gold hover:shadow-sm active:scale-95"
              type="button"
              aria-label="Search"
              aria-haspopup="dialog"
              onClick={() => {
                closeMenu();
                setCategoryDropdownOpen(false);
                setSearchOpen(true);
              }}
            >
              <Search size={18} className="transition-transform duration-300 group-hover:scale-110" />
            </button>

            {/* Wishlist Button */}
            <Link
              className="group relative hidden size-10 items-center justify-center rounded-full border border-line/60 bg-surface/50 text-ivory transition-all duration-300 hover:border-gold/60 hover:bg-gold/10 hover:text-gold hover:shadow-sm active:scale-95 sm:inline-flex"
              href="/wishlist"
              aria-label={`Wishlist, ${wishlist.length} saved pieces`}
            >
              <Heart
                size={18}
                className={cn(
                  "transition-transform duration-300 group-hover:scale-110",
                  wishlist.length > 0 && "text-gold fill-gold/20"
                )}
              />
              {wishlist.length > 0 ? (
                <span className="absolute -top-1 -right-1 flex size-4.5 items-center justify-center rounded-full bg-gold text-[0.55rem] font-black text-gold-ink shadow-sm ring-2 ring-surface animate-in zoom-in duration-300">
                  {wishlist.length}
                </span>
              ) : null}
            </Link>

            {/* Cart Button */}
            <Link
              className="group relative inline-flex size-10 items-center justify-center rounded-full border border-line/60 bg-surface/50 text-ivory transition-all duration-300 hover:border-gold/60 hover:bg-gold/10 hover:text-gold hover:shadow-sm active:scale-95"
              href="/cart"
              aria-label={`Cart, ${cartCount} items`}
            >
              <ShoppingBag
                size={18}
                className="transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-110"
              />
              {cartCount > 0 ? (
                <span className="absolute -top-1 -right-1 flex size-4.5 items-center justify-center rounded-full bg-gold text-[0.55rem] font-black text-gold-ink shadow-sm ring-2 ring-surface animate-in zoom-in duration-300">
                  {cartCount}
                </span>
              ) : null}
            </Link>
          </div>
        </div>

        {/* MOBILE NAVIGATION DRAWER */}
        <div
          className={cn(
            "fixed inset-x-0 top-full h-[calc(100svh-4rem)] bg-surface/98 backdrop-blur-2xl transition-all duration-500 ease-in-out lg:hidden border-b border-line",
            menuOpen
              ? "visible opacity-100 translate-y-0"
              : "invisible opacity-0 -translate-y-6 pointer-events-none"
          )}
          aria-hidden={!menuOpen}
          inert={!menuOpen}
        >
          <nav
            id="mobile-navigation"
            aria-label="Mobile navigation"
            className="flex h-full flex-col justify-between overflow-y-auto px-6 py-8"
            onKeyDown={(event) => {
              if (event.key === "Escape") closeMenu(true);
            }}
          >
            {/* Primary Nav Links */}
            <div className="flex flex-col gap-3">
              {navigation.map((item, index) => (
                <Link
                  key={item.href}
                  className={cn(
                    "group flex items-center justify-between rounded-xl px-4 py-3 font-display text-2xl font-bold transition-all duration-300",
                    isActive(item.href)
                      ? "bg-gold/15 text-gold border border-gold/30"
                      : "text-ivory hover:bg-surface-raised hover:text-gold",
                    item.isSpecial && !isActive(item.href) && "text-rose-500"
                  )}
                  style={{ animationDelay: `${index * 50}ms` }}
                  href={item.href}
                  onClick={() => closeMenu()}
                >
                  <span className="flex items-center gap-2">
                    {item.label}
                    {item.isSpecial ? (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-500 font-sans uppercase font-bold tracking-wider">
                        Hot
                      </span>
                    ) : null}
                  </span>
                  <ArrowRight
                    size={18}
                    className="opacity-40 transition-transform duration-300 group-hover:translate-x-1 group-hover:opacity-100 group-hover:text-gold"
                  />
                </Link>
              ))}
            </div>

            {/* Mobile Categories Grid */}
            <div className="mt-8 border-t border-line/60 pt-6">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-[0.68rem] font-bold uppercase tracking-[0.2em] text-gold">
                  Explore Collections
                </p>
                <Link
                  href="/shop"
                  onClick={() => closeMenu()}
                  className="text-xs font-bold text-muted hover:text-ivory"
                >
                  View All
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    className="flex items-center rounded-xl border border-line/60 bg-surface-raised/40 px-3.5 py-2.5 text-xs font-semibold text-muted transition-colors hover:border-gold/40 hover:bg-gold/10 hover:text-gold"
                    href={`/shop/${category.slug}`}
                    onClick={() => closeMenu()}
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Mobile Footer Concierge CTA */}
            <div className="mt-8 border-t border-line/60 pt-6 flex flex-col gap-3">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl bg-gold/10 border border-gold/40 py-3 text-xs font-bold uppercase tracking-wider text-gold hover:bg-gold hover:text-gold-ink transition-all"
              >
                <MessageCircle size={16} />
                <span>Chat on WhatsApp</span>
              </a>
              <div className="flex items-center justify-between text-xs text-muted px-2">
                <Link href="/wishlist" onClick={() => closeMenu()} className="hover:text-ivory">
                  Wishlist ({wishlist.length})
                </Link>
                <Link href="/cart" onClick={() => closeMenu()} className="hover:text-ivory">
                  Shopping Bag ({cartCount})
                </Link>
              </div>
            </div>
          </nav>
        </div>
      </header>

      {/* SEARCH MODAL DIALOG */}
      {searchOpen ? (
        <div
          ref={dialog}
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/80 p-4 backdrop-blur-md transition-all duration-300 animate-in fade-in"
          role="dialog"
          aria-modal="true"
          aria-labelledby="search-dialog-title"
          onKeyDown={handleDialogKeys}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeSearch();
          }}
        >
          <div className="mt-[8svh] w-full max-w-2xl rounded-2xl border border-gold/20 bg-surface/98 p-6 shadow-[0_25px_60px_rgba(0,0,0,0.5)] backdrop-blur-2xl sm:p-8 animate-in zoom-in-95 duration-200">
            <div className="mb-6 flex items-center justify-between border-b border-line pb-4">
              <div>
                <p className="store-eyebrow text-gold">Search Store</p>
                <h2 id="search-dialog-title" className="font-display text-2xl font-bold text-ivory sm:text-3xl">
                  Find What You Need
                </h2>
              </div>
              <button
                className="inline-flex size-9 items-center justify-center rounded-full border border-line/60 text-muted transition-all duration-300 hover:border-gold hover:bg-gold/10 hover:text-gold"
                type="button"
                aria-label="Close search"
                onClick={closeSearch}
              >
                <X size={20} />
              </button>
            </div>
            <SearchCombobox onNavigate={closeSearch} />
          </div>
        </div>
      ) : null}
    </>
  );
}
