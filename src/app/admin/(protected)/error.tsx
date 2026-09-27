"use client";

import { useEffect } from "react";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.error("Admin view render error:", error);
    }
  }, [error]);

  return (
    <div className="admin-page">
      <div className="admin-panel py-14 text-center">
        <h1 className="text-2xl font-bold text-admin-ink">
          This admin view could not be loaded
        </h1>
        <p className="mt-2 text-sm text-admin-muted">Please try again.</p>
        <button className="admin-button mt-5" onClick={reset}>
          Try again
        </button>
      </div>
    </div>
  );
}
