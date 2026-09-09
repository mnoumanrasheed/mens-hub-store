"use client";

import { useEffect } from "react";
import { ErrorState } from "@/components/ui/error-state";

export default function StorefrontError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) { useEffect(() => { console.error(error); }, [error]); return <main className="mx-auto flex min-h-[55svh] max-w-[90rem] items-center justify-center px-[var(--mh-container-gutter)] py-16"><ErrorState eyebrow="Storefront unavailable" title="We couldn't load this page." description="Please try again. Your cart and wishlist remain saved on this device." action={<button type="button" className="store-cta-primary" onClick={reset}>Try again</button>} /></main>; }
