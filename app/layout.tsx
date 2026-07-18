import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EverAfter AI — Redefine Your Happily Ever After",
  description: "A private story intelligence tool that helps people transform stuck narratives into safer meaning and anonymized realization rooms.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}<Analytics /></body>
    </html>
  );
}
