import notes from '@/initialData/notes';
import { SnippetSchema } from '@/lib/schemas/snippet';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const snippets = SnippetSchema.array().parse(notes);

async function main() {
  console.log('Seeding...');

  for (const { id, ...snippet } of snippets) {
    await prisma.snippet.create({
      data: snippet,
    });
  }

  console.log('Seeding completed.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
