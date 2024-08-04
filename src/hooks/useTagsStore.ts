'use client';

import useTags from '@/hooks/useTags';
import { Tag } from '@/lib/schemas/tag';
import { create } from 'zustand';

interface TagsStore {
  tags: Tag[];
  isTagsDialogOpen: boolean;
  setIsTagsDialogOpen: (isOpen: boolean) => void;
  setTags: (tags: Tag[]) => void;
}

const useTagsStore = create<TagsStore>(set => ({
  tags: [],
  isTagsDialogOpen: false,
  setIsTagsDialogOpen: isOpen => set({ isTagsDialogOpen: isOpen }),
  setTags: tags => set({ tags }),
}));

export const useTagsWithInitialization = () => {
  const store = useTagsStore();
  const { tags: existingTags } = useTags();

  // Initialize tags if the store is empty
  if (store.tags.length === 0 && existingTags.length > 0) {
    store.setTags(existingTags);
  }

  return store;
};

export default useTagsWithInitialization;
