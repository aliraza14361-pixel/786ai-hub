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

function renderInline(text) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\(https?:\/\/[^\s)]+\))/g);
  return parts.map((part, i) => {
    if (!part) return null;
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return <strong key={i} className="font-bold text-white">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
      return <code key={i} className="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 font-mono text-xs">{part.slice(1, -1)}</code>;
    }
    const linkMatch = part.match(/^\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)$/);
    if (linkMatch) {
      return (
        <a key={i} href={linkMatch[2]} target="_blank" rel="noreferrer" className="text-cyan-400 underline hover:text-cyan-300">
          {linkMatch[1]}
        </a>
      );
    }
    return part;
  });
}

function CodeBlock({ raw }) {
  const [copied, setCopied] = useState(false);
  const firstLineEnd = raw.indexOf("\n");
  const lang = firstLineEnd !== -1 ? raw.slice(3, firstLineEnd).trim() || "code" : "code";
  const code = firstLineEnd !== -1 ? raw.slice(firstLineEnd + 1, -3).trim() : raw.slice(3, -3).trim();

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-3 rounded-xl overflow-hidden border border-slate-700 bg-slate-950">
      <div className="flex items-center justify-between px-3 py-1.5 bg-slate-800/80 border-b border-slate-700">
        <span className="text-[11px] font-mono uppercase text-cyan-300">{lang}</span>
        <button onClick={handleCopy} className="text-xs text-slate-300 hover:text-white">
          {copied ? "Copied!" : "Copy Code"}
        </button>
      </div>
      <pre className="p-3 overflow-x-auto text-xs text-slate-200 font-mono leading-relaxed">{code}</pre>
    </div>
  );
}

function FormattedOutput({ content }) {
  const segments = content.split(/(```[\w-]*\n[\s\S]*?```)/g);

  return (
    <div className="space-y-1">
      {segments.map((seg, idx) => {
        if (!seg) return null;
        if (seg.startsWith("```") && seg.endsWith("```")) {
          return <CodeBlock key={idx} raw={seg} />;
        }

        const lines = seg.split("\n");
        return (
          <div key={idx}>
            {lines.map((line, lIdx) => {
              const trimmed = line.trim();
              if (!trimmed) return <div key={lIdx} className="h-2" />;
              if (trimmed === "---" || trimmed === "***") {
                return <hr key={lIdx} className="my-4 border-slate-800" />;
              }
              if (trimmed.startsWith("#### ")) {
                return <h4 key={lIdx} className="text-base font-bold text-cyan-300 mt-4 mb-1">{renderInline(trimmed.slice(5))}</h4>;
              }
              if (trimmed.startsWith("### ")) {
                return <h3 key={lIdx} className="text-lg font-extrabold text-white mt-5 mb-2">{renderInline(trimmed.slice(4))}</h3>;
              }
              if (trimmed.startsWith("## ")) {
                return <h2 key={lIdx} className="text-xl font-extrabold text-white mt-5 mb-2">{renderInline(trimmed.slice(3))}</h2>;
              }
              if (trimmed.startsWith("> ")) {
                return (
                  <blockquote key={lIdx} className="border-l-2 border-cyan-500 pl-3 my-2 text-sm text-slate-300 italic">
                    {renderInline(trimmed.slice(2))}
                  </blockquote>
                );
              }
              const bulletMatch = line.match(/^\s*[\*\-]\s+(.*)/);
              if (bulletMatch) {
                return (
                  <div key={lIdx} className="flex items-start gap-2 text-sm text-slate-200 leading-relaxed my-1 pl-1">
                    <span className="text-cyan-400 font-bold mt-0.5">•</span>
                    <span className="flex-1">{renderInline(bulletMatch[1])}</span>
                  </div>
                );
              }
              const numMatch = line.match(/^\s*(\d+\.)\s+(.*)/);
              if (numMatch) {
                return (
                  <div key={lIdx} className="flex items-start gap-2 text-sm text-slate-200 leading-relaxed my-1 pl-1">
                    <span className="text-cyan-400 font-bold min-w-[20px]">{numMatch[1]}</span>
                    <span className="flex-1">{renderInline(numMatch[2])}</span>
                  </div>
                );
              }
              return (
                <p key={lIdx} className="text-sm text-slate-200 leading-relaxed my-1">
                  {renderInline(line)}
                </p>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

export default function StudioPage() {
  const [mode, setMode] = useState("chat");
  const [prompt, setPrompt] = useState("");
  const [output, setOutput] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);

  const activeMode = MODES.find((m) => m.id === mode) || MODES[0];

  const extractHtml = (text) => {
    const match = text.match(/```html([\s\S]*?)```/i);
    return match ? match[1].trim() : text.includes("<html") ? text : "";
  };

  const previewHtml = mode === "coding" ? extractHtml(output) : "";

  const handleDownloadApp = () => {
    if (!previewHtml) return;
    const blob = new Blob([previewHtml], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `786ai-app-${Date.now()}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyAll = () => {
    navigator.clipboard.writeText(output);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
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
        setOutput("Playing voiceover directly in your browser. You can also switch to **AI Chat & Assistant** to write a script first!");
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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <span className="inline-block px-3 py-1 text-xs font-bold rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 mb-2">
              786AI • ALL-IN-ONE STUDIO
            </span>
            <h1 className="text-3xl font-extrabold text-white">786AI Studio</h1>
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
            <img src={imageUrl} alt="786AI Generated" className="max-h-[512px] mx-auto rounded-xl border border-slate-800" />
            <a href={imageUrl} target="_blank" rel="noreferrer" className="inline-block mt-4 px-5 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-sm">
              Open Full HD Image
            </a>
          </div>
        )}

        {previewHtml && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 mb-6">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <span className="text-xs font-bold text-cyan-300">LIVE APP PREVIEW</span>
              <button
                onClick={handleDownloadApp}
                className="px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs"
              >
                ⬇ Download App (.html)
              </button>
            </div>
            <iframe title="786AI Live Preview" srcDoc={previewHtml} className="w-full h-96 bg-white rounded-xl border border-slate-700" />
          </div>
        )}

        {output && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
              <span className="text-xs font-bold text-cyan-300">786AI OUTPUT</span>
              <button
                onClick={handleCopyAll}
                className="px-3 py-1 rounded-lg bg-slate-800 text-xs text-slate-200 hover:bg-slate-700"
              >
                {copiedAll ? "Copied!" : "Copy Output"}
              </button>
            </div>
            <FormattedOutput content={output} />
          </div>
        )}
      </div>
    </div>
  );
}
