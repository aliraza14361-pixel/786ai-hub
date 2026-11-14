"use client";
import { useState } from "react";

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "contact@786aihub.com";

export default function ContactPage() {
  const [status, setStatus] = useState("idle");
  const [lastMsg, setLastMsg] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setLastMsg({ ...form });
        setStatus("sent");
        setForm({ name: "", email: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  const mailtoHref = lastMsg
    ? "mailto:" + ADMIN_EMAIL + "?subject=" + encodeURIComponent("786 AI Hub Inquiry from " + lastMsg.name) + "&body=" + encodeURIComponent("Name: " + lastMsg.name + "\nEmail: " + lastMsg.email + "\n\n" + lastMsg.message)
    : "mailto:" + ADMIN_EMAIL;

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
          Have a question, affiliate partnership inquiry, or want to feature your AI tool on <span className="text-white font-semibold">786 AI Hub</span>? Send us a message below.
        </p>

        {status === "sent" ? (
          <div className="p-5 rounded-xl bg-emerald-950/60 border border-emerald-700/60 text-emerald-300 text-sm space-y-3">
            <p className="font-semibold">Message submitted successfully! We will reply within 24–48 hours.</p>
            <div className="flex flex-wrap gap-3 pt-1">
              <a
                href={mailtoHref}
                className="inline-block px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs transition"
              >
                Also Send via Gmail App →
              </a>
              <button
                type="button"
                onClick={() => setStatus("idle")}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition cursor-pointer"
              >
                Send Another
              </button>
            </div>
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
            {status === "error" && (
              <p className="text-xs text-rose-400">Could not submit form. Please try again or email us directly below.</p>
            )}
            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-60 text-slate-950 font-semibold text-sm transition cursor-pointer"
            >
              {status === "sending" ? "Sending..." : "Send Message"}
            </button>
          </form>
        )}

        <div className="mt-6 pt-4 border-t border-slate-800 text-xs text-slate-400 flex flex-wrap justify-between gap-2">
          <span>Direct Email: <a href={"mailto:" + ADMIN_EMAIL} className="text-cyan-400 hover:underline">{ADMIN_EMAIL}</a></span>
          <span>Response time: 24–48 hours</span>
        </div>
      </div>
    </div>
  );
}
