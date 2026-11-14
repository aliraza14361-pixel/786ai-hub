import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Apne Prisma client path ke mutabiq adjustment karein

export async function GET(
  req: NextRequest,
  { params }: { params: { toolId: string } }
) {
  const { toolId } = params;

  try {
    const tool = await prisma.tool.update({
      where: { id: toolId },
      data: {
        clicksCount: { increment: 1 },
      },
      select: { websiteUrl: true },
    });

    if (!tool || !tool.websiteUrl) {
      return NextResponse.redirect(new URL('/', req.url));
    }

    return NextResponse.redirect(tool.websiteUrl);
  } catch (error) {
    return NextResponse.redirect(new URL('/', req.url));
  }
}

