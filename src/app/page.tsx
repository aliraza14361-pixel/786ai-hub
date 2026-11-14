import ToolGrid from '../components/ToolGrid';
import { prisma } from '@/lib/prisma';

export default async function HomePage() {
  let tools = [];
  try {
    tools = await prisma.tool.findMany({
      orderBy: { rating: 'desc' },
    });
  } catch (err) {
    tools = [];
  }

  return (
    <main className="py-10 bg-slate-950 min-h-screen">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">
          Unleash the <span className="text-indigo-500">Power of AI</span>
        </h1>
        <p className="text-slate-400">
          Global Tools Directory, Native Processors & Automation Studio.
        </p>
      </div>

      <ToolGrid initialTools={tools} />
    </main>
  );
}
