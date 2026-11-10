import { MetadataRoute } from 'next';
import { TOOLS_DATA } from '../lib/toolsData';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://786ai-hub.vercel.app';

  // Static Pages
  const staticPages = [
    '',
    '/categories',
    '/submit',
    '/disclosure',
    '/privacy',
    '/terms',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  // Dynamic 32 Tool Review Pages
  const toolPages = TOOLS_DATA.map((tool) => ({
    url: `${baseUrl}/tool/${tool.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...toolPages];
}
