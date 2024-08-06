'use client';

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
import useTagsContext from '@/hooks/useTagsStore';
import { Snippet } from '@/lib/schemas/snippet';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { PlusCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from 'react-day-picker';
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
    setSnippetDialog,
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
  const { theme } = useCurrentTheme();
  const isDarkMode = theme === 'dark';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className={cn(
        'flex h-[400px] flex-col items-center justify-center rounded-lg border-2 border-dashed',
        isDarkMode
          ? 'border-purple-700 bg-gray-800'
          : 'border-purple-200 bg-white',
      )}
    >
      <PlusCircle
        className={cn(
          'mb-4 h-16 w-16',
          isDarkMode ? 'text-purple-400' : 'text-purple-500',
        )}
      />
      <h3
        className={cn(
          'mb-2 text-xl font-semibold',
          isDarkMode ? 'text-white' : 'text-gray-800',
        )}
      >
        No snippets found
      </h3>
      <p
        className={cn(
          'mb-4 text-center',
          isDarkMode ? 'text-gray-400' : 'text-gray-600',
        )}
      >
        Get started by creating your first snippet
      </p>
      <Button
        onClick={onCreateSnippet}
        className={cn(
          'transition-all duration-300',
          isDarkMode
            ? 'bg-purple-600 hover:bg-purple-700'
            : 'bg-purple-500 hover:bg-purple-600',
        )}
      >
        Create Snippet
      </Button>
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
