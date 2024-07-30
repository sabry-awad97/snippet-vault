import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.snippet.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.user.deleteMany();
  await prisma.snippetState.deleteMany();

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

  // Create snippet states
  const snippetState1 = await prisma.snippetState.create({
    data: {
      isFavorite: true,
      isDark: false,
    },
  });

  const snippetState2 = await prisma.snippetState.create({
    data: {
      isFavorite: false,
      isDark: true,
    },
  });

  const snippetState3 = await prisma.snippetState.create({
    data: {
      isFavorite: true,
      isDark: true,
    },
  });

  // Create snippets
  const snippet1 = await prisma.snippet.create({
    data: {
      title: 'Hello World in JavaScript',
      language: 'javascript',
      code: 'console.log("Hello, World!");',
      snippetStateId: snippetState1.id,
      tags: {
        connect: [
          { id: tags[0].id }, // JavaScript
          { id: tags[3].id }, // Node.js
        ],
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
      snippetStateId: snippetState2.id,
      tags: {
        connect: [
          { id: tags[0].id }, // JavaScript
          { id: tags[2].id }, // React
        ],
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
      snippetStateId: snippetState3.id,
      tags: {
        connect: [
          { id: tags[1].id }, // Python
        ],
      },
    },
  });

  console.log('Created snippets:', snippet1.id, snippet2.id, snippet3.id);

  console.log('Seeding completed successfully.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
