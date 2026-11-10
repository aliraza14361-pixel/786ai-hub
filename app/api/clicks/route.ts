import { NextResponse } from 'next/server';

// Global click memory counter
export let clickCounts: Record<string, number> = {
  total: 12840,
  chatgpt: 1420,
  'claude-ai': 980,
  'cursor-editor': 1150,
};

export async function GET() {
  return NextResponse.json({
    total: clickCounts.total || 0,
    byTool: clickCounts,
  });
}

export async function POST(req: Request) {
  try {
    const { slug } = await req.json();
    if (slug) {
      clickCounts.total = (clickCounts.total || 0) + 1;
      clickCounts[slug] = (clickCounts[slug] || 0) + 1;
    }
    return NextResponse.json({ success: true, total: clickCounts.total });
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
