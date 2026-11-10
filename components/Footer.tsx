import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 py-8 px-6 mt-16 text-xs text-slate-400">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <p className="font-semibold text-slate-300">786 AI Hub © {new Date().getFullYear()}</p>
          <p className="mt-1 text-slate-400">Curated AI Tools Directory & Automation Studio.</p>
        </div>
        
        <div className="flex gap-6">
          <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
          <Link href="/terms" className="hover:underline">Terms of Service</Link>
          <Link href="/disclosure" className="hover:underline">Affiliate Disclosure</Link>
        </div>
      </div>
    </footer>
  );
}
