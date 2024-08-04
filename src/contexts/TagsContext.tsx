'use client';

import useTags from '@/hooks/useTags';
import { Tag } from '@/lib/schemas/tag';
import { createContext, ReactNode, useState } from 'react';

interface TagsContextValue {
  tags: Tag[];
  isTagsDialogOpen: boolean;
  setIsTagsDialogOpen: (isTagsDialogOpen: boolean) => void;
}

const TagsContext = createContext<TagsContextValue | undefined>(undefined);
TagsContext.displayName = 'TagContext';

const TagsProvider = ({ children }: { children: ReactNode }) => {
  const [isTagsDialogOpen, setIsTagsDialogOpen] = useState(false);
  const { tags: existingTags } = useTags();

  return (
    <TagsContext.Provider
      value={{
        tags: existingTags,
        isTagsDialogOpen,
        setIsTagsDialogOpen,
      }}
    >
      {children}
    </TagsContext.Provider>
  );
};

export { TagsContext, TagsProvider };
