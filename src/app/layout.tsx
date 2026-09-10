import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Cormorant_Garamond, Manrope } from "next/font/google";

import { cn } from "@/lib/cn";

import "./globals.css";

const bodyFont = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const displayFont = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Men’s Hub",
    template: "%s | Men’s Hub",
  },
  description: "Style Made for Men",
  applicationName: "Men’s Hub",
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
          bodyFont.variable,
          displayFont.variable,
          "min-h-full bg-canvas font-sans text-ivory antialiased",
        )}
      >
        {children}
      </body>
    </html>
  );
}
