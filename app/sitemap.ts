import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://786ai-hub.vercel.app";
  let toolUrls: MetadataRoute.Sitemap = [];

  try {
    const tools = await prisma.tool.findMany({
      where: { status: "Active" },
      select: { slug: true, updatedAt: true },
    });

    toolUrls = tools.map((tool) => ({
      url: `${baseUrl}/tool/${tool.slug}`,
      lastModified: tool.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  } catch (error) {
    console.error("Sitemap DB fetch skipped:", error);
  }

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    ...toolUrls,
  ];
}
