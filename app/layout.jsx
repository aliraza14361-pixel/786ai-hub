import './globals.css';
import Footer from "../components/Footer";
import SocialRewardModal from "../src/components/SocialRewardModal";
import DomainSupportModal from "../src/components/DomainSupportModal";

export const viewport = {
  themeColor: '#090d16',
};

export const metadata = {
  verification: { google: "m3C51XuWVnVi0J7VHoLbmvPmUWgCUZ4QeUuuk8N4bkU" },
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

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "WebSite",
                  "@id": "https://786ai-hub.vercel.app/#website",
                  "name": "786 AI Hub",
                  "alternateName": ["786ai hub", "786ai", "786 AI Directory"],
                  "url": "https://786ai-hub.vercel.app",
                  "description": "Curated directory of 52+ free and freemium AI tools across Writing, Image, Video, Voice, Coding, and Automation with an integrated AI Studio."
                },
                {
                  "@type": "Organization",
                  "@id": "https://786ai-hub.vercel.app/#organization",
                  "name": "786 AI Hub",
                  "alternateName": "786ai hub",
                  "url": "https://786ai-hub.vercel.app",
                  "sameAs": [
                    "https://github.com/aliraza14361-pixel/786ai-hub"
                  ]
                }
              ]
            })
          }}
        />
        <div className="flex-grow">{children}</div>
        <Footer />
        <SocialRewardModal />
        <DomainSupportModal />
      
        <a href="/studio" style={{position:"fixed",bottom:"20px",right:"20px",zIndex:9999,background:"linear-gradient(135deg,#06b6d4,#3b82f6)",color:"#020617",fontWeight:"800",padding:"12px 20px",borderRadius:"9999px",boxShadow:"0 10px 25px rgba(6,182,212,0.45)",textDecoration:"none",fontSize:"14px"}}>✨ 786AI</a>
      <a href="/blog" style={{position:"fixed",bottom:"20px",left:"20px",zIndex:9999,background:"#0f172a",color:"#67e8f9",border:"1px solid rgba(6,182,212,0.4)",fontWeight:"700",padding:"10px 16px",borderRadius:"9999px",boxShadow:"0 8px 20px rgba(0,0,0,0.4)",textDecoration:"none",fontSize:"13px"}}>📚 AI Guides</a>
        </body>
    </html>
  );
}
