'use client';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Snippet } from '@/lib/schemas/snippet';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import SnippetCard from './_components/SnippetCard';
import SnippetDialog from './_components/SnippetDialog';

export default function SnippetsPage() {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [isNewSnippetDialogOpen, setIsNewSnippetDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingSnippet, setEditingSnippet] = useState<Snippet | null>(null);
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!auth?.user) {
      router.push('/login');
    } else {
      fetchSnippets();
    }
  }, [auth, router]);

  const fetchSnippets = async () => {
    // Replace with actual API call
    const mockSnippets: Snippet[] = [
      {
        id: '1',
        title: 'Hello World',
        code: 'console.log("Hello World!");',
        language: 'javascript',
        tags: ['hello', 'world'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        title: 'Fizz Buzz',
        code: 'for (let i = 1; i <= 100; i++) {\n  if (i % 15 === 0) console.log("FizzBuzz");\n  else if (i % 3 === 0) console.log("Fizz");\n  else if (i % 5 === 0) console.log("Buzz");\n  else console.log(i);\n}',
        language: 'javascript',
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    setSnippets(mockSnippets);
  };

  const handleCreateSnippet = async (newSnippet: Snippet) => {
    // Replace with actual API call
    const newSnippetWithId = {
      ...newSnippet,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setSnippets(prevSnippets => [...prevSnippets, newSnippetWithId]);
    setIsNewSnippetDialogOpen(false);
    toast('Snippet Created', {
      description: 'Your new snippet has been successfully created.',
    });
  };

  const handleUpdateSnippet = async (updatedSnippet: Snippet) => {
    // Replace with actual API call
    setSnippets(prevSnippets =>
      prevSnippets.map(snippet =>
        snippet.id === updatedSnippet.id ? updatedSnippet : snippet,
      ),
    );
    setIsEditMode(false);
    setEditingSnippet(null);
    toast('Snippet Updated', {
      description: 'Your snippet has been successfully updated.',
    });
  };

  const handleDeleteSnippet = async (id: string) => {
    // Replace with actual API call
    setSnippets(prevSnippets =>
      prevSnippets.filter(snippet => snippet.id !== id),
    );
    toast('Snippet Deleted', {
      description: 'Your snippet has been successfully deleted.',
    });
  };

  const handleCopySnippet = (code: string) => {
    navigator.clipboard.writeText(code);
    toast('Copied to Clipboard', {
      description: 'The snippet code has been copied to your clipboard.',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-8"
    >
      <div className="mb-6 flex items-center justify-between">
        <Button
          onClick={() => setIsNewSnippetDialogOpen(true)}
          className="bg-purple-600 text-white transition-all duration-200 hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
        >
          <Plus className="mr-2 h-4 w-4" /> <span>New Snippet</span>
        </Button>
      </div>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
      >
        <AnimatePresence>
          {snippets.map(snippet => (
            <motion.div
              key={snippet.id}
              layout
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
              <SnippetCard
                snippet={snippet}
                onDelete={() => handleDeleteSnippet(snippet.id)}
                onCopy={() => handleCopySnippet(snippet.code)}
                onEdit={() => {
                  setIsEditMode(true);
                  setEditingSnippet(snippet);
                  setIsNewSnippetDialogOpen(true);
                }}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
      <SnippetDialog
        isOpen={isNewSnippetDialogOpen}
        onClose={() => {
          setIsNewSnippetDialogOpen(false);
          setIsEditMode(false);
          setEditingSnippet(null);
        }}
        onSubmit={isEditMode ? handleUpdateSnippet : handleCreateSnippet}
        initialData={editingSnippet}
        isEditMode={isEditMode}
      />
    </motion.div>
  );
}
