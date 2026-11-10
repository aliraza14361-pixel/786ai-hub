'use client';
import { useState } from 'react';

const INITIAL_SUBMISSIONS = [
  { id: 1, name: 'Kling Pro AI', category: 'Video', url: 'https://klingai.com', desc: 'Cinematic HD video synthesis tool.', status: 'Pending' },
  { id: 2, name: 'Sora Web', category: 'Video', url: 'https://openai.com/sora', desc: 'Text to video generation model.', status: 'Pending' },
];

const INITIAL_TOOLS = [
  { id: 101, name: 'ChatGPT', category: 'Writing/LLMs', status: 'Active' },
  { id: 102, name: 'Claude AI', category: 'Writing/LLMs', status: 'Active' },
  { id: 103, name: 'Perplexity AI', category: 'Writing/LLMs', status: 'Active' },
  { id: 104, name: 'Midjourney', category: 'Image', status: 'Active' },
  { id: 105, name: 'Cursor Editor', category: 'Coding', status: 'Active' },
  { id: 106, name: 'n8n.io', category: 'Automation', status: 'Active' }
];

export default function AdminPage() {
  const [submissions, setSubmissions] = useState(INITIAL_SUBMISSIONS);
  const [tools, setTools] = useState(INITIAL_TOOLS);

  const handleApprove = (id: number) => {
    setSubmissions(submissions.filter(item => item.id !== id));
    alert('Tool approved and added to live directory!');
  };

  const handleDestroy = (id: number) => {
    setTools(tools.filter(tool => tool.id !== id));
  };

  return (
    <div className="py-8 space-y-8">
      {/* Top Header */}
      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white">786 AI Admin Dashboard</h1>
          <p className="text-xs text-slate-400">Directory management & submissions approval queue</p>
        </div>
        <span className="px-3 py-1 bg-cyan-950 text-cyan-400 text-xs font-semibold rounded-full border border-cyan-800">
          System Admin Online
        </span>
      </div>

      {/* Analytics Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <p className="text-xs text-slate-400">Affiliate Clicks</p>
          <p className="text-2xl font-bold text-cyan-400">18.4K</p>
        </div>
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <p className="text-xs text-slate-400">Pending Reviews</p>
          <p className="text-2xl font-bold text-amber-400">{submissions.length}</p>
        </div>
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <p className="text-xs text-slate-400">Live Catalog Tools</p>
          <p className="text-2xl font-bold text-white">{tools.length + 26}</p>
        </div>
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <p className="text-xs text-slate-400">Conversion Rate</p>
          <p className="text-2xl font-bold text-emerald-400">7.3%</p>
        </div>
      </div>

      {/* Section 1: User Submissions Queue */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white">Pending Submissions Queue ({submissions.length})</h2>
        {submissions.length === 0 ? (
          <p className="text-sm text-slate-500">No pending submissions right now.</p>
        ) : (
          <div className="space-y-3">
            {submissions.map((sub) => (
              <div key={sub.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                  <h3 className="font-bold text-white">{sub.name} <span className="text-xs font-normal text-slate-400">({sub.category})</span></h3>
                  <p className="text-xs text-cyan-400">{sub.url}</p>
                  <p className="text-xs text-slate-400 mt-1">{sub.desc}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleApprove(sub.id)} className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition">
                    Approve
                  </button>
                  <button onClick={() => setSubmissions(submissions.filter(i => i.id !== sub.id))} className="px-3 py-1.5 bg-rose-950 hover:bg-rose-900 text-rose-300 text-xs font-bold rounded-lg transition">
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Section 2: Manage Live Catalog & Destroy Tools */}
      <div className="space-y-4 pt-6 border-t border-slate-800">
        <h2 className="text-lg font-bold text-white">Manage Live Directory Catalog</h2>
        <div className="divide-y divide-slate-800 bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
          {tools.map((tool) => (
            <div key={tool.id} className="p-4 flex justify-between items-center">
              <div>
                <p className="font-semibold text-white">{tool.name}</p>
                <p className="text-xs text-slate-400">{tool.category}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 rounded text-xs bg-emerald-950 text-emerald-400 border border-emerald-800">Active</span>
                <button onClick={() => handleDestroy(tool.id)} className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-lg transition">
                  Destroy / Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
