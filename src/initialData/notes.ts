const notes = [
  {
    id: '1',
    title: 'JavaScript Basics',
    tags: ['JavaScript', 'Beginner'],
    description:
      'This note covers the basics of JavaScript, including variables, data types, and basic syntax.',
    language: 'javascript',
    code: `// JavaScript Basics
  const name = 'John';
  console.log(name); // Output: John
  `,
    state: {
      isFavorite: true,
    },
    createdAt: new Date('2024-07-09'),
    updatedAt: new Date('2024-07-09'),
  },
  {
    id: '2',
    title: 'React Hooks Overview',
    tags: ['JavaScript', 'React', 'Hooks'],
    description:
      'An overview of React hooks, including useState, useEffect, and custom hooks.',
    language: 'javascript',
    code: `// React Hooks Overview
  import React, { useState, useEffect } from 'react';
  
  const Example = () => {
    const [count, setCount] = useState(0);
  
    useEffect(() => {
      document.title = \`You clicked \${count} times\`;
    }, [count]);
  
    return (
      <div>
        <p>You clicked {count} times</p>
        <button onClick={() => setCount(count + 1)}>Click me</button>
      </div>
    );
  };
  
  export default Example;
  `,

    state: {
      isFavorite: false,
    },
    createdAt: new Date('2024-07-08'),
    updatedAt: new Date('2024-07-08'),
  },
  {
    id: '3',
    title: 'Next.js API Routes',
    tags: ['JavaScript', 'React', 'Next.js', 'API'],
    description:
      'This note demonstrates how to create API routes in a Next.js application.',
    language: 'javascript',
    code: `// Next.js API Routes
  export default function handler(req, res) {
    res.status(200).json({ message: 'Hello from Next.js API route' });
  }
  `,
    state: {
      isFavorite: false,
    },
    createdAt: new Date('2024-07-07'),
    updatedAt: new Date('2024-07-07'),
  },
  {
    id: '4',
    title: 'Styled Components with Tailwind CSS',
    tags: ['CSS', 'React', 'Tailwind'],
    description:
      'How to use styled components with Tailwind CSS in a React application.',
    language: 'javascript',
    code: `// Styled Components with Tailwind CSS
  import styled from 'styled-components';
  
  const Button = styled.button\`
    @apply bg-blue-500 text-white font-bold py-2 px-4 rounded;
  \`;
  
  const App = () => (
    <div>
      <Button>Click Me</Button>
    </div>
  );
  
  export default App;
  `,
    state: {
      isFavorite: true,
    },
    createdAt: new Date('2024-07-06'),
    updatedAt: new Date('2024-07-06'),
  },
  {
    id: '5',
    title: 'Connecting to MongoDB with Mongoose',
    tags: ['JavaScript', 'Node.js', 'MongoDB', 'Backend'],
    description:
      'This note explains how to connect to a MongoDB database using Mongoose in a Node.js application.',
    language: 'javascript',
    code: `// Connecting to MongoDB with Mongoose
  const mongoose = require('mongoose');
  
  mongoose.connect('mongodb://localhost:27017/mydatabase', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  
  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function() {
    console.log('Connected to the database');
  });
  `,
    state: {
      isFavorite: false,
    },
    createdAt: new Date('2024-07-05'),
    updatedAt: new Date('2024-07-05'),
  },
];

export default notes;
