import type { ReactNode } from "react";
import { StoreHeader } from "@/components/storefront/store-header";
import { StoreFooter } from "@/components/storefront/store-footer";
import type { StorefrontCategory } from "@/data/storefront";
import { FloatingWhatsApp } from "@/components/storefront/floating-whatsapp";

type StorefrontShellProps = {
  children: ReactNode;
  brandName: string;
  settings: Parameters<typeof StoreFooter>[0]["settings"];
  categories: Pick<StorefrontCategory, "id" | "name" | "slug">[];
  footerContent?: Record<string, string>;
};

export function StorefrontShell({ brandName, categories, children, footerContent, settings }: StorefrontShellProps) {
  return (
    <div className="atelier-store flex min-h-svh flex-col bg-canvas">
      <a
        href="#main-content"
        className="fixed left-4 top-4 z-50 -translate-y-24 rounded-sm bg-gold px-4 py-3 text-sm font-bold text-gold-ink transition-transform focus:translate-y-0"
      >
        Skip to content
      </a>
      <StoreHeader brandName={brandName} categories={categories} whatsapp={settings.whatsapp} />
      <div id="main-content" className="flex-1">
        {children}
      </div>
      <FloatingWhatsApp brandName={brandName} />
      <StoreFooter settings={settings} categories={categories} content={footerContent} />
    </div>
  );
}

