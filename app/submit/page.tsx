'use client';
import { useState } from 'react';

export default function SubmitPage() {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState('Writing/LLMs');
  const [description, setDescription] = useState('');
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatusMsg(null);

    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, url, category, description }),
      });

      if (res.ok) {
        setStatusMsg({ type: 'success', msg: 'Tool submitted successfully! Admin will review it soon.' });
        setName('');
        setUrl('');
        setDescription('');
      } else {
        setStatusMsg({ type: 'error', msg: 'Failed to submit tool. Please try again.' });
      }
    } catch {
      setStatusMsg({ type: 'error', msg: 'Network connection error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-12 px-4">
      <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 shadow-2xl">
        <div className="text-center space-y-2">
          <span className="text-4xl">🚀</span>
          <h1 className="text-2xl font-bold text-white">Submit an AI Tool</h1>
          <p className="text-xs text-slate-400">Add your AI software to 786 AI Hub directory catalog</p>
        </div>

        {statusMsg && (
          <div
            className={`p-3 rounded-xl text-xs text-center font-medium border ${
              statusMsg.type === 'success'
                ? 'bg-emerald-950/80 border-emerald-800 text-emerald-300'
                : 'bg-rose-950/80 border-rose-800 text-rose-300'
            }`}
          >
            {statusMsg.msg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1 font-medium">Tool Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Acme AI"
              required
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1 font-medium">Website URL</label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              required
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1 font-medium">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500"
            >
              <option value="Writing/LLMs">Writing / LLMs</option>
              <option value="Image">Image Generator</option>
              <option value="Video">Video Synthesis</option>
              <option value="Audio">Audio & Music</option>
              <option value="Coding">Coding & Dev Tools</option>
              <option value="Automation">Automation Workflows</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1 font-medium">Short Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Briefly describe what your AI tool does..."
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold text-sm transition shadow-lg shadow-cyan-500/20"
          >
            {loading ? 'Submitting...' : 'Submit Tool for Approval'}
          </button>
        </form>
      </div>
    </div>
  );
}
