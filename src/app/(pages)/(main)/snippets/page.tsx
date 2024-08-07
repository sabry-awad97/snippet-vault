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
import { useCreateTag } from '@/hooks/useTags';
import useTagsStore from '@/hooks/useTagsStore';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import EmptySnippetsState from './_components/EmptySnippetsState';
import TagListDialog from './_components/ExistingTagsDialog';
import SnippetDialog from './_components/SnippetDialog';
import SnippetGrid from './_components/SnippetGrid';
import SnippetGridSkeleton from './_components/SnippetGridSkeleton';
import TagCarousel from './_components/TagCarousel';
import TagCreateFormDialog from './_components/TagFormDialog';

export default function SnippetsPage() {
  const auth = useAuth();
  const router = useRouter();
  const { theme } = useCurrentTheme();
  const isDarkMode = theme === 'dark';

  const filter = useQueryParams();

  const createSnippetMutation = useCreateSnippet();
  const updateSnippetMutation = useUpdateSnippet();
  const createTagMutation = useCreateTag();
  const { data: snippets = [], isLoading, error } = useSnippetsQuery(filter);

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
      className={cn('flex h-full w-full bg-gradient-to-br', {
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

        {isLoading ? (
          <SnippetGridSkeleton />
        ) : snippets.length === 0 ? (
          <EmptySnippetsState onCreateSnippet={() => setSnippetDialog(null)} />
        ) : (
          <SnippetGrid snippets={snippets} />
        )}

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
          onCreateTag={() => setIsTagFormDialogOpen(true)}
        />
        <TagCreateFormDialog
          isOpen={isTagFormDialogOpen}
          onClose={() => {
            setIsTagFormDialogOpen(false);
          }}
          onSubmit={value => createTagMutation.mutateAsync(value)}
          isDarkMode={isDarkMode}
        />
      </motion.div>
    </div>
  );
}
