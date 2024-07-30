import initialNotes from '@/initialData/notes';
import initialTags from '@/initialData/tags';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.snippet.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.user.deleteMany();

  // Create tags
  const tags = await Promise.all(
    initialTags.map(tag => prisma.tag.create({ data: tag })),
  );

  console.log(
    'Created tags:',
    tags.map(tag => tag.id),
  );

  // Create snippets
  const snippets = await Promise.all(
    initialNotes.map(({ description, tagIDs: snippetTags, ...note }) =>
      prisma.snippet.create({
        data: {
          ...note,
          tagIDs: tags
            .filter(tag => snippetTags.includes(tag.name))
            .map(tag => tag.id),
        },
      }),
    ),
  );

  console.log(
    'Created snippets:',
    snippets.map(snippet => snippet.id),
  );

  // Update tags with snippet IDs
  await Promise.all(
    tags.map(tag =>
      prisma.tag.update({
        where: { id: tag.id },
        data: {
          snippetIDs: snippets
            .filter(snippet => snippet.tagIDs.includes(tag.id))
            .map(snippet => snippet.id),
        },
      }),
    ),
  );

  console.log('Updated tags with snippet IDs');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
