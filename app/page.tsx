'use client';

import { useState, useMemo } from 'react';

const initialTools = [
  { id: '1', name: 'ChatGPT', slug: 'chatgpt', description: 'Advanced AI language model for interaction, creativity, and writing.', category: 'WRITING', pricing: 'FREEMIUM', rating: 5.0, websiteUrl: 'https://chatgpt.com', icon: '🤖' },
  { id: '2', name: 'Claude AI', slug: 'claude-ai', description: 'Next-gen assistant by Anthropic for long-context analysis and code.', category: 'CODING', pricing: 'FREEMIUM', rating: 4.9, websiteUrl: 'https://claude.ai', icon: '🧠' },
  { id: '3', name: 'Perplexity AI', slug: 'perplexity-ai', description: 'AI-powered live answer search engine with verifiable citations.', category: 'PRODUCTIVITY', pricing: 'FREEMIUM', rating: 4.8, websiteUrl: 'https://perplexity.ai', icon: '🔍' },
  { id: '4', name: 'Midjourney', slug: 'midjourney', description: 'Generative AI platform for photorealistic artwork generation.', category: 'IMAGE', pricing: 'PAID', rating: 4.9, websiteUrl: 'https://midjourney.com', icon: '🎨' },
  { id: '5', name: 'FLUX.1 AI', slug: 'flux-1-ai', description: 'State-of-the-art open image model with supreme realism.', category: 'IMAGE', pricing: 'FREE', rating: 4.9, websiteUrl: 'https://flux.ai', icon: '🧠' },
  { id: '6', name: 'Remove.bg', slug: 'remove-bg', description: 'Instant AI background removal for photos in 1-click.', category: 'IMAGE', pricing: 'FREE', rating: 4.7, websiteUrl: 'https://remove.bg', icon: '✂️' },
];

export default function HomePage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('ALL');

  const filteredTools = useMemo(() => {
    return initialTools.filter((tool) => {
      const matchesSearch = tool.name.toLowerCase().includes(search.toLowerCase()) ||
                            tool.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === 'ALL' || tool.category.toLowerCase() === category.toLowerCase();
      return matchesSearch && matchesCategory;
    });
  }, [search, category]);

  return (
    <main className="py-10 bg-slate-950 min-h-screen text-white px-4">
      <div className="text-center mb-8 max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">
          Unleash the <span className="text-indigo-500">Power of AI</span>
        </h1>
        <p className="text-slate-400">
          Global Tools Directory, Native Processors & Automation Studio.
        </p>
      </div>

      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Search Bar & Filters */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-900/50 p-4 rounded-xl border border-slate-800">
          <input
            type="text"
            placeholder="Search AI tools (e.g. ChatGPT, Image, Writing)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-1/3 px-4 py-2 bg-slate-950 rounded-lg border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
          />

          <div className="flex flex-wrap gap-2">
            {['ALL', 'WRITING', 'IMAGE', 'CODING', 'PRODUCTIVITY'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                  category === cat ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool) => (
            <div key={tool.id} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between hover:border-indigo-500/50 transition">
              <div>
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{tool.icon}</span>
                    <div>
                      <h3 className="font-bold text-lg text-white">{tool.name}</h3>
                      <p className="text-xs text-yellow-400">★ {tool.rating.toFixed(1)}</p>
                    </div>
                  </div>
                  <span className="text-xs font-medium px-2 py-1 bg-indigo-950 text-indigo-400 border border-indigo-800/40 rounded">
                    {tool.pricing}
                  </span>
                </div>
                <p className="text-slate-400 text-sm line-clamp-2">{tool.description}</p>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-800/80 flex gap-2">
                <a
                  href={tool.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full text-center py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition"
                >
                  Visit Site ↗
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
