import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: '786 AI Hub - Global Tools Directory & Studio',
  description: 'Curated directory of AI tools, text processors, and automation workflows.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-white min-h-screen flex flex-col justify-between antialiased">
        <Header />
        <main className="flex-1 max-w-6xl mx-auto px-4 w-full">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
