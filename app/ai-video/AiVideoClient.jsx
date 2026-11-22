"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

const SIDEBAR_GROUPS = [
  {
    title: "AI VIDEO",
    items: [
      "Text to Video",
      "Image to Video",
      "Video to Video",
      "Video Extend",
      "Video Transition",
      "Reference to Video",
      "Long Video",
      "Music to Video",
      "Motion Control",
      "Video Effects",
    ],
  },
  {
    title: "AI IMAGE",
    items: ["Text to Image", "Image to Image"],
  },
  {
    title: "AI MUSIC & VOICE",
    items: ["Music Maker", "Text to Speech", "Text to Dialogue", "Speech to Text"],
  },
];

const ALL_MODELS = [
  { id: "Seedance 2.0", badge: "NEW", tag: "Audio", iconBg: "from-amber-400 to-orange-500", code: "S2", specs: "480p - 1080p • 4s - 15s", desc: "Multi-shot video generation with synchronized audio and physics." },
  { id: "Seedance 2.5", badge: "HOT", tag: "Audio", iconBg: "from-amber-500 to-orange-600", code: "2.5", specs: "4-30s • Multimodal", desc: "Multimodal video engine with image, video, and audio reference." },
  { id: "Veo 3.1", badge: "PRO", tag: "Audio", iconBg: "from-blue-500 to-indigo-600", code: "G", specs: "720p - 1080p • 4s - 8s", desc: "Latest Veo with improved quality, dialogue, and sound effects." },
  { id: "Veo 3", badge: "", tag: "Audio", iconBg: "from-sky-400 to-blue-600", code: "G", specs: "720p - 1080p • 4s - 8s", desc: "Flagship video model with stunning realism and native sound." },
  { id: "Sora 2", badge: "NEW", tag: "Audio", iconBg: "from-zinc-300 to-zinc-600", code: "S2", specs: "720p • 4s - 12s", desc: "Enhanced stability, realistic reflections, and world simulation." },
  { id: "Kling 3.0", badge: "NEW", tag: "Audio", iconBg: "from-emerald-400 to-teal-600", code: "K3", specs: "720p - 1080p • 5s - 15s", desc: "Native audio, multi-shot choreography, and element references." },
  { id: "Kling 2.6", badge: "", tag: "Motion", iconBg: "from-teal-500 to-cyan-700", code: "K2", specs: "720p - 1080p • 5s - 10s", desc: "High-quality video generation with strong motion control." },
  { id: "Wan 3.0", badge: "NEW", tag: "Omni", iconBg: "from-fuchsia-500 to-purple-700", code: "W3", specs: "1080p • 5s - 15s", desc: "All-in-one video model with image, video, and audio inputs." },
  { id: "Wan 2.7", badge: "NEW", tag: "Ref", iconBg: "from-purple-500 to-indigo-600", code: "W7", specs: "1080p • 5s - 15s", desc: "Advanced reference-guided video model with high consistency." },
  { id: "Wan 2.6", badge: "", tag: "V2V", iconBg: "from-violet-500 to-purple-700", code: "W2", specs: "720p - 1080p • 5s - 15s", desc: "Text, image & video to video with flexible camera duration." },
  { id: "HappyHorse 1.0", badge: "NEW", tag: "Ref", iconBg: "from-teal-400 to-emerald-600", code: "HH", specs: "720p - 1080p • 5s - 10s", desc: "Multi-mode character animation and dynamic tracking shots." },
  { id: "MiniMax H3 Max", badge: "", tag: "Video", iconBg: "from-pink-500 to-purple-600", code: "H3", specs: "480p - 768p • 6-10s", desc: "Expressive motion and cinematic storytelling video engine." },
  { id: "Seedance 2.0 Mini", badge: "", tag: "Fast", iconBg: "from-indigo-500 to-blue-600", code: "SM", specs: "480p - 720p", desc: "Lightweight high-speed Seedance model for rapid drafts." },
  { id: "Seedance 1.5 Pro", badge: "PRO", tag: "Audio", iconBg: "from-amber-600 to-yellow-500", code: "1.5", specs: "480p - 1080p • 4s - 12s", desc: "Reliable video model with synchronized audio generation." },
  { id: "GPT Image 2.5", badge: "NEW", tag: "Image", iconBg: "from-emerald-500 to-green-700", code: "GP", specs: "2K - 4K • Reference", desc: "Fast and detailed image generation with multi-image reference." },
  { id: "Nano Banana 2.1", badge: "NEW", tag: "Edit", iconBg: "from-yellow-400 to-amber-500", code: "G", specs: "Up to 14 Refs", desc: "Generate or edit images with up to 14 visual references." },
  { id: "Suno V5", badge: "", tag: "Music", iconBg: "from-orange-500 to-rose-600", code: "SV", specs: "Vocals & Score", desc: "Create original songs, melodies, and background soundtracks." },
  { id: "ElevenLabs", badge: "", tag: "Voice", iconBg: "from-zinc-200 to-zinc-400", code: "11", specs: "TTS & Dialogue", desc: "Lifelike AI voice generation, narration, and sound cues." },
];

