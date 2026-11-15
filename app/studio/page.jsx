"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

const SESSIONS_KEY = "786ai_chat_sessions_v2";
const PERSONAL_KEY = "786ai_personal_intel_v1";
const MAX_SESSIONS = 25;
const FENCE = String.fromCharCode(96).repeat(3);
const TICK = String.fromCharCode(96);

const CHAT_MODELS = [
  { id: "786ai", name: "786AI", tag: "All-in-One Flagship", icon: "✨", color: "from-cyan-400 to-blue-500" },
  { id: "deepseek", name: "DeepSeek", tag: "Deep Reasoning & Code", icon: "🐋", color: "from-sky-400 to-indigo-500" },
  { id: "chatgpt", name: "ChatGPT", tag: "Creative & Structured", icon: "🟢", color: "from-emerald-400 to-teal-500" },
  { id: "gemini", name: "Gemini", tag: "Fast Research & Insights", icon: "💎", color: "from-blue-400 to-purple-500" },
  { id: "metaai", name: "MetaAI", tag: "Social & Everyday", icon: "🔵", color: "from-blue-500 to-cyan-400" },
  { id: "grok", name: "Grok", tag: "Sharp & Direct", icon: "⚡", color: "from-amber-400 to-orange-500" }
];

const SHEET_TOOLS = [
  {
    id: "image",
    name: "Create images",
    desc: "Visualize and edit",
    icon: "🖼️",
    placeholder: "Describe the image to visualize or edit...",
    presets: [
      "Futuristic neon cyberpunk city at night, 8k ultra detailed",
      "3D Pixar style cute robot working on a glowing laptop"
    ]
  },
  {
    id: "video",
    name: "Create videos",
    desc: "Bring ideas to life",
    icon: "🎬",
    placeholder: "Describe your video idea, Reels script, or scene prompts...",
    presets: [
      "60-sec viral faceless YouTube Shorts script on AI future",
      "Dark luxury motivational TikTok reel + Kling prompts"
    ]
  },
  {
    id: "music",
    name: "Create music",
    desc: "Make audio tracks",
    icon: "🎵",
    placeholder: "Describe song mood, lyrics topic, or audio track style...",
    presets: [
      "Upbeat lo-fi chill study beats prompt for Suno AI",
      "Emotional Urdu & English fusion song lyrics about dreams"
    ]
  },
  {
    id: "canvas",
    name: "Canvas",
    desc: "Code, write, or make slides",
    icon: "🖥️",
    placeholder: "Build an app, write a doc, or make interactive slides...",
    presets: [
      "Build a modern scientific calculator app",
      "Create a 5-slide interactive pitch deck on AI Automation"
    ]
  },
  {
    id: "research",
    name: "Deep research",
    desc: "Get detailed reports",
    icon: "🔬",
    placeholder: "Enter a topic for an in-depth structured report...",
    presets: [
      "Deep research report on best AI monetization models in 2026",
      "Compare top free AI video & voice tools for creators"
    ]
  },
  {
    id: "learning",
    name: "Guided learning",
    desc: "Get step-by-step help",
    icon: "📖",
    placeholder: "What would you like to learn step-by-step?",
    presets: [
      "Teach me Next.js App Router step-by-step from basics",
      "Guide me step-by-step on building Make.com automations"
    ]
  },
  {
    id: "think",
    name: "Think harder",
    desc: "Deep step-by-step reasoning",
    icon: "🧠",
    placeholder: "Ask a complex logic, strategy, or coding problem...",
    presets: [
      "Plan a 30-day roadmap to grow 786 AI Hub to 10k users",
      "Solve and explain step-by-step system architecture"
    ]
  },
  {
    id: "automation",
    name: "Plugins & Automation",
    desc: "Connect workflows & Make.com",
    icon: "🔌",
    placeholder: "Describe an app workflow or plugin automation...",
    presets: [
      "Auto-post new YouTube videos to X & Telegram via Make.com",
      "Summarize incoming Gmail leads into Google Sheets"
    ]
  }
];

