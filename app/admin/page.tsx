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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const [submissions, setSubmissions] = useState(INITIAL_SUBMISSIONS);
  const [tools, setTools] = useState(INITIAL_TOOLS);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Admin Credentials
    if (username === 'admin' && password === '786aihubpass') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Invalid username or password!');
    }
  };

  const handleGoogleLogin = () => {
    // Fast mock login for Google OAuth readiness
    setIsAuthenticated(true);
  };

  const handleApprove = (id: number) => {
    setSubmissions(submissions.filter(item => item.id !== id));
    alert('Tool approved and added to live directory!');
  };

  const handleDestroy = (id: number) => {
    setTools(tools.filter(tool => tool.id !== id));
  };

  // Modern Login Screen (If Not Authenticated)
  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full space-y-6 p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl">
          <div className="text-center space-y-2">
            <span className="text-4xl">🔐</span>
            <h1 className="text-2xl font-bold text-white">786 AI Admin Portal</h1>
            <p className="text-xs text-slate-400">Sign in to manage directory submissions & tools</p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs text-center font-medium">
              {error}
            </div>
          )}

          {/* Form Login */}
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
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-800"></div></div>
            <div className="relative flex justify-center text-xs"><span className="px-2 bg-slate-900 text-slate-500">OR</span></div>
          </div>

          {/* Google Login Button UI */}
          <button
            onClick={handleGoogleLogin}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-200 text-sm font-semibold flex items-center justify-center gap-3 transition"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            Sign in with Google Account
          </button>
        </div>
      </div>
    );
  }

  // Admin Dashboard View (When Logged In)
  return (
    <div className="py-8 space-y-8">
      {/* Top Header */}
      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white">786 AI Admin Dashboard</h1>
          <p className="text-xs text-slate-400 font-medium">Directory management & submissions approval queue</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 bg-cyan-950 text-cyan-400 text-xs font-semibold rounded-full border border-cyan-800">
            Admin Authenticated
          </span>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-medium rounded-lg border border-slate-800 transition"
          >
            Logout
          </button>
        </div>
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
