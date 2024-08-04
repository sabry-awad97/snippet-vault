import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tag, TagSchema } from '@/lib/schemas/tag';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { useImmerReducer } from 'use-immer';
import ColorPicker from './ColorPicker';
import EditTagDialog from './EditTagDialog';
import ExistingTagsList from './ExistingTagsList';
import NewTagForm from './NewTagForm';

interface TagDialogProps {
  isOpen: boolean;
  onClose: () => void;
  existingTags: Tag[];
  onCreateTag: (tag: Tag) => void;
  onUpdateTag: (tag: Tag) => void;
  onDeleteTag: (tagId: string) => void;
  isDarkMode: boolean;
}

type State = {
  newTagName: string;
  newTagColor: string;
  editingTag: Tag | null;
};

type Action =
  | { type: 'SET_NEW_TAG_NAME'; payload: string }
  | { type: 'SET_NEW_TAG_COLOR'; payload: string }
  | { type: 'SET_EDITING_TAG'; payload: Tag | null }
  | { type: 'UPDATE_EDITING_TAG'; payload: Partial<Tag> }
  | { type: 'RESET_NEW_TAG' };

const initialState: State = {
  newTagName: '',
  newTagColor: '#f7df1e',
  editingTag: null,
};

const reducer = (draft: State, action: Action) => {
  switch (action.type) {
    case 'SET_NEW_TAG_NAME':
      draft.newTagName = action.payload;
      break;
    case 'SET_NEW_TAG_COLOR':
      draft.newTagColor = action.payload;
      break;
    case 'SET_EDITING_TAG':
      draft.editingTag = action.payload;
      break;
    case 'UPDATE_EDITING_TAG':
      if (draft.editingTag) {
        Object.assign(draft.editingTag, action.payload);
      }
      break;
    case 'RESET_NEW_TAG':
      draft.newTagName = '';
      draft.newTagColor = '#f7df1e';
      break;
  }
};

const TagDialog: React.FC<TagDialogProps> = ({
  isOpen,
  onClose,
  existingTags,
  onCreateTag,
  onUpdateTag,
  onDeleteTag,
  isDarkMode,
}) => {
  const [state, dispatch] = useImmerReducer(reducer, initialState);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);

  const handleCreateTag = () => {
    if (state.newTagName.trim()) {
      const newTag = TagSchema.parse({
        id: Date.now().toString(),
        name: state.newTagName.trim(),
        snippetIds: [],
        color: state.newTagColor,
      });
      onCreateTag(newTag);
      dispatch({ type: 'RESET_NEW_TAG' });
    }
  };

  const handleUpdateTag = (updatedTag: Tag) => {
    onUpdateTag(updatedTag);
    setEditingTag(null);
  };

  const handleDeleteTag = (tagId: string) => {
    onDeleteTag(tagId);
    setEditingTag(null);
  };

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
              <NewTagForm
                newTagName={state.newTagName}
                onNewTagNameChange={value =>
                  dispatch({ type: 'SET_NEW_TAG_NAME', payload: value })
                }
                onCreateTag={handleCreateTag}
                isDarkMode={isDarkMode}
              />
              <ColorPicker
                color={state.newTagColor}
                onChange={color =>
                  dispatch({ type: 'SET_NEW_TAG_COLOR', payload: color })
                }
                isDarkMode={isDarkMode}
              />
              <ExistingTagsList
                existingTags={existingTags}
                onEditTag={setEditingTag}
                onDeleteTag={handleDeleteTag}
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
      <EditTagDialog
        tag={editingTag}
        onClose={() => setEditingTag(null)}
        onUpdate={handleUpdateTag}
        isDarkMode={isDarkMode}
      />
    </>
  );
};

export default TagDialog;
