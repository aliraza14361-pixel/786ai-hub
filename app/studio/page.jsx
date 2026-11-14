"use client";
import { useState } from "react";
import Link from "next/link";

const MODES = [
  { id: "chat", label: "AI Chat & Assistant", icon: "🤖", placeholder: "Ask anything in English, Urdu, or Roman Urdu..." },
  { id: "image", label: "Image Generator", icon: "🎨", placeholder: "Describe the image, logo, poster, or 9:16 artwork you want..." },
  { id: "coding", label: "Build App & Code", icon: "⚡", placeholder: "Describe a web app, calculator, landing page, or tool to build & preview live..." },
  { id: "video", label: "Video Studio", icon: "🎬", placeholder: "Enter a topic for a faceless YouTube video, Reels script & AI video prompts..." },
  { id: "voice", label: "Voiceover (TTS)", icon: "🎙️", placeholder: "Type or paste text to convert into instant AI voiceover..." },
  { id: "music", label: "Music & Lyrics", icon: "🎶", placeholder: "Describe song mood, topic, language, or background music style..." },
  { id: "automation", label: "AI Automation", icon: "🔗", placeholder: "Describe a workflow to automate (e.g., auto-post YouTube to X & Telegram)..." },
  { id: "social", label: "Social Media Content", icon: "📱", placeholder: "Enter your topic for viral TikTok/Reels hooks, captions & hashtags..." }
];

export default function StudioPage() {
  const [mode, setMode] = useState("chat");
  const [prompt, setPrompt] = useState("");
  const [output, setOutput] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  const activeMode = MODES.find((m) => m.id === mode) || MODES[0];

  const extractHtml = (text) => {
    const match = text.match(/```html([\s\S]*?)```/i);
    return match ? match[1].trim() : text.includes("<html") ? text : "";
  };

  const handleRun = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    setLoading(true);
    setOutput("");
    setImageUrl("");

    if (mode === "image") {
      const encoded = encodeURIComponent(prompt.trim());
      setImageUrl(`https://image.pollinations.ai/prompt/${encoded}?width=1024&height=1024&nologo=true&seed=${Date.now()}`);
      setLoading(false);
      return;
    }

    if (mode === "voice") {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(prompt.trim());
        utter.rate = 1;
        utter.onstart = () => setSpeaking(true);
        utter.onend = () => setSpeaking(false);
        window.speechSynthesis.speak(utter);
        setOutput("Playing voiceover directly in your browser. You can also switch to AI Chat to write a script first!");
      } else {
        setOutput("Voice synthesis is not supported in this browser.");
      }
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/786ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, mode })
      });
      const data = await res.json();
      setOutput(data.error ? `Error: ${data.error}` : data.text);
    } catch (err) {
      setOutput("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const previewHtml = mode === "coding" ? extractHtml(output) : "";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <span className="inline-block px-3 py-1 text-xs font-bold rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 mb-2">
              786AIHUB ALL-IN-ONE STUDIO
            </span>
            <h1 className="text-3xl font-extrabold text-white">786AIHub AI Studio</h1>
            <p className="text-slate-400 text-sm mt-1">Chat, Images, App Builder, Video, Voice, Music, Automation & Social Content — 100% Free</p>
          </div>
          <Link href="/" className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-cyan-300 hover:border-cyan-500">
            ← Back to 50 AI Tools
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
          {MODES.map((m) => (
            <button
              key={m.id}
              onClick={() => { setMode(m.id); setOutput(""); setImageUrl(""); }}
              className={`p-3 rounded-xl border text-left transition ${
                mode === m.id
                  ? "bg-cyan-500/20 border-cyan-400 text-white"
                  : "bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700"
              }`}
            >
              <div className="text-xl mb-1">{m.icon}</div>
              <div className="text-xs font-semibold">{m.label}</div>
            </button>
          ))}
        </div>

        <form onSubmit={handleRun} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 mb-6">
          <textarea
            rows={4}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={activeMode.placeholder}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-cyan-400"
          />
          <div className="flex items-center justify-between mt-3">
            <span className="text-xs text-slate-400">Active Mode: <strong className="text-cyan-300">{activeMode.label}</strong></span>
            <div className="flex gap-2">
              {speaking && (
                <button type="button" onClick={() => { window.speechSynthesis.cancel(); setSpeaking(false); }} className="px-4 py-2 rounded-xl bg-rose-600 text-white text-sm font-bold">
                  Stop Voice
                </button>
              )}
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm disabled:opacity-50"
              >
                {loading ? "Generating..." : mode === "voice" ? "Speak Now" : "Generate"}
              </button>
            </div>
          </div>
        </form>

        {imageUrl && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 mb-6 text-center">
            <img src={imageUrl} alt="786AIHub Generated" className="max-h-[512px] mx-auto rounded-xl border border-slate-800" />
            <a href={imageUrl} target="_blank" rel="noreferrer" className="inline-block mt-4 px-5 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-sm">
              Open Full HD Image
            </a>
          </div>
        )}

        {previewHtml && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 mb-6">
            <div className="text-xs font-bold text-cyan-300 mb-2">LIVE APP PREVIEW</div>
            <iframe title="786AIHub Live Preview" srcDoc={previewHtml} className="w-full h-96 bg-white rounded-xl border border-slate-700" />
          </div>
        )}

        {output && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-cyan-300">786AIHUB OUTPUT</span>
              <button
                onClick={() => navigator.clipboard.writeText(output)}
                className="px-3 py-1 rounded-lg bg-slate-800 text-xs text-slate-200 hover:bg-slate-700"
              >
                Copy Output
              </button>
            </div>
            <pre className="whitespace-pre-wrap font-sans text-sm text-slate-200 leading-relaxed">{output}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
