'use client';

import { create } from 'zustand';

interface TagsStore {
  isTagsDialogOpen: boolean;
  setIsTagsDialogOpen: (isOpen: boolean) => void;
  isTagFormDialogOpen: boolean;
  setIsTagFormDialogOpen: (isOpen: boolean) => void;
}

const useTagsStore = create<TagsStore>(set => ({
  isTagsDialogOpen: false,
  setIsTagsDialogOpen: isOpen => set({ isTagsDialogOpen: isOpen }),
  isTagFormDialogOpen: false,
  setIsTagFormDialogOpen: isOpen => set({ isTagFormDialogOpen: isOpen }),
}));

export default useTagsStore;
