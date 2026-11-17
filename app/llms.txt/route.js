import { NextResponse } from "next/server";
import { TOOLS_DATA } from "@/lib/toolsData";

export const dynamic = "force-static";

export async function GET() {
  const toolLines = TOOLS_DATA.map((t) => {
    const feats =
      Array.isArray(t.features) && t.features.length > 0
        ? ` | Features: ${t.features.slice(0, 3).join(", ")}`
        : "";
    return `- **${t.name}** (${t.category} | ${t.pricing} | Rating: ${t.rating}/5): ${t.description}${feats} | Review: https://786ai-hub.vercel.app/tool/${t.slug} | Direct: ${t.url}`;
  });

  const content = `# 786 AI Hub
> Curated directory of ${TOOLS_DATA.length} free and freemium AI tools across Writing/LLMs, Image Generation, Video Generation, Voice & Music, Coding Tools, and AI Automation, plus an integrated AI Studio with +25 free starter credits.

- Main Directory: https://786ai-hub.vercel.app
- AI Studio: https://786ai-hub.vercel.app/studio
- Blog: https://786ai-hub.vercel.app/blog
- Sitemap: https://786ai-hub.vercel.app/sitemap.xml

## Curated AI Tools Catalog (${TOOLS_DATA.length} Tools)
${toolLines.join("\n")}
`;

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
