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
            Updated: November 2026
          </span>
        </div>

        <div className="bg-[#0e1422] border border-slate-800/90 rounded-3xl p-5 sm:p-8 shadow-2xl">
          <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 rounded-full mb-3">
            Data Protection & Transparency
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-6">
            Privacy Policy
          </h1>

          <div className="space-y-6 text-sm sm:text-base text-slate-300 leading-relaxed">
            <section className="space-y-2">
              <h2 className="text-lg font-bold text-white">1. Overview &amp; Commitment</h2>
              <p>
                At <strong>786 AI Hub</strong> (<code>786ai-hub.vercel.app</code>), your privacy is a core priority. We do not collect personally identifiable information without your explicit consent, nor do we sell, rent, or trade your personal data to third parties.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-white">2. Information We Collect</h2>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
                <li><strong>Account Information:</strong> When you sign in to access 786AI Studio, we store your name and email address via Supabase authentication to sync your workspace preferences.</li>
                <li><strong>Chat &amp; Workspace Data:</strong> Conversations and saved tool bookmarks are stored to provide continuity across sessions. You can delete your chat history anytime inside Studio.</li>
                <li><strong>Usage Analytics:</strong> We analyze aggregated, non-personal traffic statistics (such as page views, search queries, and tool clicks) to improve directory accuracy and site speed.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-white">3. Cookies &amp; Google AdSense Advertising</h2>
              <p>
                786 AI Hub uses browser storage and cookies to keep you signed in and remember theme and language settings. Third-party vendors, including Google, use cookies to serve ads based on a user&apos;s prior visits to this website or other websites on the internet. Users may opt out of personalized advertising by visiting Google Ads Settings.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-white">4. Third-Party AI Tools &amp; External Links</h2>
              <p>
                Our directory links to external AI platforms and software providers. Once you leave 786 AI Hub via an external link, that platform&apos;s own privacy policy applies.
              </p>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
