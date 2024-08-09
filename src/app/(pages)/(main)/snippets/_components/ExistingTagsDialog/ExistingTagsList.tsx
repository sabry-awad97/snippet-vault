import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Slider } from '@/components/ui/slider';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useDeleteTag, useFetchTags, useUpdateTag } from '@/hooks/useTags';
import { Tag } from '@/lib/schemas/tag';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion, Variants } from 'framer-motion';
import {
  Edit2,
  Grid,
  List,
  Moon,
  Sparkles,
  Star,
  Sun,
  Tag as TagIcon,
  Trash2,
  Zap,
} from 'lucide-react';
import React from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import useCurrentTheme from '@/hooks/useCurrentTheme';
import { toast } from 'sonner';
import TagUpdateFormDialog from '../TagFormDialog';

interface TagsState {
  favoriteTagIds: string[];
  tagSize: number;
  tagView: 'list' | 'grid';
  highlightedTag: string | null;
  isTagEditFormDialogOpen: boolean;
  editingTag: Tag | null;
  toggleFavorite: (tagId: string) => void;
  setTagSize: (size: number) => void;
  setTagView: (view: 'list' | 'grid') => void;
  setHighlightedTag: (tagId: string | null) => void;
  setIsTagEditFormDialogOpen: (isOpen: boolean) => void;
  setEditingTag: (tag: Tag | null) => void;
}

const useTagsStore = create<TagsState>()(
  persist(
    set => ({
      favoriteTagIds: [],
      tagSize: 100,
      tagView: 'list',
      highlightedTag: null,
      isTagEditFormDialogOpen: false,
      editingTag: null,
      toggleFavorite: tagId =>
        set(state => {
          const newFavorites = new Set(state.favoriteTagIds);
          if (newFavorites.has(tagId)) {
            newFavorites.delete(tagId);
          } else {
            newFavorites.add(tagId);
          }
          return { favoriteTagIds: Array.from(newFavorites) };
        }),
      setTagSize: size => set({ tagSize: size }),
      setTagView: view => set({ tagView: view }),
      setHighlightedTag: tagId => set({ highlightedTag: tagId }),
      setIsTagEditFormDialogOpen: isOpen =>
        set({ isTagEditFormDialogOpen: isOpen }),
      setEditingTag: tag => set({ editingTag: tag }),
    }),
    {
      name: 'tags-storage',
      getStorage: () => localStorage,
    },
  ),
);

interface ExistingTagsListProps {
  searchTerm: string;
  sortBy: 'name' | 'color' | 'recent';
}

