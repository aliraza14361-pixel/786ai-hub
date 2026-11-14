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
  { id: '13', name: 'ElevenLabs', description: 'Human-quality AI voice synthesis, text-to-speech, and voice cloning.', category: 'Voice & Music', rating: '4.9', pricing: 'Freemium', icon: '🎙️', url: 'https://elevenlabs.io/' },
  { id: '14', name: 'Suno AI', description: 'Generate complete songs with realistic vocals and instrumentals.', category: 'Voice & Music', rating: '4.8', pricing: 'Freemium', icon: '🎵', url: 'https://suno.com/' },
  { id: '15', name: 'Voice.ai', description: 'Real-time AI voice changer for streaming and gaming.', category: 'Voice & Music', rating: '4.6', pricing: 'Free', icon: '🎤', url: 'https://voice.ai/' },
  { id: '16', name: 'v0.dev', description: 'Generative UI system by Vercel for React and Tailwind components.', category: 'Coding Tools', rating: '4.9', pricing: 'Freemium', icon: '⚡', url: 'https://v0.dev/' },
  { id: '17', name: 'Codeium', description: 'Free AI code autocomplete extension supporting all modern IDEs.', category: 'Coding Tools', rating: '4.8', pricing: 'Free', icon: '⌨️', url: 'https://codeium.com/' },
  { id: '18', name: 'Cursor Editor', description: 'AI-first code editor designed for rapid full-stack engineering.', category: 'Coding Tools', rating: '4.9', pricing: 'Freemium', icon: '🚀', url: 'https://cursor.com/' },
  { id: '19', name: 'Thunderbit', description: 'No-code browser AI automation and web data scraping platform.', category: 'AI Automation', rating: '4.7', pricing: 'Freemium', icon: '🌐', url: 'https://www.thunderbit.com/' },
  { id: '20', name: 'n8n.io', description: 'Fair-code workflow automation tool with native AI integrations.', category: 'AI Automation', rating: '4.8', pricing: 'Free', icon: '⚙️', url: 'https://n8n.io/' },
  { id: '21', name: 'Make.com', description: 'Visual automation platform connecting AI models to business apps.', category: 'AI Automation', rating: '4.9', pricing: 'Freemium', icon: '🔄', url: 'https://www.make.com/' },
];

