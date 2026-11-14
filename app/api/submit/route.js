import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    if (!body?.name || !body?.url) {
      return NextResponse.json({ success: false, error: 'Name and URL required' }, { status: 400 });
    }
    return NextResponse.json({ success: true, tool: body });
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 500 });
  }
}
