"use client";
import { useState } from "react";

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white px-4 py-12">
      <div className="max-w-xl mx-auto bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-cyan-400">Contact Us</h1>
          <a href="/" className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition">
            ← Back to Home
          </a>
        </div>
        <p className="text-slate-400 text-sm mb-6">
          Have a question, partnership inquiry, or want to feature your AI tool on <span className="text-white font-semibold">786 AI Hub</span>? Send us a message below.
        </p>

        {sent ? (
          <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-700/60 text-emerald-300 text-sm mb-4">
            Thank you! Your message has been received. We will get back to you soon.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Your Name</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Enter your name"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Message</label>
              <textarea
                rows="4"
                required
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Write your message or partnership details..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-sm transition cursor-pointer"
            >
              Send Message
            </button>
          </form>
        )}

        <div className="mt-6 pt-4 border-t border-slate-800 text-xs text-slate-400 flex flex-wrap justify-between gap-2">
          <span>Direct Email: <a href="mailto:contact@786aihub.com" className="text-cyan-400 hover:underline">contact@786aihub.com</a></span>
          <span>Response time: 24–48 hours</span>
        </div>
      </div>
    </div>
  );
}