export default function Home() {
  const [theme, setTheme] = useState('dark');
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
          <h1 style={{ fontSize: '22px', fontWeight: '900', background: 'linear-gradient(to right, #38bdf8, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 }}>786 AI Hub</h1>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
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
      </header>

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
            {filteredTools.map((t) => (
              <div key={t.id} style={{ backgroundColor: cardBg, border: `1px solid ${borderCol}`, borderRadius: '20px', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '16px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '30px', backgroundColor: isDark ? '#1e293b' : '#f1f5f9', padding: '10px', borderRadius: '14px' }}>{t.icon}</span>
                      <div>
                        <h4 style={{ margin: 0, fontSize: '18px', fontWeight: '800' }}>{t.name}</h4>
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
                <a href={"/go/" + (t.slug || t.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")) + "?u=" + encodeURIComponent(t.url)} target="_blank" rel="noreferrer" style={{ backgroundColor: "#7c3aed", color: "#fff", textDecoration: "none", borderRadius: "10px", padding: "8px 18px", fontSize: "12px", fontWeight: "700" }}>
                    Launch Tool ↗
                  </a>
                </div>
              </div>
            ))}
          
<footer className="mt-16 border-t border-slate-800/80 bg-slate-950/90 text-slate-400">
        <div className="max-w-7xl mx-auto px-4 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <p className="text-white font-bold text-base">786 AI Hub</p>
            <p className="text-xs text-slate-400 mt-1">Discover, compare, and launch the best AI tools in one place.</p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium">
            <a href="/" className="hover:text-cyan-400 transition">Home</a>
            <a href="/categories" className="hover:text-cyan-400 transition">Categories</a>
            <a href="/submit" className="hover:text-cyan-400 transition">Submit Tool</a>
            <a href="/contact" className="text-cyan-400 hover:text-cyan-300 font-semibold transition">Contact Us</a>
            <a href="/privacy" className="hover:text-cyan-400 transition">Privacy</a>
            <a href="/terms" className="hover:text-cyan-400 transition">Terms</a>
            <a href="/disclosure" className="hover:text-cyan-400 transition">Disclosure</a>
          </div>

          <div className="flex items-center gap-3">
            <a href="https://youtube.com/@alirazaali2358" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-cyan-500/50 hover:text-cyan-400 transition">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.4 31.4 0 0 0 0 12a31.4 31.4 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.4 31.4 0 0 0 24 12a31.4 31.4 0 0 0-.5-5.8zM9.6 15.6V8.4l6.3 3.6-6.3 3.6z"/></svg>
            </a>
            <a href="https://x.com/AliRaza10048422" target="_blank" rel="noopener noreferrer" aria-label="X" className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-cyan-500/50 hover:text-cyan-400 transition">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a href="https://instagram.com/alirazaali746" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-cyan-500/50 hover:text-cyan-400 transition">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.8.2 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1.1.4 2.2.1 1.3.1 1.6.1 4.8s0 3.6-.1 4.9c-.1 1.2-.2 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1.1.4-2.2.4-1.3.1-1.6.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.8-.2-2.2-.4a3.9 3.9 0 0 1-1.4-.9c-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1.1-.4-2.2-.1-1.3-.1-1.6-.1-4.9s0-3.6.1-4.9c.1-1.2.2-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1.1-.4 2.2-.4 1.3-.1 1.6-.1 4.9-.1M12 0C8.7 0 8.3 0 7 .1 5.7.2 4.8.4 4 .7c-.8.3-1.5.7-2.2 1.4C1.1 2.8.7 3.5.4 4.3c-.3.8-.5 1.7-.6 3C-.2 8.6-.2 9-.2 12s0 3.4.1 4.7c.1 1.3.3 2.2.6 3 .3.8.7 1.5 1.4 2.2.7.7 1.4 1.1 2.2 1.4.8.3 1.7.5 3 .6 1.3.1 1.7.1 4.9.1s3.6 0 4.9-.1c1.3-.1 2.2-.3 3-.6.8-.3 1.5-.7 2.2-1.4.7-.7 1.1-1.4 1.4-2.2.3-.8.5-1.7.6-3 .1-1.3.1-1.7.1-4.7s0-3.4-.1-4.7c-.1-1.3-.3-2.2-.6-3-.3-.8-.7-1.5-1.4-2.2-.7-.7-1.4-1.1-2.2-1.4-.8-.3-1.7-.5-3-.6C15.6 0 15.2 0 12 0zm0 5.8a6.2 6.2 0 1 0 0 12.4 6.2 6.2 0 0 0 0-12.4zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.4-11.8a1.4 1.4 0 1 0 0 2.9 1.4 1.4 0 0 0 0-2.9z"/></svg>
            </a>
            <a href="https://www.threads.com/@alirazaali746" target="_blank" rel="noopener noreferrer" aria-label="Threads" className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-cyan-500/50 hover:text-cyan-400 transition">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.964-.065-1.19.408-2.285 1.33-3.082.88-.76 2.119-1.207 3.583-1.291a13.853 13.853 0 0 1 3.02.142c-.126-.742-.375-1.332-.75-1.757-.513-.586-1.308-.883-2.359-.89h-.029c-.844 0-1.992.232-2.721 1.32L7.734 7.847c.98-1.454 2.568-2.256 4.478-2.256h.044c3.194.02 5.097 1.975 5.287 5.388.108.046.216.094.321.142 1.49.7 2.58 1.761 3.154 3.07.797 1.82.871 4.79-1.548 7.158-1.85 1.81-4.094 2.628-7.277 2.65Zm1.003-11.69c-.242 0-.487.007-.739.021-1.836.103-2.98.946-2.916 2.143.067 1.256 1.452 1.839 2.784 1.767 1.224-.065 2.818-.543 3.086-3.71a10.5 10.5 0 0 0-2.215-.221z"/></svg>
            </a>
            <a href="https://tiktok.com/@user1379169809" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-cyan-500/50 hover:text-cyan-400 transition">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19.6 6.7a4.8 4.8 0 0 1-3.8-4.7V1h-3.6v14.8a2.9 2.9 0 0 1-2.9 2.8 2.9 2.9 0 0 1-2.9-2.9 2.9 2.9 0 0 1 2.9-2.9c.3 0 .6 0 .9.1V9.2a6.6 6.6 0 0 0-.9-.1 6.5 6.5 0 0 0-6.5 6.5A6.5 6.5 0 0 0 9.3 22a6.5 6.5 0 0 0 6.5-6.5V8.1a8.3 8.3 0 0 0 4.8 1.5V6.1c-.3 0-.7.2-1 .6z"/></svg>
            </a>
          </div>
        </div>
        <div className="border-t border-slate-900 py-4 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} 786 AI Hub. All rights reserved.
        </div>
      </footer>
</div>
        </section>
      )}
    </main>
  );
}

