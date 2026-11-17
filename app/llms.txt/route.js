import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-static";

export async function GET() {
  let toolLines = [];
  try {
    const filePath = path.join(process.cwd(), "lib", "toolsData.ts");
    const raw = fs.readFileSync(filePath, "utf8");
    const objectBlocks =
      raw.match(/\{[^{}]*name\s*:\s*["'`][^"'`]+["'`][^{}]*\}/g) || [];

    toolLines = objectBlocks
      .map((block) => {
        const getField = (key) => {
          const m = block.match(
            new RegExp(`${key}\\s*:\\s*["'\`]([^"'\`]+)["'\`]`)
          );
          return m ? m[1].trim() : "";
        };
        const name = getField("name");
        const category = getField("category");
        const pricing = getField("pricing");
        const rating = getField("rating");
        const desc = getField("description");
        const url = getField("url");
        if (!name) return null;
        return `- **${name}** (${category || "AI Tool"} | ${pricing || "Freemium"} | Rating: ${rating || "4.5"}/5): ${desc} — Link: ${url}`;
      })
      .filter(Boolean);
  } catch {
    toolLines = [
      "- Explore 50+ curated AI tools across Writing, Image, Video, Voice, Coding, and Automation at https://786ai-hub.vercel.app",
    ];
  }

  const content = `# 786 AI Hub
> Curated directory of 50+ free and freemium AI tools across Text & Writing, Image Generation, Video Generation, Voice & Music, Coding, and Business Automation, plus an integrated AI Studio with +25 free starter credits.

- Main Directory: https://786ai-hub.vercel.app
- AI Studio: https://786ai-hub.vercel.app/studio
- Core Categories: Text & Writing, Image Generator, Video Generation, Voice & Music, Coding Tools, AI Automation, Image & Design

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
