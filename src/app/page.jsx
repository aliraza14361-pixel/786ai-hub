'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://tzeoghdogqpvetxhnkzx.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_BUDtkAlRg88MWjYtP1Z37A_DokKloKI';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function Home() {
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTools() {
      const { data, error } = await supabase.from('tools').select('*');
      if (!error && data) setTools(data);
      setLoading(false);
    }
    fetchTools();
  }, []);

  return (
    <main className="min-h-screen bg-[#090d16] text-white p-6">
      <header className="max-w-6xl mx-auto py-6 border-b border-gray-800 flex justify-between items-center">
        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
          786ai.com
        </h1>
        <span className="text-xs bg-cyan-900/50 text-cyan-300 border border-cyan-700/50 px-3 py-1 rounded-full">
          Global AI Hub (Web, Android, iOS)
        </span>
      </header>

      <section className="max-w-6xl mx-auto my-10 text-center">
        <h2 className="text-4xl font-extrabold mb-4">All World AI Tools Hub</h2>
        <p className="text-gray-400 max-w-xl mx-auto mb-8">
          Discover and launch top-rated AI tools worldwide for writing, coding, images, and audio.
        </p>

        {loading ? (
          <p className="text-cyan-400">Loading live AI tools from Supabase...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
            {tools.map((tool) => (
              <div key={tool.id} className="bg-gray-900/60 border border-gray-800 rounded-xl p-5 hover:border-cyan-500/50 transition">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold">{tool.name}</h3>
                  <span className="text-xs bg-blue-950 text-blue-300 px-2.5 py-0.5 rounded border border-blue-800">
                    {tool.pricing}
                  </span>
                </div>
                <p className="text-gray-400 text-sm mb-4">{tool.description}</p>
                <a 
                  href={tool.url} 
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-block w-full text-center bg-gradient-to-r from-blue-600 to-cyan-500 hover:opacity-90 py-2 rounded-lg font-medium text-sm transition"
                >
                  Launch Tool 🚀
                </a>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
