import { Snippet } from '@/lib/schemas/snippet';
import { TagSchema } from '@/lib/schemas/tag';
import React, { useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { FiX } from 'react-icons/fi';

interface TagInputProps {
  placeholder?: string;
  className?: string;
}

export const TagInput: React.FC<TagInputProps> = ({
  placeholder = 'Add a tag...',
  className = '',
}) => {
  const [inputValue, setInputValue] = useState('');
  const { control } = useFormContext<Snippet>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'tags',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleAddTag = () => {
    if (inputValue.trim()) {
      const newTag = {
        id: Date.now().toString(),
        name: inputValue.trim(),
        snippetIds: [],
        color: '#f7df1e',
      };

      append(TagSchema.parse(newTag));
      setInputValue('');
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();

      handleAddTag();
    }
  };

  const removeTag = (tagToRemove: string) => {
    remove(fields.findIndex(tag => tag.name === tagToRemove));
  };

  return (
    <div
      className={`flex flex-wrap items-center rounded-md border p-2 ${className}`}
    >
      {fields.map(tag => {
        console.log(tag);

        return (
          <div
            key={tag.id}
            className="m-1 flex items-center rounded-full bg-purple-100 px-3 py-1 text-purple-800"
          >
            {tag.name}
            <button
              type="button"
              onClick={() => removeTag(tag.name)}
              className="ml-2 text-purple-600 hover:text-purple-800"
            >
              <FiX />
            </button>
          </div>
        );
      })}
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleInputKeyDown}
        placeholder={placeholder}
        className="flex-grow bg-transparent p-1 outline-none"
      />
    </div>
  );
};