const ExistingTagsList: React.FC<ExistingTagsListProps> = ({
  searchTerm,
  sortBy,
}) => {
  const { theme, setTheme } = useCurrentTheme();
  const { data: existingTags = [], isLoading, error } = useFetchTags();
  const updateTagMutation = useUpdateTag();
  const deleteTagMutation = useDeleteTag();
  const {
    favoriteTagIds,
    tagSize,
    tagView,
    highlightedTag,
    isTagEditFormDialogOpen,
    editingTag,
    toggleFavorite,
    setTagSize,
    setTagView,
    setHighlightedTag,
    setIsTagEditFormDialogOpen,
    setEditingTag,
  } = useTagsStore();

  const isDarkMode = theme === 'dark';

  const toggleDarkMode = () => {
    setTheme(isDarkMode ? 'light' : 'dark');
  };

  const filtered = existingTags.filter(tag =>
    tag.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const sortedTags = filtered.sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'color') return (a.color || '').localeCompare(b.color || '');
    if (sortBy === 'recent')
      return b.createdAt.getTime() - a.createdAt.getTime();
    return 0;
  });

  const handleDeleteTag = async (tagId: string) => {
    try {
      await deleteTagMutation.mutateAsync(tagId);
      toast.success('Tag Deleted', {
        description: 'Your Tag has been successfully deleted.',
        icon: <TagIcon className="h-5 w-5 text-red-500" />,
      });
    } catch (error) {
      console.error('Delete Tag Error:', error);
      toast.error('Error', {
        description: 'Failed to delete Tag.',
      });
    }
  };

  const listVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  const generateTagBackground = (color: string) => {
    return `radial-gradient(circle, ${color}22 0%, ${color}11 100%)`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.3 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <h3
          className={cn(
            'text-2xl font-bold',
            isDarkMode ? 'text-purple-300' : 'text-purple-700',
          )}
        >
          Tag Galaxy
        </h3>
        <div className="flex items-center space-x-4">
          <Button
            onClick={() => setTagView(tagView === 'list' ? 'grid' : 'list')}
            size="sm"
            variant="outline"
            className={cn(
              'transition-colors duration-200 hover:bg-purple-100 dark:hover:bg-purple-700',
            )}
          >
            {tagView === 'list' ? (
              <Grid className="h-4 w-4" />
            ) : (
              <List className="h-4 w-4" />
            )}
          </Button>
          <Slider
            value={[tagSize]}
            onValueChange={([value]) => setTagSize(value)}
            max={150}
            min={50}
            step={10}
            className="w-32"
          />
          <Button
            onClick={toggleDarkMode}
            size="sm"
            variant="outline"
            className={cn(
              'bg-purple-100 text-purple-800 transition-colors duration-200 dark:bg-purple-700 dark:text-yellow-300',
            )}
          >
            {isDarkMode ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
      <ScrollArea className="h-[400px] w-full rounded-md border">
        {isLoading ? (
          <TagListSkeleton />
        ) : (
          <AnimatePresence>
            <motion.div
              variants={listVariants}
              initial="hidden"
              animate="show"
              className={cn(
                'p-4',
                tagView === 'grid'
                  ? 'grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4'
                  : '',
              )}
            >
              {sortedTags.map(tag => (
                <motion.div
                  key={tag.id}
                  variants={itemVariants}
                  layout
                  style={{
                    height: tagView === 'list' ? `${tagSize}px` : 'auto',
                    background: generateTagBackground(tag.color || ''),
                  }}
                  className={cn(
                    'mb-2 rounded-md border p-3',
                    isDarkMode ? 'border-purple-700' : 'border-purple-200',
                    'transition-all duration-300 hover:scale-105 hover:shadow-lg',
                    highlightedTag === tag.id ? 'ring-2 ring-purple-500' : '',
                    tagView === 'list'
                      ? 'flex items-center justify-between'
                      : 'flex flex-col items-center space-y-2',
                  )}
                  onMouseEnter={() => setHighlightedTag(tag.id)}
                  onMouseLeave={() => setHighlightedTag(null)}
                >
                  <div
                    className={cn(
                      'flex items-center space-x-3',
                      tagView === 'grid' ? 'flex-col space-x-0 space-y-2' : '',
                    )}
                  >
                    <motion.div
                      className="h-10 w-10 rounded-full shadow-inner"
                      style={{ backgroundColor: tag.color }}
                      whileHover={{ scale: 1.2, rotate: 360 }}
                      transition={{ duration: 0.3 }}
                    />
                    <span
                      className={cn(
                        'font-medium text-gray-800 dark:text-white',
                        tagView === 'grid' ? 'text-center' : '',
                      )}
                    >
                      {tag.name}
                    </span>
                  </div>
                  <div
                    className={cn(
                      'flex space-x-2',
                      tagView === 'grid' ? 'mt-2' : '',
                    )}
                  >
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            onClick={() => toggleFavorite(tag.id)}
                            size="sm"
                            variant="outline"
                            className={cn(
                              'transition-colors duration-200',
                              favoriteTagIds.includes(tag.id)
                                ? 'bg-yellow-500 text-white'
                                : isDarkMode
                                  ? 'hover:bg-yellow-700'
                                  : 'hover:bg-yellow-100',
                            )}
                          >
                            <Star className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            {favoriteTagIds.includes(tag.id)
                              ? 'Remove from Favorites'
                              : 'Add to Favorites'}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            onClick={() => {
                              setEditingTag(tag);
                              setIsTagEditFormDialogOpen(true);
                            }}
                            size="sm"
                            variant="outline"
                            className={cn(
                              'transition-colors duration-200 hover:bg-purple-100 dark:hover:bg-purple-700',
                            )}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Edit Tag</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            onClick={() => handleDeleteTag(tag.id)}
                            size="sm"
                            variant="outline"
                            className={cn(
                              'text-destructive transition-colors duration-200 hover:bg-red-100 dark:hover:bg-red-900',
                            )}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Delete Tag</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  {highlightedTag === tag.id && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                      className="absolute -right-2 -top-2"
                    >
                      <Sparkles className="h-6 w-6 text-yellow-400" />
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </ScrollArea>

      <TagUpdateFormDialog
        isOpen={isTagEditFormDialogOpen}
        initialTag={editingTag}
        onClose={() => {
          setEditingTag(null);
          setIsTagEditFormDialogOpen(false);
        }}
        onSubmit={async value => {
          try {
            await updateTagMutation.mutateAsync(value);
            setEditingTag(null);
            toast.success('Tag Updated', {
              description: 'Your Tag has been successfully updated.',
              icon: <Zap className="h-5 w-5 text-green-500" />,
            });
          } catch (error) {
            console.error('Update Tag Error:', error);
            toast.error('Error', {
              description: 'Failed to update Tag.',
            });
          }
        }}
        isDarkMode={isDarkMode}
      />
    </motion.div>
  );
};

const TagListSkeleton: React.FC = () => {
  return (
    <>
      {[...Array(5)].map((_, index) => (
        <div
          key={index}
          className={cn(
            'mx-2 mb-2 flex animate-pulse items-center justify-between rounded-md border border-purple-200 p-3 dark:border-purple-700',
          )}
        >
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-muted" />
            <div className="h-6 w-32 rounded bg-muted" />
          </div>
          <div className="flex space-x-2">
            <div className="h-8 w-8 rounded bg-muted" />
            <div className="h-8 w-8 rounded bg-muted" />
            <div className="h-8 w-8 rounded bg-muted" />
          </div>
        </div>
      ))}
    </>
  );
};

export default ExistingTagsList;