function renderInline(text) {
  const inlineRegex = new RegExp("(\\*\\*[^*]+\\*\\*|" + TICK + "[^" + TICK + "]+" + TICK + "|\\[[^\\]]+\\]\\(https?:\\/\\/[^\\s)]+\\))", "g");
  const parts = text.split(inlineRegex);
  return parts.map((part, i) => {
    if (!part) return null;
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return <strong key={i} className="font-bold text-white">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith(TICK) && part.endsWith(TICK) && part.length > 2) {
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
    <div className="my-3 rounded-xl overflow-hidden border border-slate-700/80 bg-slate-950">
      <div className="flex items-center justify-between px-3 py-1.5 bg-slate-800/80 border-b border-slate-700/80">
        <span className="text-[11px] font-mono uppercase text-cyan-300">{lang}</span>
        <button type="button" onClick={handleCopy} className="text-xs text-slate-300 hover:text-white">
          {copied ? "Copied!" : "Copy Code"}
        </button>
      </div>
      <pre className="p-3 overflow-x-auto text-xs text-slate-200 font-mono leading-relaxed">{code}</pre>
    </div>
  );
}

function FormattedOutput({ content }) {
  const blockRegex = new RegExp("(" + FENCE + "[\\w-]*\\n[\\s\\S]*?" + FENCE + ")", "g");
  const segments = content.split(blockRegex);

  return (
    <div className="space-y-1">
      {segments.map((seg, idx) => {
        if (!seg) return null;
        if (seg.startsWith(FENCE) && seg.endsWith(FENCE)) {
          return <CodeBlock key={idx} raw={seg} />;
        }

        const lines = seg.split("\n");
        return (
          <div key={idx}>
            {lines.map((line, lIdx) => {
              const trimmed = line.trim();
              if (!trimmed) return <div key={lIdx} className="h-2" />;
              if (trimmed === "---" || trimmed === "***") {
                return <hr key={lIdx} className="my-3 border-slate-800" />;
              }
              if (trimmed.startsWith("#### ")) {
                return <h4 key={lIdx} className="text-sm font-bold text-cyan-300 mt-3 mb-1">{renderInline(trimmed.slice(5))}</h4>;
              }
              if (trimmed.startsWith("### ")) {
                return <h3 key={lIdx} className="text-base font-extrabold text-white mt-4 mb-1.5">{renderInline(trimmed.slice(4))}</h3>;
              }
              if (trimmed.startsWith("## ")) {
                return <h2 key={lIdx} className="text-lg font-extrabold text-white mt-4 mb-1.5">{renderInline(trimmed.slice(3))}</h2>;
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

function extractHtml(text) {
  if (!text) return "";
  const htmlRegex = new RegExp(FENCE + "html([\\s\\S]*?)" + FENCE, "i");
  const match = text.match(htmlRegex);
  return match ? match[1].trim() : text.includes("<html") ? text : "";
}

function resizeImageFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const maxDim = 1024;
        let w = img.width;
        let h = img.height;
        if (w > maxDim || h > maxDim) {
          if (w > h) {
            h = Math.round((h * maxDim) / w);
            w = maxDim;
          } else {
            w = Math.round((w * maxDim) / h);
            h = maxDim;
          }
        }
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, w, h);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.82);
        const base64 = dataUrl.split(",")[1] || "";
        resolve({ previewUrl: dataUrl, base64, mimeType: "image/jpeg" });
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function StudioPage() {
  const [selectedModel, setSelectedModel] = useState("786ai");
  const [activeTool, setActiveTool] = useState("chat");
  const [modelMenuOpen, setModelMenuOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Personal Intelligence (Labs)
  const [personalEnabled, setPersonalEnabled] = useState(true);
  const [personalNote, setPersonalNote] = useState("I am a creator & developer using 786 AI Hub. Give clear, practical answers.");
  const [editingPersonal, setEditingPersonal] = useState(false);

  // Attachments (Photos, Camera, Files)
  const [attachedImage, setAttachedImage] = useState(null);
  const [attachedFile, setAttachedFile] = useState(null);

  const [sessions, setSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [autoSpeak, setAutoSpeak] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [listening, setListening] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const photoInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(SESSIONS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setSessions(parsed);
      }
      const savedPersonal = localStorage.getItem(PERSONAL_KEY);
      if (savedPersonal) {
        const p = JSON.parse(savedPersonal);
        if (typeof p.enabled === "boolean") setPersonalEnabled(p.enabled);
        if (typeof p.note === "string") setPersonalNote(p.note);
      }
    } catch {}
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const updatePersonalSettings = (enabled, note) => {
    setPersonalEnabled(enabled);
    setPersonalNote(note);
    try {
      localStorage.setItem(PERSONAL_KEY, JSON.stringify({ enabled, note }));
    } catch {}
  };

  const activeModelObj = CHAT_MODELS.find((m) => m.id === selectedModel) || CHAT_MODELS[0];
  const activeToolObj = SHEET_TOOLS.find((t) => t.id === activeTool) || null;

  const persistSession = (sessionId, updatedMessages, modelId, firstPrompt) => {
    setSessions((prev) => {
      const existing = prev.find((s) => s.id === sessionId);
      const title = existing?.title || (firstPrompt || "Media Chat").slice(0, 48);
      const cleanMsgs = updatedMessages.map((m) => ({
        ...m,
        imageBase64: undefined
      }));
      const sessionObj = {
        id: sessionId,
        title,
        modelId,
        updatedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        messages: cleanMsgs
      };
      const others = prev.filter((s) => s.id !== sessionId);
      const next = [sessionObj, ...others].slice(0, MAX_SESSIONS);
      try {
        localStorage.setItem(SESSIONS_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const startNewChat = () => {
    setCurrentSessionId(null);
    setMessages([]);
    setInput("");
    setActiveTool("chat");
    setAttachedImage(null);
    setAttachedFile(null);
    setSidebarOpen(false);
    setSheetOpen(false);
    setModelMenuOpen(false);
  };

  const openSession = (session) => {
    setCurrentSessionId(session.id);
    setMessages(session.messages || []);
    if (session.modelId) setSelectedModel(session.modelId);
    setSidebarOpen(false);
  };

  const deleteSession = (e, id) => {
    e.stopPropagation();
    setSessions((prev) => {
      const next = prev.filter((s) => s.id !== id);
      try {
        localStorage.setItem(SESSIONS_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
    if (currentSessionId === id) {
      startNewChat();
    }
  };

  const clearAllSessions = () => {
    setSessions([]);
    try {
      localStorage.removeItem(SESSIONS_KEY);
    } catch {}
    startNewChat();
  };

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

  const handleVoiceInput = (autoSubmitAfter = false) => {
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
        if (autoSubmitAfter) {
          setAutoSpeak(true);
          handleSend(transcript);
        } else {
          setInput((prev) => (prev ? prev + " " + transcript : transcript));
        }
      }
    };
    rec.start();
  };

  const handleImagePicked = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      const resized = await resizeImageFile(file);
      setAttachedImage({
        name: file.name || "photo.jpg",
        previewUrl: resized.previewUrl,
        base64: resized.base64,
        mimeType: resized.mimeType
      });
      setAttachedFile(null);
      setSheetOpen(false);
      inputRef.current?.focus();
    } catch {
      alert("Could not load photo. Please try another image.");
    }
  };

  const handleFilePicked = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const content = String(ev.target?.result || "");
      setAttachedFile({
        name: file.name,
        text: content.slice(0, 15000)
      });
      setAttachedImage(null);
      setSheetOpen(false);
      inputRef.current?.focus();
    };
    reader.readAsText(file);
  };

  const handleDownloadHtml = (htmlCode) => {
    if (!htmlCode) return;
    const blob = new Blob([htmlCode], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "786ai-canvas-" + Date.now() + ".html";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSend = async (customPrompt, overrideTool) => {
    const textToSend = (customPrompt !== undefined ? customPrompt : input).trim();
    const toolToUse = overrideTool || activeTool;
    const currentImage = attachedImage;
    const currentFile = attachedFile;

    if (!textToSend && !currentImage && !currentFile) return;
    if (loading) return;

    const toolObj = SHEET_TOOLS.find((t) => t.id === toolToUse);
    const sid = currentSessionId || Date.now().toString();
    if (!currentSessionId) setCurrentSessionId(sid);

    setInput("");
    setAttachedImage(null);
    setAttachedFile(null);
    setSheetOpen(false);
    setModelMenuOpen(false);

    const userMsg = {
      id: "u-" + Date.now(),
      role: "user",
      text: textToSend || (currentImage ? "Analyze this photo" : "Summarize " + currentFile.name),
      toolId: toolToUse,
      toolName: toolObj ? toolObj.name : "",
      toolIcon: toolObj ? toolObj.icon : "",
      userImageUrl: currentImage?.previewUrl || "",
      userFileName: currentFile?.name || ""
    };

    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setLoading(true);

    // 1. Create Images Mode (when no photo uploaded for vision)
    if (toolToUse === "image" && !currentImage) {
      try {
        const imgRes = await fetch("/api/786ai/image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: textToSend })
        });
        const imgData = await imgRes.json();
        const aiMsg = imgData.imageUrl
          ? {
              id: "a-" + Date.now(),
              role: "assistant",
              modelId: selectedModel,
              toolId: "image",
              text: "Created image for: **" + textToSend + "**",
              imageUrl: imgData.imageUrl
            }
          : {
              id: "a-" + Date.now(),
              role: "assistant",
              modelId: selectedModel,
              toolId: "image",
              text: "⏳ " + (imgData.error || "Please wait 45 seconds before generating the next free image.")
            };
        const finalThread = [...nextMessages, aiMsg];
        setMessages(finalThread);
        if (imgData.imageUrl) persistSession(sid, finalThread, selectedModel, textToSend);
      } catch {
        setMessages((prev) => [
          ...prev,
          { id: "err-" + Date.now(), role: "assistant", modelId: selectedModel, toolId: "image", text: "Network error while generating image." }
        ]);
      } finally {
        setLoading(false);
      }
      return;
    }

    // 2. Gemini API (Chat, Vision Photos/Camera, Files, Canvas, Video, Music, Deep Research, Guided Learning, Think Harder, Plugins)
    try {
      const chatHistoryPayload = nextMessages
        .filter((m) => !m.imageUrl)
        .slice(-10)
        .map((m) => ({ role: m.role, text: m.text }));

      const res = await fetch("/api/786ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: textToSend,
          mode: toolToUse,
          modelPersona: selectedModel,
          messages: chatHistoryPayload,
          imageBase64: currentImage?.base64 || "",
          imageMimeType: currentImage?.mimeType || "image/jpeg",
          fileText: currentFile?.text || "",
          fileName: currentFile?.name || "",
          personalContext: personalEnabled ? personalNote : ""
        })
      });
      const data = await res.json();
      const replyText = data.error ? "Error: " + data.error : data.text;
      const htmlCode = toolToUse === "canvas" || toolToUse === "coding" ? extractHtml(replyText) : "";

      const aiMsg = {
        id: "a-" + Date.now(),
        role: "assistant",
        modelId: selectedModel,
        toolId: toolToUse,
        text: replyText,
        htmlPreview: htmlCode
      };

      const finalThread = [...nextMessages, aiMsg];
      setMessages(finalThread);

      if (!data.error) {
        if (autoSpeak) speakText(replyText);
        persistSession(sid, finalThread, selectedModel, userMsg.text);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: "err-" + Date.now(),
          role: "assistant",
          modelId: selectedModel,
          toolId: toolToUse,
          text: "Network error. Please check your connection and try again."
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[10000] flex flex-col bg-[#080c14] text-slate-100 overflow-hidden">
      {/* Hidden File Inputs for Photos, Camera & Files */}
      <input
        ref={photoInputRef}
        type="file"
        accept="image/*"
        onChange={handleImagePicked}
        className="hidden"
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleImagePicked}
        className="hidden"
      />
      <input
        ref={fileInputRef}
        type="file"
        accept=".txt,.md,.csv,.json,.js,.jsx,.ts,.tsx,.html,.css,.py"
        onChange={handleFilePicked}
        className="hidden"
      />

      {/* Slide-Over Chat History Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-xs"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="relative z-10 w-72 max-w-[82vw] h-full bg-[#0d1320] border-r border-slate-800 flex flex-col">
            <div className="p-3.5 border-b border-slate-800 flex items-center justify-between">
              <span className="text-sm font-extrabold text-white tracking-tight">✨ 786AI History</span>
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="w-8 h-8 rounded-lg bg-slate-900 text-slate-400 hover:text-white flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="p-3">
              <button
                type="button"
                onClick={startNewChat}
                className="w-full py-2.5 px-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 transition"
              >
                <span>+</span>
                <span>New Chat</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-3 space-y-1.5">
              <div className="flex items-center justify-between px-1 py-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Recent Chats ({sessions.length})
                </span>
                {sessions.length > 0 && (
                  <button
                    type="button"
                    onClick={clearAllSessions}
                    className="text-[11px] text-rose-400 hover:text-rose-300"
                  >
                    Clear
                  </button>
                )}
              </div>

              {sessions.length === 0 ? (
                <p className="text-xs text-slate-500 px-2 py-6 text-center">
                  No saved chats yet. Start a conversation!
                </p>
              ) : (
                sessions.map((s) => {
                  const sModel = CHAT_MODELS.find((m) => m.id === s.modelId) || CHAT_MODELS[0];
                  const isActive = s.id === currentSessionId;
                  return (
                    <div
                      key={s.id}
                      onClick={() => openSession(s)}
                      className={`group flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl cursor-pointer transition ${
                        isActive
                          ? "bg-cyan-500/15 border border-cyan-500/40 text-white"
                          : "hover:bg-slate-900 text-slate-300 border border-transparent"
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                          <span>{sModel.icon}</span>
                          <span className="truncate">{sModel.name} • {s.updatedAt}</span>
                        </div>
                        <div className="text-xs font-medium truncate mt-0.5">{s.title}</div>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => deleteSession(e, s.id)}
                        className="px-1.5 py-1 rounded text-slate-500 hover:text-rose-400 text-xs"
                        title="Delete chat"
                      >
                        ✕
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            <div className="p-3 border-t border-slate-800 space-y-1.5">
              <Link
                href="/"
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-cyan-300"
              >
                <span>🏠</span>
                <span>50 AI Tools Directory</span>
              </Link>
              <Link
                href="/blog"
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-slate-300"
              >
                <span>📚</span>
                <span>AI Guides & Tutorials</span>
              </Link>
            </div>
          </aside>
        </div>
      )}

      {/* Gemini / ChatGPT Style Bottom Sheet for "+" Button */}
      {sheetOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-xs"
            onClick={() => setSheetOpen(false)}
          />
          <div className="relative z-10 w-full max-w-2xl mx-auto bg-[#16181d] border-t border-slate-700/80 rounded-t-3xl px-4 pt-3 pb-6 shadow-2xl max-h-[85vh] overflow-y-auto">
            {/* Drag Handle */}
            <div className="w-10 h-1 rounded-full bg-slate-600 mx-auto mb-4" />

            {/* Top 3 Large Media Cards: Photos, Camera, Files */}
            <div className="grid grid-cols-3 gap-2.5 mb-4">
              <button
                type="button"
                onClick={() => photoInputRef.current?.click()}
                className="flex flex-col items-center justify-center gap-2 py-4 px-2 rounded-2xl bg-[#22252c] hover:bg-[#2a2e37] border border-slate-700/60 text-slate-100 transition"
              >
                <span className="text-2xl">🖼️</span>
                <span className="text-xs font-semibold">Photos</span>
              </button>
              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                className="flex flex-col items-center justify-center gap-2 py-4 px-2 rounded-2xl bg-[#22252c] hover:bg-[#2a2e37] border border-slate-700/60 text-slate-100 transition"
              >
                <span className="text-2xl">📷</span>
                <span className="text-xs font-semibold">Camera</span>
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center gap-2 py-4 px-2 rounded-2xl bg-[#22252c] hover:bg-[#2a2e37] border border-slate-700/60 text-slate-100 transition"
              >
                <span className="text-2xl">📎</span>
                <span className="text-xs font-semibold">Files</span>
              </button>
            </div>

            {/* Vertical Tool List (Create images, Create videos, Create music, Canvas, Deep research, Guided learning, Think harder, Plugins) */}
            <div className="space-y-1">
              {SHEET_TOOLS.map((tool) => {
                const isSelected = activeTool === tool.id;
                return (
                  <button
                    key={tool.id}
                    type="button"
                    onClick={() => {
                      setActiveTool(tool.id);
                      setSheetOpen(false);
                      inputRef.current?.focus();
                    }}
                    className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-2xl text-left transition ${
                      isSelected
                        ? "bg-cyan-500/15 border border-cyan-500/40"
                        : "hover:bg-[#22252c]"
                    }`}
                  >
                    <div className="w-9 h-9 rounded-xl bg-[#22252c] flex items-center justify-center text-lg shrink-0">
                      {tool.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-white leading-tight">{tool.name}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{tool.desc}</div>
                    </div>
                    {isSelected && <span className="text-cyan-400 text-xs font-bold">✓</span>}
                  </button>
                );
              })}
            </div>

            {/* Bottom Personal Intelligence Toggle Row (Matching Screenshot) */}
            <div className="mt-3 pt-3 border-t border-slate-800">
              <div className="flex items-center justify-between gap-3 px-2 py-1.5">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-[#22252c] flex items-center justify-center text-lg shrink-0">
                    👤
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-white truncate">Personal Intelligence</span>
                      <span className="px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-[10px] font-bold text-slate-300">
                        Labs
                      </span>
                    </div>
                    <div className="text-xs text-slate-400">Personalize chat if helpful</div>
                  </div>
                </div>

                <button
                  type="button"
                  role="switch"
                  aria-checked={personalEnabled}
                  onClick={() => updatePersonalSettings(!personalEnabled, personalNote)}
                  className={`w-12 h-7 rounded-full p-1 transition shrink-0 ${
                    personalEnabled ? "bg-blue-500" : "bg-slate-700"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${
                      personalEnabled ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {personalEnabled && (
                <div className="mt-2 px-2">
                  {editingPersonal ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={personalNote}
                        onChange={(e) => updatePersonalSettings(true, e.target.value)}
                        placeholder="e.g., Reply in Roman Urdu, I build web apps..."
                        className="flex-1 bg-[#22252c] border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                      />
                      <button
                        type="button"
                        onClick={() => setEditingPersonal(false)}
                        className="px-3 py-1.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs"
                      >
                        Done
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setEditingPersonal(true)}
                      className="text-[11px] text-cyan-400 hover:text-cyan-300 underline"
                    >
                      ✏️ Customize memory: &ldquo;{personalNote.slice(0, 42)}...&rdquo;
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Top Sticky Header Bar */}
      <header className="shrink-0 h-14 px-3 sm:px-5 bg-[#0b101b]/95 backdrop-blur-md border-b border-slate-800/90 flex items-center justify-between gap-2 relative z-30">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 flex items-center justify-center text-slate-200"
            title="Chat History"
          >
            ☰
          </button>

          {/* Model Switcher Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => { setModelMenuOpen((v) => !v); setSheetOpen(false); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white font-bold text-sm transition"
            >
              <span>{activeModelObj.icon}</span>
              <span>{activeModelObj.name}</span>
              <span className="text-[10px] text-slate-400">{modelMenuOpen ? "▲" : "▼"}</span>
            </button>

            {modelMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setModelMenuOpen(false)} />
                <div className="absolute left-0 mt-2 w-64 rounded-2xl bg-[#111827] border border-slate-700 shadow-2xl p-1.5 z-50">
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
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5">
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
            className={`w-9 h-9 rounded-full border flex items-center justify-center text-sm transition ${
              autoSpeak
                ? "bg-cyan-500/20 border-cyan-400 text-cyan-300"
                : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
            }`}
            title="Toggle Auto-Voice"
          >
            {autoSpeak ? "🔊" : "🔇"}
          </button>
          <button
            type="button"
            onClick={startNewChat}
            className="px-3 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-200"
            title="New Chat"
          >
            + New
          </button>
          <Link
            href="/"
            className="hidden sm:inline-flex px-3 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-cyan-300"
          >
            50 Tools
          </Link>
        </div>
      </header>

      {/* Main Scrollable Chat Feed */}
      <main className="flex-1 overflow-y-auto px-3 sm:px-6 py-4">
        <div className="max-w-3xl mx-auto min-h-full flex flex-col justify-start">
          {messages.length === 0 ? (
            <div className="my-auto py-6 text-center sm:text-left">
              <div className="inline-flex sm:flex items-center gap-3 mb-3">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${activeModelObj.color} flex items-center justify-center text-2xl shadow-lg`}>
                  {activeModelObj.icon}
                </div>
                <div className="text-left">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                    Hi! I&apos;m {activeModelObj.name}
                  </h1>
                  <p className="text-xs text-cyan-300 font-semibold">
                    {activeModelObj.tag} • Tap + for Photos, Camera, Canvas & Deep Research
                  </p>
                </div>
              </div>

              <p className="text-sm text-slate-400 mb-6 max-w-xl mx-auto sm:mx-0">
                Ask anything in English, Urdu, or Roman Urdu — or tap <strong className="text-white">+</strong> below to upload photos, scan with camera, create images, build Canvas apps, or run Deep Research.
              </p>

              {/* Quick Start Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-left">
                <button
                  type="button"
                  onClick={() => handleSend("Futuristic neon cyberpunk city at night, 8k ultra detailed", "image")}
                  className="p-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 hover:border-cyan-500/40 transition"
                >
                  <div className="text-xs font-bold text-purple-300 mb-1">🖼️ Create images</div>
                  <div className="text-sm text-slate-200">Visualize & generate 8K cyberpunk artwork</div>
                </button>
                <button
                  type="button"
                  onClick={() => handleSend("Build a modern scientific calculator app", "canvas")}
                  className="p-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 hover:border-cyan-500/40 transition"
                >
                  <div className="text-xs font-bold text-emerald-300 mb-1">🖥️ Canvas</div>
                  <div className="text-sm text-slate-200">Code, write, or make interactive slides</div>
                </button>
                <button
                  type="button"
                  onClick={() => handleSend("Deep research report on best free AI tools for creators in 2026", "research")}
                  className="p-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 hover:border-cyan-500/40 transition"
                >
                  <div className="text-xs font-bold text-cyan-300 mb-1">🔬 Deep research</div>
                  <div className="text-sm text-slate-200">Get detailed multi-section AI reports</div>
                </button>
                <button
                  type="button"
                  onClick={() => handleSend("Teach me how to build AI automations step-by-step", "learning")}
                  className="p-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 hover:border-cyan-500/40 transition"
                >
                  <div className="text-xs font-bold text-amber-300 mb-1">📖 Guided learning</div>
                  <div className="text-sm text-slate-200">Get step-by-step interactive tutoring</div>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-5 pb-2">
              {messages.map((msg) => {
                if (msg.role === "user") {
                  return (
                    <div key={msg.id} className="flex flex-col items-end">
                      {msg.toolName && (
                        <span className="text-[11px] font-semibold text-cyan-300 mb-1 px-2">
                          {msg.toolIcon} {msg.toolName}
                        </span>
                      )}
                      {msg.userImageUrl && (
                        <img
                          src={msg.userImageUrl}
                          alt="Uploaded"
                          className="max-h-48 rounded-2xl border border-cyan-500/40 mb-1.5 shadow"
                        />
                      )}
                      {msg.userFileName && (
                        <div className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-cyan-300 mb-1.5">
                          📎 {msg.userFileName}
                        </div>
                      )}
                      <div className="max-w-[85%] sm:max-w-[75%] rounded-2xl rounded-br-sm bg-cyan-500 text-slate-950 font-medium px-4 py-2.5 text-sm shadow-md">
                        {msg.text}
                      </div>
                    </div>
                  );
                }

                const msgModel = CHAT_MODELS.find((m) => m.id === msg.modelId) || activeModelObj;
                return (
                  <div key={msg.id} className="flex items-start gap-2.5">
                    <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${msgModel.color} flex items-center justify-center text-sm shrink-0 mt-0.5 shadow`}>
                      {msgModel.icon}
                    </div>
                    <div className="flex-1 min-w-0 bg-slate-900/90 border border-slate-800/90 rounded-2xl rounded-tl-sm p-3.5 sm:p-4">
                      <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-slate-800/80">
                        <span className="text-xs font-bold text-cyan-300">{msgModel.name}</span>
                        <div className="flex items-center gap-2.5">
                          <button
                            type="button"
                            onClick={() => speakText(msg.text)}
                            className="text-[11px] text-slate-400 hover:text-cyan-300"
                          >
                            🔊 Listen
                          </button>
                          <button
                            type="button"
                            onClick={() => handleCopy(msg.id, msg.text)}
                            className="text-[11px] text-slate-400 hover:text-white"
                          >
                            {copiedId === msg.id ? "Copied!" : "Copy"}
                          </button>
                        </div>
                      </div>

                      {msg.imageUrl ? (
                        <div className="text-center">
                          <img
                            src={msg.imageUrl}
                            alt="786AI Generated"
                            className="max-h-[420px] mx-auto rounded-xl border border-slate-800 my-2"
                          />
                          <a
                            href={msg.imageUrl}
                            download={"786ai-image-" + Date.now() + ".jpg"}
                            className="inline-block mt-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs"
                          >
                            ⬇ Download Image
                          </a>
                        </div>
                      ) : (
                        <>
                          {msg.htmlPreview && (
                            <div className="mb-3 rounded-xl overflow-hidden border border-slate-700 bg-slate-950">
                              <div className="flex items-center justify-between px-3 py-2 bg-slate-800/90">
                                <span className="text-[11px] font-bold text-cyan-300">CANVAS LIVE PREVIEW</span>
                                <button
                                  type="button"
                                  onClick={() => handleDownloadHtml(msg.htmlPreview)}
                                  className="px-3 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs"
                                >
                                  ⬇ Download .html
                                </button>
                              </div>
                              <iframe
                                title="786AI Canvas Preview"
                                srcDoc={msg.htmlPreview}
                                className="w-full h-80 bg-white"
                              />
                            </div>
                          )}
                          <FormattedOutput content={msg.text} />
                        </>
                      )}
                    </div>
                  </div>
                );
              })}

              {loading && (
                <div className="flex items-center gap-2.5 px-1">
                  <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${activeModelObj.color} flex items-center justify-center text-sm animate-pulse`}>
                    {activeModelObj.icon}
                  </div>
                  <div className="px-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-cyan-300">
                    {activeModelObj.name} is thinking...
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </main>

      {/* Sticky Bottom Composer Bar */}
      <footer className="shrink-0 px-3 sm:px-6 pb-3 pt-2 bg-[#080c14] border-t border-slate-800/80 relative z-30">
        <div className="max-w-3xl mx-auto">
          {/* Attached Photo or File Preview Pill */}
          {(attachedImage || attachedFile) && (
            <div className="mb-2 flex items-center gap-2">
              {attachedImage && (
                <div className="inline-flex items-center gap-2 p-1.5 pr-3 rounded-2xl bg-slate-900 border border-cyan-500/40">
                  <img src={attachedImage.previewUrl} alt="Preview" className="w-10 h-10 rounded-xl object-cover" />
                  <span className="text-xs text-slate-200 max-w-[160px] truncate">{attachedImage.name}</span>
                  <button
                    type="button"
                    onClick={() => setAttachedImage(null)}
                    className="text-slate-400 hover:text-rose-400 text-xs font-bold"
                  >
                    ✕
                  </button>
                </div>
              )}
              {attachedFile && (
                <div className="inline-flex items-center gap-2 px-3 py-2 rounded-2xl bg-slate-900 border border-cyan-500/40">
                  <span>📎</span>
                  <span className="text-xs text-slate-200 max-w-[180px] truncate">{attachedFile.name}</span>
                  <button
                    type="button"
                    onClick={() => setAttachedFile(null)}
                    className="text-slate-400 hover:text-rose-400 text-xs font-bold"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Active Tool Chip & Presets */}
          {activeToolObj && (
            <div className="mb-2 flex items-center gap-2 overflow-x-auto pb-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-bold shrink-0">
                <span>{activeToolObj.icon}</span>
                <span>{activeToolObj.name}</span>
                <button
                  type="button"
                  onClick={() => setActiveTool("chat")}
                  className="ml-1 text-slate-300 hover:text-white"
                  title="Close Tool"
                >
                  ✕
                </button>
              </span>
              {activeToolObj.presets.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSend(p, activeTool)}
                  className="px-3 py-1 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] text-slate-300 whitespace-nowrap shrink-0"
                >
                  ⚡ {p.slice(0, 34)}...
                </button>
              ))}
            </div>
          )}

          {/* Input Pill (Matching Gemini & ChatGPT Mobile Bar) */}
          <form
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="flex items-center gap-2 bg-slate-900 border border-slate-700/90 focus-within:border-cyan-400 rounded-full px-2.5 py-1.5 shadow-lg"
          >
            <button
              type="button"
              onClick={() => { setSheetOpen(true); setModelMenuOpen(false); }}
              className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-lg shrink-0 transition ${
                sheetOpen || activeTool !== "chat"
                  ? "bg-cyan-500 text-slate-950"
                  : "bg-slate-800 hover:bg-slate-700 text-slate-200"
              }`}
              title="Photos, Camera, Files & AI Tools"
            >
              +
            </button>

            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={activeToolObj ? activeToolObj.placeholder : "Ask " + activeModelObj.name + "..."}
              className="flex-1 bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none px-1"
            />

            <button
              type="button"
              onClick={() => handleVoiceInput(false)}
              className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition ${
                listening
                  ? "bg-rose-600 text-white animate-pulse"
                  : "text-slate-300 hover:bg-slate-800"
              }`}
              title="Dictate Text"
            >
              🎙️
            </button>

            {input.trim() || attachedImage || attachedFile ? (
              <button
                type="submit"
                disabled={loading}
                className="w-9 h-9 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold flex items-center justify-center shrink-0 disabled:opacity-35 transition"
                title="Send"
              >
                ↑
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleVoiceInput(true)}
                className="w-9 h-9 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center justify-center shrink-0 shadow transition"
                title="Live Voice Chat"
              >
                〰️
              </button>
            )}
          </form>
        </div>
      </footer>
    </div>
  );
}
