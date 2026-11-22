'use client';
import { useState, useEffect } from 'react';
import AuthModal from '../components/AuthModal';

const MASTER_100_TOOLS = [
  { id: 0, name: "Google Gemini", description: "Google advanced multimodal AI model for text, code, and reasoning.", category: "Text & Writing AI", rating: "4.9", pricing: "Freemium", icon: "✨", url: "https://gemini.google.com/" },
  // Text & Writing AI
  { id: '1', name: 'ChatGPT', description: 'Advanced AI language model for interaction, creativity, and writing.', category: 'Text & Writing', rating: '5.0', pricing: 'Freemium', icon: '🤖', url: 'https://chatgpt.com/' },
  { id: '2', name: 'Claude AI', description: 'Next-gen assistant by Anthropic for long-context analysis and code.', category: 'Text & Writing', rating: '4.9', pricing: 'Freemium', icon: '🧠', url: 'https://claude.ai/' },
  { id: '3', name: 'Perplexity AI', description: 'AI-powered live answer search engine with verifiable citations.', category: 'Text & Writing', rating: '4.8', pricing: 'Freemium', icon: '🔍', url: 'https://www.perplexity.ai/' },
  { id: '4', name: 'Jasper AI', description: 'Enterprise-grade copywriter for blog posts and social marketing.', category: 'Text & Writing', rating: '4.7', pricing: 'Paid', icon: '✍️', url: 'https://www.jasper.ai/' },
  { id: '5', name: 'Midjourney', description: 'Generative AI platform for photorealistic artwork generation.', category: 'Image Generator', rating: '4.9', pricing: 'Paid', icon: '🎨', url: 'https://www.midjourney.com/' },
  { id: '6', name: 'Leonardo AI', description: 'Production-quality visual assets and gaming graphics creator.', category: 'Image Generator', rating: '4.8', pricing: 'Freemium', icon: '🖼️', url: 'https://leonardo.ai/' },
  { id: '7', name: 'Stable Diffusion', description: 'Open-source latent image diffusion model by Stability AI.', category: 'Image Generator', rating: '4.8', pricing: 'Free', icon: '🔮', url: 'https://stability.ai/' },
  { id: '8', name: 'FLUX.1 AI', description: 'State-of-the-art open image model with supreme realism.', category: 'Image Generator', rating: '4.9', pricing: 'Free', icon: '⚡', url: 'https://blackforestlabs.ai/' },
  { id: '9', name: 'Remove.bg', description: 'Instant AI background removal for photos in 1-click.', category: 'Image Generator', rating: '4.9', pricing: 'Free', icon: '🧼', url: 'https://www.remove.bg/' },
  { id: '10', name: 'Runway Gen-2', description: 'Generative AI video suite transforming text and images into film clips.', category: 'Video Generator', rating: '4.8', pricing: 'Freemium', icon: '🎬', url: 'https://runwayml.com/' },
  { id: '11', name: 'Luma Dream Machine', description: 'High-fidelity video synthesis powered by deep neural networks.', category: 'Video Generator', rating: '4.9', pricing: 'Freemium', icon: '✨', url: 'https://lumalabs.ai/' },
  { id: '12', name: 'CapCut AI', description: 'Smart video editor with automated captions, effects, and tracking.', category: 'Video Generator', rating: '4.8', pricing: 'Free', icon: '📲', url: 'https://www.capcut.com/' },
  { id: '13', name: 'ElevenLabs', description: 'Human-quality AI voice synthesis, text-to-speech, and voice cloning.', category: 'Voice & Music', rating: '4.9', pricing: 'Freemium', icon: '🎙️', url: 'https://try.elevenlabs.io/0cxvk7hfr2qk' },
  { id: '14', name: 'Suno AI', description: 'Generate complete songs with realistic vocals and instrumentals.', category: 'Voice & Music', rating: '4.8', pricing: 'Freemium', icon: '🎵', url: 'https://suno.com/' },
  { id: '15', name: 'Voice.ai', description: 'Real-time AI voice changer for streaming and gaming.', category: 'Voice & Music', rating: '4.6', pricing: 'Free', icon: '🎤', url: 'https://voice.ai/' },
  { id: '16', name: 'v0.dev', description: 'Generative UI system by Vercel for React and Tailwind components.', category: 'Coding Tools', rating: '4.9', pricing: 'Freemium', icon: '⚡', url: 'https://v0.dev/' },
  { id: '17', name: 'Codeium', description: 'Free AI code autocomplete extension supporting all modern IDEs.', category: 'Coding Tools', rating: '4.8', pricing: 'Free', icon: '⌨️', url: 'https://codeium.com/' },
  { id: '18', name: 'Cursor Editor', description: 'AI-first code editor designed for rapid full-stack engineering.', category: 'Coding Tools', rating: '4.9', pricing: 'Freemium', icon: '🚀', url: 'https://cursor.com/' },
  { id: '19', name: 'Thunderbit', description: 'No-code browser AI automation and web data scraping platform.', category: 'AI Automation', rating: '4.7', pricing: 'Freemium', icon: '🌐', url: 'https://www.thunderbit.com/' },
  { id: '20', name: 'n8n.io', description: 'Fair-code workflow automation tool with native AI integrations.', category: 'AI Automation', rating: '4.8', pricing: 'Free', icon: '⚙️', url: 'https://n8n.io/' },
  { id: '21', name: 'Make.com', description: 'Visual automation platform connecting AI models to business apps.', category: 'AI Automation', rating: '4.9', pricing: 'Freemium', icon: '🔄', url: 'https://www.make.com/en/register?pc=aliraza' },
  {"id":"33","name":"NotebookLM","description":"100% free AI research assistant and study guide generator by Google for summarizing PDFs, notes, and YouTube videos with audio overviews.","category":"Text & Writing","rating":"4.9","pricing":"Free","icon":"📓","url":"https://notebooklm.google.com"},
  {"id":"34","name":"DeepSeek AI","description":"Free open-weight AI chatbot and reasoning assistant for coding, math problem solving, and long-form writing with zero daily paywall.","category":"Text & Writing","rating":"4.8","pricing":"Free","icon":"🐋","url":"https://chat.deepseek.com"},
  {"id":"35","name":"Gamma AI","description":"Free AI presentation maker and slide deck generator that turns text prompts and notes into clean visual slides in seconds.","category":"Text & Writing","rating":"4.8","pricing":"Freemium","icon":"📊","url":"https://gamma.app"},
  {"id":"36","name":"Photopea AI","description":"100% free online photo editor and Photoshop alternative in your browser with AI magic replace, background removal, and PSD support.","category":"Image & Design","rating":"4.8","pricing":"Free","icon":"🎨","url":"https://www.photopea.com"},
  {"id":"37","name":"Napkin AI","description":"Free AI diagram and infographic generator that transforms plain text articles and notes into clean visual charts for creators.","category":"Image & Design","rating":"4.8","pricing":"Freemium","icon":"✏️","url":"https://www.napkin.ai"},
  {"id":"38","name":"Recraft AI","description":"Free AI vector art, logo, and icon generator with crisp text rendering and consistent brand styles for graphic designers.","category":"Image & Design","rating":"4.8","pricing":"Freemium","icon":"🖌️","url":"https://www.recraft.ai"},
  {"id":"39","name":"Kling AI","description":"High-realism AI video generator with free daily credits for turning text prompts and still images into smooth 1080p video clips.","category":"Video Generation","rating":"4.8","pricing":"Freemium","icon":"🎬","url":"https://klingai.com"},
  {"id":"40","name":"Hailuo AI","description":"Free-tier text-to-video and image-to-video AI generator built for lifelike character motion and faceless YouTube storytelling.","category":"Video Generation","rating":"4.7","pricing":"Freemium","icon":"🎥","url":"https://hailuoai.video"},
  {"id":"41","name":"Vizard AI","description":"Free AI video clipper that automatically turns long YouTube videos and podcasts into viral TikTok, Reels, and Shorts with captions.","category":"Video Generation","rating":"4.7","pricing":"Freemium","icon":"✂️","url":"https://vizard.ai"},
  {"id":"42","name":"Udio AI","description":"Free-tier AI music and song generator creating studio-quality vocals, background tracks, and custom lyrics from simple text prompts.","category":"Voice & Music","rating":"4.8","pricing":"Freemium","icon":"🎶","url":"https://www.udio.com"},
  {"id":"43","name":"Adobe Podcast AI","description":"Free AI voice enhancer and background noise remover that makes mobile phone recordings sound like a professional studio mic.","category":"Voice & Music","rating":"4.8","pricing":"Freemium","icon":"🎙️","url":"https://podcast.adobe.com"},
  {"id":"44","name":"TTSMaker","description":"100% free text-to-speech AI voice generator supporting 100+ languages with commercial usage rights and instant MP3 download.","category":"Voice & Music","rating":"4.7","pricing":"Free","icon":"🔊","url":"https://ttsmaker.com"},
  {"id":"45","name":"Bolt.new","description":"Free-tier AI full-stack web app builder that generates, runs, and deploys Next.js and React projects directly in your browser.","category":"Coding Tools","rating":"4.9","pricing":"Freemium","icon":"⚡","url":"https://bolt.new"},
  {"id":"46","name":"Windsurf Editor","description":"Agentic AI code editor with generous free autocomplete and multi-file editing built for fast web and mobile app development.","category":"Coding Tools","rating":"4.8","pricing":"Freemium","icon":"🏄","url":"https://codeium.com/windsurf"},
  {"id":"47","name":"GroqCloud","description":"Ultra-fast AI inference platform with a free API tier for running Llama, Whisper, and open-source models at lightning speed.","category":"Coding Tools","rating":"4.9","pricing":"Freemium","icon":"🚀","url":"https://console.groq.com"},
  {"id":"48","name":"Notion AI","description":"All-in-one AI workspace and note-taking app with a free plan for organizing projects, docs, tasks, and knowledge bases.","category":"Automation & Business","rating":"4.8","pricing":"Freemium","icon":"📝","url":"https://www.notion.so"},
  {"id":"49","name":"Tally Forms AI","description":"100% free online form and survey builder with unlimited forms, unlimited submissions, and smart logic for creators and startups.","category":"Automation & Business","rating":"4.9","pricing":"Free","icon":"📋","url":"https://tally.so"},
  {"id":"50","name":"Zapier Free","description":"No-code AI workflow automation tool with a free forever tier connecting 7,000+ apps like Gmail, Google Sheets, and Slack.","category":"Automation & Business","rating":"4.8","pricing":"Freemium","icon":"🔗","url":"https://zapier.com"}
];

