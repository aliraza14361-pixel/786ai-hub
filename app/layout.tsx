import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "786 AI Hub - Global Tools Directory & Automation Studio",
    template: "%s | 786 AI Hub",
  },
  description: "Discover, compare, and test top AI tools, native processors, and automation workflows on 786 AI Hub.",
  keywords: ["AI Tools", "AI Directory", "Automation Studio", "ChatGPT Alternatives", "LLM Workflows"],
  authors: [{ name: "786 AI Hub Team" }],
  openGraph: {
    title: "786 AI Hub - Global Tools Directory & Automation Studio",
    description: "Discover, compare, and launch top AI tools and automation workflows.",
    url: "https://786ai-hub.vercel.app",
    siteName: "786 AI Hub",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "786 AI Hub",
    description: "Global AI tools directory and automation suite.",
  },
  robots: {
    index: true,
    follow: true,
  },
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
