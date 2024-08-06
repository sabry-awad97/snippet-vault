import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { FormField, FormItem } from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import useHotkeys from '@/hooks/useHotkeys';
import { useCreateTag, useFetchTags } from '@/hooks/useTags';
import useTagsStore from '@/hooks/useTagsStore';
import { Snippet } from '@/lib/schemas/snippet';
import { Tag } from '@/lib/schemas/tag';
import { cn } from '@/lib/utils';
import { Check, Edit2 } from 'lucide-react';
import React, { useCallback, useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { FiPlus, FiX } from 'react-icons/fi';
import { useImmerReducer } from 'use-immer';
import TagFormDialog from '../../TagFormDialog';

interface TagInputProps {
  isDarkMode: boolean;
}

interface ComboboxState {
  open: boolean;
  values: string[];
}

type ComboboxAction =
  | { type: 'SET_OPEN'; payload: boolean }
  | { type: 'TOGGLE_VALUE'; payload: string }
  | { type: 'SET_VALUES'; payload: string[] };

const comboboxReducer = (draft: ComboboxState, action: ComboboxAction) => {
  switch (action.type) {
    case 'SET_OPEN':
      draft.open = action.payload;
      break;
    case 'TOGGLE_VALUE':
      const index = draft.values.indexOf(action.payload);
      if (index > -1) {
        draft.values.splice(index, 1);
      } else {
        draft.values.push(action.payload);
      }
      break;
    case 'SET_VALUES':
      draft.values = action.payload;
      break;
    default:
      break;
  }
};

const TagInput: React.FC<TagInputProps> = ({ isDarkMode }) => {
  const [isTagFormDialogOpen, setIsTagFormDialogOpen] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const { control } = useFormContext<Snippet>();
  const { data: existingTags = [] } = useFetchTags();
  const createTagMutation = useCreateTag();

  const { setIsTagsDialogOpen } = useTagsStore();
  useHotkeys([['ctrl+e', () => setIsTagsDialogOpen(true)]]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'tags',
  });

  const [{ open, values: _selectedValues }, dispatch] = useImmerReducer(
    comboboxReducer,
    {
      open: false,
      values: fields.map(field => field.name),
    },
  );

  const handleSelectTag = useCallback(
    (selectedTag: Tag) => {
      const index = fields.findIndex(field => field.name === selectedTag.name);
      if (index === -1) {
        append(selectedTag);
        dispatch({ type: 'TOGGLE_VALUE', payload: selectedTag.name });
      }
    },
    [fields, append, dispatch],
  );

  const handleUnselectTag = useCallback(
    (unselectedTag: Tag) => {
      const index = fields.findIndex(
        field => field.name === unselectedTag.name,
      );
      if (index !== -1) {
        remove(index);
        dispatch({ type: 'TOGGLE_VALUE', payload: unselectedTag.name });
      }
    },
    [fields, remove, dispatch],
  );

  const handleAddNewTag = useCallback(() => {
    setIsTagFormDialogOpen(true);
  }, []);

  const handleCreateTag = useCallback(
    async (tag: Tag) => {
      const newTag = await createTagMutation.mutateAsync(tag);
      handleSelectTag(newTag);
      setIsTagFormDialogOpen(false);
      setNewTagName('');
    },
    [createTagMutation, handleSelectTag],
  );

  const renderTrigger = useCallback(
    () => (
      <button
        className={cn(
          'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all',
          isDarkMode
            ? 'bg-gray-700 text-white hover:bg-gray-600'
            : 'bg-purple-100 text-purple-800 hover:bg-purple-200',
        )}
      >
        <FiPlus className="h-4 w-4" />
        <span>Add Tags</span>
        <div
          className={cn(
            'flex h-5 w-5 items-center justify-center rounded-full text-xs',
            isDarkMode
              ? 'bg-purple-500 text-white'
              : 'bg-purple-200 text-purple-800',
          )}
        >
          {fields.length}
        </div>
      </button>
    ),
    [isDarkMode, fields.length],
  );

  return (
    <>
      <div
        className={cn(
          'flex items-start rounded-md border p-2 transition-colors focus-within:ring-2',
          {
            'border-purple-700 bg-gray-800 text-white focus-within:border-purple-400 focus-within:ring-purple-400 hover:border-purple-500':
              isDarkMode,
            'border-purple-200 bg-white focus-within:border-purple-500 focus-within:ring-purple-300 hover:border-purple-400':
              !isDarkMode,
          },
        )}
      >
        <div className="mr-2 flex flex-grow flex-wrap items-start gap-1">
          {fields.map((field, index) => (
            <FormField
              key={field.id}
              control={control}
              name={`tags.${index}.name`}
              render={({ field: { value } }) => (
                <FormItem className="flex items-center rounded-full bg-purple-100 px-3 py-1 text-purple-800 shadow-sm transition-colors hover:bg-purple-200">
                  <div
                    className="mr-2 h-3 w-3 rounded-full"
                    style={{ backgroundColor: field.color }}
                  />
                  <span className="text-sm font-medium">{value}</span>
                  <button
                    type="button"
                    onClick={() => handleUnselectTag(field)}
                    className="ml-2 rounded-full text-purple-600 hover:text-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:ring-offset-2"
                  >
                    <FiX className="h-4 w-4" />
                  </button>
                </FormItem>
              )}
            />
          ))}
        </div>

        <Popover
          open={open}
          onOpenChange={isOpen =>
            dispatch({ type: 'SET_OPEN', payload: isOpen })
          }
        >
          <PopoverTrigger asChild>{renderTrigger()}</PopoverTrigger>
          <PopoverContent className="w-[250px] p-0" align="end">
            <Command>
              <CommandInput placeholder="Search tags..." />
              <CommandEmpty>
                No tag found.
                <button
                  className="mt-2 w-full rounded-md bg-purple-100 px-2 py-1 text-purple-800 transition-colors hover:bg-purple-200"
                  onClick={() => {
                    setNewTagName(newTagName);
                    handleAddNewTag();
                  }}
                >
                  Create &quot;{newTagName}&quot;
                </button>
              </CommandEmpty>
              <CommandList>
                <CommandGroup className="p-2">
                  <ScrollArea className="h-28 overflow-y-auto pr-2">
                    <div className="space-y-1">
                      {existingTags.map(tag => {
                        const selected = fields.some(
                          field => field.name === tag.name,
                        );
                        return (
                          <CommandItem
                            key={tag.id}
                            value={tag.name}
                            onSelect={() => {
                              if (selected) {
                                handleUnselectTag(tag);
                              } else {
                                handleSelectTag(tag);
                              }
                            }}
                            className={cn(
                              'group flex cursor-default select-none items-center rounded-md px-3 py-2 text-sm outline-none',
                              'transition-all duration-300 ease-in-out',
                              'relative overflow-hidden',
                              isDarkMode
                                ? selected
                                  ? 'bg-purple-700 text-white'
                                  : 'text-gray-200 hover:bg-gray-700'
                                : selected
                                  ? 'bg-purple-100 text-purple-900'
                                  : 'text-gray-700 hover:bg-purple-50',
                            )}
                          >
                            <div
                              className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-10"
                              style={{
                                backgroundImage: `radial-gradient(circle, ${tag.color} 10%, transparent 10.01%)`,
                                backgroundSize: '20px 20px',
                              }}
                            />
                            <div className="relative z-10 flex flex-1 items-center space-x-3">
                              <div
                                className={cn(
                                  'h-4 w-4 rounded-full transition-all duration-300',
                                  selected ? 'scale-110' : 'scale-100',
                                  'group-hover:animate-ping',
                                )}
                                style={{ backgroundColor: tag.color }}
                              />
                              <span
                                className={cn(
                                  'relative overflow-hidden font-medium',
                                  selected && 'text-purple-900',
                                )}
                              >
                                <span className="relative z-10 inline-block transition-all duration-300 group-hover:opacity-0">
                                  {tag.name}
                                </span>
                                <span
                                  className="absolute inset-0 z-0 inline-block opacity-0 transition-all duration-300 group-hover:opacity-100"
                                  style={{ color: tag.color }}
                                >
                                  {tag.name}
                                </span>
                              </span>
                            </div>
                            <Check
                              className={cn(
                                'ml-2 h-4 w-4 transition-all duration-300',
                                selected
                                  ? 'rotate-0 scale-100 opacity-100'
                                  : '-rotate-90 scale-0 opacity-0',
                                isDarkMode ? 'text-white' : 'text-purple-600',
                              )}
                            />
                          </CommandItem>
                        );
                      })}
                    </div>
                  </ScrollArea>
                </CommandGroup>
                <CommandSeparator
                  alwaysRender
                  className="my-2 bg-gradient-to-r from-transparent via-gray-200 to-transparent dark:via-gray-700"
                />
                <CommandGroup>
                  <CommandItem
                    value={`:${newTagName}:`}
                    className="group rounded-md transition-all duration-300 ease-in-out hover:bg-purple-50 dark:hover:bg-purple-900/30"
                  >
                    <div
                      className="group flex w-full cursor-pointer items-center justify-center space-x-2 transition-all duration-300"
                      onClick={() => setIsTagsDialogOpen(true)}
                    >
                      <div className="relative flex items-center justify-center">
                        <div className="relative mr-3 flex flex-shrink-0 items-center justify-center">
                          <Edit2 className="h-4 w-4 text-purple-500 transition-all duration-300 group-hover:rotate-12 dark:text-purple-400" />
                          <span className="absolute inset-0 scale-0 rounded-full bg-purple-200 opacity-0 transition-all duration-300 group-hover:scale-150 group-hover:opacity-30 dark:bg-purple-700"></span>
                        </div>
                        <span className="flex-grow text-sm font-medium text-gray-700 transition-colors duration-300 group-hover:text-purple-600 dark:text-gray-200 dark:group-hover:text-purple-300">
                          Edit Tags
                        </span>
                        <span className="ml-2 flex-shrink-0 text-xs text-gray-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:text-gray-500">
                          Ctrl+E
                        </span>
                      </div>
                    </div>
                  </CommandItem>
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      <TagFormDialog
        isOpen={isTagFormDialogOpen}
        onClose={() => setIsTagFormDialogOpen(false)}
        onSubmit={handleCreateTag}
        isDarkMode={isDarkMode}
      />
    </>
  );
};

export default TagInput;
