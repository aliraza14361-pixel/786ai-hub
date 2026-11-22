"use client";

import { useState } from "react";
import Link from "next/link";

const SIDEBAR_GROUPS = [
  {
    title: "AI Video",
    items: [
      "Text to Video",
      "Image to Video",
      "Reference to Video",
      "Video to Video",
      "Video Extend",
      "Motion Control",
      "Long Video",
      "Video Transition",
      "Video Lip Sync",
      "Music to Video",
      "Sound Effects",
      "Video Remover",
    ],
  },
  {
    title: "AI Image & Audio",
    items: ["Text to Image", "Image to Image", "Text to Speech", "AI Avatar"],
  },
];

const VIDEO_MODELS = [
  {
    id: "Seedance 2.0",
    badge: "HOT",
    badgeColor: "bg-amber-500 text-slate-950",
    tag: "Audio",
    specs: "480p - 1080p • 4s - 15s",
    desc: "Flagship multi-shot video generation with synchronized audio and realistic physics.",
    directorySlug: "/tool/runway",
  },
  {
    id: "Veo 3.1",
    badge: "PRO",
    badgeColor: "bg-emerald-500 text-slate-950",
    tag: "Audio • 4K",
    specs: "720p - 4K • 5s - 10s",
    desc: "Cinematic 4K video synthesis with native dialogue, sound effects, and fluid camera motion.",
    directorySlug: "/studio",
  },
  {
    id: "Sora 2",
    badge: "NEW",
    badgeColor: "bg-sky-400 text-slate-950",
    tag: "Audio",
    specs: "720p - 1080p • 5s - 15s",
    desc: "Photorealistic world simulation with consistent characters and natural lighting.",
    directorySlug: "/studio",
  },
  {
    id: "Kling 3.0",
    badge: "HOT",
    badgeColor: "bg-amber-500 text-slate-950",
    tag: "Motion",
    specs: "720p - 1080p • 5s - 10s",
    desc: "Expressive human motion, dynamic action scenes, and precise camera control.",
    directorySlug: "/tool/kling-ai",
  },
  {
    id: "Wan 2.6",
    badge: "FAST",
    badgeColor: "bg-purple-400 text-slate-950",
    tag: "Audio",
    specs: "480p - 1080p • 5s - 10s",
    desc: "High-speed open-weight video generation with crisp visual style adherence.",
    directorySlug: "/studio",
  },
  {
    id: "Hailuo 2.3",
    badge: "PRO",
    badgeColor: "bg-emerald-500 text-slate-950",
    tag: "25fps",
    specs: "720p - 1080p • 6s - 10s",
    desc: "Smooth storytelling shots with rich color grading and cinematic depth of field.",
    directorySlug: "/studio",
  },
];

const AI_VIDEO_TOOLS = [
  {
    name: "Motion Control",
    tag: "Director",
    desc: "Transfer exact camera paths and character movement from reference clips.",
  },
  {
    name: "Video Extend",
    tag: "Seamless",
    desc: "Extend any short video clip seamlessly while preserving scene continuity.",
  },
  {
    name: "Video Transition",
    tag: "Smooth",
    desc: "Generate fluid AI morph transitions between your start and end frames.",
  },
  {
    name: "AI Avatar",
    tag: "Talking",
    desc: "Create lifelike talking presenters from a single portrait photo and script.",
  },
  {
    name: "Video Lip Sync",
    tag: "Sync",
    desc: "Match mouth movements accurately to any voiceover or dialogue track.",
  },
  {
    name: "Sound Effects",
    tag: "Audio",
    desc: "Generate realistic foley, ambient soundscapes, and cinematic impacts.",
  },
];

