import ToolDirectory from '../components/ToolDirectory';
import { TOOLS_DATA } from '../lib/toolsData';

export default function HomePage() {
  return (
    <div className="py-8 space-y-10">
      {/* Hero Banner */}
      <section className="text-center space-y-4 max-w-3xl mx-auto pt-6">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
          Unleash the <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Power of AI.</span>
        </h1>
        <p className="text-slate-400 text-lg">
          Global Tools Directory, Native Processors & Automation Studio.
        </p>
      </section>

      {/* Stats Bar */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-2xl bg-slate-900/40 border border-slate-800 text-center">
        <div>
          <p className="text-slate-400 text-xs">Affiliate Traffic</p>
          <p className="text-2xl font-bold text-cyan-400">18.4K</p>
        </div>
        <div>
          <p className="text-slate-400 text-xs">Unique Clicks</p>
          <p className="text-2xl font-bold text-white">12.8K</p>
        </div>
        <div>
          <p className="text-slate-400 text-xs">Approved Leads</p>
          <p className="text-2xl font-bold text-white">2.6K</p>
        </div>
        <div>
          <p className="text-slate-400 text-xs">Conversion Rate</p>
          <p className="text-2xl font-bold text-emerald-400">7.3%</p>
        </div>
      </section>

      {/* Tools Directory & Dynamic Filters */}
      <ToolDirectory tools={TOOLS_DATA} />
    </div>
  );
}
