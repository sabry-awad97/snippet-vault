import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Moon,
  Plus,
  Search,
  Sparkles,
  Sun,
  Tag as TagIcon,
} from 'lucide-react';
import React, { useState } from 'react';
import ExistingTagsList from './ExistingTagsList';

interface TagDialogProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  onCreateTag: () => void;
  onToggleDarkMode: () => void;
}

const TagListDialog: React.FC<TagDialogProps> = ({
  isOpen,
  onClose,
  isDarkMode,
  onCreateTag,
  onToggleDarkMode,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'color' | 'recent'>('name');

  const handleCreateTag = () => {
    onCreateTag();
  };

  const backgroundVariants = {
    hidden: {
      backgroundPosition: '0% 50%',
    },
    visible: {
      backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
      transition: {
        duration: 20,
        ease: 'linear',
        repeat: Infinity,
      },
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent
            className={cn(
              'overflow-hidden rounded-lg p-0 shadow-lg sm:max-w-[700px]',
              isDarkMode
                ? 'bg-gradient-to-br from-gray-900 via-purple-950 to-indigo-950'
                : 'bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50',
            )}
          >
            <motion.div
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={backgroundVariants}
              className="absolute h-full w-full"
              style={{
                background: isDarkMode
                  ? 'linear-gradient(45deg, #1a1a2e, #16213e, #0f3460)'
                  : 'linear-gradient(45deg, #e0e7ff, #c7d2fe, #a5b4fc)',
                backgroundSize: '400% 400%',
              }}
            />
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="relative space-y-6 p-8"
            >
              <DialogHeader className="flex items-center justify-between">
                <DialogTitle
                  className={cn(
                    'flex items-center space-x-3 text-4xl font-bold',
                    isDarkMode ? 'text-purple-300' : 'text-purple-700',
                  )}
                >
                  <TagIcon className="h-10 w-10" />
                  <span>Manage Tags</span>
                </DialogTitle>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onToggleDarkMode}
                  className={cn(
                    'rounded-full p-2',
                    isDarkMode
                      ? 'bg-purple-800 text-yellow-300'
                      : 'bg-purple-200 text-purple-800',
                  )}
                >
                  {isDarkMode ? (
                    <Sun className="h-6 w-6" />
                  ) : (
                    <Moon className="h-6 w-6" />
                  )}
                </motion.button>
              </DialogHeader>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Button
                  onClick={handleCreateTag}
                  className={cn(
                    'w-full rounded-md py-5 font-semibold text-white shadow-md transition-all duration-300',
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
                    <Plus className="h-6 w-6" />
                    <span className="text-lg">Create New Tag</span>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                    >
                      <Sparkles className="h-6 w-6" />
                    </motion.div>
                  </motion.div>
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-x-4 sm:space-y-0"
              >
                <div className="flex-grow">
                  <Label htmlFor="search-tags" className="sr-only">
                    Search Tags
                  </Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-muted-foreground" />
                    <Input
                      id="search-tags"
                      placeholder="Search tags..."
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      className={cn(
                        'rounded-full py-3 pl-10 pr-4 text-lg transition-all duration-300',
                        isDarkMode
                          ? 'bg-gray-800 text-purple-300 placeholder-purple-400 focus:ring-2 focus:ring-purple-500'
                          : 'bg-white text-purple-700 placeholder-purple-400 focus:ring-2 focus:ring-purple-400',
                      )}
                    />
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Select
                    value={sortBy}
                    onValueChange={(value: 'name' | 'color' | 'recent') =>
                      setSortBy(value)
                    }
                  >
                    <SelectTrigger
                      id="sort-tags"
                      className={cn(
                        'w-[140px] rounded-full transition-all duration-300',
                        isDarkMode
                          ? 'bg-gray-800 text-purple-300 focus:ring-2 focus:ring-purple-500'
                          : 'bg-white text-purple-700 focus:ring-2 focus:ring-purple-400',
                      )}
                    >
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">Sort by Name</SelectItem>
                      <SelectItem value="color">Sort by Color</SelectItem>
                      <SelectItem value="recent">Sort by Recent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <ExistingTagsList
                  isDarkMode={isDarkMode}
                  searchTerm={searchTerm}
                  sortBy={sortBy}
                />
              </motion.div>

              <DialogFooter>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full"
                >
                  <Button
                    onClick={onClose}
                    className={cn(
                      'w-full rounded-full py-4 font-semibold text-white shadow-md transition-all duration-200 focus:ring-2 focus:ring-offset-2',
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
      )}
    </AnimatePresence>
  );
};

export default TagListDialog;
