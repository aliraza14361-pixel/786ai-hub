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
            Platform Rules & Usage Guidelines
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-6">
            Terms of Service
          </h1>

          <div className="space-y-6 text-sm sm:text-base text-slate-300 leading-relaxed">
            <section className="space-y-2">
              <h2 className="text-lg font-bold text-white">1. Acceptance of Terms</h2>
              <p>
                By accessing or using <strong>786 AI Hub</strong> and <strong>786AI Studio</strong>, you agree to comply with these Terms of Service and all applicable laws. If you do not agree with any part of these terms, please discontinue use of the platform.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-white">2. AI Directory &amp; 786AI Studio Usage</h2>
              <p>
                786 AI Hub provides a curated catalog of third-party AI tools alongside native AI chat, canvas, and image generation utilities in 786AI Studio. You agree not to misuse the platform, attempt unauthorized access, or generate harmful content.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-white">3. AI-Generated Output Disclaimer</h2>
              <p>
                Responses, code, and images generated inside 786AI Studio are produced by artificial intelligence models for informational and productivity purposes. Always verify critical technical, legal, medical, or financial information independently.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-white">4. Tool Submissions &amp; Catalog Listings</h2>
              <p>
                All user-submitted AI tools are reviewed by 786 AI Hub administrators before publication. We reserve the right to edit descriptions, update pricing tags, or remove inactive listings.
              </p>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
