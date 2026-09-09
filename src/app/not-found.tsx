import Link from "next/link";

import { Container } from "@/components/storefront/container";
import { buttonStyles } from "@/components/ui/button";
import { ErrorState } from "@/components/ui/error-state";

export default function NotFound() {
  return (
    <main className="flex min-h-svh items-center py-16">
      <Container size="narrow">
        <ErrorState
          eyebrow="404"
          title="This page is out of frame."
          description="The page may have moved, or the address may be incorrect."
          action={
            <Link href="/" className={buttonStyles()}>
              Return home
            </Link>
          }
        />
      </Container>
    </main>
  );
}
