import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.snippet.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.snippetState.deleteMany();

  // Create tags
  const tags = await Promise.all([
    prisma.tag.create({ data: { name: 'JavaScript', color: '#F7DF1E' } }),
    prisma.tag.create({ data: { name: 'Beginner', color: '#FF6347' } }),
    prisma.tag.create({ data: { name: 'React', color: '#61DAFB' } }),
    prisma.tag.create({ data: { name: 'Hooks', color: '#4CAF50' } }),
    prisma.tag.create({ data: { name: 'Next.js', color: '#000000' } }),
    prisma.tag.create({ data: { name: 'API', color: '#00BFFF' } }),
    prisma.tag.create({ data: { name: 'CSS', color: '#2965F1' } }),
    prisma.tag.create({ data: { name: 'Tailwind', color: '#38B2AC' } }),
    prisma.tag.create({ data: { name: 'Node.js', color: '#68A063' } }),
    prisma.tag.create({ data: { name: 'MongoDB', color: '#47A248' } }),
    prisma.tag.create({ data: { name: 'Backend', color: '#FFA500' } }),
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
      title: 'JavaScript Basics',
      description:
        'This note covers the basics of JavaScript, including variables, data types, and basic syntax.',
      language: 'javascript',
      code: `// JavaScript Basics\nconst name = 'John';\nconsole.log(name); // Output: John\n`,
      snippetStateId: snippetState1.id,
      tags: {
        connect: [{ id: tags[0].id }, { id: tags[1].id }],
      },
    },
  });

  const snippet2 = await prisma.snippet.create({
    data: {
      title: 'React Hooks Overview',
      description:
        'An overview of React hooks, including useState, useEffect, and custom hooks.',
      language: 'javascript',
      code: `// React Hooks Overview\nimport React, { useState, useEffect } from 'react';\n\nconst Example = () => {\n  const [count, setCount] = useState(0);\n\n  useEffect(() => {\n    document.title = \`You clicked \${count} times\`;\n  }, [count]);\n\n  return (\n    <div>\n      <p>You clicked {count} times</p>\n      <button onClick={() => setCount(count + 1)}>Click me</button>\n    </div>\n  );\n};\n\nexport default Example;\n`,
      snippetStateId: snippetState2.id,
      tags: {
        connect: [{ id: tags[0].id }, { id: tags[2].id }, { id: tags[3].id }],
      },
    },
  });

  const snippet3 = await prisma.snippet.create({
    data: {
      title: 'Next.js API Routes',
      description:
        'This note demonstrates how to create API routes in a Next.js application.',
      language: 'javascript',
      code: `// Next.js API Routes\nexport default function handler(req, res) {\n  res.status(200).json({ message: 'Hello from Next.js API route' });\n}\n`,
      snippetStateId: snippetState3.id,
      tags: {
        connect: [
          { id: tags[0].id },
          { id: tags[2].id },
          { id: tags[4].id },
          { id: tags[5].id },
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
