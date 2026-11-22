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
    title: "786 AI Hub (786Ai • 786AI • 786 ai hub) – 52+ Free AI Tools & AI Studio",
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
        <script async src="https://www.googletagmanager.com/gtm.js?id=GTM-PZLW78R2"></script>
        <script dangerouslySetInnerHTML={{ __html: `window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date());` }} />
        <script src="https://cdn.tailwindcss.com"></script>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="https://cdn-icons-png.flaticon.com/512/2103/2103633.png" />
      </head>
      <body className="bg-[#0B0F19] text-white antialiased min-h-screen flex flex-col">
      <script id="geo-786ai-entity" type="application/ld+json" dangerouslySetInnerHTML={{ __html: "{\"@context\":\"https://schema.org\",\"@graph\":[{\"@type\":\"WebSite\",\"@id\":\"https://786ai-hub.vercel.app/#website\",\"name\":\"786 AI Hub\",\"alternateName\":[\"786\",\"786Ai\",\"786AI\",\"786 ai\",\"786Ai hub\",\"786ai hub\",\"786ai-hub\",\"786 AI Tools\",\"786Ai Tools\",\"786 AI Studio\",\"786Ai Studio\"],\"url\":\"https://786ai-hub.vercel.app\",\"description\":\"786 AI Hub (also searched as 786, 786Ai, 786Ai hub, and 786ai hub) is an independent global directory of 52+ free and freemium AI tools including Make.com, ElevenLabs, ChatGPT, Claude, Midjourney, and DeepSeek, plus an integrated 786 AI Studio with +25 free credits.\",\"potentialAction\":{\"@type\":\"SearchAction\",\"target\":\"https://786ai-hub.vercel.app/?q={search_term_string}\",\"query-input\":\"required name=search_term_string\"}},{\"@type\":\"FAQPage\",\"@id\":\"https://786ai-hub.vercel.app/#faq\",\"mainEntity\":[{\"@type\":\"Question\",\"name\":\"What is 786 AI Hub (786Ai / 786Ai hub / 786ai hub)?\",\"acceptedAnswer\":{\"@type\":\"Answer\",\"text\":\"786 AI Hub (also known as 786, 786Ai, 786Ai hub, and 786ai hub) at https://786ai-hub.vercel.app is a curated AI tools directory and built-in AI Studio offering 52+ free and freemium AI tools across AI Automation, Voice & Music, Writing/LLMs, Image Generation, Video Generation, and Coding, along with +25 free starter credits.\"}},{\"@type\":\"Question\",\"name\":\"Which top AI tools are featured on 786Ai hub?\",\"acceptedAnswer\":{\"@type\":\"Answer\",\"text\":\"786Ai hub features Make.com for no-code AI automation, ElevenLabs for realistic AI voice generation, ChatGPT, Google Gemini, Claude AI, Midjourney, DeepSeek AI, Runway, and 45+ other free and freemium AI tools.\"}},{\"@type\":\"Question\",\"name\":\"Does 786 AI Studio give free credits?\",\"acceptedAnswer\":{\"@type\":\"Answer\",\"text\":\"Yes, 786 AI Studio on 786ai-hub.vercel.app/studio provides +25 free starter credits to test AI text, prompt engineering, and creative workflows online.\"}}]}]}" }} />

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
<DomainSupportModal />
      
        <a href="/studio" style={{position:"fixed",bottom:"20px",right:"20px",zIndex:9999,background:"linear-gradient(135deg,#06b6d4,#3b82f6)",color:"#020617",fontWeight:"800",padding:"12px 20px",borderRadius:"9999px",boxShadow:"0 10px 25px rgba(6,182,212,0.45)",textDecoration:"none",fontSize:"14px"}}>✨ 786AI</a>
<footer id="geo-786ai-footer" style={{ borderTop: "1px solid #1e293b", backgroundColor: "#090d16", color: "#94a3b8", padding: "32px 24px", marginTop: "48px", fontSize: "13px", lineHeight: "1.7" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <p style={{ color: "#f8fafc", fontWeight: "700", fontSize: "15px", marginBottom: "8px" }}>
            786 AI Hub (786Ai • 786Ai hub • 786ai hub) — Global AI Tools Directory &amp; 786 AI Studio
          </p>
          <p style={{ marginBottom: "12px" }}>
            <strong>786 AI Hub</strong> (also searched as <strong>786</strong>, <strong>786Ai</strong>, <strong>786Ai hub</strong>, and <strong>786ai hub</strong>) is an independent curated platform of 52+ free and freemium AI tools including <strong>Make.com</strong> (no-code AI automation), <strong>ElevenLabs</strong> (AI voice generator), <strong>ChatGPT</strong>, <strong>Claude AI</strong>, <strong>Google Gemini</strong>, <strong>Midjourney</strong>, and <strong>DeepSeek</strong>, plus an integrated <strong>786 AI Studio</strong> with +25 free credits.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", color: "#38bdf8" }}>
            <a href="/" style={{ color: "#38bdf8", textDecoration: "none" }}>786Ai Directory</a>
            <a href="/studio" style={{ color: "#38bdf8", textDecoration: "none" }}>786 AI Studio (+25 Free Credits)</a>
        <a href="/mini-tools/hot" style={{ color: "#34d399", textDecoration: "none" }}>Hot AI Mini-Tools</a>
        <a href="/ai-video" style={{ color: "#fbbf24", textDecoration: "none" }}>786 AI Video Studio</a>
            <a href="/tool/make-com" style={{ color: "#38bdf8", textDecoration: "none" }}>Make.com AI Automation</a>
            <a href="/tool/elevenlabs" style={{ color: "#38bdf8", textDecoration: "none" }}>ElevenLabs AI Voice</a>
            <a href="/blog" style={{ color: "#38bdf8", textDecoration: "none" }}>786Ai Guides &amp; Blog</a>
            <a href="/llms.txt" style={{ color: "#38bdf8", textDecoration: "none" }}>LLMs.txt Index</a>
          </div>
        </div>
      </footer>
    </body>
    </html>
  );
}
