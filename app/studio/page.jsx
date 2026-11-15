"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

const HISTORY_KEY = "786ai_studio_history_v1";
const MAX_HISTORY = 15;

const CHAT_MODELS = [
  { id: "786ai", name: "786AI", tag: "All-in-One", icon: "✨", color: "from-cyan-400 to-blue-500" },
  { id: "deepseek", name: "DeepSeek", tag: "Reasoning & Code", icon: "🐋", color: "from-sky-400 to-indigo-500" },
  { id: "chatgpt", name: "ChatGPT", tag: "Creative & Writing", icon: "🟢", color: "from-emerald-400 to-teal-500" },
  { id: "gemini", name: "Gemini", tag: "Research & Fast", icon: "💎", color: "from-blue-400 to-purple-500" },
  { id: "metaai", name: "MetaAI", tag: "Social & Casual", icon: "🔵", color: "from-blue-500 to-cyan-400" },
  { id: "grok", name: "Grok", tag: "Bold & Witty", icon: "⚡", color: "from-amber-400 to-orange-500" }
];

const CHAT_SUGGESTIONS = [
  { icon: "🚀", text: "Best free AI tools for YouTube & TikTok" },
  { icon: "💡", text: "5 online earning ideas using free AI tools" },
  { icon: "🤖", text: "Explain AI automation in simple Roman Urdu" },
  { icon: "⚡", text: "Write a viral 30-sec Reels hook on AI future" }
];

