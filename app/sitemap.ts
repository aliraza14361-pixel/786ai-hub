import type { MetadataRoute } from "next";
import { TOOLS_DATA } from "@/lib/toolsData";

function resolveSlug(t: any): string {
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

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://786ai-hub.vercel.app";
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${baseUrl}/studio`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/llms.txt`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
  ];

  const seen = new Set<string>();
  const toolRoutes: MetadataRoute.Sitemap = [];
  for (const tool of TOOLS_DATA) {
    const slug = resolveSlug(tool);
    if (slug && !seen.has(slug)) {
      seen.add(slug);
      toolRoutes.push({
        url: `${baseUrl}/tool/${slug}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.85,
      });
    }
  }

  return [...staticRoutes, ...toolRoutes];
}
