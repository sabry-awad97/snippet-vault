'use client';

import { Snippet } from '@/lib/schemas/snippet';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export enum FilterType {
  SEARCH = 'search',
  LANGUAGE = 'language',
  TAGS = 'tags',
  FAVORITE = 'favorite',
  DATE_RANGE = 'dateRange',
}

export type Filter =
  | {
      type: FilterType.SEARCH;
      value: string;
    }
  | {
      type: FilterType.LANGUAGE;
      value: string[];
    }
  | {
      type: FilterType.TAGS;
      value: string[];
    }
  | {
      type: FilterType.FAVORITE;
      value: boolean;
    }
  | {
      type: FilterType.DATE_RANGE;
      value: [Date, Date];
    };

interface SnippetStore {
  snippets: Snippet[];
  filteredSnippets: Snippet[];
  isSnippetDialogOpen: boolean;
  isEditMode: boolean;
  editingSnippet: Snippet | null;
  filters: Filter[];
  selectedTags: string[];
  setSnippetDialog: (snippet: Snippet | null) => void;
  resetSnippetDialog: () => void;
  setFilter: (filter: Filter) => void;
  removeFilter: (filterType: `${FilterType}`) => void;
  clearFilters: () => void;
  handleSearchChange: (value: string) => void;
  handleLanguageChange: (value: string) => void;
  handleFavoriteToggle: (value: boolean) => void;
  handleDateRangeChange: (range: { from: Date; to: Date }) => void;
  toggleTagSelection: (tag: string) => void;
  setFilterTags: (tags: string[]) => void;
}

const useSnippetStore = create<SnippetStore>()(
  immer((set, get) => ({
    snippets: [],
    filteredSnippets: [],
    isSnippetDialogOpen: false,
    isEditMode: false,
    editingSnippet: null,
    filters: [],
    selectedTags: [],

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

    setFilter: (filter: Filter) =>
      set(state => {
        const existingFilterIndex = state.filters.findIndex(
          f => f.type === filter.type,
        );
        if (existingFilterIndex !== -1) {
          state.filters[existingFilterIndex] = filter;
        } else {
          state.filters.push(filter);
        }
        state.filteredSnippets = applyFilters(state.snippets, state.filters);
      }),

    removeFilter: (filterType: `${FilterType}`) =>
      set(state => {
        state.filters = state.filters.filter(f => f.type !== filterType);
        state.filteredSnippets = applyFilters(state.snippets, state.filters);
      }),

    clearFilters: () =>
      set(state => {
        state.filters = [];
        state.filteredSnippets = state.snippets;
        state.selectedTags = [];
      }),

    handleSearchChange: (value: string) =>
      get().setFilter({ type: FilterType.SEARCH, value }),

    handleLanguageChange: (value: string) =>
      set(state => {
        const currentLanguages =
          state.filters.find(f => f.type === FilterType.LANGUAGE)?.value || [];
        const newLanguages =
          value === 'all' ? [] : [...currentLanguages, value];
        get().setFilter({ type: FilterType.LANGUAGE, value: newLanguages });
      }),

    handleFavoriteToggle: (value: boolean) =>
      get().setFilter({ type: FilterType.FAVORITE, value }),

    handleDateRangeChange: (range: { from: Date; to: Date }) =>
      get().setFilter({
        type: FilterType.DATE_RANGE,
        value: [range.from, range.to],
      }),

    toggleTagSelection: (tag: string) =>
      set(state => {
        const isSelected = state.selectedTags.includes(tag);
        if (isSelected) {
          state.selectedTags = state.selectedTags.filter(t => t !== tag);
        } else {
          state.selectedTags.push(tag);
        }
        get().setFilterTags(state.selectedTags);
      }),

    setFilterTags: (tags: string[]) =>
      set(state => {
        state.selectedTags = tags;
        get().setFilter({ type: FilterType.TAGS, value: tags });
      }),
  })),
);

const applyFilters = (snippets: Snippet[], filters: Filter[]): Snippet[] => {
  return snippets.filter(snippet =>
    filters.every(filter => applyFilter(snippet, filter)),
  );
};

const applyFilter = (snippet: Snippet, filter: Filter): boolean => {
  switch (filter.type) {
    case FilterType.SEARCH:
      const searchTerm = filter.value.toLowerCase();
      return (
        snippet.title.toLowerCase().includes(searchTerm) ||
        snippet.code.toLowerCase().includes(searchTerm) ||
        snippet.tags?.some(tag =>
          tag.name.toLowerCase().includes(searchTerm),
        ) ||
        false
      );
    case FilterType.LANGUAGE:
      return (
        filter.value.length === 0 || filter.value.includes(snippet.language)
      );
    case FilterType.TAGS:
      return (
        filter.value.length === 0 ||
        filter.value.every(tagName =>
          snippet.tags?.some(tag => tag.name === tagName),
        )
      );
    case FilterType.FAVORITE:
      return filter.value ? snippet.state?.isFavorite || false : true;
    case FilterType.DATE_RANGE:
      const snippetDate = new Date(snippet.createdAt);
      return (
        snippetDate >= new Date(filter.value[0]) &&
        snippetDate <= new Date(filter.value[1])
      );
    default:
      return true;
  }
};

export default useSnippetStore;

// export const useSnippetsWithStore = () => {
//   const { snippets } = useSnippets();
//   const store = useSnippetStore();

//   // Initialize snippets if the store is empty
//   if (store.snippets.length === 0 && snippets.length > 0) {
//     store.snippets = snippets;
//     store.filteredSnippets = snippets;
//     // Extract unique tags from snippets
//     const uniqueTags = [
//       ...new Set(snippets.flatMap(s => s.tags?.map(t => t.name) || [])),
//     ];
//     store.setTags(uniqueTags);
//   }

//   return store;
// };

// export default useSnippetsWithStore;
