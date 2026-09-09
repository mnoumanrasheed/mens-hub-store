import type { Metadata } from "next";
import { Container } from "@/components/storefront/container";
import { WishlistView } from "@/components/storefront/wishlist-view";

export const metadata: Metadata = { title: "Wishlist", robots: { index: false, follow: false } };

export default function WishlistPage() { return <main className="py-14 sm:py-20"><Container size="wide"><WishlistView /></Container></main>; }