export default function Home() {
  const [theme, setTheme] = useState('dark');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [tools] = useState(MASTER_100_TOOLS);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [priceFilter, setPriceFilter] = useState('All');
  const [lang, setLang] = useState('en');
  const [favorites, setFavorites] = useState([]);
  const [activeTab, setActiveTab] = useState('explore');
  const [user, setUser] = useState(null);
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const [nativeTool, setNativeTool] = useState('writer');
  const [nativeInput, setNativeInput] = useState('');
  const [nativeOutput, setNativeOutput] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [autoTask, setAutoTask] = useState('scraper');
  const [autoTarget, setAutoTarget] = useState('');
  const [autoLogs, setAutoLogs] = useState([]);
  const [isAutoRunning, setIsAutoRunning] = useState(false);

  useEffect(() => {
    try {
      const savedFavs = localStorage.getItem('786ai_favs');
      if (savedFavs) {
        setFavorites(JSON.parse(savedFavs));
      }

      const savedUser = localStorage.getItem('786ai_user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (e) {
      console.error('Failed to load saved session state', e);
    }
  }, []);

  const toggleFavorite = (id) => {
    const updated = favorites.includes(id) ? favorites.filter((f) => f !== id) : [...favorites, id];
    setFavorites(updated);
    localStorage.setItem('786ai_favs', JSON.stringify(updated));
  };

  const handleLoginSuccess = (account) => {
    setUser(account);
    setAuthModalOpen(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('786ai_user');
  };

  const handleNativeRun = () => {
    if (!nativeInput) return;
    setIsExecuting(true);
    setNativeOutput('');
    setTimeout(() => {
      if (nativeTool === 'writer') setNativeOutput(`[AI Native Writer]\n\nHeadline: High Converting Copy\nContent: Based on "${nativeInput}", your article drafting is completed.`);
      else if (nativeTool === 'caption') setNativeOutput(`[Social Media Caption]\n\n🚀 "${nativeInput}"\n\n#786AI #Viral #Automation2026`);
      else if (nativeTool === 'hashtags') setNativeOutput(`#AI #${nativeInput.replace(/\s+/g, '')} #Tech #Trends`);
      else if (nativeTool === 'summarizer') setNativeOutput(`[Summary]: ${nativeInput.slice(0, 90)}...`);
      else setNativeOutput(`[Urdu Translation]: "${nativeInput}" کا اردو ترجمہ مکمل ہو گیا ہے۔`);
      setIsExecuting(false);
    }, 1000);
  };

  const handleRunAutomation = () => {
    if (!autoTarget) return;
    setIsAutoRunning(true);
    setAutoLogs(['[1/3] Initializing 786 AI Engine Workflow...']);
    setTimeout(() => {
      setAutoLogs((prev) => [...prev, `[2/3] Executing Action: ${autoTask.toUpperCase()} for Target: "${autoTarget}"`]);
    }, 1000);
    setTimeout(() => {
      setAutoLogs((prev) => [...prev, `[3/3] Workflow Complete! Successfully executed 786 AI Pipeline for "${autoTarget}". Data synchronized.`]);
      setIsAutoRunning(false);
    }, 2200);
  };

  const categories = ['All', 'Text & Writing', 'Image Generator', 'Video Generator', 'Voice & Music', 'Coding Tools', 'AI Automation'];

  const filteredTools = tools.filter((t) => {
    const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase()) || t.description.toLowerCase().includes(search.toLowerCase());
    const matchesCat = category === 'All' || t.category === category;
    const matchesPrice = priceFilter === 'All' || t.pricing.toLowerCase() === priceFilter.toLowerCase();
    const matchesFav = activeTab !== 'saved' || favorites.includes(t.id);
    return matchesSearch && matchesCat && matchesPrice && matchesFav;
  });

  const isDark = theme === 'dark';
  const bgColor = isDark ? '#090d16' : '#f8fafc';
  const cardBg = isDark ? '#0f172a' : '#ffffff';
  const textColor = isDark ? '#ffffff' : '#0f172a';
  const subTextColor = isDark ? '#94a3b8' : '#64748b';
  const borderCol = isDark ? '#1e293b' : '#e2e8f0';

  return (
    <main style={{ minHeight: '100vh', backgroundColor: bgColor, color: textColor, fontFamily: 'system-ui, -apple-system, sans-serif', transition: 'background-color 0.3s ease', paddingBottom: '60px' }}>
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setAuthModalOpen(false)} onLoginSuccess={handleLoginSuccess} />

      <header style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${borderCol}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '26px' }}>🔮</span>
          <h1 style={{ fontSize: '22px', fontWeight: '900', background: 'linear-gradient(to right, #38bdf8, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 }}><span className="whitespace-nowrap shrink-0">786 AI Hub</span></h1>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
            <nav className="hidden lg:flex items-center gap-1 mr-1 text-xs font-semibold text-slate-300">
              <a href="/" className="px-3 py-2 rounded-xl hover:bg-slate-800/80 hover:text-white transition">
                Explore Tools
              </a>
              <a href="/studio" className="px-3 py-2 rounded-xl hover:bg-slate-800/80 text-cyan-300 transition">
                ✨ 786AI Studio
              </a>

            <a href="/mini-tools/hot" className="px-3 py-2 rounded-xl hover:bg-slate-800/80 text-emerald-300 transition">
              🔥 Mini-Tools
            </a>
            <a href="/ai-video" className="px-3 py-2 rounded-xl hover:bg-slate-800/80 text-amber-300 transition">
              🎬 AI Video
            </a>
              <a href="/blog" className="px-3 py-2 rounded-xl hover:bg-slate-800/80 hover:text-white transition">
                AI Guides
              </a>
            </nav>
            <a
              href="/ai-video"
              className="lg:hidden inline-flex items-center gap-1.5 px-2.5 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 text-xs font-bold shadow-md transition shrink-0"
            >
              <span>🎬</span>
              <span>AI Video</span>
            </a>
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              aria-label="Open Menu"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/95 hover:bg-slate-800 border border-slate-700/90 hover:border-cyan-500/50 text-slate-100 text-xs font-bold shadow-md transition shrink-0"
            >
              <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <span>Menu</span>
            </button>
          </div>
      </header>
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-[10050] flex justify-end">
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <aside className="relative z-10 w-80 max-w-[88vw] h-full bg-[#0b101b] border-l border-slate-800/90 flex flex-col justify-between overflow-y-auto shadow-2xl text-slate-100">
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800/80 bg-[#0e1422]">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 flex items-center justify-center text-lg">
                    🔮
                  </div>
                  <div>
                    <div className="font-extrabold text-sm text-white leading-tight whitespace-nowrap">
                      786 AI Hub
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Navigation &amp; Workspace
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileSidebarOpen(false)}
                  aria-label="Close Menu"
                  className="w-8 h-8 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white flex items-center justify-center text-xs transition"
                >
                  ✕
                </button>
              </div>

              <div className="p-4 space-y-5">
                {/* Main Navigation Section */}
                <div className="space-y-1.5">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-2 pb-1">
                    Platform Menu
                  </p>
                  <a
                    href="/"
                    onClick={() => setMobileSidebarOpen(false)}
                    className="group flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-800/90 border border-slate-800/80 hover:border-slate-700 transition"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-base">🏠</span>
                      <div>
                        <div className="text-xs font-bold text-slate-100 group-hover:text-white">AI Tools Directory</div>
                        <div className="text-[10px] text-slate-400">Browse 50+ curated AI apps</div>
                      </div>
                    </div>
                    <span className="text-slate-500 group-hover:text-cyan-400 text-xs">›</span>
                  </a>

                  <a
                    href="/studio"
                    onClick={() => setMobileSidebarOpen(false)}
                    className="group flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500/15 to-blue-600/15 hover:from-cyan-500/25 hover:to-blue-600/25 border border-cyan-500/35 transition"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-base">✨</span>
                      <div>
                        <div className="text-xs font-bold text-cyan-300 flex items-center gap-2">
                          <span>786AI Studio</span>
                          <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-cyan-500/20 text-cyan-200 font-extrabold">FREE</span>
                        </div>
                        <div className="text-[10px] text-slate-300">Chat, Canvas &amp; Image Generator</div>
                      </div>
                    </div>
                    <span className="text-cyan-400 text-xs">›</span>
                  </a>
            <a
              href="/ai-video"
              onClick={() => setMobileSidebarOpen(false)}
              className="group flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500/15 to-orange-600/15 hover:from-amber-500/25 hover:to-orange-600/25 border border-amber-500/35 transition"
            >
              <div className="flex items-center gap-3">
                <span className="text-base">🎬</span>
                <div>
                  <div className="text-xs font-bold text-amber-300 flex items-center gap-2">
                    <span>786 AI Video Studio</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-amber-500/20 text-amber-200 font-extrabold">PRO</span>
                  </div>
                  <div className="text-[10px] text-slate-400">Veo 3.1, Sora 2, Kling &amp; Seedance</div>
                </div>
              </div>
              <span className="text-amber-400 text-xs">&gt;</span>
            </a>

            <a
              href="/mini-tools/hot"
              onClick={() => setMobileSidebarOpen(false)}
              className="group flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500/15 to-teal-600/15 hover:from-emerald-500/25 hover:to-teal-600/25 border border-emerald-500/35 transition"
            >
              <div className="flex items-center gap-3">
                <span className="text-base">🔥</span>
                <div>
                  <div className="text-xs font-bold text-emerald-300 flex items-center gap-2">
                    <span>Hot AI Mini-Tools</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-200 font-extrabold">NEW</span>
                  </div>
                  <div className="text-[10px] text-slate-400">Prompt Enhancer, Reels Hooks &amp; SEO</div>
                </div>
              </div>
              <span className="text-emerald-400 text-xs">&gt;</span>
            </a>


                  <a
                    href="/blog"
                    onClick={() => setMobileSidebarOpen(false)}
                    className="group flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-800/90 border border-slate-800/80 hover:border-slate-700 transition"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-base">📚</span>
                      <div>
                        <div className="text-xs font-bold text-slate-100 group-hover:text-white">AI Guides &amp; Blog</div>
                        <div className="text-[10px] text-slate-400">Tutorials &amp; automation workflows</div>
                      </div>
                    </div>
                    <span className="text-slate-500 group-hover:text-cyan-400 text-xs">›</span>
                  </a>
              <a
                href="/studio"
                onClick={() => setMobileSidebarOpen(false)}
                className="group flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500/15 to-orange-500/15 hover:from-amber-500/25 hover:to-orange-500/25 border border-amber-500/35 transition"
              >
                <div className="flex items-center gap-3">
                  <span className="text-base">🎁</span>
                  <div>
                    <div className="text-xs font-bold text-amber-300 flex items-center gap-2">
                      <span>25 Bonus Credits</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-amber-500/20 text-amber-200 font-extrabold">FREE</span>
                    </div>
                    <div className="text-[10px] text-slate-300">Claim starter credits for 786AI Studio</div>
                  </div>
                </div>
                <span className="text-amber-400 text-xs">&gt;</span>
              </a>
                </div>

                {/* Account & Controls Styled as Clean Menu Items */}
                <div className="space-y-2 border-t border-slate-800/80 pt-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-2 pb-0.5">
                    Account &amp; Workspace
                  </p>
                  <div
                    onClickCapture={() => setTimeout(() => setMobileSidebarOpen(false), 150)}
                    className="flex flex-col gap-2 [&_div]:!flex [&_div]:!items-center [&_div]:!justify-between [&_div]:!gap-2 [&_span]:!whitespace-nowrap [&_span]:!text-xs [&_span]:!font-semibold [&_span]:!text-slate-300 [&_button]:!w-full [&_button]:!flex [&_button]:!items-center [&_button]:!justify-center [&_button]:!gap-2 [&_button]:!px-3.5 [&_button]:!py-2.5 [&_button]:!rounded-xl [&_button]:!bg-slate-900/90 [&_button:hover]:!bg-slate-800 [&_button]:!border [&_button]:!border-slate-800 [&_button:hover]:!border-cyan-500/40 [&_button]:!text-slate-100 [&_button]:!text-xs [&_button]:!font-semibold [&_button]:!shadow-none [&_button]:!transition"
                  >
                    <button onClick={() => setTheme(isDark ? 'light' : 'dark')} style={{ backgroundColor: cardBg, color: textColor, border: `1px solid ${borderCol}`, borderRadius: '20px', padding: '6px 14px', cursor: 'pointer', fontWeight: '700' }}>
            {isDark ? '☀️ Light' : '🌙 Dark'}
          </button>
          <button onClick={() => setLang(lang === 'en' ? 'ur' : 'en')} style={{ backgroundColor: cardBg, color: '#38bdf8', border: `1px solid ${borderCol}`, borderRadius: '20px', padding: '6px 14px', cursor: 'pointer', fontWeight: '700' }}>
            {lang === 'en' ? 'اردو' : 'English'}
          </button>

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '12px', color: '#cbd5e1' }}>Hi, {user.name || user.email?.split('@')[0]}</span>
              <button onClick={logout} style={{ backgroundColor: '#7c3aed', color: '#fff', border: 'none', borderRadius: '20px', padding: '7px 14px', cursor: 'pointer', fontWeight: '700' }}>Logout</button>
            </div>
          ) : (
            <button onClick={() => setAuthModalOpen(true)} style={{ backgroundColor: '#7c3aed', color: '#fff', border: 'none', borderRadius: '20px', padding: '7px 16px', cursor: 'pointer', fontWeight: '700', fontSize: '12px' }}>Login / Join</button>
          )}

          <a href="/submit" style={{ backgroundColor: "#10b981", color: "#fff", padding: "7px 14px", borderRadius: "20px", textDecoration: "none", fontWeight: "700", fontSize: "12px" }}>+ Add Tool</a>
          <a href="/admin" style={{ backgroundColor: '#0ea5e9', color: '#fff', padding: '7px 16px', borderRadius: '20px', textDecoration: 'none', fontWeight: '700', fontSize: '12px' }}>Admin Panel</a>
                  </div>
                </div>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-slate-800/80 bg-[#090d16]">
              <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
                <a href="/privacy-policy" onClick={() => setMobileSidebarOpen(false)} className="hover:text-cyan-300 transition">
                  Privacy
                </a>
                <span>•</span>
                <a href="/terms-of-service" onClick={() => setMobileSidebarOpen(false)} className="hover:text-cyan-300 transition">
                  Terms
                </a>
                <span>•</span>
                <a href="/affiliate-disclosure" onClick={() => setMobileSidebarOpen(false)} className="hover:text-cyan-300 transition">
                  Disclosure
                </a>
              </div>
            </div>
          </aside>
        </div>
      )}

      <section style={{ textAlign: 'center', padding: '40px 20px 24px', maxWidth: '850px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '40px', fontWeight: '900', margin: '0 0 14px', lineHeight: '1.2' }}>
          Unleash the <span style={{ background: 'linear-gradient(to right, #c084fc, #38bdf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Power of AI.</span>
        </h2>
        <p style={{ color: subTextColor, fontSize: '15px', margin: '0 0 28px' }}>Global Tools Directory, Native Processors & Automation Studio.</p>

        <div style={{ maxWidth: '580px', margin: '0 auto 28px' }}>
          <input
            type="text"
            placeholder="Search AI tools, Free models, or Automations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', backgroundColor: cardBg, border: `1px solid ${borderCol}`, borderRadius: '30px', padding: '16px 24px', color: textColor, fontSize: '15px', outline: 'none', boxShadow: '0 10px 30px rgba(59,130,246,0.12)' }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <button onClick={() => setActiveTab('explore')} style={{ backgroundColor: activeTab === 'explore' ? '#7c3aed' : cardBg, color: activeTab === 'explore' ? '#fff' : textColor, border: `1px solid ${borderCol}`, borderRadius: '20px', padding: '8px 18px', fontWeight: '700', cursor: 'pointer' }}>Explore</button>
          <button onClick={() => setActiveTab('native')} style={{ backgroundColor: activeTab === 'native' ? '#7c3aed' : cardBg, color: activeTab === 'native' ? '#fff' : textColor, border: `1px solid ${borderCol}`, borderRadius: '20px', padding: '8px 18px', fontWeight: '700', cursor: 'pointer' }}>Native AI</button>
          <button onClick={() => setActiveTab('automation')} style={{ backgroundColor: activeTab === 'automation' ? '#7c3aed' : cardBg, color: activeTab === 'automation' ? '#fff' : textColor, border: `1px solid ${borderCol}`, borderRadius: '20px', padding: '8px 18px', fontWeight: '700', cursor: 'pointer' }}>Automation</button>
          <button onClick={() => setActiveTab('saved')} style={{ backgroundColor: activeTab === 'saved' ? '#7c3aed' : cardBg, color: activeTab === 'saved' ? '#fff' : textColor, border: `1px solid ${borderCol}`, borderRadius: '20px', padding: '8px 18px', fontWeight: '700', cursor: 'pointer' }}>Saved</button>
        </div>
      </section>

      <section style={{ maxWidth: '1200px', margin: '0 auto 24px', padding: '0 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
          {[
            { label: 'Affiliate Traffic', value: '18.4K' },
            { label: 'Unique Clicks', value: '12.8K' },
            { label: 'Approved Leads', value: '2.6K' },
            { label: 'Conversion Rate', value: '7.3%' },
          ].map((stat) => (
            <div key={stat.label} style={{ backgroundColor: cardBg, border: `1px solid ${borderCol}`, borderRadius: '18px', padding: '18px 20px' }}>
              <div style={{ color: subTextColor, fontSize: '12px' }}>{stat.label}</div>
              <div style={{ fontSize: '28px', fontWeight: '800', marginTop: '8px' }}>{stat.value}</div>
            </div>
          ))}
        </div>
      </section>

      {activeTab === 'explore' && (
        <section style={{ maxWidth: '1200px', margin: '0 auto 20px', padding: '0 24px', display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {['All', 'Free', 'Freemium', 'Paid'].map((p) => (
            <button
              key={p}
              onClick={() => setPriceFilter(p)}
              style={{
                backgroundColor: priceFilter === p ? (p === 'Free' ? '#10b981' : p === 'Paid' ? '#ef4444' : '#0284c7') : cardBg,
                color: priceFilter === p ? '#fff' : subTextColor,
                border: `1px solid ${borderCol}`,
                borderRadius: '16px',
                padding: '5px 16px',
                fontSize: '12px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              {p === 'Free' ? '💯 100% Free Tools' : p === 'Paid' ? '💎 Premium/Paid' : p === 'Freemium' ? '⚡ Freemium' : 'All Pricing'}
            </button>
          ))}
        </section>
      )}

      {activeTab === 'native' ? (
        <section style={{ maxWidth: '850px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ backgroundColor: cardBg, border: `1px solid ${borderCol}`, borderRadius: '20px', padding: '28px' }}>
            <h3 style={{ margin: '0 0 8px', color: '#38bdf8', fontSize: '20px', fontWeight: '800' }}>Native AI Processing Studio</h3>
            <p style={{ color: subTextColor, fontSize: '13px', margin: '0 0 20px' }}>Select an internal generator below to run tasks directly in browser.</p>

            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '20px' }}>
              {['writer', 'caption', 'hashtags', 'summarizer', 'translator'].map((t) => (
                <button key={t} onClick={() => setNativeTool(t)} style={{ backgroundColor: nativeTool === t ? '#7c3aed' : (isDark ? '#1e293b' : '#f1f5f9'), color: nativeTool === t ? '#fff' : textColor, border: 'none', borderRadius: '12px', padding: '8px 12px', fontWeight: '700', cursor: 'pointer', textTransform: 'capitalize' }}>
                  {t}
                </button>
              ))}
            </div>

            <textarea
              value={nativeInput}
              onChange={(e) => setNativeInput(e.target.value)}
              placeholder="Type prompt or context for native AI..."
              style={{ width: '100%', height: '110px', backgroundColor: isDark ? '#090d16' : '#f8fafc', border: `1px solid ${borderCol}`, borderRadius: '12px', padding: '14px', color: textColor, resize: 'vertical' }}
            />

            <button onClick={handleNativeRun} disabled={isExecuting} style={{ backgroundColor: '#7c3aed', color: '#fff', border: 'none', padding: '12px 28px', borderRadius: '10px', fontWeight: '800', cursor: 'pointer', marginTop: '16px' }}>
              {isExecuting ? 'Running Assistant...' : 'Run Assistant ⚡'}
            </button>

            {nativeOutput && (
              <div style={{ marginTop: '24px', padding: '18px', backgroundColor: isDark ? '#090d16' : '#f0fdf4', border: '1px solid #10b981', borderRadius: '12px', color: isDark ? '#10b981' : '#166534', whiteSpace: 'pre-wrap' }}>
                {nativeOutput}
              </div>
            )}
          </div>
        </section>
      ) : activeTab === 'automation' ? (
        <section style={{ maxWidth: '850px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ backgroundColor: cardBg, border: `1px solid ${borderCol}`, borderRadius: '20px', padding: '28px' }}>
            <h3 style={{ margin: '0 0 8px', color: '#a855f7', fontSize: '20px', fontWeight: '800' }}>AI Automation Studio ⚙️</h3>
            <p style={{ color: subTextColor, fontSize: '13px', margin: '0 0 20px' }}>Build, simulate, and trigger automated AI workflows (n8n / Make / Web Scraper).</p>

            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '20px' }}>
              {[
                { id: 'scraper', label: '🌐 AI Web Scraper' },
                { id: 'lead', label: '🎯 Lead Generation Flow' },
                { id: 'autopost', label: '📲 Social Auto-Poster' },
                { id: 'webhook', label: '⚡ Webhook / n8n Trigger' },
              ].map((item) => (
                <button key={item.id} onClick={() => setAutoTask(item.id)} style={{ backgroundColor: autoTask === item.id ? '#a855f7' : (isDark ? '#1e293b' : '#f1f5f9'), color: autoTask === item.id ? '#fff' : textColor, border: 'none', borderRadius: '12px', padding: '8px 12px', fontWeight: '700', cursor: 'pointer' }}>
                  {item.label}
                </button>
              ))}
            </div>

            <input
              type="text"
              value={autoTarget}
              onChange={(e) => setAutoTarget(e.target.value)}
              placeholder="Enter Website URL, Webhook Endpoint, or Keyword Target..."
              style={{ width: '100%', backgroundColor: isDark ? '#090d16' : '#f8fafc', border: `1px solid ${borderCol}`, borderRadius: '12px', padding: '14px', color: textColor, fontSize: '14px' }}
            />

            <button onClick={handleRunAutomation} disabled={isAutoRunning} style={{ backgroundColor: '#a855f7', color: '#fff', border: 'none', padding: '12px 28px', borderRadius: '10px', fontWeight: '800', cursor: 'pointer', marginTop: '16px' }}>
              {isAutoRunning ? 'Executing Workflow...' : 'Execute Workflow Pipeline ⚙️'}
            </button>

            {autoLogs.length > 0 && (
              <div style={{ marginTop: '24px', padding: '18px', backgroundColor: isDark ? '#090d16' : '#f8fafc', border: `1px solid ${borderCol}`, borderRadius: '12px' }}>
                <h4 style={{ margin: '0 0 12px', fontSize: '14px', color: '#38bdf8' }}>Live Execution Terminal Logs:</h4>
                {autoLogs.map((log, index) => (
                  <p key={index} style={{ margin: '4px 0', fontSize: '12px', fontFamily: 'monospace', color: log.includes('Complete') ? '#10b981' : '#94a3b8' }}>
                    {log}
                  </p>
                ))}
              </div>
            )}
          </div>
        </section>
      ) : (
        <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '16px', marginBottom: '24px' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                style={{ backgroundColor: category === cat ? '#7c3aed' : cardBg, color: category === cat ? '#fff' : textColor, border: `1px solid ${borderCol}`, borderRadius: '20px', padding: '8px 16px', cursor: 'pointer', fontWeight: '700', whiteSpace: 'nowrap' }}
              >
                {cat}
              </button>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
            {[...filteredTools].sort((a,b)=>{const r=(x)=>{const n=((x&&(x.name||x.title||x.slug))||"").toLowerCase();return n.includes("make")?1:n.includes("elevenlabs")?2:n.includes("gemini")?3:99;};return r(a)-r(b);}).map((t) => (
              <div key={t.id} style={{ backgroundColor: cardBg, border: `1px solid ${borderCol}`, borderRadius: '20px', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '16px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '30px', backgroundColor: isDark ? '#1e293b' : '#f1f5f9', padding: '10px', borderRadius: '14px' }}>{t.icon}</span>
                      <div>
                        <h4 style={{ margin: 0, fontSize: '18px', fontWeight: '800' }}><a href={"/tool/" + (t.slug || t.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""))} style={{ color: "inherit", textDecoration: "none" }}>{t.name}</a></h4>
                        <span style={{ fontSize: '12px', color: '#fbbf24', fontWeight: '700' }}>★ {t.rating}</span>
                      </div>
                    </div>
                    <button onClick={() => toggleFavorite(t.id)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', padding: 0 }}>
                      {favorites.includes(t.id) ? '❤️' : '🤍'}
                    </button>
                  </div>
                  <p style={{ color: subTextColor, fontSize: '13px', lineHeight: '1.6', margin: '0 0 20px' }}>{t.description}</p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: `1px solid ${borderCol}` }}>
                  <span style={{ fontSize: '11px', backgroundColor: t.pricing === 'Free' ? '#10b98120' : t.pricing === 'Paid' ? '#ef444420' : '#0284c720', color: t.pricing === 'Free' ? '#10b981' : t.pricing === 'Paid' ? '#ef4444' : '#38bdf8', padding: '4px 12px', borderRadius: '12px', fontWeight: '800' }}>
                    {t.pricing === 'Free' ? '100% Free' : t.pricing}
                  </span>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <a
                  href={"/tool/" + (t.slug || t.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""))}
                  style={{
                    color: "#a78bfa",
                    border: "1px solid rgba(167, 139, 250, 0.35)",
                    textDecoration: "none",
                    borderRadius: "10px",
                    padding: "7px 12px",
                    fontSize: "12px",
                    fontWeight: "600",
                  }}
                >
                  Details
                </a>
                <a href={"/go/" + (t.slug || t.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")) + "?u=" + encodeURIComponent(t.url)} target="_blank" rel="noreferrer" style={{ backgroundColor: "#7c3aed", color: "#fff", textDecoration: "none", borderRadius: "10px", padding: "8px 18px", fontSize: "12px", fontWeight: "700" }}>
                    Launch Tool ↗
                  </a>
              </div>
                </div>
              </div>
            ))}
          

</div>
        </section>
      )}
    </main>
  );
}

