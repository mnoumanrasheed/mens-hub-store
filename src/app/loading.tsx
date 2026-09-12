import { LoadingIndicator } from "@/components/ui/loading-indicator";

export default function Loading() {
  return (
    <main className="grid min-h-svh place-items-center bg-canvas px-4">
      <LoadingIndicator label="Opening the boutique" />
    </main>
  );
}