const AI_TOOLS = [
  { name: "Motion Control", badge: "NEW", icon: "🎯", desc: "Control camera and object motion in video generation." },
  { name: "Video Extend", badge: "", icon: "⏩", desc: "Extend the duration of your generated videos seamlessly." },
  { name: "Video Transition", badge: "", icon: "🔀", desc: "Create smooth transitions between two video clips or images." },
  { name: "AI Avatar", badge: "NEW", icon: "🧑‍💼", desc: "Create talking avatar videos from a photo and audio." },
  { name: "Lip Sync", badge: "NEW", icon: "🗣️", desc: "Sync lip movements to audio accurately." },
  { name: "Sound Effects", badge: "NEW", icon: "🔊", desc: "Generate custom AI sound effects from text descriptions." },
  { name: "Noise Remover", badge: "NEW", icon: "🧹", desc: "Remove background noise and isolate clean audio from recordings." },
];

function drawCoverImage(ctx, img, width, height, scale, panX, panY, alpha = 1) {
  ctx.save();
  ctx.globalAlpha = alpha;
  const imgRatio = img.width / img.height;
  const canvasRatio = width / height;
  let drawW = width * scale;
  let drawH = height * scale;
  if (imgRatio > canvasRatio) {
    drawW = drawH * imgRatio;
  } else {
    drawH = drawW / imgRatio;
  }
  const x = (width - drawW) / 2 + panX;
  const y = (height - drawH) / 2 + panY;
  ctx.drawImage(img, x, y, drawW, drawH);
  ctx.restore();
}

