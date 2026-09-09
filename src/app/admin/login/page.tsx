import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ShieldCheck } from "lucide-react";

import { LoginForm } from "@/components/admin/login-form";
import { getCurrentAdmin } from "@/lib/auth/require-admin";

export const metadata: Metadata = {
  title: "Admin sign in",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  if (await getCurrentAdmin()) {
    redirect("/admin");
  }

  return (
    <main className="grid min-h-svh bg-canvas lg:grid-cols-[minmax(0,0.9fr)_minmax(30rem,1.1fr)]">
      <section className="hidden border-r border-line bg-surface p-12 lg:flex lg:flex-col lg:justify-between xl:p-16">
        <p className="font-display text-2xl font-semibold tracking-wide text-gold">
          Men&apos;s Hub
        </p>
        <div className="max-w-lg">
          <p className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-gold">
            Private administration
          </p>
          <p className="font-display text-6xl font-semibold leading-[0.95] text-ivory xl:text-7xl">
            A focused space for the work behind the brand.
          </p>
        </div>
        <p className="text-sm text-muted">Style Made for Men</p>
      </section>

      <section className="flex items-center justify-center px-5 py-12 sm:px-10 lg:px-16">
        <div className="w-full max-w-md">
          <div className="mb-9 flex size-12 items-center justify-center rounded-sm border border-gold/50 bg-surface text-gold">
            <ShieldCheck aria-hidden="true" size={22} strokeWidth={1.6} />
          </div>
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-gold lg:hidden">
            Men&apos;s Hub administration
          </p>
          <h1 className="font-display text-4xl font-semibold text-ivory sm:text-5xl">
            Welcome back
          </h1>
          <p className="mb-8 mt-3 max-w-sm text-sm leading-6 text-muted">
            Sign in with your authorized administrator credentials to continue.
          </p>
          <LoginForm />
          <p className="mt-8 border-t border-line pt-6 text-xs leading-5 text-subtle">
            This area is restricted. Authentication is stored only in a secure,
            signed HttpOnly session cookie.
          </p>
        </div>
      </section>
    </main>
  );
}
