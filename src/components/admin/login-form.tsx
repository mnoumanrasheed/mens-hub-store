"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { ArrowRight, LockKeyhole } from "lucide-react";

import {
  loginAction,
  type LoginActionState,
} from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const initialState: LoginActionState = { error: null };

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" size="lg" className="w-full" disabled={pending}>
      {pending ? "Signing in…" : "Sign in securely"}
      {!pending ? <ArrowRight aria-hidden="true" size={17} /> : null}
    </Button>
  );
}

export function LoginForm() {
  const [state, formAction] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="grid gap-5" noValidate>
      <Input
        id="admin-email"
        name="email"
        label="Email address"
        type="email"
        autoComplete="username"
        inputMode="email"
        required
      />
      <Input
        id="admin-password"
        name="password"
        label="Password"
        type="password"
        autoComplete="current-password"
        required
      />
      <div aria-live="polite" className="min-h-6">
        {state.error ? (
          <p className="flex items-center gap-2 text-sm text-critical" role="alert">
            <LockKeyhole aria-hidden="true" size={15} />
            {state.error}
          </p>
        ) : null}
      </div>
      <SubmitButton />
    </form>
  );
}
