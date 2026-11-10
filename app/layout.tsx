import './globals.css';
import Header from '../components/Header';
import Footer from '../components/Footer';

export const metadata = {
  title: '786 AI Hub - Global Tools Directory & Automation Studio',
  description: 'Global Tools Directory, Native Processors & Automation Studio.',
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
      <body className="bg-slate-950 text-slate-100 min-h-screen flex flex-col justify-between antialiased">
        <Header />
        <main className="flex-1 max-w-6xl mx-auto px-4 w-full">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
