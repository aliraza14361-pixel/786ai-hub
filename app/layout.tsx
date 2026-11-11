import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "786 AI Hub - Global Tools Directory",
  description: "Discover and launch top AI tools and automation workflows.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body className="bg-[#0B0F19] text-gray-100 min-h-screen flex flex-col antialiased">
        {/* Header */}
        <header className="border-b border-gray-800 bg-[#0F172A]/80 backdrop-blur sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                786 AI Hub
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <a href="/admin" className="text-sm text-gray-400 hover:text-white transition">Admin</a>
              <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
                Sign In
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t border-gray-800 bg-[#0B0F19] py-8 text-center text-sm text-gray-500">
          <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
            <p>© 2026 786 AI Hub. All rights reserved.</p>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-gray-300">Privacy</a>
              <a href="#" className="hover:text-gray-300">Terms</a>
              <a href="/admin" className="hover:text-gray-300">Admin Dashboard</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
