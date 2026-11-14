import './globals.css';
import Footer from '../components/Footer';

export const viewport = {
  themeColor: '#090d16',
};

export const metadata = {
  metadataBase: new URL('https://786ai-hub.vercel.app'),
  title: {
    default: '786 AI Hub | Global AI Tools Directory, Native Processors & Automation Studio',
    template: '%s | 786 AI Hub',
  },
  description:
    'Discover, search, and launch top-rated AI tools worldwide for text, images, code, audio, video, and workflow automation.',
  keywords: [
    'AI tools directory',
    'free AI tools',
    'AI automation',
    'ChatGPT alternatives',
    '786 AI Hub',
  ],
  manifest: '/manifest.json',
  openGraph: {
    title: '786 AI Hub | Global AI Tools Directory',
    description:
      'Explore 100+ curated AI tools, native AI text generators, and automation workflows.',
    url: 'https://786ai-hub.vercel.app',
    siteName: '786 AI Hub',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="https://cdn-icons-png.flaticon.com/512/2103/2103633.png" />
      </head>
      <body className="bg-[#0B0F19] text-white antialiased min-h-screen flex flex-col">
        <div className="flex-grow">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
