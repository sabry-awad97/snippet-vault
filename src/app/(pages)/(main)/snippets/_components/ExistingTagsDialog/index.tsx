import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Plus, Sparkles } from 'lucide-react'; // Import the Sparkles icon
import React from 'react';
import ExistingTagsList from './ExistingTagsList';

interface TagDialogProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  onCreateTag: () => void;
}

const TagListDialog: React.FC<TagDialogProps> = ({
  isOpen,
  onClose,
  isDarkMode,
  onCreateTag,
}) => {
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

            <motion.div
              className="px-6 pt-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Button
                onClick={onCreateTag}
                className={cn(
                  'w-full rounded-md py-3 font-semibold text-white shadow-md transition-all duration-300',
                  isDarkMode
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700'
                    : 'bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600',
                )}
              >
                <motion.div
                  className="flex items-center justify-center space-x-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Plus className="h-5 w-5" />
                  <span>Create New Tag</span>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                  >
                    <Sparkles className="h-5 w-5" />
                  </motion.div>
                </motion.div>
              </Button>
            </motion.div>

            <div className="grid gap-6 p-6">
              <ExistingTagsList isDarkMode={isDarkMode} />
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
