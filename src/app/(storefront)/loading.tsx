import { LoadingIndicator } from "@/components/ui/loading-indicator";

export default function StorefrontLoading() {
  return (
    <main
      className="mx-auto grid min-h-[65svh] max-w-[90rem] place-items-center px-[var(--mh-container-gutter)]"
      aria-busy="true"
    >
      <LoadingIndicator label="Curating your selection" />
    </main>
  );
}
