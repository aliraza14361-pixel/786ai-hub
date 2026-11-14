'use client';
import { useState, useEffect } from 'react';
import AuthModal from '../components/AuthModal';

const MASTER_100_TOOLS = [
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
                  <a href={`/go/${t.slug || t.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}?u=${encodeURIComponent(t.url)}`} target="_blank" rel="noreferrer" style={{ backgroundColor: '#7c3aed', color: '#fff', textDecoration: 'none', borderRadius: '10px', padding: '8px 18px', fontSize: '12px', fontWeight: '700' }}>
                    Launch Tool ↗
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

