import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import useTags from '@/hooks/useTags';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import React from 'react';
import ExistingTagsList from './ExistingTagsList';

interface TagDialogProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
}

const TagListDialog: React.FC<TagDialogProps> = ({
  isOpen,
  onClose,
  isDarkMode,
}) => {
  const { tags: existingTags } = useTags();

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent
          className={cn(
            'rounded-lg p-0 shadow-lg sm:max-w-[500px]',
            isDarkMode
              ? 'bg-gradient-to-br from-gray-800 to-gray-900'
              : 'bg-gradient-to-br from-purple-50 to-indigo-50',
          )}
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <DialogHeader className="p-6 pb-0">
              <DialogTitle
                className={cn(
                  'text-2xl font-bold',
                  isDarkMode ? 'text-purple-300' : 'text-purple-700',
                )}
              >
                Manage Tags
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-6 p-6">
              <ExistingTagsList
                existingTags={existingTags}
                isDarkMode={isDarkMode}
              />
            </div>
            <DialogFooter className="p-6 pt-0">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full"
              >
                <Button
                  onClick={onClose}
                  className={cn(
                    'w-full rounded-md py-2 font-semibold text-white shadow-md transition-all duration-200 focus:ring-2 focus:ring-offset-2',
                    isDarkMode
                      ? 'bg-purple-700 hover:bg-purple-600 focus:ring-purple-400'
                      : 'bg-purple-600 hover:bg-purple-700 focus:ring-purple-500',
                  )}
                >
                  Close
                </Button>
              </motion.div>
            </DialogFooter>
          </motion.div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TagListDialog;
