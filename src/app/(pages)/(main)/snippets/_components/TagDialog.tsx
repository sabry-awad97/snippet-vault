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
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tag, TagSchema } from '@/lib/schemas/tag';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import { FiCheck, FiEdit2, FiPlus, FiTrash2, FiX } from 'react-icons/fi';

interface TagDialogProps {
  isOpen: boolean;
  onClose: () => void;
  existingTags: Tag[];
  onCreateTag: (tag: Tag) => void;
  onUpdateTag: (tag: Tag) => void;
  onDeleteTag: (tagId: string) => void;
  isDarkMode: boolean;
}

const TagDialog: React.FC<TagDialogProps> = ({
  isOpen,
  onClose,
  existingTags,
  onCreateTag,
  onUpdateTag,
  onDeleteTag,
  isDarkMode,
}) => {
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState('#f7df1e');
  const [editingTag, setEditingTag] = useState<Tag | null>(null);

  const handleCreateTag = () => {
    if (newTagName.trim()) {
      const newTag = TagSchema.parse({
        id: Date.now().toString(),
        name: newTagName.trim(),
        snippetIds: [],
        color: newTagColor,
      });
      onCreateTag(newTag);
      setNewTagName('');
      setNewTagColor('#f7df1e');
    }
  };

  const handleUpdateTag = () => {
    if (editingTag && editingTag.name.trim()) {
      onUpdateTag(editingTag);
      setEditingTag(null);
    }
  };

  const handleDeleteTag = (tagId: string) => {
    onDeleteTag(tagId);
    if (editingTag && editingTag.id === tagId) {
      setEditingTag(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={cn(
          'rounded-lg p-8 shadow-lg sm:max-w-[425px]',
          isDarkMode
            ? 'bg-gradient-to-br from-gray-800 to-gray-900'
            : 'bg-gradient-to-br from-purple-50 to-indigo-50',
        )}
      >
        <DialogHeader>
          <DialogTitle
            className={cn(
              'font-semibold',
              isDarkMode ? 'text-purple-300' : 'text-purple-700',
            )}
          >
            Manage Tags
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label
              htmlFor="newTagName"
              className={cn(
                'text-right font-semibold',
                isDarkMode ? 'text-purple-300' : 'text-purple-700',
              )}
            >
              New Tag
            </Label>
            <Input
              id="newTagName"
              value={newTagName}
              onChange={e => setNewTagName(e.target.value)}
              className={cn(
                'col-span-3 rounded-md border-2 px-4 py-2 transition-all duration-200',
                isDarkMode
                  ? 'border-purple-700 bg-gray-800 text-white hover:border-purple-500 focus:border-purple-400 focus:ring-purple-400'
                  : 'border-purple-200 bg-white hover:border-purple-400 focus:border-purple-500 focus:ring-purple-300',
                'focus:outline-none focus:ring-2',
              )}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label
              className={cn(
                'text-right font-semibold',
                isDarkMode ? 'text-purple-300' : 'text-purple-700',
              )}
            >
              Color
            </Label>
            <div className="col-span-3">
              <HexColorPicker color={newTagColor} onChange={setNewTagColor} />
            </div>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={handleCreateTag}
              className={cn(
                'w-full rounded-md py-2 font-semibold text-white shadow-md transition-all duration-200 focus:ring-2 focus:ring-offset-2',
                isDarkMode
                  ? 'bg-purple-700 hover:bg-purple-600 focus:ring-purple-400'
                  : 'bg-purple-600 hover:bg-purple-700 focus:ring-purple-500',
              )}
            >
              <FiPlus className="mr-2 h-4 w-4" /> Create Tag
            </Button>
          </motion.div>
        </div>
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
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="flex items-center justify-between py-2"
              >
                {editingTag && editingTag.id === tag.id ? (
                  <>
                    <Input
                      value={editingTag.name}
                      onChange={e =>
                        setEditingTag({ ...editingTag, name: e.target.value })
                      }
                      className={cn(
                        'mr-2 rounded-md border-2 px-4 py-2 transition-all duration-200',
                        isDarkMode
                          ? 'border-purple-700 bg-gray-800 text-white hover:border-purple-500 focus:border-purple-400 focus:ring-purple-400'
                          : 'border-purple-200 bg-white hover:border-purple-400 focus:border-purple-500 focus:ring-purple-300',
                        'focus:outline-none focus:ring-2',
                      )}
                    />
                    <HexColorPicker
                      color={editingTag.color}
                      onChange={color =>
                        setEditingTag({ ...editingTag, color })
                      }
                    />
                    <Button
                      onClick={handleUpdateTag}
                      size="sm"
                      variant="outline"
                    >
                      <FiCheck className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => setEditingTag(null)}
                      size="sm"
                      variant="outline"
                    >
                      <FiX className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="flex items-center">
                      <div
                        className="mr-2 h-3 w-3 rounded-full"
                        style={{ backgroundColor: tag.color }}
                      />
                      <span
                        className={isDarkMode ? 'text-white' : 'text-gray-800'}
                      >
                        {tag.name}
                      </span>
                    </div>
                    <div>
                      <Button
                        onClick={() => setEditingTag(tag)}
                        size="sm"
                        variant="outline"
                        className="mr-2"
                      >
                        <FiEdit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => handleDeleteTag(tag.id)}
                        size="sm"
                        variant="outline"
                        className="text-red-500 hover:text-red-700"
                      >
                        <FiTrash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </ScrollArea>
        <DialogFooter>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
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
      </DialogContent>
    </Dialog>
  );
};

export default TagDialog;