const STAND_OUT_ITEMS = [
  {
    title: "Optimized Performance",
    desc: "Engineered for fast prompt-to-storyboard generation with zero lag on mobile or desktop.",
  },
  {
    title: "User-Friendly Interface",
    desc: "Switch between models, aspect ratios, and video tools in one clean studio dashboard.",
  },
  {
    title: "Reliable & Secure",
    desc: "Your prompts and creative concepts stay private with protected server-side processing.",
  },
  {
    title: "Creative Freedom",
    desc: "Full control over 16:9 widescreen, 9:16 TikTok/Reels, resolution, and scene pacing.",
  },
  {
    title: "All-in-One Ecosystem",
    desc: "Connected directly to 786 AI Hub's 50+ curated AI tools, Studio, and Mini-Tools.",
  },
  {
    title: "Commercial Ready",
    desc: "Build high-CTR YouTube, TikTok, Reels, and ad video workflows ready for production.",
  },
];

const FAQS = [
  {
    q: "What AI video models does 786 AI Video support?",
    a: "786 AI Video supports prompt engineering, shot-by-shot storyboards, and direct workflow routing for Seedance 2.0, Veo 3.1, Sora 2, Kling 3.0, Wan 2.6, and Hailuo 2.3—all from one interface.",
  },
  {
    q: "How long does it take to generate a video blueprint?",
    a: "786 AI Video generates your master video prompt, shot timeline, camera movement specs, and SFX cues in just 2 to 4 seconds.",
  },
  {
    q: "What video formats and aspect ratios are supported?",
    a: "You can configure 16:9 (YouTube/Web), 9:16 (TikTok, Instagram Reels, YouTube Shorts), 1:1 (Social), 4:3, and 21:9 cinema ratios across 480P, 720P, 1080P, and 4K settings.",
  },
  {
    q: "Can I use generated video prompts and scripts commercially?",
    a: "Yes. Everything generated on 786 AI Hub is 100% free to use for your YouTube channels, client ads, social media reels, and commercial projects.",
  },
];

