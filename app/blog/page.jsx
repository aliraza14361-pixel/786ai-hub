import Link from "next/link";
import { BLOG_POSTS } from "../../lib/blogs";

export const metadata = {
  title: "AI Tutorials, Guides & Workflows (2026) | 786 AI Hub",
  description: "Step-by-step AI tutorials, automation workflows, voiceover guides, and free prompt templates by 786 AI Hub."
};

export default function BlogIndexPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 px-4 py-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <span className="inline-block px-3 py-1 text-xs font-bold rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 mb-2">
              786 AI HUB • TUTORIALS & GUIDES
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white">AI Guides & Automation Blog</h1>
            <p className="text-slate-400 text-sm mt-2 max-w-2xl">
              Practical tutorials on AI tools, no-code automation, faceless video creation, and building apps faster.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/studio"
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm"
            >
              ✨ Open 786AI Studio
            </Link>
            <Link
              href="/"
              className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-200 hover:border-cyan-500"
            >
              ← 50 AI Tools
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {BLOG_POSTS.map((post) => (
            <article
              key={post.slug}
              className="bg-slate-900/90 border border-slate-800 hover:border-cyan-500/60 rounded-2xl p-6 flex flex-col justify-between transition"
            >
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 font-semibold">
                    {post.category}
                  </span>
                  <span>• {post.readTime}</span>
                  <span>• {post.date}</span>
                </div>
                <Link href={`/blog/${post.slug}`}>
                  <h2 className="text-xl font-bold text-white hover:text-cyan-300 transition mb-2">
                    {post.title}
                  </h2>
                </Link>
                <p className="text-sm text-slate-400 leading-relaxed mb-4">
                  {post.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <div className="flex flex-wrap gap-1.5">
                  {post.featuredTools.slice(0, 2).map((t, i) => (
                    <span key={i} className="text-[11px] px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-300">
                      {t.name}
                    </span>
                  ))}
                </div>
                <Link
                  href={`/blog/${post.slug}`}
                  className="text-sm font-bold text-cyan-400 hover:text-cyan-300 shrink-0 ml-2"
                >
                  Read Guide →
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 bg-gradient-to-r from-cyan-500/15 via-blue-500/15 to-slate-900 border border-cyan-500/30 rounded-2xl p-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-extrabold text-white">Try Every Workflow Live in 786AI Studio</h3>
            <p className="text-sm text-slate-300 mt-1">
              Generate scripts, images, automation blueprints, and live web apps — 100% free with zero sign-up.
            </p>
          </div>
          <Link
            href="/studio"
            className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-sm"
          >
            Launch 786AI Studio →
          </Link>
        </div>
      </div>
    </div>
  );
}
