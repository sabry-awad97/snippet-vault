'use client';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/hooks/useAuth';
import useCurrentTheme from '@/hooks/useCurrentTheme';
import useQueryParams from '@/hooks/useQueryParams';
import {
  useCreateSnippet,
  useSnippetsQuery,
  useUpdateSnippet,
} from '@/hooks/useSnippets';
import useSnippetStore from '@/hooks/useSnippetStore';
import { useCreateTag, useFetchTags } from '@/hooks/useTags';
import useTagsStore from '@/hooks/useTagsStore';
import { Snippet } from '@/lib/schemas/snippet';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronRight, PlusCircle, Tag } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import TagListDialog from './_components/ExistingTagsDialog';
import SnippetCard from './_components/SnippetCard';
import SnippetDialog from './_components/SnippetDialog';
import TagCarousel from './_components/TagCarousel';
import TagFormDialog from './_components/TagFormDialog';

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
    isTagFormDialogOpen,
    setIsTagFormDialogOpen,
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
        <TagFormDialog
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

interface SnippetGridProps {
  snippets: Snippet[];
}

function SnippetGrid({ snippets }: SnippetGridProps) {
  return (
    <ScrollArea className="h-[600px]">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className={cn({
          'grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3': true,
        })}
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
    </ScrollArea>
  );
}

function EmptySnippetsState({
  onCreateSnippet,
}: {
  onCreateSnippet: () => void;
}) {
  const { data: tags = [] } = useFetchTags();
  const [showTagHint, setShowTagHint] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowTagHint(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className={cn(
        'relative flex flex-1 flex-col items-center justify-center rounded-lg border-2 border-dashed border-purple-200 bg-white dark:border-purple-700 dark:bg-gray-800',
      )}
    >
      <PlusCircle
        className={cn('mb-4 h-16 w-16 text-purple-500 dark:text-purple-400')}
      />
      <h3
        className={cn(
          'mb-2 text-xl font-semibold text-gray-800 dark:text-white',
        )}
      >
        No snippets found
      </h3>
      <p className={cn('mb-4 text-center text-gray-600 dark:text-gray-400')}>
        Get started by creating your first snippet
      </p>
      <Button
        onClick={onCreateSnippet}
        className={cn(
          'bg-purple-500 transition-all duration-300 hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-700',
        )}
      >
        Create Snippet
      </Button>

      <AnimatePresence>
        {showTagHint && tags.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className={cn(
              'absolute bottom-4 right-4 max-w-xs rounded-lg bg-purple-100 p-4 shadow-lg dark:bg-purple-900',
            )}
          >
            <div className="flex items-center space-x-2">
              <Tag className="h-5 w-5 text-purple-500 dark:text-purple-400" />
              <p className="text-sm font-medium text-purple-700 dark:text-purple-300">
                Psst! Want a pro tip?
              </p>
            </div>
            <p className="mt-2 text-xs text-purple-600 dark:text-purple-200">
              Create some tags first to organize your snippets better!
            </p>
            <Button
              variant="link"
              size="sm"
              className="mt-2 p-0 text-xs text-purple-700 dark:text-purple-300"
              onClick={() => {
                // Handle navigation to tag creation
                console.log('Navigate to tag creation');
              }}
            >
              Create Tags
              <ChevronRight className="ml-1 h-3 w-3" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function SnippetGridSkeleton() {
  return (
    <ScrollArea className="h-[600px]">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className="animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"
          >
            <div className="h-48 rounded-t-lg bg-gray-300 dark:bg-gray-600"></div>
            <div className="p-4">
              <div className="mb-2 h-4 w-3/4 rounded bg-gray-300 dark:bg-gray-600"></div>
              <div className="h-4 w-1/2 rounded bg-gray-300 dark:bg-gray-600"></div>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
