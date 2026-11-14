import { NextResponse } from 'next/server';
import { getToolBySlug, TOOLS_DATA } from '../../../lib/toolsData';
import { clickCounts } from '../../api/clicks/route';

type Props = {
  params: Promise<{ slug: string }> | { slug: string };
};

export async function GET(req: Request, { params }: Props) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  const tool =
    getToolBySlug(slug) ||
    TOOLS_DATA.find(
      (t) =>
        t.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') === slug
    );

  const fallbackUrl = new URL(req.url).searchParams.get('u');
  const targetUrl =
    tool?.url || (fallbackUrl && fallbackUrl.startsWith('https://') ? fallbackUrl : null);

  if (!targetUrl) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  clickCounts.total = (clickCounts.total || 0) + 1;
  clickCounts[slug] = (clickCounts[slug] || 0) + 1;

  return NextResponse.redirect(targetUrl, { status: 307 });
}
