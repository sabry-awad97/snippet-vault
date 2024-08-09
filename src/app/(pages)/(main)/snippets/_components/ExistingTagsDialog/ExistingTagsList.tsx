import { useDeleteTag, useFetchTags, useUpdateTag } from '@/hooks/useTags';
import useTagsStore from '@/hooks/useTagsStore';
import { Tag } from '@/lib/schemas/tag';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion, Variants } from 'framer-motion';
import { Edit2, Star, Tag as TagIcon, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Slider } from '@/components/ui/slider';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { toast } from 'sonner';
import TagUpdateFormDialog from '../TagFormDialog';

interface ExistingTagsListProps {
  isDarkMode: boolean;
  searchTerm: string;
  sortBy: 'name' | 'color' | 'recent';
}

const ExistingTagsList: React.FC<ExistingTagsListProps> = ({
  isDarkMode,
  searchTerm,
  sortBy,
}) => {
  const { data: existingTags = [], isLoading, error } = useFetchTags();
  const updateTagMutation = useUpdateTag();
  const deleteTagMutation = useDeleteTag();
  const { isTagEditFormDialogOpen, setIsTagEditFormDialogOpen } =
    useTagsStore();
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [favoriteTagIds, setFavoriteTagIds] = useState<Set<string>>(new Set());
  const [tagSize, setTagSize] = useState<number>(100);

  useEffect(() => {
    const storedFavorites = localStorage.getItem('favoriteTags');
    if (storedFavorites) {
      setFavoriteTagIds(new Set(JSON.parse(storedFavorites)));
    }
  }, []);

  const toggleFavorite = (tagId: string) => {
    setFavoriteTagIds(prevFavorites => {
      const newFavorites = new Set(prevFavorites);
      if (newFavorites.has(tagId)) {
        newFavorites.delete(tagId);
      } else {
        newFavorites.add(tagId);
      }
      localStorage.setItem('favoriteTags', JSON.stringify([...newFavorites]));
      return newFavorites;
    });
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
            'text-lg font-semibold',
            isDarkMode ? 'text-purple-300' : 'text-purple-700',
          )}
        >
          Tag Size
        </h3>
        <Slider
          value={[tagSize]}
          onValueChange={([value]) => setTagSize(value)}
          max={150}
          min={50}
          step={10}
          className="w-1/2"
        />
      </div>
      <ScrollArea className="h-[400px] w-full rounded-md border">
        {isLoading ? (
          <TagListSkeleton isDarkMode={isDarkMode} />
        ) : (
          <AnimatePresence>
            <motion.div variants={listVariants} initial="hidden" animate="show">
              {sortedTags.map(tag => (
                <motion.div
                  key={tag.id}
                  variants={itemVariants}
                  layout
                  style={{ height: `${tagSize}px` }}
                  className={cn(
                    'mx-2 mb-2 flex items-center justify-between rounded-md border p-3',
                    isDarkMode ? 'border-purple-700' : 'border-purple-200',
                    'transition-all duration-300 hover:scale-105 hover:shadow-lg',
                    'bg-gradient-to-r',
                    isDarkMode
                      ? 'from-purple-900 to-indigo-900'
                      : 'from-purple-50 to-indigo-50',
                  )}
                >
                  <div className="flex items-center space-x-3">
                    <motion.div
                      className="h-5 w-5 rounded-full shadow-inner"
                      style={{ backgroundColor: tag.color }}
                      whileHover={{ scale: 1.2, rotate: 360 }}
                      transition={{ duration: 0.3 }}
                    />
                    <span
                      className={cn(
                        'text-sm font-medium',
                        isDarkMode ? 'text-white' : 'text-gray-800',
                      )}
                    >
                      {tag.name}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            onClick={() => toggleFavorite(tag.id)}
                            size="sm"
                            variant="outline"
                            className={cn(
                              'transition-colors duration-200',
                              favoriteTagIds.has(tag.id)
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
                            {favoriteTagIds.has(tag.id)
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
                              'transition-colors duration-200',
                              isDarkMode
                                ? 'hover:bg-purple-700'
                                : 'hover:bg-purple-100',
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
                              'text-destructive transition-colors duration-200',
                              isDarkMode
                                ? 'hover:bg-red-900'
                                : 'hover:bg-red-100',
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
              icon: <TagIcon className="h-5 w-5 text-green-500" />,
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

const TagListSkeleton: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  return (
    <>
      {[...Array(5)].map((_, index) => (
        <div
          key={index}
          className={cn(
            'mx-2 mb-2 flex items-center justify-between rounded-md border p-3',
            isDarkMode ? 'border-purple-700' : 'border-purple-200',
            'animate-pulse',
          )}
        >
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 rounded-full bg-muted" />
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
