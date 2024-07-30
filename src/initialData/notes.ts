const notes = [
  {
    title: 'JavaScript Basics',
    tagIDs: ['1', '2'],
    description:
      'This note covers the basics of JavaScript, including variables, data types, and basic syntax.',
    language: 'javascript',
    code: `// JavaScript Basics\nconst name = 'John';\nconsole.log(name); // Output: John\n`,
    state: {
      isFavorite: true,
      isDark: false,
    },
    createdAt: new Date('2024-07-09'),
    updatedAt: new Date('2024-07-09'),
  },
  {
    title: 'React Hooks Overview',
    tagIDs: ['1', '3', '4'],
    description:
      'An overview of React hooks, including useState, useEffect, and custom hooks.',
    language: 'javascript',
    code: `// React Hooks Overview\nimport React, { useState, useEffect } from 'react';\n\nconst Example = () => {\n  const [count, setCount] = useState(0);\n\n  useEffect(() => {\n    document.title = \`You clicked \${count} times\`;\n  }, [count]);\n\n  return (\n    <div>\n      <p>You clicked {count} times</p>\n      <button onClick={() => setCount(count + 1)}>Click me</button>\n    </div>\n  );\n};\n\nexport default Example;\n`,
    state: {
      isFavorite: false,
      isDark: false,
    },
    createdAt: new Date('2024-07-08'),
    updatedAt: new Date('2024-07-08'),
  },
  {
    title: 'Next.js API Routes',
    tagIDs: ['1', '3', '5', '6'],
    description:
      'This note demonstrates how to create API routes in a Next.js application.',
    language: 'javascript',
    code: `// Next.js API Routes\nexport default function handler(req, res) {\n  res.status(200).json({ message: 'Hello from Next.js API route' });\n}\n`,
    state: {
      isFavorite: false,
      isDark: false,
    },
    createdAt: new Date('2024-07-07'),
    updatedAt: new Date('2024-07-07'),
  },
  {
    title: 'Styled Components with Tailwind CSS',
    tagIDs: ['7', '3', '8'],
    description:
      'How to use styled components with Tailwind CSS in a React application.',
    language: 'javascript',
    code: `// Styled Components with Tailwind CSS\nimport styled from 'styled-components';\n\nconst Button = styled.button\`\n  @apply bg-blue-500 text-white font-bold py-2 px-4 rounded;\n\`;\n\nconst App = () => (\n  <div>\n    <Button>Click Me</Button>\n  </div>\n);\n\nexport default App;\n`,
    state: {
      isFavorite: true,
      isDark: false,
    },
    createdAt: new Date('2024-07-06'),
    updatedAt: new Date('2024-07-06'),
  },
  {
    title: 'Connecting to MongoDB with Mongoose',
    tagIDs: ['1', '9', '10', '11'],
    description:
      'This note explains how to connect to a MongoDB database using Mongoose in a Node.js application.',
    language: 'javascript',
    code: `// Connecting to MongoDB with Mongoose\nconst mongoose = require('mongoose');\n\nmongoose.connect('mongodb://localhost:27017/mydatabase', {\n  useNewUrlParser: true,\n  useUnifiedTopology: true,\n});\n\nconst db = mongoose.connection;\ndb.on('error', console.error.bind(console, 'connection error:'));\ndb.once('open', function() {\n  console.log('Connected to the database');\n});\n`,
    state: {
      isFavorite: false,
      isDark: false,
    },
    createdAt: new Date('2024-07-05'),
    updatedAt: new Date('2024-07-05'),
  },
];

export default notes;