async function renderBrowserMotionVideo({ frames = [], frameDataUrl, aspectRatio, durationSec }) {
  const isPortrait = aspectRatio === "9:16" || aspectRatio === "3:4";
  const isSquare = aspectRatio === "1:1";
  const width = isPortrait ? 540 : isSquare ? 720 : 960;
  const height = isPortrait ? 960 : isSquare ? 720 : 540;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  const sources = frames.length > 0 ? frames : frameDataUrl ? [frameDataUrl] : [];
  const loadedImages = [];

  for (const src of sources) {
    const img = await new Promise((resolve) => {
      const el = new Image();
      el.crossOrigin = "anonymous";
      el.onload = () => resolve(el);
      el.onerror = () => resolve(null);
      el.src = src;
    });
    if (img) loadedImages.push(img);
  }

  const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
    ? "video/webm;codecs=vp9"
    : MediaRecorder.isTypeSupported("video/webm")
    ? "video/webm"
    : "";

  if (!mimeType || typeof canvas.captureStream !== "function") {
    throw new Error("Video encoder unavailable on this browser.");
  }

  const stream = canvas.captureStream(30);
  const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 3000000 });
  const chunks = [];

  recorder.ondataavailable = (ev) => {
    if (ev.data && ev.data.size > 0) chunks.push(ev.data);
  };

  const totalFrames = Math.max(150, Math.min(durationSec, 10) * 30);

  return new Promise((resolve) => {
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: "video/webm" });
      resolve(URL.createObjectURL(blob));
    };

    recorder.start();
    let frame = 0;

    function drawFrame() {
      const progress = frame / totalFrames;
      ctx.fillStyle = "#09090b";
      ctx.fillRect(0, 0, width, height);

      if (loadedImages.length > 0) {
        const count = loadedImages.length;
        const scaledPos = progress * count;
        const idx = Math.min(count - 1, Math.floor(scaledPos));
        const nextIdx = Math.min(count - 1, idx + 1);
        const localT = scaledPos - idx;

        const dir = idx % 2 === 0 ? 1 : -1;
        const scale1 = 1.04 + localT * 0.14;
        const panX1 = dir * (localT - 0.5) * 36;
        const panY1 = (localT - 0.5) * 18;

        drawCoverImage(ctx, loadedImages[idx], width, height, scale1, panX1, panY1, 1);

        if (nextIdx !== idx && localT > 0.72) {
          const fadeAlpha = (localT - 0.72) / 0.28;
          drawCoverImage(ctx, loadedImages[nextIdx], width, height, 1.04, -dir * -18, -9, fadeAlpha);
        }
      } else {
        const grad = ctx.createLinearGradient(0, 0, width, height);
        grad.addColorStop(0, "#0f172a");
        grad.addColorStop(0.5, "#1d4ed8");
        grad.addColorStop(1, "#0284c7");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
      }

      frame += 1;
      if (frame <= totalFrames) {
        requestAnimationFrame(drawFrame);
      } else {
        recorder.stop();
      }
    }

    requestAnimationFrame(drawFrame);
  });
}