const MODES = [
  {
    id: "chat",
    label: "AI Chat & Assistant",
    icon: "🤖",
    placeholder: "Ask anything in English, Urdu, or Roman Urdu...",
    presets: [
      "Best free AI tools for YouTube & TikTok",
      "Explain AI automation in simple Roman Urdu",
      "5 online earning ideas using free AI tools"
    ]
  },
  {
    id: "image",
    label: "Image Generator",
    icon: "🎨",
    placeholder: "Describe the image, logo, poster, or 9:16 artwork you want...",
    presets: [
      "Futuristic neon cyberpunk city at night, 8k ultra detailed",
      "3D Pixar style cute robot working on a glowing laptop",
      "Minimalist luxury gold and black 786AI emblem logo"
    ]
  },
  {
    id: "coding",
    label: "Build App & Code",
    icon: "⚡",
    placeholder: "Describe a web app, calculator, landing page, or tool to build & preview live...",
    presets: [
      "Build a modern scientific calculator app",
      "Create a Pomodoro focus timer with dark UI",
      "Build a strong password & QR text generator tool"
    ]
  },
  {
    id: "video",
    label: "Video Studio",
    icon: "🎬",
    placeholder: "Enter a topic for a faceless YouTube video, Reels script & AI video prompts...",
    presets: [
      "60-sec viral faceless YouTube Shorts script on AI future",
      "Dark luxury motivational TikTok reel + Kling prompts",
      "3-scene cinematic product ad storyboard for a smartwatch"
    ]
  },
  {
    id: "voice",
    label: "Voiceover (TTS)",
    icon: "🎙️",
    placeholder: "Type or paste text to convert into instant AI voiceover...",
    presets: [
      "Welcome to 786AI Studio! Create amazing videos, apps, and designs for free.",
      "Assalam-o-Alaikum! Welcome to 786 AI Hub, your all-in-one AI platform."
    ]
  },
  {
    id: "music",
    label: "Music & Lyrics",
    icon: "🎶",
    placeholder: "Describe song mood, topic, language, or background music style...",
    presets: [
      "Upbeat lo-fi chill study beats prompt for Suno AI",
      "Emotional Urdu & English fusion song lyrics about dreams",
      "High-energy cinematic trailer background music tags"
    ]
  },
  {
    id: "automation",
    label: "AI Automation",
    icon: "🔗",
    placeholder: "Describe a workflow to automate (e.g., auto-post YouTube to X & Telegram)...",
    presets: [
      "Auto-post new YouTube videos to X & Telegram via Make.com",
      "Summarize incoming Gmail leads into Google Sheets",
      "Auto-reply to Instagram comments with a custom DM link"
    ]
  },
  {
    id: "social",
    label: "Social Media Content",
    icon: "📱",
    placeholder: "Enter your topic for viral TikTok/Reels hooks, captions & hashtags...",
    presets: [
      "10 viral hooks for AI & tech TikTok videos",
      "7-day Instagram Reels content calendar for creators",
      "High-converting X thread about top free AI tools"
    ]
  }
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
  const [history, setHistory] = useState([]);

  // Multi-model Chat UI states
  const [selectedModel, setSelectedModel] = useState("786ai");
  const [modelMenuOpen, setModelMenuOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [autoSpeak, setAutoSpeak] = useState(false);
  const [listening, setListening] = useState(false);
  const [quickDrawerOpen, setQuickDrawerOpen] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(HISTORY_KEY);
      if (saved) setHistory(JSON.parse(saved));
    } catch {}
  }, []);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages, loading]);

  const speakText = (text) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const clean = text.replace(/[#*`>_]/g, "").slice(0, 1200);
    const utter = new SpeechSynthesisUtterance(clean);
    utter.rate = 1;
    utter.onstart = () => setSpeaking(true);
    utter.onend = () => setSpeaking(false);
    window.speechSynthesis.speak(utter);
  };

  const handleVoiceInput = () => {
    if (typeof window === "undefined") return;
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) {
      alert("Voice input is not supported in this browser.");
      return;
    }
    const rec = new SpeechRec();
    rec.lang = "en-US";
    rec.interimResults = false;
    rec.onstart = () => setListening(true);
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    rec.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript || "";
      if (transcript) {
        setChatInput((prev) => (prev ? prev + " " + transcript : transcript));
      }
    };
    rec.start();
  };

  const saveToHistory = (entry) => {
    setHistory((prev) => {
      const updated = [entry, ...prev].slice(0, MAX_HISTORY);
      try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const deleteHistoryItem = (id) => {
    setHistory((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const clearAllHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(HISTORY_KEY);
    } catch {}
  };

  const loadHistoryItem = (item) => {
    setMode(item.mode);
    if (item.mode === "chat") {
      if (item.modelId) setSelectedModel(item.modelId);
      setChatMessages(
        item.messages || [
          { role: "user", text: item.prompt },
          { role: "assistant", text: item.output, modelId: item.modelId || "786ai" }
        ]
      );
    } else {
      setPrompt(item.prompt);
      setOutput(item.output || "");
      setImageUrl(item.imageUrl || "");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const activeMode = MODES.find((m) => m.id === mode) || MODES[0];
  const activeChatModel = CHAT_MODELS.find((m) => m.id === selectedModel) || CHAT_MODELS[0];

  const handleSendChat = async (customText) => {
    const textToSend = (customText !== undefined ? customText : chatInput).trim();
    if (!textToSend || loading) return;

    setChatInput("");
    setQuickDrawerOpen(false);
    setModelMenuOpen(false);

    const userMsg = { role: "user", text: textToSend };
    const updatedThread = [...chatMessages, userMsg];
    setChatMessages(updatedThread);
    setLoading(true);

    try {
      const res = await fetch("/api/786ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: textToSend,
          mode: "chat",
          modelPersona: selectedModel,
          messages: updatedThread
        })
      });
      const data = await res.json();
      const replyText = data.error ? `Error: ${data.error}` : data.text;
      const aiMsg = { role: "assistant", text: replyText, modelId: selectedModel };
      const finalThread = [...updatedThread, aiMsg];
      setChatMessages(finalThread);

      if (!data.error) {
        if (autoSpeak) speakText(replyText);
        saveToHistory({
          id: Date.now().toString(),
          mode: "chat",
          modeLabel: `${activeChatModel.name} Chat`,
          modeIcon: activeChatModel.icon,
          modelId: selectedModel,
          prompt: textToSend,
          output: replyText,
          messages: finalThread,
          createdAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        });
      }
    } catch {
      setChatMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Network error. Please try again.", modelId: selectedModel }
      ]);
    } finally {
      setLoading(false);
    }
  };

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

  const executePrompt = async (customPrompt) => {
    const textToRun = (customPrompt !== undefined ? customPrompt : prompt).trim();
    if (!textToRun || loading) return;
    if (customPrompt !== undefined) setPrompt(customPrompt);

    setLoading(true);
    setOutput("");
    setImageUrl("");

    const currentModeObj = MODES.find((m) => m.id === mode) || MODES[0];

    if (mode === "image") {
      const encoded = encodeURIComponent(textToRun);
      const url = `[https://image.pollinations.ai/prompt/$](https://image.pollinations.ai/prompt/$){encoded}?width=1024&height=1024&nologo=true&seed=${Date.now()}`;
      setImageUrl(url);
      saveToHistory({
        id: Date.now().toString(),
        mode,
        modeLabel: currentModeObj.label,
        modeIcon: currentModeObj.icon,
        prompt: textToRun,
        output: "",
        imageUrl: url,
        createdAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      });
      setLoading(false);
      return;
    }

    if (mode === "voice") {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        speakText(textToRun);
        const msg = `Playing voiceover for: "${textToRun}"`;
        setOutput(msg);
        saveToHistory({
          id: Date.now().toString(),
          mode,
          modeLabel: currentModeObj.label,
          modeIcon: currentModeObj.icon,
          prompt: textToRun,
          output: msg,
          imageUrl: "",
          createdAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        });
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
        body: JSON.stringify({ prompt: textToRun, mode })
      });
      const data = await res.json();
      if (data.error) {
        setOutput(`Error: ${data.error}`);
      } else {
        setOutput(data.text);
        saveToHistory({
          id: Date.now().toString(),
          mode,
          modeLabel: currentModeObj.label,
          modeIcon: currentModeObj.icon,
          prompt: textToRun,
          output: data.text,
          imageUrl: "",
          createdAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        });
      }
    } catch {
      setOutput("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRun = (e) => {
    e.preventDefault();
    executePrompt();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 px-4 py-8 pb-24">
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
              onClick={() => { setMode(m.id); setOutput(""); setImageUrl(""); setModelMenuOpen(false); }}
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

        {mode === "chat" ? (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl mb-6 relative">
            {/* Top Bar with Model Switcher Dropdown, Auto-Voice & New Chat */}
            <div className="flex items-center justify-between px-4 py-3 bg-slate-950/80 border-b border-slate-800 relative z-20">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setModelMenuOpen((v) => !v)}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-bold text-sm transition"
                >
                  <span className="text-base">{activeChatModel.icon}</span>
                  <span>{activeChatModel.name}</span>
                  <span className="text-xs text-slate-400">{modelMenuOpen ? "▲" : "▼"}</span>
                </button>

                {modelMenuOpen && (
                  <div className="absolute left-0 mt-2 w-64 rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-slate-700 shadow-2xl p-1.5 z-50">
                    {CHAT_MODELS.map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => { setSelectedModel(m.id); setModelMenuOpen(false); }}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition ${
                          selectedModel === m.id
                            ? "bg-slate-800 text-white border border-cyan-500/40"
                            : "text-slate-300 hover:bg-slate-800/60"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-lg">{m.icon}</span>
                          <div>
                            <div className="text-sm font-bold leading-tight">{m.name}</div>
                            <div className="text-[11px] text-slate-400">{m.tag}</div>
                          </div>
                        </div>
                        {selectedModel === m.id && <span className="text-cyan-400 text-xs font-bold">✓</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                {speaking && (
                  <button
                    type="button"
                    onClick={() => { window.speechSynthesis.cancel(); setSpeaking(false); }}
                    className="px-2.5 py-1.5 rounded-full bg-rose-600 text-white text-xs font-bold"
                  >
                    Stop
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    const next = !autoSpeak;
                    setAutoSpeak(next);
                    if (!next && typeof window !== "undefined" && "speechSynthesis" in window) {
                      window.speechSynthesis.cancel();
                      setSpeaking(false);
                    }
                  }}
                  title="Auto Read Replies Aloud"
                  className={`px-3 py-1.5 rounded-full border text-xs font-bold transition ${
                    autoSpeak
                      ? "bg-cyan-500/20 border-cyan-400 text-cyan-300"
                      : "bg-slate-900 border-slate-700 text-slate-400 hover:text-white"
                  }`}
                >
                  {autoSpeak ? "🔊 Voice On" : "🔇 Voice"}
                </button>
                <button
                  type="button"
                  onClick={() => { setChatMessages([]); setChatInput(""); }}
                  title="New Chat"
                  className="px-3 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-200"
                >
                  + New Chat
                </button>
              </div>
            </div>

            {/* Chat Conversation Area */}
            <div className="p-4 sm:p-6 min-h-[380px] max-h-[540px] overflow-y-auto space-y-4">
              {chatMessages.length === 0 ? (
                <div className="py-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${activeChatModel.color} flex items-center justify-center text-2xl shadow-lg`}>
                      {activeChatModel.icon}
                    </div>
                    <div>
                      <h2 className="text-2xl font-extrabold text-white">
                        Hi! I&apos;m {activeChatModel.name}
                      </h2>
                      <p className="text-xs text-cyan-300 font-semibold">{activeChatModel.tag} • Powered by 786AI</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-400 mb-5">
                    All-in-one AI assistant for chat, coding, content, and research in English, Urdu, or Roman Urdu.
                  </p>

                  <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 mb-5">
                    <div className="text-xs font-bold text-cyan-300 mb-1">What&apos;s New in 786AI Chat</div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Switch anytime between 786AI, DeepSeek, ChatGPT, Gemini, MetaAI, and Grok styles using the top menu, or tap the mic to speak your prompt.
                    </p>
                  </div>

                  <div className="space-y-2">
                    {CHAT_SUGGESTIONS.map((s, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleSendChat(s.text)}
                        className="w-full sm:w-auto sm:mr-2 inline-flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/50 text-left text-xs sm:text-sm text-slate-200 transition"
                      >
                        <span>{s.icon}</span>
                        <span>{s.text}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                chatMessages.map((msg, idx) => {
                  const msgModel = CHAT_MODELS.find((m) => m.id === msg.modelId) || activeChatModel;
                  if (msg.role === "user") {
                    return (
                      <div key={idx} className="flex justify-end">
                        <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-cyan-500 text-slate-950 font-medium px-4 py-3 text-sm shadow">
                          {msg.text}
                        </div>
                      </div>
                    );
                  }
                  return (
                    <div key={idx} className="flex items-start gap-2.5">
                      <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${msgModel.color} flex items-center justify-center text-sm shrink-0 mt-1`}>
                        {msgModel.icon}
                      </div>
                      <div className="flex-1 min-w-0 bg-slate-950 border border-slate-800 rounded-2xl rounded-tl-sm p-4">
                        <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-slate-800/80">
                          <span className="text-xs font-bold text-cyan-300">{msgModel.name}</span>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => speakText(msg.text)}
                              className="text-[11px] text-slate-400 hover:text-cyan-300"
                              title="Listen"
                            >
                              🔊 Listen
                            </button>
                            <button
                              type="button"
                              onClick={() => navigator.clipboard.writeText(msg.text)}
                              className="text-[11px] text-slate-400 hover:text-white"
                            >
                              Copy
                            </button>
                          </div>
                        </div>
                        <FormattedOutput content={msg.text} />
                      </div>
                    </div>
                  );
                })
              )}

              {loading && (
                <div className="flex items-center gap-2 text-xs text-cyan-300 px-2">
                  <span className="animate-pulse">●</span>
                  <span>{activeChatModel.name} is thinking...</span>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Quick Drawer for "+" button */}
            {quickDrawerOpen && (
              <div className="px-4 py-3 bg-slate-950 border-t border-slate-800 flex flex-wrap gap-2">
                {CHAT_SUGGESTIONS.map((s, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleSendChat(s.text)}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 hover:border-cyan-400"
                  >
                    {s.icon} {s.text}
                  </button>
                ))}
              </div>
            )}

            {/* Bottom Input Bar (Plus, Text Input, Voice Mic, Send) */}
            <form
              onSubmit={(e) => { e.preventDefault(); handleSendChat(); }}
              className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2"
            >
              <button
                type="button"
                onClick={() => setQuickDrawerOpen((v) => !v)}
                className="w-10 h-10 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-lg flex items-center justify-center shrink-0"
                title="Quick Prompts"
              >
                +
              </button>
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder={`Ask ${activeChatModel.name} anything...`}
                className="flex-1 bg-slate-900 border border-slate-800 rounded-full px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400"
              />
              <button
                type="button"
                onClick={handleVoiceInput}
                className={`w-10 h-10 rounded-full border flex items-center justify-center shrink-0 transition ${
                  listening
                    ? "bg-rose-600 border-rose-400 text-white animate-pulse"
                    : "bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-200"
                }`}
                title="Voice Input"
              >
                🎙️
              </button>
              <button
                type="submit"
                disabled={loading || !chatInput.trim()}
                className="px-4 h-10 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-sm disabled:opacity-40 shrink-0"
              >
                Send
              </button>
            </form>
          </div>
        ) : (
          <>
            <form onSubmit={handleRun} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 mb-6">
              {activeMode.presets && (
                <div className="mb-3">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    ⚡ 1-Click Prompts (Tap to Run)
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {activeMode.presets.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        disabled={loading}
                        onClick={() => executePrompt(preset)}
                        className="px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-cyan-500/15 border border-slate-800 hover:border-cyan-500/50 text-xs text-slate-300 hover:text-cyan-200 text-left transition disabled:opacity-50"
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>
              )}

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
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 mb-6">
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
          </>
        )}

        {history.length > 0 && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 mt-8">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-300">
                🕒 Saved History ({history.length}/{MAX_HISTORY})
              </span>
              <button
                onClick={clearAllHistory}
                className="text-xs text-rose-400 hover:text-rose-300"
              >
                Clear All
              </button>
            </div>
            <div className="space-y-2">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700"
                >
                  <button
                    type="button"
                    onClick={() => loadHistoryItem(item)}
                    className="flex-1 text-left min-w-0"
                  >
                    <div className="flex items-center gap-2 text-xs text-slate-400 mb-0.5">
                      <span>{item.modeIcon}</span>
                      <span className="font-semibold text-cyan-300">{item.modeLabel}</span>
                      <span>• {item.createdAt}</span>
                    </div>
                    <div className="text-sm text-slate-200 truncate">{item.prompt}</div>
                  </button>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => loadHistoryItem(item)}
                      className="px-2.5 py-1 rounded-lg bg-cyan-500/15 text-cyan-300 text-xs font-semibold hover:bg-cyan-500/25"
                    >
                      Open
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteHistoryItem(item.id)}
                      className="px-2 py-1 rounded-lg bg-slate-800 text-slate-400 hover:text-rose-400 text-xs"
                      title="Delete"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
