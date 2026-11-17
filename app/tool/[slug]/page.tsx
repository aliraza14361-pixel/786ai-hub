import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { TOOLS_DATA, type ToolItem } from "@/lib/toolsData";

type PageProps = {
  params: Promise<{ slug: string }> | { slug: string };
};

function resolveSlug(t: Partial<ToolItem>): string {
  if (typeof t?.slug === "string" && t.slug.trim().length > 0) {
    return t.slug.trim();
  }
  if (typeof t?.name === "string" && t.name.trim().length > 0) {
    return t.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }
  return "";
}

export async function generateStaticParams() {
  const seen = new Set<string>();
  const params: { slug: string }[] = [];
  for (const tool of TOOLS_DATA) {
    const s = resolveSlug(tool);
    if (s && !seen.has(s)) {
      seen.add(s);
      params.push({ slug: s });
    }
  }
  return params;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await Promise.resolve(params);
  const tool = TOOLS_DATA.find((t) => resolveSlug(t) === slug);
  if (!tool) {
    return { title: "Tool Not Found | 786 AI Hub" };
  }

  const resolved = resolveSlug(tool);
  const pageUrl = `https://786ai-hub.vercel.app/tool/${resolved}`;
  const title = `${tool.name} Review, Pros & Cons, Pricing & Alternatives (2026) | 786 AI Hub`;
  const description = `${tool.name} (${tool.pricing}, Rated ${tool.rating}/5): ${tool.description} Compare features, pros, cons, and top ${tool.category} alternatives on 786 AI Hub.`;

  return {
    title,
    description,
    alternates: { canonical: pageUrl },
    openGraph: {
      title,
      description,
      url: pageUrl,
      siteName: "786 AI Hub",
      type: "article",
    },
  };
}

