import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getToolBySlug, TOOLS_DATA } from '../../../lib/toolsData';

export async function generateStaticParams() {
  return TOOLS_DATA.map((tool) => ({
    slug: tool.slug,
  }));
}

type Props = {
  params: Promise<{ slug: string }> | { slug: string };
};

export async function generateMetadata({ params }: Props) {
  const resolvedParams = await params;
  const tool = getToolBySlug(resolvedParams.slug);
  if (!tool) return {};

  return {
    title: `${tool.name} Review, Pricing & Features | 786 AI Hub`,
    description: `${tool.description} Read full review, pros, cons and pricing details for ${tool.name}.`,
    openGraph: {
      title: `${tool.name} - AI Tool Review | 786 AI Hub`,
      description: tool.description,
    },
  };
}

export default async function ToolDetailPage({ params }: Props) {
  const resolvedParams = await params;
  const tool = getToolBySlug(resolvedParams.slug);

  if (!tool) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: tool.name,
    operatingSystem: 'Web-based',
    applicationCategory: 'BusinessApplication',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: tool.rating,
      ratingCount: '240',
    },
    offers: {
      '@type': 'Offer',
      price: tool.pricing === '100% Free' ? '0' : '9.99',
      priceCurrency: 'USD',
    },
  };

  return (
    <div className="py-10 max-w-4xl mx-auto space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav className="text-xs text-slate-400 flex items-center gap-2">
        <Link href="/" className="hover:text-cyan-400">Home</Link>
        <span>/</span>
        <Link href="/categories" className="hover:text-cyan-400 font-normal">Directory</Link>
        <span>/</span>
        <span className="text-slate-200 font-semibold">{tool.name}</span>
      </nav>

      <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-5">
          <span className="text-5xl p-4 rounded-2xl bg-slate-800/80 border border-slate-700">{tool.icon}</span>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-extrabold text-white">{tool.name}</h1>
              <span className="text-sm text-yellow-400 font-semibold">★ {tool.rating}</span>
            </div>
            <div className="flex gap-2 mt-2">
              <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-cyan-950 text-cyan-400 border border-cyan-800">{tool.category}</span>
              <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-slate-800 text-slate-300">{tool.pricing}</span>
            </div>
          </div>
        </div>

        <a
          href={tool.url}
          target="_blank"
          rel="noreferrer"
          className="w-full md:w-auto text-center px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition shadow-lg shadow-cyan-500/20"
        >
          Launch Official Tool ↗
        </a>
      </div>

      <section className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3">
        <h2 className="text-xl font-bold text-white">Overview</h2>
        <p className="text-slate-300 leading-relaxed">{tool.description}</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tool.features.map((feat, i) => (
            <div key={i} className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-300 flex items-center gap-3">
              <span className="text-cyan-400 font-bold">✓</span> {feat}
            </div>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-emerald-950/20 border border-emerald-900/40 space-y-3">
          <h3 className="text-lg font-bold text-emerald-400">Pros</h3>
          <ul className="space-y-2 text-sm text-slate-300">
            {tool.pros.map((pro, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">+</span> {pro}
              </li>
            ))}
          </ul>
        </div>

        <div className="p-6 rounded-2xl bg-rose-950/20 border border-rose-900/40 space-y-3">
          <h3 className="text-lg font-bold text-rose-400">Cons</h3>
          <ul className="space-y-2 text-sm text-slate-300">
            {tool.cons.map((con, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">-</span> {con}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
