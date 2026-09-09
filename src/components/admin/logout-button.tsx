"use client";

import { useFormStatus } from "react-dom";
import { LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";

export function LogoutButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" variant="ghost" size="sm" disabled={pending}>
      <LogOut aria-hidden="true" size={16} />
      {pending ? "Signing out…" : "Sign out"}
    </Button>
  );
}