export default function AiVideoClient() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeMode, setActiveMode] = useState("Text to Video");
  const [selectedModel, setSelectedModel] = useState("Seedance 2.0");
  const [refTab, setRefTab] = useState("Omni Reference");
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [duration, setDuration] = useState(5);
  const [resolution, setResolution] = useState("1080p");
  const [prompt, setPrompt] = useState("");
  const [refPreview, setRefPreview] = useState("");
  const [refBase64, setRefBase64] = useState("");
  const [refMime, setRefMime] = useState("image/png");

  const [loading, setLoading] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [engineUsed, setEngineUsed] = useState("");
  const [error, setError] = useState("");

  const fileInputRef = useRef(null);
  const pollTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (pollTimerRef.current) clearInterval(pollTimerRef.current);
    };
  }, []);

  function handleFileUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setRefMime(file.type || "image/png");
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result || "");
      setRefPreview(dataUrl);
      const commaIdx = dataUrl.indexOf(",");
      if (commaIdx !== -1) setRefBase64(dataUrl.slice(commaIdx + 1));
      if (activeMode === "Text to Video") setActiveMode("Image to Video");
    };
    reader.readAsDataURL(file);
  }

  function enhancePrompt() {
    if (!prompt.trim()) {
      setPrompt(
        "Cinematic drone shot of a futuristic sports car speeding along a neon-lit coastal highway at sunset, dramatic reflections, ultra-realistic 4K motion"
      );
      return;
    }
    if (!prompt.toLowerCase().includes("cinematic")) {
      setPrompt(
        `${prompt.trim()}, cinematic 4K lighting, smooth dynamic camera motion, ultra-realistic details`
      );
    }
  }

  async function handleGenerate(e) {
    e.preventDefault();
    if (!prompt.trim() || loading) return;

    if (pollTimerRef.current) clearInterval(pollTimerRef.current);
    setLoading(true);
    setError("");
    setVideoUrl("");
    setEngineUsed("");
    setStatusText("Generating AI scenes for your video...");

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
          duration: `${duration}s`,
          imageBase64: refBase64 || undefined,
          imageMimeType: refMime,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Video generation failed.");
        setLoading(false);
        return;
      }

      if (data.status === "processing" && data.operationName) {
        setStatusText(`Rendering MP4 video with ${data.engine}...`);
        pollTimerRef.current = setInterval(async () => {
          try {
            const pRes = await fetch(`/api/ai-video?op=${encodeURIComponent(data.operationName)}`);
            const pData = await pRes.json();
            if (pData.status === "completed" && pData.videoUrl) {
              clearInterval(pollTimerRef.current);
              setVideoUrl(pData.videoUrl);
              setEngineUsed(data.engine || "Google Veo MP4");
              setStatusText("");
              setLoading(false);
            } else if (pData.status === "failed") {
              clearInterval(pollTimerRef.current);
              setError(pData.error || "Cloud video rendering failed.");
              setStatusText("");
              setLoading(false);
            }
          } catch {}
        }, 5000);
        return;
      }

      if (data.status === "motion_render") {
        setStatusText("Animating AI scenes & encoding playable video...");
        const initialFrames =
          Array.isArray(data.frames) && data.frames.length > 0
            ? data.frames
            : refPreview
            ? [refPreview]
            : [];
        const blobUrl = await renderBrowserMotionVideo({
          frames: initialFrames,
          frameDataUrl: data.frameDataUrl || refPreview,
          aspectRatio,
          durationSec: data.durationSec || duration,
        });
        setVideoUrl(blobUrl);
        setEngineUsed(data.engine || "786 AI Motion Engine");
        setStatusText("");
        setLoading(false);
      }
    } catch (err) {
      setError(err?.message || "Network error. Please try again.");
      setStatusText("");
      setLoading(false);
    }
  }

  function jumpToTop(modeName, modelName) {
    if (modeName) setActiveMode(modeName);
    if (modelName) setSelectedModel(modelName);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-zinc-100 flex">
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/75 z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-56 bg-[#0e0e11] border-r border-zinc-800/80 flex flex-col transition-transform duration-200 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="px-4 py-3.5 border-b border-zinc-800/80 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 text-black font-black flex items-center justify-center text-xs">
              786
            </span>
            <span className="font-extrabold text-sm text-white">786 AI</span>
          </Link>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-zinc-400 text-xs px-2 py-1"
          >
            ✕
          </button>
        </div>

        <div className="p-3 space-y-1.5">
          <button
            type="button"
            onClick={() => {
              setPrompt("");
              setVideoUrl("");
              setRefPreview("");
              setRefBase64("");
              setSidebarOpen(false);
            }}
            className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-black font-extrabold text-xs shadow-md"
          >
            + Create New
          </button>
          <Link
            href="/"
            className="w-full py-1.5 px-3 rounded-lg text-xs text-zinc-400 hover:text-white hover:bg-zinc-800/60 flex items-center gap-2"
          >
            <span>🏠</span>
            <span>Home Directory</span>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto px-2.5 pb-6 space-y-4">
          {SIDEBAR_GROUPS.map((g) => (
            <div key={g.title}>
              <div className="px-2.5 mb-1 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                {g.title}
              </div>
              <div className="space-y-0.5">
                {g.items.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => {
                      setActiveMode(item);
                      setSidebarOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
                      activeMode === item
                        ? "bg-amber-500/15 text-amber-400 border border-amber-500/30 font-semibold"
                        : "text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      <div className="flex-1 min-w-0">
        <header className="sticky top-0 z-30 bg-[#0a0a0c]/95 backdrop-blur border-b border-zinc-800/80 px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200 text-xs font-semibold"
            >
              ☰ Menu
            </button>
            <span className="text-xs font-bold text-amber-400">{activeMode}</span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/mini-tools/hot"
              className="hidden sm:inline-block text-xs px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-emerald-400 font-semibold"
            >
              🔥 Mini-Tools
            </Link>
            <Link
              href="/studio"
              className="text-xs px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-400 to-orange-500 text-black font-extrabold"
            >
              786AI Studio
            </Link>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-4 py-6">
          <section className="rounded-2xl bg-[#131316] border border-zinc-800 p-4 sm:p-5 shadow-2xl mb-10 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="bg-[#1b1b20] border border-zinc-700 rounded-lg px-2.5 py-1.5 text-xs font-bold text-white focus:outline-none"
                >
                  {ALL_MODELS.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.id}
                    </option>
                  ))}
                </select>
                <span className="px-1.5 py-0.5 rounded bg-amber-500 text-black font-black text-[10px]">
                  NEW
                </span>
              </div>
              <span className="text-[11px] text-zinc-400">
                {aspectRatio} • {resolution} • {duration}s
              </span>
            </div>

            <div className="grid grid-cols-2 border-b border-zinc-800 text-xs font-bold">
              {["Omni Reference", "First and Last Frames"].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setRefTab(tab)}
                  className={`pb-2.5 text-center border-b-2 transition ${
                    refTab === tab
                      ? "border-amber-400 text-white"
                      : "border-transparent text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="cursor-pointer rounded-xl bg-[#18181c] border border-dashed border-zinc-700 hover:border-amber-400 p-3.5 text-center transition"
                >
                  {refPreview ? (
                    <div className="flex items-center justify-center gap-3">
                      <img
                        src={refPreview}
                        alt="Reference"
                        className="w-14 h-14 rounded-lg object-cover border border-amber-400/50"
                      />
                      <div className="text-left">
                        <div className="text-xs font-bold text-amber-400">Reference Frame Attached</div>
                        <div className="text-[11px] text-zinc-400">Tap to change image</div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="text-zinc-400 text-xs mb-0.5">⬆ Click to upload reference content</div>
                      <div className="text-[10px] text-zinc-500">Image 0/1 • PNG, JPG, WebP</div>
                    </>
                  )}
                </div>
              </div>

              <div className="rounded-xl bg-[#18181c] border border-zinc-800 p-3">
                <textarea
                  rows={3}
                  maxLength={2500}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe the video scene you want to create (e.g., A lion walking through a glowing forest at night)..."
                  className="w-full bg-transparent text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none resize-none"
                />
                <div className="flex items-center justify-between pt-2 border-t border-zinc-800/80 text-[11px] text-zinc-500">
                  <span>{prompt.length}/2500</span>
                  <button
                    type="button"
                    onClick={enhancePrompt}
                    className="text-amber-400 hover:text-amber-300 font-semibold"
                  >
                    ✨ Enhance Prompt
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-xs font-bold text-zinc-300 mb-1.5">Aspect Ratio</div>
                  <div className="grid grid-cols-6 gap-1.5">
                    {["16:9", "9:16", "1:1", "21:9", "4:3", "3:4"].map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setAspectRatio(r)}
                        className={`py-1.5 rounded-lg border text-[11px] font-bold transition ${
                          aspectRatio === r
                            ? "bg-amber-500/15 border-amber-400 text-amber-300"
                            : "bg-[#18181c] border-zinc-800 text-zinc-400"
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-xs font-bold text-zinc-300 mb-1.5">Resolution</div>
                  <div className="grid grid-cols-3 gap-2">
                    {["480p", "720p", "1080p"].map((resOpt) => (
                      <button
                        key={resOpt}
                        type="button"
                        onClick={() => setResolution(resOpt)}
                        className={`py-1.5 rounded-lg border text-[11px] font-bold transition ${
                          resolution === resOpt
                            ? "bg-amber-500/15 border-amber-400 text-amber-300"
                            : "bg-[#18181c] border-zinc-800 text-zinc-400"
                        }`}
                      >
                        {resOpt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-bold text-zinc-300 mb-1">
                  <span>Duration</span>
                  <span className="text-amber-400">{duration}s</span>
                </div>
                <input
                  type="range"
                  min={4}
                  max={10}
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full accent-amber-400"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-zinc-400">Free Unlimited Render</span>
                <button
                  type="submit"
                  disabled={loading || !prompt.trim()}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 hover:opacity-95 disabled:opacity-50 text-black font-extrabold text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition"
                >
                  {loading ? "Rendering Video..." : "▶ Generate"}
                </button>
              </div>
            </form>

            {loading && statusText && (
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-3">
                <span className="w-4 h-4 rounded-full border-2 border-amber-400 border-t-transparent animate-spin shrink-0" />
                <span>{statusText}</span>
              </div>
            )}

            {error && (
              <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs">
                {error}
              </div>
            )}

            {videoUrl && (
              <div className="pt-4 border-t border-zinc-800 space-y-3">
                <div className="rounded-2xl overflow-hidden bg-black border border-zinc-800">
                  <video
                    src={videoUrl}
                    controls
                    autoPlay
                    loop
                    playsInline
                    className="w-full max-h-[440px] object-contain mx-auto"
                  />
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <a
                    href={videoUrl}
                    download={`786ai-${selectedModel.toLowerCase().replace(/\s+/g, "-")}.mp4`}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-black font-extrabold text-xs shadow-md"
                  >
                    ⬇ Download Video
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      setVideoUrl("");
                      setPrompt("");
                    }}
                    className="px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200 font-bold text-xs"
                  >
                    + Create Another
                  </button>
                </div>
                {engineUsed && (
                  <p className="text-[11px] text-center text-zinc-400">{engineUsed}</p>
                )}
              </div>
            )}
          </section>

          <section className="mb-10">
            <h2 className="text-base sm:text-lg font-extrabold text-white mb-3.5">Models</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ALL_MODELS.map((m) => (
                <div
                  key={m.id}
                  onClick={() => jumpToTop(null, m.id)}
                  className={`cursor-pointer rounded-xl p-3.5 border transition flex items-start gap-3 ${
                    selectedModel === m.id
                      ? "bg-[#18181d] border-amber-400"
                      : "bg-[#131316] border-zinc-800/90 hover:border-zinc-700"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-br ${m.iconBg} text-white font-black text-xs flex items-center justify-center shrink-0`}
                  >
                    {m.code}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1.5">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="font-bold text-xs sm:text-sm text-white truncate">{m.id}</span>
                        {m.badge && (
                          <span
                            className={`text-[9px] font-black px-1.5 py-0.5 rounded ${
                              m.badge === "HOT"
                                ? "bg-orange-500 text-white"
                                : "bg-emerald-400 text-black"
                            }`}
                          >
                            {m.badge}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 shrink-0">
                        {m.tag}
                      </span>
                    </div>
                    <div className="text-[10px] text-amber-400/90 font-medium mt-0.5">{m.specs}</div>
                    <p className="text-[11px] text-zinc-400 mt-1 line-clamp-2">{m.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-base sm:text-lg font-extrabold text-white mb-3.5">AI Tools</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {AI_TOOLS.map((tool) => (
                <div
                  key={tool.name}
                  onClick={() => jumpToTop(tool.name, null)}
                  className="cursor-pointer rounded-xl p-3.5 bg-[#131316] border border-zinc-800/90 hover:border-amber-500/50 transition flex items-start gap-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-base shrink-0">
                    {tool.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs sm:text-sm text-white">{tool.name}</span>
                      {tool.badge && (
                        <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-emerald-400 text-black">
                          {tool.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-1">{tool.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <footer className="border-t border-zinc-800/80 pt-6 pb-6 text-center text-[11px] text-zinc-500">
            © 2026 786 AI Hub — All rights reserved.
          </footer>
        </main>
      </div>
    </div>
  );
}
