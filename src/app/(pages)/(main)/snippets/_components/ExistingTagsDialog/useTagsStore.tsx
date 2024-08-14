import { Tag } from '@/lib/schemas/tag';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface TagsState {
  favoriteTagIds: string[];
  tagSize: number;
  tagView: 'list' | 'grid';
  highlightedTag: string | null;
  expandedTag: string | null;
  isTagEditFormDialogOpen: boolean;
  editingTag: Tag | null;
  toggleFavorite: (tagId: string) => void;
  setTagSize: (size: number) => void;
  setTagView: (view: 'list' | 'grid') => void;
  setHighlightedTag: (tagId: string | null) => void;
  setExpandedTag: (tagId: string | null) => void;
  setIsTagEditFormDialogOpen: (isOpen: boolean) => void;
  setEditingTag: (tag: Tag | null) => void;
}

export const useTagsStore = create<TagsState>()(
  persist(
    set => ({
      favoriteTagIds: [],
      tagSize: 100,
      tagView: 'list',
      highlightedTag: null,
      expandedTag: null,
      isTagEditFormDialogOpen: false,
      editingTag: null,
      toggleFavorite: tagId =>
        set(state => {
          const newFavorites = new Set(state.favoriteTagIds);
          if (newFavorites.has(tagId)) {
            newFavorites.delete(tagId);
          } else {
            newFavorites.add(tagId);
          }
          return { favoriteTagIds: Array.from(newFavorites) };
        }),
      setTagSize: size => set({ tagSize: size }),
      setTagView: view => set({ tagView: view }),
      setHighlightedTag: tagId => set({ highlightedTag: tagId }),
      setExpandedTag: tagId => set({ expandedTag: tagId }),
      setIsTagEditFormDialogOpen: isOpen =>
        set({ isTagEditFormDialogOpen: isOpen }),
      setEditingTag: tag => set({ editingTag: tag }),
    }),
    {
      name: 'tags-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
