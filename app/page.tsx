import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
        Unleash the Power of AI.
      </h1>
      <p className="mt-4 text-lg text-slate-400 max-w-2xl">
        Global Tools Directory, Native Processors & Automation Studio.
      </p>

      <div className="mt-6 flex justify-center">
        <Link 
          href="https://x.com/AliRaza10048422" 
          target="_blank" 
          className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold px-6 py-3 rounded-full text-base transition-all shadow-lg flex items-center gap-2"
        >
          🔥 Feature Your AI Tool ($29)
        </Link>
      </div>
    </main>
  );
}
<div className="mt-4 flex justify-center">
  <a 
    href="https://x.com/AliRaza10048422" 
    target="_blank" 
    className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold px-6 py-3 rounded-full text-base transition-all shadow-lg flex items-center gap-2"
  >
    🔥 Feature Your AI Tool ($29)
  </a>
</div>
