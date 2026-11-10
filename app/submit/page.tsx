'use client';
import { useState } from 'react';

export default function SubmitToolPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-lg mx-auto py-12 px-6">
      <h1 className="text-2xl font-bold text-white mb-4">Submit an AI Tool</h1>
      {submitted ? (
        <div className="p-4 bg-emerald-900/40 border border-emerald-500 rounded-xl text-emerald-300">
          Tool submitted successfully! It will be reviewed in the Admin Queue.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Tool Name" required className="w-full p-3 rounded-lg bg-slate-900 border border-slate-700 text-white" />
          <input type="url" placeholder="Website URL" required className="w-full p-3 rounded-lg bg-slate-900 border border-slate-700 text-white" />
          <select className="w-full p-3 rounded-lg bg-slate-900 border border-slate-700 text-white">
            <option value="Writing/LLMs">Writing / LLMs</option>
            <option value="Image">Image Generation</option>
            <option value="Video">Video Synthesis</option>
            <option value="Coding">Coding</option>
          </select>
          <textarea placeholder="Short Description" rows={4} className="w-full p-3 rounded-lg bg-slate-900 border border-slate-700 text-white"></textarea>
          <button type="submit" className="w-full py-3 bg-cyan-600 font-bold rounded-lg text-white hover:bg-cyan-500">
            Submit Tool for Approval
          </button>
        </form>
      )}
    </div>
  );
}
