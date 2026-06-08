import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LINKORNA | Cross-border AI Employees",
  description: "Cross-border AI Employees for Global Trade"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
