import Link from 'next/link';

export default function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-50">
      <Link href="/" className="flex items-center gap-2 font-bold text-xl text-white">
        <span className="text-2xl">🔮</span> 786 AI Hub
      </Link>
      
      <nav className="flex items-center gap-6 text-sm font-medium text-slate-300">
        <Link href="#tools" className="hover:text-cyan-400 transition">Directory</Link>
        <Link href="/categories" className="hover:text-cyan-400 transition">Categories</Link>
        <Link href="/submit" className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold transition">
          + Submit Tool
        </Link>
        <Link href="/admin" className="text-slate-400 hover:text-white transition">Admin Panel</Link>
      </nav>
    </header>
  );
}
