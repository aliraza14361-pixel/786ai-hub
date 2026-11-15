import Link from "next/link";
import { notFound } from "next/navigation";
import { BLOG_POSTS } from "../../../lib/blogs";

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) return { title: "Article Not Found | 786 AI Hub" };
  return {
    title: `${post.title} | 786 AI Hub`,
    description: post.description
  };
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) notFound();

  const related = BLOG_POSTS.filter((p) => p.slug !== post.slug).slice(0, 2);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: { "@type": "Organization", name: "786 AI Hub" }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 px-4 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between gap-3 mb-6">
          <Link href="/blog" className="text-sm text-cyan-400 hover:text-cyan-300 font-semibold">
            ← Back to All Guides
          </Link>
          <Link href="/" className="text-xs px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:border-cyan-500">
            50 AI Tools Directory
          </Link>
        </div>

        <header className="mb-8">
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mb-3">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 font-semibold">
              {post.category}
            </span>
            <span>• {post.readTime}</span>
            <span>• Updated {post.date}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight mb-3">
            {post.title}
          </h1>
          <p className="text-base text-slate-300 leading-relaxed">
            {post.description}
          </p>
        </header>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 mb-8">
          <div className="text-xs font-bold uppercase tracking-wider text-cyan-300 mb-3">
            Featured Tools in This Guide
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {post.featuredTools.map((tool, i) => (
              <Link
                key={i}
                href={tool.url}
                className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-400 transition flex items-center justify-between"
              >
                <span className="text-xs font-bold text-white">{tool.name}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-semibold">
                  {tool.badge}
                </span>
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          {post.sections.map((sec, idx) => (
            <section key={idx} className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-3">{sec.heading}</h2>
              {sec.paragraphs && sec.paragraphs.map((p, pIdx) => (
                <p key={pIdx} className="text-sm sm:text-base text-slate-300 leading-relaxed mb-3 last:mb-0">
                  {p}
                </p>
              ))}
              {sec.bullets && (
                <ul className="space-y-2.5 mt-2">
                  {sec.bullets.map((b, bIdx) => (
                    <li key={bIdx} className="flex items-start gap-2.5 text-sm sm:text-base text-slate-200 leading-relaxed">
                      <span className="text-cyan-400 font-bold mt-0.5">✓</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>

        <div className="my-10 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border border-cyan-400/40 rounded-2xl p-6 text-center">
          <h3 className="text-xl font-extrabold text-white mb-2">Put This Guide Into Action Right Now</h3>
          <p className="text-sm text-slate-300 mb-4">
            Open 786AI Studio to generate scripts, images, automation workflows, and live web apps in seconds.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/studio"
              className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-sm"
            >
              ✨ Open 786AI Studio
            </Link>
            <Link
              href="/"
              className="px-6 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-400 text-white font-bold text-sm"
            >
              Explore All 50 AI Tools
            </Link>
          </div>
        </div>

        {related.length > 0 && (
          <div className="pt-6 border-t border-slate-800">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">More AI Guides</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {related.map((item) => (
                <Link
                  key={item.slug}
                  href={`/blog/${item.slug}`}
                  className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 transition"
                >
                  <div className="text-xs text-cyan-300 font-semibold mb-1">{item.category}</div>
                  <div className="text-sm font-bold text-white">{item.title}</div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
