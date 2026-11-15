"use client";
import Link from "next/link";

export default function LegalPage() {
  return (
    <main className="min-h-screen bg-[#080c14] text-slate-100 px-4 pt-6 pb-32">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between gap-3 mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 text-xs font-semibold text-cyan-300 transition"
          >
            ← Back to 786 AI Hub
          </Link>
          <span className="text-[11px] text-slate-400 bg-slate-900/80 border border-slate-800 px-3 py-1 rounded-full">
            {updated}
          </span>
        </div>

        <div className="bg-[#0e1422] border border-slate-800/90 rounded-3xl p-5 sm:p-8 shadow-2xl">
          <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 rounded-full mb-3">
            {badge}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-6">
            Affiliate Disclosure
          </h1>

          <div className="space-y-6 text-sm sm:text-base text-slate-300 leading-relaxed">
            <section className="space-y-2">
              <h2 className="text-lg font-bold text-white">1. Full Transparency Statement</h2>
              <p>
                <strong>786 AI Hub</strong> participates in selected affiliate marketing and partner programs. This means that when you click on certain outbound &quot;Launch Tool&quot; or partner links on our website and sign up or purchase a subscription, we may earn a referral commission at <strong>zero extra cost to you</strong>.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-white">2. How Affiliate Commissions Support This Platform</h2>
              <p>
                Referral commissions help fund server hosting, database infrastructure, research, and free access to <strong>786AI Studio</strong> so visitors can browse our 50+ AI tools directory and use native AI utilities without mandatory paywalls.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-white">3. Strict Editorial Independence</h2>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
                <li><strong>Merit-Based Listings:</strong> Tools are curated and categorized based on real utility, reliability, and user value—never solely because of an affiliate partnership.</li>
                <li><strong>Honest Pricing Labels:</strong> We clearly mark Free, Freemium, and Paid tools so you always know what to expect before visiting a provider&apos;s site.</li>
                <li><strong>No Extra Cost Guarantee:</strong> Prices remain identical whether you visit a vendor directly or through a 786 AI Hub referral link.</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
