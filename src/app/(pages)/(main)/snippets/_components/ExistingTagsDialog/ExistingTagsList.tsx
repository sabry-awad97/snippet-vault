import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useDeleteTag, useFetchTags, useUpdateTag } from '@/hooks/useTags';
import useTagsStore from '@/hooks/useTagsStore';
import { Tag } from '@/lib/schemas/tag';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useState } from 'react';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import TagUpdateFormDialog from '../TagFormDialog';

interface ExistingTagsListProps {
  isDarkMode: boolean;
}

const ExistingTagsList: React.FC<ExistingTagsListProps> = ({ isDarkMode }) => {
  const { data: existingTags = [], isLoading, error } = useFetchTags();
  const updateTagMutation = useUpdateTag();
  const deleteTagMutation = useDeleteTag();
  const { isTagEditFormDialogOpen, setIsTagEditFormDialogOpen } =
    useTagsStore();
  const [editingTag, setEditingTag] = useState<Tag | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.3 }}
    >
      <Label
        className={cn(
          'mb-2 block font-semibold',
          isDarkMode ? 'text-purple-300' : 'text-purple-700',
        )}
      >
        Existing Tags
      </Label>
      <ScrollArea
        className={cn(
          'h-[200px] w-full rounded-md border p-4',
          isDarkMode ? 'border-purple-700' : 'border-purple-200',
        )}
      >
        {isLoading ? (
          <TagListSkeleton isDarkMode={isDarkMode} />
        ) : (
          <AnimatePresence>
            {existingTags.map(tag => (
              <motion.div
                key={tag.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  'mb-2 flex items-center justify-between rounded-md border p-2',
                  isDarkMode ? 'border-purple-700' : 'border-purple-200',
                )}
              >
                <div className="flex items-center">
                  <div
                    className="mr-2 h-4 w-4 rounded-full"
                    style={{ backgroundColor: tag.color }}
                  />
                  <span className={isDarkMode ? 'text-white' : 'text-gray-800'}>
                    {tag.name}
                  </span>
                </div>
                <div className="flex space-x-1">
                  <Button
                    onClick={() => {
                      setEditingTag(tag);
                      setIsTagEditFormDialogOpen(true);
                    }}
                    size="sm"
                    variant="outline"
                  >
                    <FiEdit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => deleteTagMutation.mutateAsync(tag.id)}
                    size="sm"
                    variant="outline"
                    className="text-red-500 hover:text-red-700"
                  >
                    <FiTrash2 className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
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
        onSubmit={value => {
          setEditingTag(null);
          updateTagMutation.mutateAsync(value);
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
            'mb-2 flex items-center justify-between rounded-md border p-2',
            isDarkMode ? 'border-purple-700' : 'border-purple-200',
            'animate-pulse',
          )}
        >
          <div className="flex items-center">
            <div className="mr-2 h-4 w-4 rounded-full bg-gray-300 dark:bg-gray-600" />
            <div className="h-4 w-24 rounded bg-gray-300 dark:bg-gray-600" />
          </div>
          <div className="flex space-x-1">
            <div className="h-8 w-8 rounded bg-gray-300 dark:bg-gray-600" />
            <div className="h-8 w-8 rounded bg-gray-300 dark:bg-gray-600" />
          </div>
        </div>
      ))}
    </>
  );
};

export default ExistingTagsList;
