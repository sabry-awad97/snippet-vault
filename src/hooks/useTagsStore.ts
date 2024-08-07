'use client';

import { create } from 'zustand';

interface TagsStore {
  isTagsDialogOpen: boolean;
  setIsTagsDialogOpen: (isOpen: boolean) => void;
  isTagCreateFormDialogOpen: boolean;
  setIsTagCreateFormDialogOpen: (isOpen: boolean) => void;
  isTagEditFormDialogOpen: boolean;
  setIsTagEditFormDialogOpen: (isOpen: boolean) => void;
}

const useTagsStore = create<TagsStore>(set => ({
  isTagsDialogOpen: false,
  setIsTagsDialogOpen: isOpen => set({ isTagsDialogOpen: isOpen }),
  isTagCreateFormDialogOpen: false,
  setIsTagCreateFormDialogOpen: isOpen =>
    set({ isTagCreateFormDialogOpen: isOpen }),
  isTagEditFormDialogOpen: false,
  setIsTagEditFormDialogOpen: isOpen =>
    set({ isTagEditFormDialogOpen: isOpen }),
}));

export default useTagsStore;
