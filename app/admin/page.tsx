"use client";

import React, { useState, useEffect } from "react";

interface SubmissionItem {
  id: string | number;
  name: string;
  category: string;
  url: string;
  desc: string;
}

interface ToolItem {
  id: string | number;
  name: string;
  category: string;
  url?: string;
  icon?: string;
  status?: string;
}

export default function AdminPage() {
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [submissions, setSubmissions] = useState<SubmissionItem[]>([]);
  const [tools, setTools] = useState<ToolItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [realClicks, setRealClicks] = useState<{
    total: number;
    byTool: Record<string, number>;
  }>({ total: 0, byTool: {} });
  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    localStorage.removeItem("786ai_admin_auth");
    localStorage.removeItem("786ai_admin_exp");

    fetch("/api/auth", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        setIsAuthenticated(Boolean(data?.authenticated));
      })
      .catch(() => setIsAuthenticated(false))
      .finally(() => setCheckingAuth(false));
  }, []);

  const fetchAdminData = async () => {
    setLoadingData(true);
    try {
      const [clicksRes, toolsRes] = await Promise.all([
        fetch("/api/clicks", { cache: "no-store" }),
        fetch("/api/tools", { cache: "no-store" }),
      ]);
      if (clicksRes.ok) {
        const data = await clicksRes.json();
        setRealClicks({ total: data.total || 0, byTool: data.byTool || {} });
      }
      if (toolsRes.ok) {
        const toolsData = await toolsRes.json();
        if (Array.isArray(toolsData)) {
          setTools(toolsData.map((t: ToolItem) => ({ ...t, status: "Active" })));
        }
      }
    } catch {
      // ignore network error
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchAdminData();
      try {
        const savedSubs = localStorage.getItem("786ai_submissions");
        if (savedSubs) setSubmissions(JSON.parse(savedSubs));
      } catch {
        // ignore parse error
      }
    }
  }, [isAuthenticated]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (res.ok && data?.success) {
        setIsAuthenticated(true);
        setPassword("");
      } else {
        setError(data?.error || "Invalid admin password!");
      }
    } catch {
      setError("Network error. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth", { method: "DELETE" });
    setIsAuthenticated(false);
    setPassword("");
  };

  const handleApprove = (id: string | number) => {
    const target = submissions.find((s) => s.id === id);
    if (!target) return;
    const newTools: ToolItem[] = [
      {
        id: target.id,
        name: target.name,
        category: target.category,
        url: target.url,
        icon: "✨",
        status: "Active",
      },
      ...tools,
    ];
    const newSubs = submissions.filter((s) => s.id !== id);
    setTools(newTools);
    setSubmissions(newSubs);
    localStorage.setItem("786ai_submissions", JSON.stringify(newSubs));
  };

  const handleDestroy = (id: string | number) => {
    const newTools = tools.filter((t) => t.id !== id);
    setTools(newTools);
  };

  const filteredDirectory = tools.filter(
    (t) =>
      t.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 text-sm">
        Verifying session...
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-2xl">
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-bold text-white">786 AI Admin Access</h1>
            <p className="text-xs text-slate-400">Authorized administrator only</p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs text-center font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1 font-medium">
                Admin Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter private admin password"
                autoComplete="current-password"
                required
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-60 text-slate-950 font-bold text-sm transition shadow-lg shadow-cyan-500/20"
            >
              {submitting ? "Verifying..." : "Unlock Admin Panel"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h1 className="text-2xl font-bold text-white">786 AI Hub Admin</h1>
            <p className="text-xs text-slate-400">
              Total Tracked Clicks: <span className="text-cyan-400 font-bold">{realClicks.total}</span>
              {loadingData ? " • Refreshing..." : ""}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition"
          >
            Lock & Logout
          </button>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white">
            Pending Submissions Queue ({submissions.length})
          </h2>
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
                      {sub.name}{" "}
                      <span className="text-xs font-normal text-slate-400">
                        ({sub.category})
                      </span>
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
                      onClick={() => {
                        const newSubs = submissions.filter((i) => i.id !== sub.id);
                        setSubmissions(newSubs);
                        localStorage.setItem("786ai_submissions", JSON.stringify(newSubs));
                      }}
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

        <div className="space-y-4 pt-6 border-t border-slate-800">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-white">
              Manage Live Directory Catalog ({filteredDirectory.length} / {tools.length})
            </h2>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tools or category..."
              className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
            />
          </div>
          <div className="divide-y divide-slate-800 bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
            {filteredDirectory.map((tool) => (
              <div
                key={tool.id}
                className="p-4 flex flex-wrap justify-between items-center gap-3"
              >
                <div>
                  <p className="font-semibold text-white">
                    {tool.icon ? `${tool.icon} ` : ""}
                    {tool.name}
                  </p>
                  <p className="text-xs text-slate-400">
                    {tool.category}
                    {tool.url ? ` • ${tool.url}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 rounded-full text-xs bg-emerald-950 text-emerald-400 border border-emerald-800">
                    Active
                  </span>
                  <button
                    onClick={() => handleDestroy(tool.id)}
                    className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-lg transition"
                  >
                    Delete
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
