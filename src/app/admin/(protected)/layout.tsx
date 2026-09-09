import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdmin } from "@/lib/auth/require-admin";
import type { Metadata } from "next";

export const metadata: Metadata = { robots: { index: false, follow: false, noarchive: true, nocache: true } };
export const dynamic = "force-dynamic";

type ProtectedAdminLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default async function ProtectedAdminLayout({
  children,
}: ProtectedAdminLayoutProps) {
  const admin = await requireAdmin();
  return <AdminShell admin={admin}>{children}</AdminShell>;
}
