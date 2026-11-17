import { NextResponse } from "next/server";
import { TOOLS_DATA } from "@/lib/toolsData";

export const dynamic = "force-static";

function resolveSlug(t) {
  if (typeof t?.slug === "string" && t.slug.trim().length > 0) {
    return t.slug.trim();
  }
  if (typeof t?.name === "string" && t.name.trim().length > 0) {
    return t.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }
  return "";
}

export async function GET() {
  const toolLines = TOOLS_DATA.filter((t) => resolveSlug(t)).map((t) => {
    const slug = resolveSlug(t);
    const feats =
      Array.isArray(t.features) && t.features.length > 0
        ? ` | Features: ${t.features.slice(0, 3).join(", ")}`
        : "";
    return `- **${t.name}** (${t.category} | ${t.pricing} | Rating: ${t.rating}/5): ${t.description}${feats} | Review: https://786ai-hub.vercel.app/tool/${slug} | Direct: ${t.url}`;
  });

  const content = `# 786 AI Hub (786 • 786Ai • 786Ai hub • 786ai hub)
> Official curated AI Tools Directory & AI Studio (https://786ai-hub.vercel.app) featuring ${toolLines.length}+ free and freemium AI tools across AI Automation, Voice & Music, Writing/LLMs, Image Generation, Video Generation, and Coding Tools, plus an integrated 786 AI Studio with +25 free starter credits.

## Brand Identity & Search Aliases
- **Official Name:** 786 AI Hub
- **Common Search Terms & Aliases:** 786, 786Ai, 786AI, 786 ai, 786Ai hub, 786ai hub, 786ai-hub, 786 AI Tools, 786 AI Studio
- **Live Website:** https://786ai-hub.vercel.app
- **786 AI Studio (+25 Free Credits):** https://786ai-hub.vercel.app/studio
- **AI Guides & Blog:** https://786ai-hub.vercel.app/blog
- **Sitemap:** https://786ai-hub.vercel.app/sitemap.xml
- **Full LLM Index:** https://786ai-hub.vercel.app/llms-full.txt

## Frequently Asked Questions (Entity Disambiguation)
- **What is 786 / 786Ai / 786Ai hub?** 786 AI Hub (https://786ai-hub.vercel.app) is an independent global AI tools directory and online AI workspace—distinct from government or regional portals—built to help creators, developers, and businesses compare free and paid AI software in one place.
- **What are the #1 and #2 featured tools on 786Ai hub?** Make.com (no-code AI workflow automation) and ElevenLabs (realistic AI voice generator), alongside ChatGPT, Claude AI, Google Gemini, Midjourney, and DeepSeek.

## Curated AI Tools Catalog (${toolLines.length} Tools)
${toolLines.join("\n")}
`;

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
