'use client';

import { useAuth } from '@/hooks/useAuth';
import useCurrentTheme from '@/hooks/useCurrentTheme';
import { useLinkStore } from '@/hooks/useLinkStore';
import useSnippets from '@/hooks/useSnippets';
import useSnippetStore from '@/hooks/useSnippetStore';
import useTagsContext from '@/hooks/useTagsStore';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import TagListDialog from './_components/ExistingTagsDialog';
import SnippetCard from './_components/SnippetCard';
import SnippetDialog from './_components/SnippetDialog';

export default function SnippetsPage() {
  const auth = useAuth();
  const router = useRouter();
  const { theme } = useCurrentTheme();
  const { resetLinks } = useLinkStore();

  const { createSnippet, updateSnippet } = useSnippets();

  const {
    editingSnippet,
    filteredSnippets,
    isEditMode,
    isSnippetDialogOpen,
    resetSnippetDialog,
  } = useSnippetStore();

  const { isTagsDialogOpen, setIsTagsDialogOpen } = useTagsContext();

  useEffect(() => {
    if (!auth?.user) {
      router.push('/login');
    }
  }, [auth, router]);

  return (
    <div className="flex flex-1 dark:bg-gray-900">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="mx-auto flex flex-1 flex-col p-4"
      >
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid flex-1 grid-cols-1 gap-6 md:grid-cols-2"
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
                className="flex w-full flex-1"
              >
                <SnippetCard snippet={snippet} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
        <SnippetDialog
          isOpen={isSnippetDialogOpen}
          onClose={resetSnippetDialog}
          onSubmit={async snippet => {
            await (isEditMode
              ? updateSnippet(snippet)
              : createSnippet(snippet));
          }}
          initialData={editingSnippet}
          isEditMode={isEditMode}
        />
        <TagListDialog
          isOpen={isTagsDialogOpen}
          onClose={() => {
            setIsTagsDialogOpen(false);
            resetLinks();
          }}
          isDarkMode={theme === 'dark'}
        />
      </motion.div>
    </div>
  );
}
