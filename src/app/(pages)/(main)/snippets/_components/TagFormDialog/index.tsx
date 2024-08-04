import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tag, TagSchema } from '@/lib/schemas/tag';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import React from 'react';
import TagForm from './TagForm';

interface TagFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (tag: Tag) => void;
  initialTag?: Tag | null;
  isDarkMode: boolean;
}

const TagFormDialog: React.FC<TagFormDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialTag,
  isDarkMode,
}) => {
  const isEditMode = !!initialTag;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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
              {isEditMode ? 'Edit Tag' : 'Create Tag'}
            </DialogTitle>
          </DialogHeader>
          <TagForm
            onSubmit={values => {
              onSubmit(
                TagSchema.parse({
                  id: initialTag?.id || Date.now().toString(),
                  name: values.name,
                  color: values.color,
                  snippetIds: initialTag?.snippetIds || [],
                }),
              );
              onClose();
            }}
            isDarkMode={false}
            initialTag={initialTag}
          />
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default TagFormDialog;
