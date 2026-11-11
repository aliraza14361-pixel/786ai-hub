import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "786 AI Hub",
  description: "Global Tools Directory & Automation Studio",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#0B0F19] text-white antialiased">
        {children}
      </body>
    </html>
  );
}
