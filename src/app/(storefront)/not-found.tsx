import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/storefront/container";

export default function StorefrontNotFound() {
  return <main className="py-16 sm:py-24"><Container size="wide"><div className="atelier-empty border border-line text-center">
    <p className="store-eyebrow">404 / Out of frame</p>
    <h1 className="font-display text-5xl text-ivory">A different direction.</h1>
    <p className="mx-auto mt-5 max-w-md text-sm leading-7 text-muted">This page may have moved, or is not available yet. Let us help you find what you are looking for.</p>
    <div className="mt-8 flex flex-wrap justify-center gap-3"><Link href="/shop" className="store-cta-primary">Explore the collection<ArrowUpRight size={16} /></Link><Link href="/contact" className="store-cta-secondary">Contact our team</Link></div>
  </div></Container></main>;
}
