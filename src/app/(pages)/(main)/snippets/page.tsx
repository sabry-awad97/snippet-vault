'use client';

import { useAuth } from '@/hooks/useAuth';
import useCurrentTheme from '@/hooks/useCurrentTheme';
import useQueryParams from '@/hooks/useQueryParams';
import {
  useCreateSnippet,
  useSnippetsQuery,
  useUpdateSnippet,
} from '@/hooks/useSnippets';
import useSnippetStore from '@/hooks/useSnippetStore';
import useTagsContext from '@/hooks/useTagsStore';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import TagListDialog from './_components/ExistingTagsDialog';
import SnippetCard from './_components/SnippetCard';
import SnippetDialog from './_components/SnippetDialog';
import TagCarousel from './_components/TagCarousel';

export default function SnippetsPage() {
  const auth = useAuth();
  const router = useRouter();
  const { theme } = useCurrentTheme();
  const isDarkMode = theme === 'dark';

  const filter = useQueryParams();

  const createSnippetMutation = useCreateSnippet();
  const updateSnippetMutation = useUpdateSnippet();
  const { data: snippets = [], isLoading, error } = useSnippetsQuery(filter);

  const {
    editingSnippet,
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
    <div
      className={cn('min-h-screen bg-gradient-to-br', {
        'from-purple-50 to-indigo-100': !isDarkMode,
        'from-gray-900 to-purple-900': isDarkMode,
      })}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="container mx-auto max-w-7xl px-4 py-8"
      >
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <TagCarousel />
        </motion.div>

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
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
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
              ? updateSnippetMutation.mutateAsync(snippet)
              : createSnippetMutation.mutateAsync(snippet));
          }}
          initialData={editingSnippet}
          isEditMode={isEditMode}
        />
        <TagListDialog
          isOpen={isTagsDialogOpen}
          onClose={() => {
            setIsTagsDialogOpen(false);
          }}
          isDarkMode={isDarkMode}
        />
      </motion.div>
    </div>
  );
}
