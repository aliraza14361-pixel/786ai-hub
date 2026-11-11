import { MetadataRoute } from 'next';
import { prisma } from '../lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://786ai-hub.vercel.app';

  let tools: { id: string; updatedAt?: Date }[] = [];
  try {
    tools = await prisma.tool.findMany({
      select: { id: true, updatedAt: true },
    });
  } catch (e) {
    console.error('Failed to fetch tools for sitemap', e);
  }

  const toolEntries: MetadataRoute.Sitemap = tools.map((tool) => ({
    url: `${baseUrl}/tool/${tool.id}`,
    lastModified: tool.updatedAt || new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/categories`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    ...toolEntries,
  ];
}
