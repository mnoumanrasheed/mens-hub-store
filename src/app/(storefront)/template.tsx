import type { ReactNode } from "react";

export default function StorefrontTemplate({ children }: { children: ReactNode }) {
  return <div className="store-page-enter">{children}</div>;
}
