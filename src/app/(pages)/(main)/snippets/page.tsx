'use client';

import { useAuth } from '@/hooks/useAuth';
import useSnippets from '@/hooks/useSnippets';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';
import SnippetCard from './_components/SnippetCard';
import SnippetDialog from './_components/SnippetDialog';
import SnippetsHeader from './_components/SnippetsHeader';

export default function SnippetsPage() {
  const auth = useAuth();
  const router = useRouter();

  const {
    editingSnippet,
    filteredSnippets,
    isEditMode,
    isNewSnippetDialogOpen,
    createSnippet,
    updateSnippet,
    deleteSnippet,
    toggleFavorite,
    dispatch,
  } = useSnippets();

  useEffect(() => {
    if (!auth?.user) {
      router.push('/login');
    }
  }, [auth, router]);

  const handleCopySnippet = (code: string) => {
    navigator.clipboard.writeText(code);
    toast('Copied to Clipboard', {
      description: 'The snippet code has been copied to your clipboard.',
    });
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="mx-auto px-4 py-8"
      >
        <SnippetsHeader />
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence>
            {filteredSnippets.map(snippet => (
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
                  onDelete={() => deleteSnippet(snippet.id)}
                  onCopy={() => handleCopySnippet(snippet.code)}
                  onEdit={() => {
                    dispatch({ type: 'SET_EDIT_MODE', payload: true });
                    dispatch({ type: 'SET_EDITING_SNIPPET', payload: snippet });
                    dispatch({ type: 'SET_NEW_SNIPPET_DIALOG', payload: true });
                  }}
                  onFavorite={() => toggleFavorite(snippet.id)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
        <SnippetDialog
          isOpen={isNewSnippetDialogOpen}
          onClose={() => {
            dispatch({ type: 'SET_NEW_SNIPPET_DIALOG', payload: false });
            dispatch({ type: 'SET_EDIT_MODE', payload: false });
            dispatch({ type: 'SET_EDITING_SNIPPET', payload: null });
          }}
          onSubmit={isEditMode ? updateSnippet : createSnippet}
          initialData={editingSnippet}
          isEditMode={isEditMode}
        />
      </motion.div>
    </div>
  );
}
