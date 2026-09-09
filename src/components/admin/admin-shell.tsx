import type { ReactNode } from "react";
import Link from "next/link";

import { logoutAction } from "@/actions/auth";
import { Container } from "@/components/storefront/container";
import { LogoutButton } from "@/components/admin/logout-button";
import type { AuthenticatedAdmin } from "@/data/admin";

type AdminShellProps = {
  admin: AuthenticatedAdmin;
  children: ReactNode;
};

export function AdminShell({ admin, children }: AdminShellProps) {
  const adminLabel = admin.displayName?.trim() || "Administrator";

  return (
    <div className="min-h-svh bg-admin-bg">
      <header className="border-b border-line bg-surface">
        <Container className="flex min-h-20 items-center justify-between gap-4 py-3">
          <div>
            <p className="font-display text-xl font-semibold tracking-wide text-ivory">
              Men&apos;s Hub Admin
            </p>
            <p className="text-xs text-muted">Secure management workspace</p>
          </div>
          <div className="flex items-center gap-3 sm:gap-5">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-ivory">{adminLabel}</p>
              <p className="text-xs text-muted">{admin.email}</p>
            </div>
            <form action={logoutAction}>
              <LogoutButton />
            </form>
          </div>
        </Container>
      </header>
      <nav className="border-b border-admin-line bg-white" aria-label="Admin navigation">
        <Container className="flex min-h-14 items-center gap-1 overflow-x-auto">
          <Link className="admin-nav-link" href="/admin">Dashboard</Link>
          <Link className="admin-nav-link" href="/admin/products">Products</Link>
          <Link className="admin-nav-link" href="/admin/categories">Categories</Link>
          <Link className="admin-nav-link" href="/admin/inventory">Inventory</Link>
          <Link className="admin-nav-link" href="/admin/analytics">Analytics</Link>
          <Link className="admin-nav-link" href="/admin/content">Content</Link>
          <Link className="admin-nav-link" href="/admin/settings">Settings</Link>
        </Container>
      </nav>
      <main>{children}</main>
    </div>
  );
}
