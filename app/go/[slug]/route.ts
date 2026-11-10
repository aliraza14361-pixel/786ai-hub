import { NextResponse } from 'next/server';
import { getToolBySlug } from '../../../lib/toolsData';
import { clickCounts } from '../../api/clicks/route';

type Props = {
  params: Promise<{ slug: string }> | { slug: string };
};

export async function GET(req: Request, { params }: Props) {
  const resolvedParams = await params;
  const tool = getToolBySlug(resolvedParams.slug);

  if (!tool || !tool.url) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // Increment live click count
  clickCounts.total = (clickCounts.total || 0) + 1;
  clickCounts[resolvedParams.slug] = (clickCounts[resolvedParams.slug] || 0) + 1;

  return NextResponse.redirect(tool.url, { status: 307 });
}
