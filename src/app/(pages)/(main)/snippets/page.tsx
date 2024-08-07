'use client';

import { useAuth } from '@/hooks/useAuth';
import useCurrentTheme from '@/hooks/useCurrentTheme';
import {
  useCreateSnippet,
  useSnippetsQuery,
  useUpdateSnippet,
} from '@/hooks/useSnippets';
import useSnippetsFilter from '@/hooks/useSnippetsFilter';
import useSnippetStore from '@/hooks/useSnippetStore';
import { useCreateTag } from '@/hooks/useTags';
import useTagsStore from '@/hooks/useTagsStore';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import EmptySnippetsState from './_components/EmptySnippetsState';
import TagListDialog from './_components/ExistingTagsDialog';
import SnippetDialog from './_components/SnippetDialog';
import SnippetGrid from './_components/SnippetGrid';
import SnippetGridSkeleton from './_components/SnippetGridSkeleton';
import TagCarousel from './_components/TagCarousel';
import TagCreateFormDialog from './_components/TagFormDialog';

interface ErrorProps {
  error: Error;
  onRetry: () => void;
}

const ErrorDisplay = ({ error, onRetry }: ErrorProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="flex flex-col items-center justify-center rounded-lg bg-red-50 p-8 shadow-lg dark:bg-red-900"
  >
    <AlertCircle className="mb-4 h-16 w-16 text-red-500 dark:text-red-300" />
    <h2 className="mb-2 text-2xl font-bold text-red-700 dark:text-red-200">
      Oops! Something went wrong
    </h2>
    <p className="mb-4 text-center text-red-600 dark:text-red-100">
      {error.message || 'An unexpected error occurred'}
    </p>
    <button
      onClick={onRetry}
      className="flex items-center rounded-full bg-red-500 px-4 py-2 text-white transition-colors duration-200 hover:bg-red-600"
    >
      <RefreshCw className="mr-2 h-4 w-4" />
      Retry
    </button>
  </motion.div>
);

export default function SnippetsPage() {
  const auth = useAuth();
  const router = useRouter();
  const { theme } = useCurrentTheme();
  const isDarkMode = theme === 'dark';

  const createSnippetMutation = useCreateSnippet();
  const updateSnippetMutation = useUpdateSnippet();
  const createTagMutation = useCreateTag();

  const { isLoading, error, refetch } = useSnippetsQuery();
  const filteredSnippets = useSnippetsFilter();

  const {
    editingSnippet,
    isEditMode,
    isSnippetDialogOpen,
    resetSnippetDialog,
    setSnippetDialog,
  } = useSnippetStore();

  const {
    isTagsDialogOpen,
    setIsTagsDialogOpen,
    isTagCreateFormDialogOpen: isTagFormDialogOpen,
    setIsTagCreateFormDialogOpen: setIsTagFormDialogOpen,
  } = useTagsStore();

  useEffect(() => {
    if (!auth?.user) {
      router.push('/login');
    }
  }, [auth, router]);

  return (
    <div
      className={cn('flex h-full min-h-screen w-full bg-gradient-to-br', {
        'from-purple-50 to-indigo-100': !isDarkMode,
        'from-gray-900 to-purple-900': isDarkMode,
      })}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="container mx-auto flex max-w-7xl flex-1 flex-col px-4 py-8"
      >
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <TagCarousel />
        </motion.div>

        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <SnippetGridSkeleton />
            </motion.div>
          ) : error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-1 items-center justify-center"
            >
              <ErrorDisplay error={error} onRetry={refetch} />
            </motion.div>
          ) : filteredSnippets.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <EmptySnippetsState
                onCreateSnippet={() => setSnippetDialog(null)}
              />
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <SnippetGrid snippets={filteredSnippets} />
            </motion.div>
          )}
        </AnimatePresence>

        <SnippetDialog
          isOpen={isSnippetDialogOpen}
          onClose={resetSnippetDialog}
          onSubmit={async snippet => {
            try {
              await (isEditMode
                ? updateSnippetMutation.mutateAsync(snippet)
                : createSnippetMutation.mutateAsync(snippet));
              resetSnippetDialog();
            } catch (error) {
              console.error('Error submitting snippet:', error);
            }
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
          onCreateTag={() => setIsTagFormDialogOpen(true)}
        />
        <TagCreateFormDialog
          isOpen={isTagFormDialogOpen}
          onClose={() => {
            setIsTagFormDialogOpen(false);
          }}
          onSubmit={async value => {
            try {
              await createTagMutation.mutateAsync(value);
              setIsTagFormDialogOpen(false);
            } catch (error) {
              console.error('Error creating tag:', error);
            }
          }}
          isDarkMode={isDarkMode}
        />
      </motion.div>
    </div>
  );
}
