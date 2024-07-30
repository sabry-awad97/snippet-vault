import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.snippet.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.user.deleteMany();

  // Create tags
  const tags = await Promise.all([
    prisma.tag.create({ data: { name: 'JavaScript', color: '#f7df1e' } }),
    prisma.tag.create({ data: { name: 'Python', color: '#3776ab' } }),
    prisma.tag.create({ data: { name: 'React', color: '#61dafb' } }),
    prisma.tag.create({ data: { name: 'Node.js', color: '#339933' } }),
  ]);

  console.log(
    'Created tags:',
    tags.map(tag => tag.id),
  );

  // Create snippets
  const snippet1 = await prisma.snippet.create({
    data: {
      title: 'Hello World in JavaScript',
      language: 'javascript',
      code: 'console.log("Hello, World!");',
      tagIDs: [tags[0].id, tags[3].id], // JavaScript and Node.js
      state: {
        isFavorite: true,
        isDark: false,
      },
    },
  });

  const snippet2 = await prisma.snippet.create({
    data: {
      title: 'React Component Example',
      language: 'javascript',
      code: `
import React from 'react';

const HelloWorld = () => {
  return <h1>Hello, World!</h1>;
};

export default HelloWorld;
      `.trim(),
      tagIDs: [tags[0].id, tags[2].id], // JavaScript and React
      state: {
        isFavorite: false,
        isDark: true,
      },
    },
  });

  const snippet3 = await prisma.snippet.create({
    data: {
      title: 'Python List Comprehension',
      language: 'python',
      code: `
# Create a list of squares
squares = [x**2 for x in range(10)]
print(squares)
      `.trim(),
      tagIDs: [tags[1].id], // Python
      state: {
        isFavorite: true,
        isDark: true,
      },
    },
  });

  console.log('Created snippets:', snippet1.id, snippet2.id, snippet3.id);

  // Update tags with snippet IDs
  await Promise.all(
    tags.map(tag =>
      prisma.tag.update({
        where: { id: tag.id },
        data: { snippetIDs: { set: [] } }, // Clear existing snippet IDs
      }),
    ),
  );

  await prisma.tag.update({
    where: { id: tags[0].id },
    data: { snippetIDs: { push: [snippet1.id, snippet2.id] } },
  });

  await prisma.tag.update({
    where: { id: tags[1].id },
    data: { snippetIDs: { push: snippet3.id } },
  });

  await prisma.tag.update({
    where: { id: tags[2].id },
    data: { snippetIDs: { push: snippet2.id } },
  });

  await prisma.tag.update({
    where: { id: tags[3].id },
    data: { snippetIDs: { push: snippet1.id } },
  });

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
