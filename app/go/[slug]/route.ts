import { NextResponse } from 'next/server';
import { getToolBySlug } from '../../../lib/toolsData';

type Props = {
  params: Promise<{ slug: string }> | { slug: string };
};

export async function GET(req: Request, { params }: Props) {
  const resolvedParams = await params;
  const tool = getToolBySlug(resolvedParams.slug);

  if (!tool || !tool.url) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // Future DB connection hook for click analytics counter:
  // console.log(`[CLICK_TRACKED] Tool: ${tool.name} | Timestamp: ${new Date().toISOString()}`);

  return NextResponse.redirect(tool.url, { status: 307 });
}
