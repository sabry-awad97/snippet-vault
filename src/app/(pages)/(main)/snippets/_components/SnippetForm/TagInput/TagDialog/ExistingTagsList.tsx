import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tag } from '@/lib/schemas/tag';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';

interface ExistingTagsListProps {
  existingTags: Tag[];
  onEditTag: (tag: Tag) => void;
  onDeleteTag: (tagId: string) => void;
  isDarkMode: boolean;
}

const ExistingTagsList: React.FC<ExistingTagsListProps> = ({
  existingTags,
  onEditTag,
  onDeleteTag,
  isDarkMode,
}) => {
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
                  onClick={() => onEditTag(tag)}
                  size="sm"
                  variant="outline"
                >
                  <FiEdit2 className="h-4 w-4" />
                </Button>
                <Button
                  onClick={() => onDeleteTag(tag.id)}
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
      </ScrollArea>
    </motion.div>
  );
};

export default ExistingTagsList;
