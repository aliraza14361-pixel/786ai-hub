import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { TOOLS_DATA } from '../../../lib/toolsData';

export async function GET() {
  try {
    let count = 0;
    for (const tool of TOOLS_DATA) {
      await prisma.tool.upsert({
        where: { slug: tool.slug },
        update: {
          name: tool.name,
          icon: tool.icon,
          rating: tool.rating,
          description: tool.description,
          pricing: tool.pricing,
          category: tool.category,
          url: tool.url,
        },
        create: {
          slug: tool.slug,
          name: tool.name,
          icon: tool.icon,
          rating: tool.rating,
          description: tool.description,
          pricing: tool.pricing,
          category: tool.category,
          url: tool.url,
          status: 'Active',
        },
      });
      count++;
    }
    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${count} tools into PostgreSQL Database!`,
    });
  } catch (error: any) {
    console.error('Seeding Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Seeding failed' },
      { status: 500 }
    );
  }
}