export default function AiVideoClient() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeMode, setActiveMode] = useState("Text to Video");
  const [selectedModel, setSelectedModel] = useState("Seedance 2.0");
  const [aspectRatio, setAspectRatio] = useState("9:16");
  const [resolution, setResolution] = useState("1080P");
  const [duration, setDuration] = useState("5s");
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  async function handleGenerate(e) {
    e.preventDefault();
    if (!prompt.trim() || loading) return;

    setLoading(true);
    setError("");
    setResult("");
    setCopied(false);

    try {
      const res = await fetch("/api/ai-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          mode: activeMode,
          model: selectedModel,
          aspectRatio,
          resolution,
          duration,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to generate.");
      } else {
        setResult(data.text || "");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function copyResult() {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function scrollToGenerator(modeName, modelName) {
    if (modeName) setActiveMode(modeName);
    if (modelName) setSelectedModel(modelName);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  return (
    <div className="min-h-screen bg-[#090b10] text-slate-100 flex">
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/70 z-40 lg:hidden"
        />
      )}

      {/* Left Sidebar Navigation */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-[#0d1017] border-r border-slate-800/80 flex flex-col transition-transform duration-200 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950 font-black flex items-center justify-center text-sm">
              786
            </span>
            <div>
              <div className="font-extrabold text-sm text-white leading-none">786 AI Video</div>
              <div className="text-[10px] text-amber-400 mt-0.5">Multi-Model Studio</div>
            </div>
          </Link>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white text-sm px-2 py-1"
          >
            ✕
          </button>
        </div>

        <div className="p-3">
          <button
            type="button"
            onClick={() => {
              setPrompt("");
              setResult("");
              setSidebarOpen(false);
            }}
            className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-500/20 hover:opacity-95 transition"
          >
            + Create New Video
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 pb-6 space-y-5">
          {SIDEBAR_GROUPS.map((group) => (
            <div key={group.title}>
              <div className="px-2.5 mb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                {group.title}
              </div>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const active = activeMode === item;
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => {
                        setActiveMode(item);
                        setSidebarOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition flex items-center justify-between ${
                        active
                          ? "bg-amber-500/15 text-amber-300 border border-amber-500/30 font-semibold"
                          : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                      }`}
                    >
                      <span>{item}</span>
                      {active && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          <div className="pt-3 border-t border-slate-800/80 space-y-1">
            <Link
              href="/mini-tools/hot"
              className="block px-3 py-2 rounded-lg text-xs font-semibold text-emerald-400 hover:bg-slate-800/60"
            >
              🔥 Hot AI Mini-Tools
            </Link>
            <Link
              href="/studio"
              className="block px-3 py-2 rounded-lg text-xs font-semibold text-cyan-400 hover:bg-slate-800/60"
            >
              ✨ 786AI Studio
            </Link>
            <Link
              href="/"
              className="block px-3 py-2 rounded-lg text-xs text-slate-400 hover:bg-slate-800/60"
            >
              ← Main AI Directory
            </Link>
          </div>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0">
        {/* Top Mobile/Desktop Bar */}
        <header className="sticky top-0 z-30 bg-[#090b10]/90 backdrop-blur border-b border-slate-800/80 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden px-2.5 py-1.5 rounded-lg bg-slate-800/90 text-slate-200 text-xs font-semibold"
            >
              ☰ Menu
            </button>
            <span className="text-xs font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/25 px-2.5 py-1 rounded-full">
              {activeMode}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/studio"
              className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium"
            >
              Open Studio
            </Link>
            <Link
              href="/"
              className="text-xs px-3 py-1.5 rounded-lg bg-amber-500/15 text-amber-300 border border-amber-500/30 font-semibold"
            >
              786 AI Hub
            </Link>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 py-6 sm:py-8">
          {/* 1. Interactive Video Prompt & Controls Box */}
          <section className="rounded-2xl bg-[#121621] border border-slate-800 p-4 sm:p-6 shadow-2xl mb-10">
            <form onSubmit={handleGenerate}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  {activeMode} • {selectedModel}
                </span>
                <span className="text-[11px] text-slate-400">Free Unlimited Blueprints</span>
              </div>

              <textarea
                rows={3}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the video you want to create... (e.g., A lone red vintage tram gliding through a rain-soaked Tokyo street at blue hour, neon reflections, cinematic 4K)"
                className="w-full rounded-xl bg-[#090b10] border border-slate-700/80 px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />

              {/* Controls Toolbar (Model, Aspect Ratio, Resolution, Duration, Generate) */}
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  {/* Model Dropdown */}
                  <select
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    className="rounded-xl bg-[#1a2030] border border-slate-700 px-3 py-2 text-xs font-bold text-amber-300 focus:outline-none"
                  >
                    {VIDEO_MODELS.map((m) => (
                      <option key={m.id} value={m.id}>
                        ⚡ {m.id}
                      </option>
                    ))}
                  </select>

                  {/* Aspect Ratios */}
                  <div className="flex items-center rounded-xl bg-[#090b10] border border-slate-800 p-1">
                    {["16:9", "9:16", "1:1"].map((ratio) => (
                      <button
                        key={ratio}
                        type="button"
                        onClick={() => setAspectRatio(ratio)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${
                          aspectRatio === ratio
                            ? "bg-amber-500 text-slate-950"
                            : "text-slate-400 hover:text-white"
                        }`}
                      >
                        {ratio}
                      </button>
                    ))}
                  </div>

                  {/* Resolution */}
                  <div className="flex items-center rounded-xl bg-[#090b10] border border-slate-800 p-1">
                    {["720P", "1080P", "4K"].map((resOpt) => (
                      <button
                        key={resOpt}
                        type="button"
                        onClick={() => setResolution(resOpt)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${
                          resolution === resOpt
                            ? "bg-slate-700 text-white"
                            : "text-slate-400 hover:text-white"
                        }`}
                      >
                        {resOpt}
                      </button>
                    ))}
                  </div>

                  {/* Duration */}
                  <div className="flex items-center rounded-xl bg-[#090b10] border border-slate-800 p-1">
                    {["5s", "10s", "15s"].map((dur) => (
                      <button
                        key={dur}
                        type="button"
                        onClick={() => setDuration(dur)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${
                          duration === dur
                            ? "bg-slate-700 text-white"
                            : "text-slate-400 hover:text-white"
                        }`}
                      >
                        {dur}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Gold Generate Button */}
                <button
                  type="submit"
                  disabled={loading || !prompt.trim()}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 hover:opacity-95 disabled:opacity-50 text-slate-950 font-extrabold text-sm shadow-lg shadow-amber-500/20 transition"
                >
                  {loading ? "Generating..." : "Generate →"}
                </button>
              </div>
            </form>

            {error && (
              <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs">
                {error}
              </div>
            )}

            {result && (
              <div className="mt-5 rounded-xl bg-[#090b10] border border-amber-500/30 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2 border-b border-slate-800">
                  <span className="text-xs font-bold text-amber-400">
                    ✓ Ready for {selectedModel} ({aspectRatio} • {resolution} • {duration})
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={copyResult}
                      className="text-xs px-3 py-1 rounded-lg bg-amber-500 text-slate-950 font-bold"
                    >
                      {copied ? "Copied!" : "Copy Prompt & Plan"}
                    </button>
                    <Link
                      href="/studio"
                      className="text-xs px-3 py-1 rounded-lg bg-slate-800 text-cyan-300 font-semibold"
                    >
                      Run in 786AI Studio →
                    </Link>
                  </div>
                </div>
                <pre className="whitespace-pre-wrap font-sans text-xs sm:text-sm text-slate-200 leading-relaxed">
                  {result}
                </pre>
              </div>
            )}
          </section>

          {/* 2. Video Models Grid */}
          <section className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg sm:text-xl font-extrabold text-white">Video Models</h2>
              <span className="text-xs text-slate-400">Click any model to select</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {VIDEO_MODELS.map((m) => {
                const active = selectedModel === m.id;
                return (
                  <div
                    key={m.id}
                    onClick={() => scrollToGenerator(null, m.id)}
                    className={`cursor-pointer rounded-2xl p-4 border transition ${
                      active
                        ? "bg-[#171c2b] border-amber-400 shadow-lg shadow-amber-500/10"
                        : "bg-[#121621] border-slate-800/90 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white">{m.id}</span>
                        <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${m.badgeColor}`}>
                          {m.badge}
                        </span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {m.tag}
                      </span>
                    </div>
                    <div className="text-[11px] text-amber-400/90 font-medium mb-1.5">{m.specs}</div>
                    <p className="text-xs text-slate-400 leading-relaxed">{m.desc}</p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* 3. AI Tools Grid */}
          <section className="mb-14">
            <h2 className="text-lg sm:text-xl font-extrabold text-white mb-4">AI Tools</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {AI_VIDEO_TOOLS.map((tool) => (
                <div
                  key={tool.name}
                  onClick={() => scrollToGenerator(tool.name, null)}
                  className="cursor-pointer rounded-2xl p-4 bg-[#121621] border border-slate-800/90 hover:border-amber-500/50 transition"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-sm text-white">{tool.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 font-semibold">
                      {tool.tag}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{tool.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 4. Hero SEO Value Proposition */}
          <section className="text-center max-w-3xl mx-auto mb-14 px-2">
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              AI Video Generator – Create Videos with Multiple AI Models
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-3 leading-relaxed">
              786 AI Video brings top AI video generation workflows together—from Sora 2, Veo 3.1, Kling 3.0, Seedance 2.0, and Wan 2.6—all in one unified platform. Create stunning, professional-quality 4K video prompts and storyboards in seconds.
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-amber-300">
              <span>⚡ 6+ Video AI Models</span>
              <span>🎬 4K Quality Output</span>
              <span>🚀 Fast Generation</span>
            </div>
          </section>

          {/* 5. Transform Your Ideas Into Stunning Videos (3 Cards) */}
          <section className="mb-14">
            <h2 className="text-xl sm:text-2xl font-extrabold text-center text-white mb-6">
              Transform Your Ideas Into Stunning Videos
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-2xl bg-[#121621] border border-slate-800 p-5">
                <div className="text-amber-400 font-bold text-sm mb-1.5">Text to Video</div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Transform any text description into structured, cinematic AI video scenes with exact lens and lighting instructions.
                </p>
              </div>
              <div className="rounded-2xl bg-[#121621] border border-slate-800 p-5">
                <div className="text-amber-400 font-bold text-sm mb-1.5">Image to Video</div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Animate your static thumbnails, product photos, and AI artwork with natural camera pans and subject motion.
                </p>
              </div>
              <div className="rounded-2xl bg-[#121621] border border-slate-800 p-5">
                <div className="text-amber-400 font-bold text-sm mb-1.5">Advanced Controls</div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Fine-tune aspect ratios (16:9, 9:16, 1:1), resolutions up to 4K, and clip duration for perfect social media results.
                </p>
              </div>
            </div>
          </section>

          {/* 6. Why 786 AI Stands Out (6-Card Grid) */}
          <section className="mb-14">
            <h2 className="text-xl sm:text-2xl font-extrabold text-center text-white mb-2">
              Why 786 AI Stands Out
            </h2>
            <p className="text-xs text-slate-400 text-center mb-6">
              Built as an all-in-one AI creative platform for creators, marketers, and developers.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {STAND_OUT_ITEMS.map((item) => (
                <div key={item.title} className="rounded-2xl bg-[#121621] border border-slate-800 p-5">
                  <h3 className="font-bold text-sm text-white mb-1.5">{item.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 7. How to Use (3 Numbered Steps) */}
          <section className="mb-14 rounded-2xl bg-[#121621] border border-slate-800 p-6 text-center">
            <h2 className="text-xl sm:text-2xl font-extrabold text-white mb-6">
              How to Use 786 AI Video Generator
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-left mb-6">
              <div className="p-4 rounded-xl bg-[#090b10] border border-slate-800">
                <span className="inline-flex w-7 h-7 rounded-full bg-amber-500 text-slate-950 font-black text-xs items-center justify-center mb-2">
                  1
                </span>
                <h3 className="font-bold text-sm text-white">Choose Your Input & Model</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Enter your scene idea and pick Veo 3.1, Sora 2, Kling 3.0, or Seedance 2.0.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-[#090b10] border border-slate-800">
                <span className="inline-flex w-7 h-7 rounded-full bg-amber-500 text-slate-950 font-black text-xs items-center justify-center mb-2">
                  2
                </span>
                <h3 className="font-bold text-sm text-white">Customize Settings</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Select 9:16 Reels or 16:9 YouTube ratio, 1080P/4K resolution, and duration.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-[#090b10] border border-slate-800">
                <span className="inline-flex w-7 h-7 rounded-full bg-amber-500 text-slate-950 font-black text-xs items-center justify-center mb-2">
                  3
                </span>
                <h3 className="font-bold text-sm text-white">Generate & Create</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Click Generate to get your master video prompt, timeline, and SFX cues instantly.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => scrollToGenerator(null, null)}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-extrabold text-xs"
            >
              Try It Now ↑
            </button>
          </section>

          {/* 8. Frequently Asked Questions Accordion */}
          <section className="max-w-3xl mx-auto mb-14">
            <h2 className="text-xl sm:text-2xl font-extrabold text-center text-white mb-6">
              Frequently Asked Questions
            </h2>
            <div className="space-y-3">
              {FAQS.map((faq, idx) => (
                <div
                  key={faq.q}
                  className="rounded-xl bg-[#121621] border border-slate-800 overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                    className="w-full px-4 py-3.5 text-left flex items-center justify-between text-xs sm:text-sm font-bold text-white"
                  >
                    <span>{faq.q}</span>
                    <span className="text-amber-400 ml-2">{openFaq === idx ? "−" : "+"}</span>
                  </button>
                  {openFaq === idx && (
                    <div className="px-4 pb-4 text-xs text-slate-400 leading-relaxed border-t border-slate-800/60 pt-2.5">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* 9. Bottom Conversion Banner */}
          <section className="rounded-2xl bg-gradient-to-r from-[#171c2b] to-[#121621] border border-amber-500/30 p-6 sm:p-8 text-center">
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Ready to Transform Your Ideas Into Videos?
            </h2>
            <p className="text-xs text-slate-400 mt-2">
              Start creating cinematic AI video prompts and workflows on 786 AI Hub — no credit card required.
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => scrollToGenerator(null, null)}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-extrabold text-xs"
              >
                Start Creating Now
              </button>
              <Link
                href="/"
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
              >
                Explore 50+ AI Tools
              </Link>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
