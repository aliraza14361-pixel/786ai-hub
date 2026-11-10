'use client';
import { useState } from 'react';

const CATEGORIES = ['All', 'Writing/LLMs', 'Image', 'Video', 'Audio', 'Coding', 'Automation'];

export default function ToolDirectory({ tools }: { tools: any[] }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const filteredTools = tools.filter((tool) => {
    const matchesSearch = tool.name.toLowerCase().includes(search.toLowerCase()) ||
                          tool.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'All' || tool.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 my-8">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <input
          type="text"
          placeholder="Search AI tools..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-96 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-500"
        />
        
        <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                category === cat
                  ? 'bg-cyan-500 text-slate-950'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTools.map((tool, idx) => (
          <div key={idx} className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{tool.icon}</span>
                <div>
                  <h3 className="font-bold text-white text-lg">{tool.name}</h3>
                  <span className="text-xs text-yellow-400">★ {tool.rating}</span>
                </div>
              </div>
              <p className="text-sm text-slate-400 line-clamp-2">{tool.description}</p>
            </div>
            
            <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-800/80">
              <span className="text-xs font-medium px-2 py-0.5 rounded bg-slate-800 text-slate-300">{tool.pricing}</span>
              <a href={tool.url} target="_blank" rel="noreferrer" className="text-xs font-bold text-cyan-400 hover:underline">
                Launch ↗
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
