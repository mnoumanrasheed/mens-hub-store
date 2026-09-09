"use client";

import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/ui/error-state";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ reset }: GlobalErrorProps) {
  return (
    <html lang="en">
      <body className="min-h-svh bg-canvas font-sans text-ivory antialiased">
        <main className="flex min-h-svh items-center justify-center px-4 py-16">
          <ErrorState
            eyebrow="Application error"
            title="Men’s Hub is temporarily unavailable."
            description="Please retry the page."
            action={<Button onClick={reset}>Retry</Button>}
          />
        </main>
      </body>
    </html>
  );
}
