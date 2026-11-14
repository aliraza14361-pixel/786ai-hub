"use client";
import { useState, useEffect } from "react";

const ALLOWED_ADMIN_EMAILS = ["admin@786aihub.com", "aliraza14361@gmail.com"];

const INITIAL_SUBMISSIONS = [
  { id: 1, name: "Kling Pro AI", category: "Video", url: "https://klingai.com", desc: "Cinematic HD video synthesis tool.", status: "Pending" },
  { id: 2, name: "Sora Web", category: "Video", url: "https://openai.com/sora", desc: "Text to video generation model.", status: "Pending" },
];

const INITIAL_TOOLS = [
  { id: 101, name: "ChatGPT", category: "Writing/LLMs", status: "Active" },
  { id: 102, name: "Claude AI", category: "Writing/LLMs", status: "Active" },
  { id: 103, name: "Perplexity AI", category: "Writing/LLMs", status: "Active" },
  { id: 104, name: "Midjourney", category: "Image", status: "Active" },
  { id: 105, name: "Cursor Editor", category: "Coding", status: "Active" },
  { id: 106, name: "n8n.io", category: "Automation", status: "Active" },
];

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [googleEmailInput, setGoogleEmailInput] = useState("");
  const [showGooglePrompt, setShowGooglePrompt] = useState(false);
  const [error, setError] = useState("");

  const [submissions, setSubmissions] = useState(INITIAL_SUBMISSIONS);
  const [tools, setTools] = useState(INITIAL_TOOLS);
  const [realClicks, setRealClicks] = useState<{ total: number; byTool: Record<string, number> }>({
    total: 0,
    byTool: {},
  });
  const [loadingClicks, setLoadingClicks] = useState(false);

  const fetchRealClicks = async () => {
    setLoadingClicks(true);
    try {
      const res = await fetch("/api/clicks", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setRealClicks({
          total: data.total || 0,
          byTool: data.byTool || {},
        });
      }
    } catch (e) {
      console.error("Failed to fetch real clicks", e);
    } finally {
      setLoadingClicks(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchRealClicks();
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "admin" && password === "786aihubpass") {
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Invalid admin username or password!");
    }
  };

  const handleGoogleAdminAuth = (e: React.FormEvent) => {
    e.preventDefault();
    const email = googleEmailInput.trim().toLowerCase();
    if (ALLOWED_ADMIN_EMAILS.includes(email) || email.endsWith("@786aihub.com")) {
      setIsAuthenticated(true);
      setError("");
      setShowGooglePrompt(false);
    } else {
      setError(`Access Denied: (${email}) does not have admin permissions!`);
    }
  };

  const handleApprove = (id: number) => {
    const sub = submissions.find((s) => s.id === id);
    if (sub) {
      setTools([{ id: Date.now(), name: sub.name, category: sub.category, status: "Active" }, ...tools]);
      setSubmissions(submissions.filter((s) => s.id !== id));
    }
  };

  const handleDestroy = (id: number) => {
    setTools(tools.filter((t) => t.id !== id));
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-2xl">
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-bold text-white">786 AI Admin Access</h1>
            <p className="text-xs text-slate-400">Authorized administrators only</p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs text-center font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1 font-medium">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter admin username"
                required
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1 font-medium">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm transition shadow-lg shadow-cyan-500/20"
            >
              Sign In with Password
            </button>
          </form>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-slate-900 text-slate-500">OR</span>
            </div>
          </div>

          {!showGooglePrompt ? (
            <button
              onClick={() => setShowGooglePrompt(true)}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-200 text-sm font-semibold flex items-center justify-center gap-3 transition"
            >
              Sign in with Admin Google Account
            </button>
          ) : (
            <form onSubmit={handleGoogleAdminAuth} className="space-y-3 p-4 bg-slate-950 rounded-2xl border border-slate-800">
              <label className="block text-xs text-slate-300 font-medium">Verify Admin Google Email</label>
              <input
                type="email"
                value={googleEmailInput}
                onChange={(e) => setGoogleEmailInput(e.target.value)}
                placeholder="e.g. aliraza14361@gmail.com"
                required
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
              />
              <div className="flex gap-2">
                <button type="submit" className="flex-1 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs">
                  Verify & Access
                </button>
                <button
                  type="button"
                  onClick={() => setShowGooglePrompt(false)}
                  className="px-3 py-2 rounded-xl bg-slate-800 text-slate-400 text-xs"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  }

  const toolClickEntries = Object.entries(realClicks.byTool).sort((a, b) => b[1] - a[1]);
  const maxToolClicks = toolClickEntries.length > 0 ? Math.max(...toolClickEntries.map(([, c]) => c), 1) : 1;
  const activeToolsCount = tools.length;

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h1 className="text-2xl font-bold text-white">786 AI Admin Dashboard</h1>
            <p className="text-xs text-slate-400">Real-time affiliate click analytics, directory & submissions</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchRealClicks}
              className="px-3 py-1.5 rounded-lg bg-cyan-950 text-cyan-300 border border-cyan-800 text-xs font-semibold hover:bg-cyan-900"
            >
              {loadingClicks ? "Refreshing..." : "Refresh Analytics"}
            </button>
            <a href="/" className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-200 text-xs font-semibold">
              Home
            </a>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="px-3 py-1.5 rounded-lg bg-rose-950 text-rose-300 border border-rose-800 text-xs font-semibold"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Real Metrics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <p className="text-xs text-slate-400">Real Affiliate Clicks</p>
            <p className="text-2xl font-extrabold text-cyan-400 mt-1">{realClicks.total}</p>
            <p className="text-[11px] text-slate-500 mt-1">Live /go/[slug] redirects</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <p className="text-xs text-slate-400">Tracked Tools Clicked</p>
            <p className="text-2xl font-extrabold text-emerald-400 mt-1">{toolClickEntries.length}</p>
            <p className="text-[11px] text-slate-500 mt-1">Unique outbound slugs</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <p className="text-xs text-slate-400">Pending Reviews</p>
            <p className="text-2xl font-extrabold text-amber-400 mt-1">{submissions.length}</p>
            <p className="text-[11px] text-slate-500 mt-1">Awaiting approval</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <p className="text-xs text-slate-400">Managed Catalog</p>
            <p className="text-2xl font-extrabold text-purple-400 mt-1">{activeToolsCount}</p>
            <p className="text-[11px] text-slate-500 mt-1">Active directory items</p>
          </div>
        </div>

        {/* Live Click Analytics Section */}
        <div className="space-y-4 p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Live Affiliate Click Analytics</h2>
              <p className="text-xs text-slate-400">Real outbound click breakdown per tool</p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs font-semibold">
              Live Tracking Active
            </span>
          </div>

          {toolClickEntries.length === 0 ? (
            <p className="text-xs text-slate-400 py-4">
              Abhi tak koi outbound click record nahi hua. Homepage par kisi bhi tool ka &quot;Launch Tool&quot; button dabane ke baad yahan real clicks aur bars show honge.
            </p>
          ) : (
            <div className="space-y-3">
              {toolClickEntries.map(([slug, count]) => {
                const pct = Math.round((count / maxToolClicks) * 100);
                return (
                  <div key={slug} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-slate-200">{slug}</span>
                      <span className="text-cyan-400 font-bold">{count} clicks</span>
                    </div>
                    <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                      <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Pending Submissions Queue */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white">Pending Submissions Queue ({submissions.length})</h2>
          {submissions.length === 0 ? (
            <p className="text-sm text-slate-500">No pending submissions right now.</p>
          ) : (
            <div className="space-y-3">
              {submissions.map((sub) => (
                <div
                  key={sub.id}
                  className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row justify-between md:items-center gap-4"
                >
                  <div>
                    <h3 className="font-bold text-white">
                      {sub.name} <span className="text-xs font-normal text-slate-400">({sub.category})</span>
                    </h3>
                    <p className="text-xs text-cyan-400">{sub.url}</p>
                    <p className="text-xs text-slate-400 mt-1">{sub.desc}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApprove(sub.id)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => setSubmissions(submissions.filter((i) => i.id !== sub.id))}
                      className="px-3 py-1.5 bg-rose-950 hover:bg-rose-900 text-rose-300 text-xs font-bold rounded-lg transition"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Manage Live Directory Catalog */}
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
                  <span className="px-2 py-0.5 rounded text-xs bg-emerald-950 text-emerald-400 border border-emerald-800">
                    Active
                  </span>
                  <button
                    onClick={() => handleDestroy(tool.id)}
                    className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-lg transition"
                  >
                    Destroy / Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
