import { PrismaClient } from '@prisma/client';
import { TOOLS_DATA } from '../lib/toolsData';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding initial 32 AI tools into PostgreSQL Database...');
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
  }
  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
