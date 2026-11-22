"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const MINI_TOOLS = [
  {
    id: "prompt-enhancer",
    name: "AI Prompt Enhancer",
    category: "Prompts",
    badge: "#1 Hot",
    baseUses: 1420,
    placeholder: "e.g., Create a 30-day workout plan for beginners at home...",
    description: "Turn any 1-line idea into 3 structured, high-performing prompts for ChatGPT, Gemini, or Claude.",
  },
  {
    id: "reels-hook-maker",
    name: "Viral Reels & TikTok Hook Maker",
    category: "Video & Reels",
    badge: "#2 Hot",
    baseUses: 1185,
    placeholder: "e.g., 5 free AI websites that save 10 hours every week...",
    description: "Generate 10 scroll-stopping 3-second opening hooks and a 30-second short video script.",
  },
  {
    id: "seo-geo-outliner",
    name: "SEO & AI Search Article Outliner",
    category: "SEO & Writing",
    badge: "#3 Hot",
    baseUses: 940,
    placeholder: "e.g., Best free AI video generators in 2026...",
    description: "Build a complete Google SEO + GEO article outline with H1s, meta description, headings, and FAQs.",
  },
  {
    id: "youtube-title-maker",
    name: "High-CTR YouTube Title & Thumbnail Maker",
    category: "Video & Reels",
    badge: "#4 Hot",
    baseUses: 830,
    placeholder: "e.g., How to build a website using only an Android phone...",
    description: "Get 8 curiosity-driven YouTube titles and 3 high-contrast thumbnail concepts.",
  },
  {
    id: "freelance-proposal",
    name: "Winning Freelance Proposal Writer",
    category: "Business",
    badge: "#5 Hot",
    baseUses: 690,
    placeholder: "e.g., Need a Next.js developer to fix Supabase auth and deploy on Vercel...",
    description: "Write a short, persuasive client pitch under 180 words without robotic fluff.",
  },
  {
    id: "ai-tool-idea",
    name: "Micro-SaaS & AI Tool Idea Generator",
    category: "Business",
    badge: "#6 Hot",
    baseUses: 540,
    placeholder: "e.g., Real estate agents or e-commerce sellers...",
    description: "Discover 5 niche AI mini-tool ideas with target audience and monetization angles.",
  },
];

const CATEGORIES = ["All", "Prompts", "Video & Reels", "SEO & Writing", "Business"];

export default function MiniToolsClient() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [activeTool, setActiveTool] = useState(MINI_TOOLS[0]);
  const [userInput, setUserInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [localCounts, setLocalCounts] = useState({});

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = JSON.parse(localStorage.getItem("786ai_minitool_uses") || "{}");
        setLocalCounts(saved);
      } catch {}
    }
  }, []);

  const filteredTools = MINI_TOOLS.filter((t) => {
    const matchCat = selectedCategory === "All" || t.category === selectedCategory;
    const matchQuery =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchQuery;
  });

  async function handleGenerate(e) {
    e.preventDefault();
    if (!userInput.trim() || loading) return;

    setLoading(true);
    setError("");
    setOutput("");
    setCopied(false);

    try {
      const res = await fetch("/api/mini-tools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toolId: activeTool.id, userInput }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
      } else {
        setOutput(data.text || "");
        const updated = {
          ...localCounts,
          [activeTool.id]: (localCounts[activeTool.id] || 0) + 1,
        };
        setLocalCounts(updated);
        if (typeof window !== "undefined") {
          localStorage.setItem("786ai_minitool_uses", JSON.stringify(updated));
        }
      }
    } catch {
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }

  function handleCopy() {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Top Breadcrumb */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/" className="text-sm text-emerald-400 hover:underline">
            ← Back to 786 AI Hub Directory
          </Link>
          <span className="text-xs px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 font-semibold">
            Free Instant AI Utilities
          </span>
        </div>

        {/* Hero Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Hot AI Mini-Tools
          </h1>
          <p className="text-slate-400 mt-2 max-w-2xl">
            Single-purpose, fast AI tools built into 786 AI Hub. Pick a tool below, enter your topic, and generate instant results free.
          </p>
        </div>

        {/* Interactive Runner Box */}
        <div className="mb-10 rounded-2xl border border-slate-800 bg-slate-900/90 p-5 sm:p-6 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-800">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                Active Mini-Tool • {activeTool.category}
              </span>
              <h2 className="text-xl font-bold text-white mt-0.5">{activeTool.name}</h2>
            </div>
            <span className="text-xs text-slate-400">
              {(activeTool.baseUses + (localCounts[activeTool.id] || 0)).toLocaleString()} runs
            </span>
          </div>

          <form onSubmit={handleGenerate} className="mt-4 space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Your Topic / Input
              </label>
              <textarea
                rows={3}
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder={activeTool.placeholder}
                className="w-full rounded-xl bg-slate-950 border border-slate-700 px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center justify-between gap-3">
              <span className="text-xs text-slate-500">{userInput.length}/1500</span>
              <button
                type="submit"
                disabled={loading || !userInput.trim()}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold text-sm transition"
              >
                {loading ? "Generating..." : "Generate Free →"}
              </button>
            </div>
          </form>

          {error && (
            <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
              {error}
            </div>
          )}

          {output && (
            <div className="mt-5 rounded-xl bg-slate-950 border border-slate-800 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-emerald-400">Generated Result</span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="text-xs px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200"
                >
                  {copied ? "Copied!" : "Copy Result"}
                </button>
              </div>
              <pre className="whitespace-pre-wrap font-sans text-sm text-slate-200 leading-relaxed">
                {output}
              </pre>
            </div>
          )}
        </div>

        {/* Search & Category Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition ${
                  selectedCategory === cat
                    ? "bg-emerald-500 text-slate-950"
                    : "bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search mini-tools..."
            className="rounded-xl bg-slate-900 border border-slate-800 px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 sm:w-64"
          />
        </div>

        {/* Hot Mini-Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTools.map((tool) => {
            const isSelected = activeTool.id === tool.id;
            const totalUses = tool.baseUses + (localCounts[tool.id] || 0);
            return (
              <div
                key={tool.id}
                onClick={() => {
                  setActiveTool(tool);
                  setOutput("");
                  setError("");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`cursor-pointer rounded-2xl p-5 border transition flex flex-col justify-between ${
                  isSelected
                    ? "bg-slate-900 border-emerald-500 shadow-lg shadow-emerald-500/10"
                    : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-2.5">
                    <span className="font-bold text-amber-400">{tool.badge}</span>
                    <span className="text-slate-400">{totalUses.toLocaleString()} uses</span>
                  </div>
                  <h3 className="font-bold text-base text-white">{tool.name}</h3>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                    {tool.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] px-2.5 py-0.5 rounded bg-slate-800 text-slate-300">
                    {tool.category}
                  </span>
                  <span className="text-xs font-semibold text-emerald-400">
                    {isSelected ? "Active ↑" : "Use Tool →"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
