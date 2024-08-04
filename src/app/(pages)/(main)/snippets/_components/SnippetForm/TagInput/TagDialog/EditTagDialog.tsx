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
import { Tag } from '@/lib/schemas/tag';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { HexColorPicker } from 'react-colorful';

interface EditTagDialogProps {
  tag: Tag | null;
  onClose: () => void;
  onUpdate: (updatedTag: Tag) => void;
  isDarkMode: boolean;
}

const EditTagDialog: React.FC<EditTagDialogProps> = ({
  tag,
  onClose,
  onUpdate,
  isDarkMode,
}) => {
  const [editedTag, setEditedTag] = useState<Tag | null>(tag);

  useEffect(() => {
    setEditedTag(tag);
  }, [tag]);

  if (!editedTag) return null;

  const handleUpdate = () => {
    if (editedTag.name.trim()) {
      onUpdate(editedTag);
    }
  };

  return (
    <Dialog open={!!tag} onOpenChange={onClose}>
      <DialogContent
        className={cn(
          'rounded-lg p-0 shadow-lg sm:max-w-[400px]',
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
              Edit Tag
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 p-6">
            <div>
              <Label
                htmlFor="editTagName"
                className={cn(
                  'mb-2 block font-semibold',
                  isDarkMode ? 'text-purple-300' : 'text-purple-700',
                )}
              >
                Tag Name
              </Label>
              <Input
                id="editTagName"
                value={editedTag.name}
                onChange={e =>
                  setEditedTag({ ...editedTag, name: e.target.value })
                }
                className={cn(
                  'w-full rounded-md border-2 px-4 py-2 transition-all duration-200',
                  isDarkMode
                    ? 'border-purple-700 bg-gray-800 text-white hover:border-purple-500 focus:border-purple-400 focus:ring-purple-400'
                    : 'border-purple-200 bg-white hover:border-purple-400 focus:border-purple-500 focus:ring-purple-300',
                  'focus:outline-none focus:ring-2',
                )}
              />
            </div>
            <div>
              <Label
                className={cn(
                  'mb-2 block font-semibold',
                  isDarkMode ? 'text-purple-300' : 'text-purple-700',
                )}
              >
                Tag Color
              </Label>
              <HexColorPicker
                color={editedTag.color}
                onChange={color => setEditedTag({ ...editedTag, color })}
                className="w-full"
              />
            </div>
          </div>
          <DialogFooter className="p-6 pt-0">
            <div className="flex w-full space-x-2">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full"
              >
                <Button
                  onClick={handleUpdate}
                  className={cn(
                    'w-full rounded-md py-2 font-semibold text-white shadow-md transition-all duration-200 focus:ring-2 focus:ring-offset-2',
                    isDarkMode
                      ? 'bg-purple-700 hover:bg-purple-600 focus:ring-purple-400'
                      : 'bg-purple-600 hover:bg-purple-700 focus:ring-purple-500',
                  )}
                >
                  Update
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full"
              >
                <Button
                  onClick={onClose}
                  variant="outline"
                  className={cn(
                    'w-full rounded-md py-2 font-semibold shadow-md transition-all duration-200 focus:ring-2 focus:ring-offset-2',
                    isDarkMode
                      ? 'border-purple-700 text-purple-300 hover:bg-purple-800 focus:ring-purple-400'
                      : 'border-purple-300 text-purple-700 hover:bg-purple-100 focus:ring-purple-500',
                  )}
                >
                  Cancel
                </Button>
              </motion.div>
            </div>
          </DialogFooter>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default EditTagDialog;
