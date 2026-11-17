import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/tool/", "/studio", "/blog", "/llms.txt"],
        disallow: ["/admin", "/api/"],
      },
      {
        userAgent: [
          "GPTBot",
          "OAI-SearchBot",
          "PerplexityBot",
          "Google-Extended",
          "ClaudeBot",
        ],
        allow: ["/", "/tool/", "/studio", "/blog", "/llms.txt"],
        disallow: ["/admin", "/api/"],
      },
    ],
    sitemap: "https://786ai-hub.vercel.app/sitemap.xml",
  };
}
