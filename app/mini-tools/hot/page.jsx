import MiniToolsClient from "./MiniToolsClient";

export const metadata = {
  title: "Hot AI Mini-Tools | 786 AI Hub",
  description:
    "Use free single-purpose AI mini-tools on 786 AI Hub: AI Prompt Enhancer, Viral Reels Hook Maker, SEO & GEO Article Outliner, and YouTube Title Generator.",
  alternates: {
    canonical: "https://786ai-hub.vercel.app/mini-tools/hot",
  },
};

export default function HotMiniToolsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Hot AI Mini-Tools - 786 AI Hub",
    url: "https://786ai-hub.vercel.app/mini-tools/hot",
    description: "Trending free single-purpose AI utilities and prompt tools on 786 AI Hub.",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <MiniToolsClient />
    </>
  );
}
