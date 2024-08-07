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
import { ChevronRight, PlusCircle, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import TagListDialog from './_components/ExistingTagsDialog';
import SnippetCard from './_components/SnippetCard';
import SnippetDialog from './_components/SnippetDialog';
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
  const [currentTip, setCurrentTip] = useState(0);

  const tips = [
    'Organize your thoughts with snippets!',
    'Boost productivity with quick access to your code.',
    'Share knowledge effortlessly with your team.',
  ];

  useEffect(() => {
    const tagTimer = setTimeout(() => setShowTagHint(true), 2000);
    const tipInterval = setInterval(() => {
      setCurrentTip(prev => (prev + 1) % tips.length);
    }, 5000);

    return () => {
      clearTimeout(tagTimer);
      clearInterval(tipInterval);
    };
  }, [tips.length]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={cn(
        'relative flex flex-1 flex-col items-center justify-center rounded-lg border-2 border-dashed border-purple-200 bg-gradient-to-br from-white to-purple-50 p-8 dark:border-purple-700 dark:from-gray-800 dark:to-purple-900',
      )}
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      >
        <PlusCircle
          className={cn('mb-6 h-20 w-20 text-purple-500 dark:text-purple-400')}
        />
      </motion.div>

      <motion.h3
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className={cn('mb-3 text-2xl font-bold text-gray-800 dark:text-white')}
      >
        Your Snippet Canvas Awaits
      </motion.h3>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <p className={cn('mb-6 text-center text-gray-600 dark:text-gray-400')}>
          {tips[currentTip]}
        </p>
      </motion.div>

      <Button
        onClick={onCreateSnippet}
        className={cn(
          'group relative overflow-hidden bg-purple-500 px-6 py-3 text-lg font-semibold text-white transition-all duration-300 hover:bg-purple-600 hover:shadow-lg dark:bg-purple-600 dark:hover:bg-purple-700',
        )}
      >
        <span className="relative z-10">Create Your First Snippet</span>
        <motion.div
          className="absolute inset-0 z-0 bg-gradient-to-r from-purple-400 to-pink-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          initial={false}
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
        />
      </Button>

      <AnimatePresence>
        {showTagHint && tags.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className={cn(
              'absolute bottom-4 right-4 max-w-xs overflow-hidden rounded-lg bg-purple-100 shadow-lg dark:bg-purple-900',
            )}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-purple-400/30 to-pink-500/30"
              animate={{ x: ['0%', '100%', '0%'] }}
              transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
            />
            <div className="relative p-4">
              <div className="flex items-center space-x-2">
                <Sparkles className="h-5 w-5 text-purple-500 dark:text-purple-400" />
                <p className="text-sm font-medium text-purple-700 dark:text-purple-300">
                  Unlock Your Snippet Potential!
                </p>
              </div>
              <p className="mt-2 text-xs text-purple-600 dark:text-purple-200">
                Elevate your workflow by creating tags to categorize and find
                snippets with ease.
              </p>
              <Button
                variant="link"
                size="sm"
                className="mt-2 p-0 text-xs font-semibold text-purple-700 transition-colors hover:text-purple-900 dark:text-purple-300 dark:hover:text-purple-100"
                onClick={() => {
                  console.log('Navigate to tag creation');
                }}
              >
                Create Tags
                <ChevronRight className="ml-1 h-3 w-3" />
              </Button>
            </div>
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
