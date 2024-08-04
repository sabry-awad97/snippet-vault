import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import { FormField, FormItem } from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import useTags from '@/hooks/useTags';
import { Snippet } from '@/lib/schemas/snippet';
import { Tag, TagSchema } from '@/lib/schemas/tag';
import { cn } from '@/lib/utils';
import React, { useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { FiCheck, FiPlus, FiX } from 'react-icons/fi';
import TagFormDialog from '../../TagFormDialog';

interface TagInputProps {
  isDarkMode: boolean;
}

const TagInput: React.FC<TagInputProps> = ({ isDarkMode }) => {
  const [isTagFormDialogOpen, setIsTagFormDialogOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const { control } = useFormContext<Snippet>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'tags',
  });

  const { tags: existingTags, createTag } = useTags();

  const handleAddNewTag = () => {
    setIsTagFormDialogOpen(true);
  };

  const handleSelectTag = (selectedTag: Tag) => {
    const index = fields.findIndex(field => field.id === selectedTag.id);
    if (index !== -1) {
      remove(index);
    } else {
      const newTag = TagSchema.parse({
        ...selectedTag,
        snippetIds: selectedTag.snippetIds || [],
      });
      append(newTag);
    }
  };

  return (
    <>
      <div
        className={cn(
          'flex items-start rounded-md border p-2 focus:outline-none focus:ring-2',
          {
            'border-purple-700 bg-gray-800 text-white hover:border-purple-500 focus:border-purple-400 focus:ring-purple-400':
              isDarkMode,
            'border-purple-200 bg-white hover:border-purple-400 focus:border-purple-500 focus:ring-purple-300':
              !isDarkMode,
          },
        )}
      >
        <div className="mr-2 flex flex-grow flex-wrap items-start">
          {fields.map((field, index) => (
            <FormField
              key={field.id}
              control={control}
              name={`tags.${index}.name`}
              render={({ field: { value } }) => (
                <FormItem className="m-1 flex items-center rounded-full bg-purple-100 px-3 py-1 text-purple-800">
                  <div
                    className="mr-2 h-3 w-3 rounded-full"
                    style={{ backgroundColor: fields[index].color }}
                  />
                  {value}
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="ml-2 text-purple-600 hover:text-purple-800"
                  >
                    <FiX />
                  </button>
                </FormItem>
              )}
            />
          ))}
        </div>

        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button
              className={cn(
                'flex-shrink-0 rounded-full p-1 transition-colors',
                isDarkMode
                  ? 'bg-gray-700 text-white hover:bg-gray-600'
                  : 'bg-purple-100 text-purple-800 hover:bg-purple-200',
              )}
            >
              <FiPlus className="h-5 w-5" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0" align="end">
            <Command className="w-full">
              <CommandInput
                placeholder="Search tags..."
                value={inputValue}
                onValueChange={setInputValue}
              />
              <CommandEmpty>
                No tag found.
                <button
                  className="mt-2 w-full rounded-md bg-purple-100 px-2 py-1 text-purple-800"
                  onClick={handleAddNewTag}
                >
                  Create &quot;{inputValue}&quot;
                </button>
              </CommandEmpty>
              <CommandGroup>
                <ScrollArea className="h-48">
                  {existingTags.map(tag => (
                    <CommandItem
                      key={tag.id}
                      onSelect={() => handleSelectTag(tag)}
                      className={cn(
                        'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
                        'dark:aria-selected:bg-purple-700 dark:aria-selected:text-white',
                        'aria-selected:bg-purple-100 aria-selected:text-purple-900',
                        fields.some(f => f.id === tag.id) &&
                          'bg-purple-100 text-purple-900',
                      )}
                    >
                      <div
                        className="mr-2 h-3 w-3 rounded-full"
                        style={{ backgroundColor: tag.color }}
                      />
                      <FiCheck
                        className={cn(
                          'mr-2 h-4 w-4',
                          fields.some(f => f.id === tag.id)
                            ? 'opacity-100'
                            : 'opacity-0',
                        )}
                      />
                      {tag.name}
                    </CommandItem>
                  ))}
                  <ScrollBar orientation="vertical" />
                </ScrollArea>
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      <TagFormDialog
        isOpen={isTagFormDialogOpen}
        onClose={() => {
          setIsTagFormDialogOpen(false);
        }}
        onSubmit={createTag}
        isDarkMode={isDarkMode}
      />
    </>
  );
};

export default TagInput;
