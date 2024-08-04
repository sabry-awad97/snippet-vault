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
import React from 'react';
import { HexColorPicker } from 'react-colorful';
import { FiCheck, FiEdit2, FiPlus, FiTrash2, FiX } from 'react-icons/fi';
import { useImmerReducer } from 'use-immer';

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

  const handleUpdateTag = () => {
    if (state.editingTag && state.editingTag.name.trim()) {
      onUpdateTag(state.editingTag);
      dispatch({ type: 'SET_EDITING_TAG', payload: null });
    }
  };

  const handleDeleteTag = (tagId: string) => {
    onDeleteTag(tagId);
    if (state.editingTag && state.editingTag.id === tagId) {
      dispatch({ type: 'SET_EDITING_TAG', payload: null });
    }
  };

  return (
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
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
            >
              <Label
                htmlFor="newTagName"
                className={cn(
                  'mb-2 block font-semibold',
                  isDarkMode ? 'text-purple-300' : 'text-purple-700',
                )}
              >
                New Tag
              </Label>
              <div className="flex space-x-2">
                <Input
                  id="newTagName"
                  value={state.newTagName}
                  onChange={e =>
                    dispatch({
                      type: 'SET_NEW_TAG_NAME',
                      payload: e.target.value,
                    })
                  }
                  className={cn(
                    'flex-grow rounded-md border-2 px-4 py-2 transition-all duration-200',
                    isDarkMode
                      ? 'border-purple-700 bg-gray-800 text-white hover:border-purple-500 focus:border-purple-400 focus:ring-purple-400'
                      : 'border-purple-200 bg-white hover:border-purple-400 focus:border-purple-500 focus:ring-purple-300',
                    'focus:outline-none focus:ring-2',
                  )}
                />
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={handleCreateTag}
                    className={cn(
                      'rounded-md px-4 py-2 font-semibold text-white shadow-md transition-all duration-200 focus:ring-2 focus:ring-offset-2',
                      isDarkMode
                        ? 'bg-purple-700 hover:bg-purple-600 focus:ring-purple-400'
                        : 'bg-purple-600 hover:bg-purple-700 focus:ring-purple-500',
                    )}
                  >
                    <FiPlus className="mr-2 h-4 w-4" /> Add
                  </Button>
                </motion.div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              <Label
                className={cn(
                  'mb-2 block font-semibold',
                  isDarkMode ? 'text-purple-300' : 'text-purple-700',
                )}
              >
                Color
              </Label>
              <HexColorPicker
                color={state.newTagColor}
                onChange={color =>
                  dispatch({ type: 'SET_NEW_TAG_COLOR', payload: color })
                }
                className="w-full"
              />
            </motion.div>
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
                        'mb-2 overflow-hidden rounded-md border',
                        isDarkMode ? 'border-purple-700' : 'border-purple-200',
                      )}
                    >
                      {state.editingTag && state.editingTag.id === tag.id ? (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: 'auto' }}
                          exit={{ height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="p-2"
                        >
                          <Input
                            value={state.editingTag.name}
                            onChange={e =>
                              dispatch({
                                type: 'UPDATE_EDITING_TAG',
                                payload: { name: e.target.value },
                              })
                            }
                            className={cn(
                              'mb-2 w-full rounded-md border-2 px-2 py-1 transition-all duration-200',
                              isDarkMode
                                ? 'border-purple-700 bg-gray-800 text-white hover:border-purple-500 focus:border-purple-400 focus:ring-purple-400'
                                : 'border-purple-200 bg-white hover:border-purple-400 focus:border-purple-500 focus:ring-purple-300',
                              'focus:outline-none focus:ring-2',
                            )}
                          />
                          <HexColorPicker
                            color={state.editingTag.color}
                            onChange={color =>
                              dispatch({
                                type: 'UPDATE_EDITING_TAG',
                                payload: { color },
                              })
                            }
                            className="mb-2 w-full"
                          />
                          <div className="flex justify-end space-x-1">
                            <Button
                              onClick={handleUpdateTag}
                              size="sm"
                              variant="outline"
                            >
                              <FiCheck className="h-4 w-4" />
                            </Button>
                            <Button
                              onClick={() =>
                                dispatch({
                                  type: 'SET_EDITING_TAG',
                                  payload: null,
                                })
                              }
                              size="sm"
                              variant="outline"
                            >
                              <FiX className="h-4 w-4" />
                            </Button>
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: 'auto' }}
                          exit={{ height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="flex items-center justify-between p-2"
                        >
                          <div className="flex items-center">
                            <div
                              className="mr-2 h-4 w-4 rounded-full"
                              style={{ backgroundColor: tag.color }}
                            />
                            <span
                              className={
                                isDarkMode ? 'text-white' : 'text-gray-800'
                              }
                            >
                              {tag.name}
                            </span>
                          </div>
                          <div className="flex space-x-1">
                            <Button
                              onClick={() =>
                                dispatch({
                                  type: 'SET_EDITING_TAG',
                                  payload: tag,
                                })
                              }
                              size="sm"
                              variant="outline"
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
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </ScrollArea>
            </motion.div>
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
  );
};

export default TagDialog;
