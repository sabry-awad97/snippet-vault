'use client';

import { useAuth } from '@/hooks/useAuth';
import useSnippets from '@/hooks/useSnippets';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
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
    resetSnippetDialog,
  } = useSnippets();

  useEffect(() => {
    if (!auth?.user) {
      router.push('/login');
    }
  }, [auth, router]);

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
                <SnippetCard snippet={snippet} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
        <SnippetDialog
          isOpen={isNewSnippetDialogOpen}
          onClose={resetSnippetDialog}
          onSubmit={isEditMode ? updateSnippet : createSnippet}
          initialData={editingSnippet}
          isEditMode={isEditMode}
        />
      </motion.div>
    </div>
  );
}
