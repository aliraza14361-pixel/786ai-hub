'use client';

import { useState } from 'react';

const TOOLS = [
  { id: 'chatgpt', name: 'ChatGPT', rating: '5.0', desc: 'Advanced AI language model for interaction, creativity, and writing.', pricing: 'Freemium', icon: '🤖', category: 'Writing/LLMs' },
  { id: 'claude-ai', name: 'Claude AI', rating: '4.9', desc: 'Next-gen assistant by Anthropic for long-context analysis and code.', pricing: 'Freemium', icon: '🧠', category: 'Writing/LLMs' },
  { id: 'perplexity-ai', name: 'Perplexity AI', rating: '4.8', desc: 'AI-powered live answer search engine with verifiable citations.', pricing: 'Freemium', icon: '🔍', category: 'Writing/LLMs' },
  { id: 'jasper-ai', name: 'Jasper AI', rating: '4.7', desc: 'Enterprise-grade copywriter for blog posts and social marketing.', pricing: 'Paid', icon: '📝', category: 'Writing/LLMs' },
  { id: 'notion-ai', name: 'Notion AI', rating: '4.8', desc: 'Integrated workspace assistant for notes, docs, and team tasks.', pricing: 'Paid', icon: '📓', category: 'Writing/LLMs' },
  { id: 'copy-ai', name: 'Copy.ai', rating: '4.7', desc: 'GTM & marketing copywriting platform for high-converting content.', pricing: 'Freemium', icon: '✨', category: 'Writing/LLMs' },
  { id: 'google-gemini', name: 'Google Gemini', rating: '4.9', desc: 'Multimodal AI assistant built by Google for reasoning & tasks.', pricing: 'Freemium', icon: '🎨', category: 'Writing/LLMs' },
  { id: 'midjourney', name: 'Midjourney', rating: '4.9', desc: 'Generative AI platform for photorealistic artwork generation.', pricing: 'Paid', icon: '🎨', category: 'Image' },
  { id: 'leonardo-ai', name: 'Leonardo AI', rating: '4.8', desc: 'Production-quality visual assets and gaming graphics creator.', pricing: 'Freemium', icon: '🖼️', category: 'Image' },
  { id: 'stable-diffusion', name: 'Stable Diffusion', rating: '4.7', desc: 'Open-source latent image diffusion model by Stability AI.', pricing: '100% Free', icon: '🔮', category: 'Image' },
  { id: 'flux-1-ai', name: 'FLUX.1 AI', rating: '4.9', desc: 'State-of-the-art open image model with supreme realism.', pricing: '100% Free', icon: '🧠', category: 'Image' },
  { id: 'remove-bg', name: 'Remove.bg', rating: '4.7', desc: 'Instant AI background removal for photos in 1-click.', pricing: '100% Free', icon: '✂️', category: 'Image' },
  { id: 'photoroom', name: 'Photoroom', rating: '4.8', desc: 'Studio-quality photo editing & product image generator.', pricing: 'Freemium', icon: '📸', category: 'Image' },
  { id: 'canva-ai', name: 'Canva AI', rating: '4.7', desc: 'Magic Studio suites for graphic creation, presentations & edits.', pricing: 'Freemium', icon: '🎨', category: 'Image' }
];

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTools = TOOLS.filter(tool => {
    const matchesCategory = selectedCategory === 'All' || tool.category === selectedCategory;
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          tool.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#0B0F19] text-gray-100 font-sans">
      {/* Header */}
      <header className="border-b border-gray-800 bg-[#0F172A]/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
              786 AI Hub
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <a href="/admin" className="text-sm text-gray-400 hover:text-white transition">Admin</a>
            <a 
              href="/api/auth/signin"
              className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
            >
              Sign In
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-10 space-y-10">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            Unleash the <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">Power of AI</span>.
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base">
            Global Tools Directory, Native Processors & Automation Studio.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="bg-[#111827] border border-gray-800 rounded-xl p-4 text-center">
            <p className="text-xs text-gray-400">Affiliate Traffic</p>
            <p className="text-2xl font-bold text-blue-400">18.4K</p>
          </div>
          <div className="bg-[#111827] border border-gray-800 rounded-xl p-4 text-center">
            <p className="text-xs text-gray-400">Unique Clicks</p>
            <p className="text-2xl font-bold text-emerald-400">12.8K</p>
          </div>
          <div className="bg-[#111827] border border-gray-800 rounded-xl p-4 text-center">
            <p className="text-xs text-gray-400">Approved Leads</p>
            <p className="text-2xl font-bold text-indigo-400">2.6K</p>
          </div>
          <div className="bg-[#111827] border border-gray-800 rounded-xl p-4 text-center">
            <p className="text-xs text-gray-400">Conversion Rate</p>
            <p className="text-2xl font-bold text-teal-400">7.3%</p>
          </div>
        </div>

        {/* Search & Categories */}
        <div className="space-y-4 max-w-4xl mx-auto">
          <input
            type="text"
            placeholder="Search 32+ AI tools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#111827] border border-gray-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition"
          />
          <div className="flex flex-wrap gap-2">
            {['All', 'Writing/LLMs', 'Image', 'Video', 'Audio', 'Coding', 'Automation'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white'
                    : 'bg-[#111827] text-gray-400 border border-gray-800 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Tools Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {filteredTools.map((tool) => (
            <div key={tool.id} className="bg-[#111827] border border-gray-800 hover:border-gray-700 transition rounded-xl p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">{tool.icon}</span>
                  <div>
                    <h3 className="font-bold text-lg">{tool.name}</h3>
                    <p className="text-xs text-amber-400">★ {tool.rating}</p>
                  </div>
                </div>
                <span className="text-xs bg-gray-800 text-gray-300 px-2.5 py-1 rounded-full border border-gray-700">
                  {tool.pricing}
                </span>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">{tool.desc}</p>
              <div className="flex justify-end space-x-4 text-xs font-medium pt-2 border-t border-gray-800/60">
                <button className="text-gray-400 hover:text-white transition">Details →</button>
                <button className="text-blue-400 hover:text-blue-300 transition">Launch ↗</button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
