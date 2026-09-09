import { LoadingIndicator } from "@/components/ui/loading-indicator";

export default function Loading() {
  return (
    <div className="flex min-h-svh items-center justify-center px-4">
      <LoadingIndicator label="Loading Men’s Hub" />
    </div>
  );
}
