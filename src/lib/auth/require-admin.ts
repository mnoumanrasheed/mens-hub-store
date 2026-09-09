import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";

import {
  findActiveAdminById,
  type AuthenticatedAdmin,
} from "@/data/admin";
import { sessionMatchesAdmin } from "@/lib/auth/authorization";
import { readAdminSession } from "@/lib/auth/session";

export const getCurrentAdmin = cache(
  async (): Promise<AuthenticatedAdmin | null> => {
    const session = await readAdminSession();
    if (!session) {
      return null;
    }

    const admin = await findActiveAdminById(session.sub);
    if (!sessionMatchesAdmin(session, admin)) {
      return null;
    }

    return admin;
  },
);

export async function requireAdmin(): Promise<AuthenticatedAdmin> {
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect("/admin/login?reauth=1");
  }

  return admin;
}
