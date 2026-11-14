import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export let clickCounts: Record<string, number> = {
  total: 0,
};

export async function GET() {
  const { total, ...byTool } = clickCounts;
  return NextResponse.json({
    total: total || 0,
    byTool,
  });
}

export async function POST(req: Request) {
  try {
    const { slug } = await req.json();
    if (slug) {
      clickCounts.total = (clickCounts.total || 0) + 1;
      clickCounts[slug] = (clickCounts[slug] || 0) + 1;
    }
    const { total, ...byTool } = clickCounts;
    return NextResponse.json({ success: true, total: total || 0, byTool });
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
