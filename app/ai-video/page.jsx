import AiVideoClient from "./AiVideoClient";

export const metadata = {
  title: "786 AI Video Generator – Create Videos with Multiple AI Models",
  description:
    "Create cinematic AI video prompts, storyboards, and workflows for Sora 2, Veo 3.1, Kling 3.0, Seedance 2.0, and Wan 2.6 on 786 AI Hub.",
  alternates: {
    canonical: "https://786ai-hub.vercel.app/ai-video",
  },
};

export default function AiVideoPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "786 AI Video Generator",
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Web",
    url: "https://786ai-hub.vercel.app/ai-video",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AiVideoClient />
    </>
  );
}
