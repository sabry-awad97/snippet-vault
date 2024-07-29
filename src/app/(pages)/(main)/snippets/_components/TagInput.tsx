import React, { useState } from 'react';
import { FiX } from 'react-icons/fi';

interface TagInputProps {
  tags: string[];
  setTags: React.Dispatch<React.SetStateAction<string[]>>;
  placeholder?: string;
  className?: string;
}

export const TagInput: React.FC<TagInputProps> = ({
  tags,
  setTags,
  placeholder = 'Add a tag...',
  className = '',
}) => {
  const [input, setInput] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && input) {
      e.preventDefault();
      if (!tags.includes(input.trim())) {
        setTags([...tags, input.trim()]);
      }
      setInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div
      className={`flex flex-wrap items-center rounded-md border p-2 ${className}`}
    >
      {tags.map(tag => (
        <div
          key={tag}
          className="m-1 flex items-center rounded-full bg-purple-100 px-3 py-1 text-purple-800"
        >
          {tag}
          <button
            type="button"
            onClick={() => removeTag(tag)}
            className="ml-2 text-purple-600 hover:text-purple-800"
          >
            <FiX />
          </button>
        </div>
      ))}
      <input
        type="text"
        value={input}
        onChange={handleInputChange}
        onKeyDown={handleInputKeyDown}
        placeholder={placeholder}
        className="flex-grow bg-transparent p-1 outline-none"
      />
    </div>
  );
};
