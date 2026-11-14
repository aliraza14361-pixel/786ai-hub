export const metadata = {
  title: "About Us | 786 AI Hub",
  description: "Learn about 786 AI Hub — a 100% free, clean, and ad-free directory of the best AI tools.",
};
export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white px-4 py-12">
      <div className="max-w-3xl mx-auto bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-10 shadow-xl space-y-6">
        <div className="flex items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-cyan-400">About 786 AI Hub</h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">100% Free & Ad-Free Curated AI Tools Directory</p>
          </div>
          <a href="/" className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition shrink-0">← Back to Home</a>
        </div>
        <div className="space-y-4 text-sm sm:text-base text-slate-300 leading-relaxed">
          <p><span className="text-white font-semibold">786 AI Hub</span> helps students, creators, developers, and everyday users discover the world’s most useful AI tools in one fast, clean, and 100% free platform.</p>
          <p>We organize top AI tools by category and clearly highlight whether each tool is <span className="text-emerald-400 font-medium">100% Free</span> or <span className="text-cyan-400 font-medium">Freemium</span>—with zero banner ads or paywalls.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800"><h2 className="text-cyan-400 font-semibold text-sm mb-1">100% Free & Clean</h2><p className="text-xs text-slate-400">No banner ads, popups, or paywalls. Browse and launch tools freely.</p></div>
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800"><h2 className="text-cyan-400 font-semibold text-sm mb-1">Curated Quality</h2><p className="text-xs text-slate-400">Every tool includes clear pricing tags, best use cases, and key features.</p></div>
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800"><h2 className="text-cyan-400 font-semibold text-sm mb-1">Community Driven</h2><p className="text-xs text-slate-400">Anyone can suggest useful free AI tools via our Submit page.</p></div>
        </div>
        <div className="pt-4 border-t border-slate-800 flex flex-wrap justify-between gap-3 text-xs text-slate-400">
          <div className="flex gap-4"><a href="/categories" className="text-cyan-400 hover:underline">Categories</a><a href="/submit" className="text-cyan-400 hover:underline">Submit a Tool</a><a href="/contact" className="text-cyan-400 hover:underline">Contact Us</a></div>
          <span>786 AI Hub © 2026</span>
        </div>
      </div>
    </div>
  );
}