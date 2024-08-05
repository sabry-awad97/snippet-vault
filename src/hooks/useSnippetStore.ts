'use client';

import { Snippet } from '@/lib/schemas/snippet';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface SnippetStore {
  isSnippetDialogOpen: boolean;
  isEditMode: boolean;
  editingSnippet: Snippet | null;
  setSnippetDialog: (snippet: Snippet | null) => void;
  resetSnippetDialog: () => void;
}

const useSnippetStore = create<SnippetStore>()(
  immer((set, get) => ({
    isSnippetDialogOpen: false,
    isEditMode: false,
    editingSnippet: null,

    setSnippetDialog: (snippet: Snippet | null) =>
      set(state => {
        state.isSnippetDialogOpen = true;
        if (snippet) {
          state.isEditMode = true;
          state.editingSnippet = snippet;
        }
      }),

    resetSnippetDialog: () =>
      set(state => {
        state.isSnippetDialogOpen = false;
        state.isEditMode = false;
        state.editingSnippet = null;
      }),
  })),
);

export default useSnippetStore;
