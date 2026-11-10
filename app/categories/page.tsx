import Link from 'next/link';

const CATEGORIES = [
  { name: 'Writing & LLMs', icon: '🤖', count: 7, desc: 'ChatGPT, Claude, Gemini, Notion AI & Copywriting assistants.' },
  { name: 'Image Generation', icon: '🎨', count: 7, desc: 'Midjourney, Stable Diffusion, Flux.1, Leonardo & Photoroom.' },
  { name: 'Video Synthesis', icon: '🎬', count: 5, desc: 'Runway Gen-2, Luma Dream Machine, CapCut & Pika AI.' },
  { name: 'Audio & Music', icon: '🎙️', count: 4, desc: 'ElevenLabs voice cloning, Suno AI music & Udio song synthesis.' },
  { name: 'Coding & Dev Tools', icon: '🚀', count: 5, desc: 'Cursor Editor, Vercel v0, Codeium & GitHub Copilot.' },
  { name: 'Automation Workflows', icon: '⚙️', count: 4, desc: 'n8n.io, Make.com, Thunderbit & Zapier AI automation.' },
];

export default function CategoriesPage() {
  return (
    <div className="py-10 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-white">Explore AI Tool Categories</h1>
        <p className="text-slate-400">Browse curated artificial intelligence tools by workflow specialization.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {CATEGORIES.map((cat, i) => (
          <Link key={i} href={`/#tools`} className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/50 transition">
            <span className="text-4xl">{cat.icon}</span>
            <h2 className="text-xl font-bold text-white mt-4">{cat.name}</h2>
            <p className="text-xs text-cyan-400 font-medium mt-1">{cat.count} Live Tools</p>
            <p className="text-sm text-slate-400 mt-2">{cat.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