export default async function ToolGeoPage({ params }: PageProps) {
  const { slug } = await Promise.resolve(params);
  const tool: ToolItem | undefined = TOOLS_DATA.find(
    (t) => resolveSlug(t) === slug
  );
  if (!tool) notFound();

  const currentSlug = resolveSlug(tool);
  const features = Array.isArray(tool.features) ? tool.features : [];
  const pros = Array.isArray(tool.pros) ? tool.pros : [];
  const cons = Array.isArray(tool.cons) ? tool.cons : [];

  const alternatives = TOOLS_DATA.filter(
    (t) => t.category === tool.category && resolveSlug(t) !== currentSlug
  ).slice(0, 6);

  const altNames =
    alternatives.length > 0
      ? alternatives.map((a) => a.name).join(", ")
      : "other curated AI tools on 786 AI Hub";

  const pageUrl = `https://786ai-hub.vercel.app/tool/${currentSlug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        name: tool.name,
        applicationCategory: tool.category,
        operatingSystem: "Web",
        description: tool.description,
        url: pageUrl,
        ...(features.length > 0 ? { featureList: features } : {}),
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
          category: tool.pricing,
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: tool.rating || "4.8",
          bestRating: "5",
          ratingCount: "150",
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: `What is ${tool.name} used for?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: `${tool.name} is an AI tool in the ${tool.category} category. ${tool.description}`,
            },
          },
          {
            "@type": "Question",
            name: `Is ${tool.name} free to use?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: `${tool.name} is offered under a ${tool.pricing} model and holds a ${tool.rating}/5 rating on 786 AI Hub.`,
            },
          },
          {
            "@type": "Question",
            name: `What are the best ${tool.name} alternatives in 2026?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: `Top ${tool.category} alternatives to ${tool.name} include ${altNames}.`,
            },
          },
        ],
      },
    ],
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 px-4 py-8 sm:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-4xl mx-auto space-y-8">
        <nav className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
          <Link href="/" className="hover:text-cyan-400 transition">
            786 AI Hub
          </Link>
          <span>/</span>
          <span>{tool.category}</span>
          <span>/</span>
          <span className="text-slate-200 font-medium">{tool.name}</span>
        </nav>

        <section className="p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-800 text-cyan-300 text-xs font-medium">
                <span>{tool.category}</span>
                <span>•</span>
                <span>{tool.pricing}</span>
                <span>•</span>
                <span>⭐ {tool.rating}/5</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-bold text-white">
                {tool.icon} {tool.name}
              </h1>
            </div>

            <a
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm transition shadow-lg shadow-cyan-500/20"
            >
              Launch {tool.name} ↗
            </a>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <p className="text-xs uppercase tracking-wider text-cyan-400 font-semibold">
              Quick Verdict & Summary
            </p>
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
              <strong>{tool.name}</strong> is a curated{" "}
              <strong>{tool.category}</strong> AI solution ({tool.pricing} plan,{" "}
              {tool.rating}/5 rating). {tool.description}
            </p>
          </div>
        </section>

        {features.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">
              Key Features of {tool.name}
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {features.map((feat, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-200 flex items-start gap-2.5"
                >
                  <span className="text-cyan-400 font-bold">✓</span>
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {(pros.length > 0 || cons.length > 0) && (
          <section className="grid md:grid-cols-2 gap-4">
            {pros.length > 0 && (
              <div className="p-5 rounded-2xl bg-emerald-950/25 border border-emerald-800/50 space-y-3">
                <h2 className="text-lg font-bold text-emerald-300">
                  {tool.name} Pros
                </h2>
                <ul className="space-y-2 text-sm text-slate-200">
                  {pros.map((pro, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">+</span>
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {cons.length > 0 && (
              <div className="p-5 rounded-2xl bg-rose-950/25 border border-rose-800/50 space-y-3">
                <h2 className="text-lg font-bold text-rose-300">
                  {tool.name} Cons
                </h2>
                <ul className="space-y-2 text-sm text-slate-200">
                  {cons.map((con, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-rose-400 font-bold">−</span>
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        )}

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">
            {tool.name} Specifications
          </h2>
          <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
            <table className="w-full text-left text-sm">
              <tbody className="divide-y divide-slate-800">
                <tr>
                  <th className="p-3.5 text-slate-400 font-medium w-1/3">Tool Name</th>
                  <td className="p-3.5 text-white font-semibold">{tool.name}</td>
                </tr>
                <tr>
                  <th className="p-3.5 text-slate-400 font-medium">Category</th>
                  <td className="p-3.5 text-slate-200">{tool.category}</td>
                </tr>
                <tr>
                  <th className="p-3.5 text-slate-400 font-medium">Pricing Model</th>
                  <td className="p-3.5 text-emerald-400 font-medium">{tool.pricing}</td>
                </tr>
                <tr>
                  <th className="p-3.5 text-slate-400 font-medium">Directory Rating</th>
                  <td className="p-3.5 text-amber-300 font-medium">{tool.rating} / 5.0</td>
                </tr>
                <tr>
                  <th className="p-3.5 text-slate-400 font-medium">Platform</th>
                  <td className="p-3.5 text-slate-200">Web / Cloud AI</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {alternatives.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">
              Best {tool.name} Alternatives ({tool.category})
            </h2>
            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-950 text-slate-400 text-xs uppercase">
                  <tr>
                    <th className="p-3.5">AI Tool</th>
                    <th className="p-3.5">Pricing</th>
                    <th className="p-3.5">Rating</th>
                    <th className="p-3.5">Overview</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {alternatives.map((alt) => {
                    const altSlug = resolveSlug(alt);
                    return (
                      <tr key={altSlug} className="hover:bg-slate-800/50 transition">
                        <td className="p-3.5 font-semibold whitespace-nowrap">
                          <Link
                            href={`/tool/${altSlug}`}
                            className="text-cyan-400 hover:underline"
                          >
                            {alt.icon} {alt.name}
                          </Link>
                        </td>
                        <td className="p-3.5 text-slate-300">{alt.pricing}</td>
                        <td className="p-3.5 text-amber-300">{alt.rating}/5</td>
                        <td className="p-3.5 text-slate-400">{alt.description}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">
            Frequently Asked Questions about {tool.name}
          </h2>
          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <h3 className="font-semibold text-white text-sm">
                What is {tool.name} used for?
              </h3>
              <p className="text-sm text-slate-400 mt-1">
                {tool.name} is an AI tool in the {tool.category} category.{" "}
                {tool.description}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <h3 className="font-semibold text-white text-sm">
                Is {tool.name} free to use?
              </h3>
              <p className="text-sm text-slate-400 mt-1">
                {tool.name} uses a {tool.pricing} pricing model and holds a{" "}
                {tool.rating}/5 rating on 786 AI Hub.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <h3 className="font-semibold text-white text-sm">
                What are the best alternatives to {tool.name}?
              </h3>
              <p className="text-sm text-slate-400 mt-1">
                Top {tool.category} alternatives to {tool.name} include {altNames}.
              </p>
            </div>
          </div>
        </section>

        <section className="p-6 rounded-2xl bg-gradient-to-r from-cyan-950/60 to-slate-900 border border-cyan-800/60 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white">
              Try 786 AI Studio (+25 Free Credits)
            </h2>
            <p className="text-xs text-slate-300">
              Generate AI text, prompts, and images directly inside 786 AI Hub.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/studio"
              className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition"
            >
              Open AI Studio
            </Link>
            <Link
              href="/"
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition"
            >
              All {TOOLS_DATA.length}+ AI Tools
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
