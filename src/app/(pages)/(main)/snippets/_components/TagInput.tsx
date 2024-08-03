import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
} from '@/components/ui/command';
import { FormField, FormItem } from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import useTags from '@/hooks/useTags';
import { Snippet } from '@/lib/schemas/snippet';
import { Tag, TagSchema } from '@/lib/schemas/tag';
import { cn } from '@/lib/utils';
import { Command as CommandPrimitive } from 'cmdk';
import React, { useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { FiCheck, FiX } from 'react-icons/fi';

interface TagInputProps {
  isDarkMode: boolean;
}

const TagInput: React.FC<TagInputProps> = ({ isDarkMode }) => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const { control } = useFormContext<Snippet>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'tags',
  });

  const { tags: existingTags } = useTags();

  const handleSelectTag = (selectedTag: Tag) => {
    setSelectedTags(prev => {
      const isSelected = prev.some(tag => tag.id === selectedTag.id);
      if (isSelected) {
        return prev.filter(tag => tag.id !== selectedTag.id);
      } else {
        return [...prev, selectedTag];
      }
    });
  };

  const handleAddSelectedTags = () => {
    selectedTags.forEach(tag => {
      const newTag = TagSchema.parse({
        ...tag,
        snippetIds: tag.snippetIds || [],
      });
      append(newTag);
    });
    setOpen(false);
    setInputValue('');
    setSelectedTags([]);
  };

  const handleAddNewTag = () => {
    if (inputValue.trim()) {
      const newTag = TagSchema.parse({
        id: Date.now().toString(),
        name: inputValue.trim(),
        snippetIds: [],
        color: '#f7df1e',
      });

      append(newTag);
      setInputValue('');
      setOpen(false);
    }
  };

  return (
    <div
      className={cn(
        'flex flex-wrap items-center rounded-md border p-2 focus:outline-none focus:ring-2',
        {
          'border-purple-700 bg-gray-800 text-white hover:border-purple-500 focus:border-purple-400 focus:ring-purple-400':
            isDarkMode,
          'border-purple-200 bg-white hover:border-purple-400 focus:border-purple-500 focus:ring-purple-300':
            !isDarkMode,
        },
      )}
    >
      {fields.map((field, index) => (
        <FormField
          key={field.id}
          control={control}
          name={`tags.${index}.name`}
          render={({ field }) => (
            <FormItem className="m-1 flex items-center rounded-full bg-purple-100 px-3 py-1 text-purple-800">
              {field.value}
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

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button className="flex-grow bg-transparent p-1 text-left outline-none">
            {inputValue || 'Add tags...'}
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command className="w-full">
            <CommandInput
              placeholder="Search tags..."
              value={inputValue}
              onValueChange={setInputValue}
            />
            <CustomCommandList>
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
                {existingTags.map(tag => (
                  <CustomCommandItem
                    key={tag.id}
                    onSelect={() => handleSelectTag(tag)}
                    selected={selectedTags.some(t => t.id === tag.id)}
                  >
                    <FiCheck
                      className={cn(
                        'mr-2 h-4 w-4',
                        selectedTags.some(t => t.id === tag.id)
                          ? 'opacity-100'
                          : 'opacity-0',
                      )}
                    />
                    {tag.name}
                  </CustomCommandItem>
                ))}
              </CommandGroup>
            </CustomCommandList>
          </Command>
          {selectedTags.length > 0 && (
            <div className="flex items-center justify-between border-t p-2">
              <span>{selectedTags.length} selected</span>
              <button
                className="rounded-md bg-purple-500 px-2 py-1 text-sm text-white"
                onClick={handleAddSelectedTags}
              >
                Add Tags
              </button>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default TagInput;

const CustomCommandList = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.List
    ref={ref}
    className={cn('max-h-[300px] overflow-y-auto overflow-x-hidden', className)}
    {...props}
  />
));
CustomCommandList.displayName = 'CustomCommandList';

const CustomCommandItem = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item> & {
    selected?: boolean;
  }
>(({ className, selected, children, ...props }, ref) => (
  <CommandPrimitive.Item
    ref={ref}
    className={cn(
      'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      'dark:aria-selected:bg-purple-700 dark:aria-selected:text-white',
      'aria-selected:bg-purple-100 aria-selected:text-purple-900',
      selected && 'bg-purple-100 text-purple-900',
      className,
    )}
    {...props}
  >
    {children}
  </CommandPrimitive.Item>
));
CustomCommandItem.displayName = 'CustomCommandItem';
