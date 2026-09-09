import { LoadingIndicator } from "@/components/ui/loading-indicator";

export default function StorefrontLoading() { return <main className="mx-auto flex min-h-[55svh] max-w-[90rem] items-center justify-center px-[var(--mh-container-gutter)]" aria-busy="true"><LoadingIndicator label="Loading collection" /></main>; }
