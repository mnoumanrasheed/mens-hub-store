"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/ui/error-state";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-svh items-center justify-center px-4 py-16">
      <ErrorState
        eyebrow="Unexpected error"
        title="We couldn't load this page."
        description="Please try again. If the problem continues, return later."
        action={<Button onClick={reset}>Try again</Button>}
      />
    </main>
  );
}
