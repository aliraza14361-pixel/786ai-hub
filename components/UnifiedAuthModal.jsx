"use client";
import { useState } from "react";

const AUTH_USER_KEY = "786ai_studio_user_v1";
const REGISTERED_USERS_KEY = "786ai_registered_users_v1";

export default function UnifiedAuthModal({ open, onClose, onSuccess }) {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password;

    if (!cleanEmail || !cleanEmail.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    if (cleanPass.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (mode === "signup" && !name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    let registry = {};
    try {
      registry = JSON.parse(localStorage.getItem(REGISTERED_USERS_KEY) || "{}");
    } catch {}

    if (mode === "signup" && registry[cleanEmail]) {
      setError("This email is already registered. Please log in.");
      setMode("login");
      return;
    }
    if (mode === "login" && registry[cleanEmail] && registry[cleanEmail].password !== cleanPass) {
      setError("Incorrect password. Please try again.");
      return;
    }

    setLoading(true);
    try {
      const resolvedName = mode === "signup" ? name.trim() : registry[cleanEmail]?.name || "";
      const res = await fetch("/api/studio-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: mode,
          name: resolvedName,
          email: cleanEmail,
          password: cleanPass
        })
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error || "Login failed. Please try again.");
        setLoading(false);
        return;
      }

      registry[cleanEmail] = { name: data.user.name, password: cleanPass };
      try {
        localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(registry));
      } catch {}

      const sessionUser = {
        name: data.user.name,
        email: data.user.email,
        token: data.token
      };
      try {
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(sessionUser));
        window.dispatchEvent(new Event("786ai-auth-changed"));
      } catch {}

      setPassword("");
      if (onSuccess) onSuccess(sessionUser);
      if (onClose) onClose();
    } catch {
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[10001] bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#0e1422] border border-slate-800 rounded-3xl p-6 shadow-2xl relative text-slate-100">
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 w-8 h-8 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center text-sm"
          >
            ✕
          </button>
        )}

        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-2xl mx-auto mb-3 shadow-lg">
          ✨
        </div>
        <h2 className="text-xl font-extrabold text-white text-center">
          {mode === "login" ? "Login to 786 AI Hub" : "Join 786 AI Hub Free"}
        </h2>
        <p className="text-xs text-slate-400 text-center mt-1 mb-5">
          One unified account for 786 AI Hub & 786AI Studio Chat
        </p>

        <div className="grid grid-cols-2 gap-1 p-1 rounded-2xl bg-slate-950 border border-slate-800 mb-4">
          <button
            type="button"
            onClick={() => { setMode("login"); setError(""); }}
            className={`py-2 rounded-xl text-xs font-bold transition ${
              mode === "login" ? "bg-cyan-500 text-slate-950 shadow" : "text-slate-400 hover:text-white"
            }`}
          >
            Log In
          </button>
          <button
            type="button"
            onClick={() => { setMode("signup"); setError(""); }}
            className={`py-2 rounded-xl text-xs font-bold transition ${
              mode === "signup" ? "bg-cyan-500 text-slate-950 shadow" : "text-slate-400 hover:text-white"
            }`}
          >
            Sign Up Free
          </button>
        </div>

        {error && (
          <div className="mb-3.5 px-3 py-2 rounded-xl bg-rose-500/15 border border-rose-500/40 text-xs text-rose-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === "signup" && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded-xl px-3.5 py-2.5 pr-12 text-sm text-white focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPass((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
              >
                {showPass ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-sm shadow-lg transition disabled:opacity-50 mt-1"
          >
            {loading ? "Please wait..." : mode === "login" ? "Log In →" : "Create Free Account →"}
          </button>
        </form>
      </div>
    </div>
  );
}
