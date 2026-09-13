import type { Metadata } from "next";
import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Men’s Hub",
    template: "%s | Men’s Hub",
  },
  description: "Style Made for Men",
  applicationName: "Men’s Hub",
  icons: { icon: "/favicon.png?v=mens-hub-2", shortcut: "/favicon.png?v=mens-hub-2", apple: "/logo.png" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" className="h-full bg-canvas">
      <body
        className={cn(
          "min-h-full bg-canvas font-sans text-ivory antialiased",
        )}
      >
        {children}
      </body>
    </html>
  );
}
