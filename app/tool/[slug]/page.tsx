import ToolDetailsGuide from "../../../components/ToolDetailsGuide";
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const tool = await prisma.tool.findUnique({ where: { slug: params.slug } });
  if (!tool) return {};

  return {
    title: `${tool.name} AI Tool Review & Details | 786 AI Hub`,
    description: tool.description,
    openGraph: {
      title: `${tool.name} - AI Tool Features & Pricing`,
      description: tool.description,
    },
  };
}

export default async function ToolDetailPage({ params }: Props) {
  const tool = await prisma.tool.findUnique({ where: { slug: params.slug } });

  if (!tool) notFound();

  // JSON-LD for Google Rich Results
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: tool.name,
    operatingSystem: 'All',
    applicationCategory: 'MultimediaApplication',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: tool.rating || 5.0,
      ratingCount: 1,
    },
    offers: {
      '@type': 'Offer',
      price: tool.pricing === 'FREE' ? '0' : 'Varies',
      priceCurrency: 'USD',
    },
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-12 text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="flex items-center gap-4 border-b border-slate-800 pb-6 mb-6">
        <span className="text-4xl">{tool.icon || '🤖'}</span>
        <div>
          <h1 className="text-3xl font-bold">{tool.name}</h1>
          <p className="text-slate-400 text-sm mt-1">{tool.category} • {tool.pricing}</p>
        </div>
      </div>

      <div className="prose prose-invert max-w-none">
        <h2 className="text-xl font-semibold mb-2">Overview</h2>
        <p className="text-slate-300 leading-relaxed">{tool.description}</p>
      </div>

      <div className="mt-8">
        <a
          href={`/api/out/${tool.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-6 py-3 bg-indigo-600 hover:bg-indigo-500 font-semibold rounded-xl text-white transition"
        >
          Try {tool.name} Now ↗
        </a>
      </div>
    
      <ToolDetailsGuide tool={tool} />
</main>
  );
}

