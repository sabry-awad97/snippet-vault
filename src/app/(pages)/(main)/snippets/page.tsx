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
import {
  ChevronRight,
  Code,
  PlusCircle,
  Share,
  Sparkles,
  Zap,
} from 'lucide-react';
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
    { icon: Code, text: 'Organize your thoughts with snippets!' },
    { icon: Zap, text: 'Boost productivity with quick access to your code.' },
    { icon: Share, text: 'Share knowledge effortlessly with your team.' },
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

  const MotionIcon = motion(tips[currentTip].icon);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.645, 0.045, 0.355, 1.0] }}
      className={cn(
        'relative flex flex-1 flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-purple-200 bg-gradient-to-br from-white to-purple-50 p-12 dark:border-purple-700 dark:from-gray-900 dark:to-purple-900',
      )}
    >
      {/* Animated background particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-2 w-2 rounded-full bg-purple-300 dark:bg-purple-600"
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
            x: ['0%', `${Math.random() * 100}%`],
            y: ['0%', `${Math.random() * 100}%`],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            delay: i * 0.4,
            ease: 'easeInOut',
          }}
        />
      ))}

      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        className="relative mb-8"
      >
        <PlusCircle
          className={cn('h-24 w-24 text-purple-500 dark:text-purple-400')}
        />
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{
            boxShadow: [
              '0 0 0 0px rgba(168, 85, 247, 0.4)',
              '0 0 0 20px rgba(168, 85, 247, 0)',
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.div>

      <motion.h3
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className={cn('mb-4 text-3xl font-bold text-gray-800 dark:text-white')}
      >
        Your Snippet Canvas Awaits
      </motion.h3>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="mb-8 flex items-center space-x-3 text-center"
      >
        <MotionIcon
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          className="h-6 w-6 text-purple-500 dark:text-purple-400"
        />
        <p className={cn('text-lg text-gray-600 dark:text-gray-300')}>
          {tips[currentTip].text}
        </p>
      </motion.div>

      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          onClick={onCreateSnippet}
          className={cn(
            'group relative overflow-hidden bg-purple-500 px-8 py-4 text-lg font-semibold text-white transition-all duration-300 hover:bg-purple-600 hover:shadow-lg dark:bg-purple-600 dark:hover:bg-purple-700',
          )}
        >
          <span className="relative z-10">Create Your First Snippet</span>
          <motion.div
            className="absolute inset-0 z-0 bg-gradient-to-r from-purple-400 to-pink-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            initial={false}
            animate={{ rotate: 360, scale: 1.5 }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
          />
        </Button>
      </motion.div>

      <AnimatePresence>
        {showTagHint && tags.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className={cn(
              'absolute bottom-6 right-6 max-w-xs overflow-hidden rounded-lg bg-white shadow-xl dark:bg-gray-800',
            )}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-pink-500/20"
              animate={{ x: ['0%', '100%', '0%'] }}
              transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
            />
            <div className="relative p-5">
              <div className="mb-3 flex items-center space-x-2">
                <Sparkles className="h-5 w-5 text-yellow-500" />
                <p className="text-sm font-semibold text-gray-800 dark:text-white">
                  Unlock Your Snippet Potential!
                </p>
              </div>
              <p className="mb-3 text-sm text-gray-600 dark:text-gray-300">
                Elevate your workflow by creating tags to categorize and find
                snippets with ease.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-between bg-purple-50 text-sm font-medium text-purple-700 transition-colors hover:bg-purple-100 dark:bg-purple-900/50 dark:text-purple-300 dark:hover:bg-purple-900"
                onClick={() => {
                  console.log('Navigate to tag creation');
                }}
              >
                Create Tags
                <ChevronRight className="ml-2 h-4 w-4" />
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
