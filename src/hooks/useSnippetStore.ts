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
  removeFilter: (filterType: FilterType) => void;
  clearFilters: () => void;
  handleSearchChange: (value: string) => void;
  handleLanguageChange: (value: string) => void;
  handleFavoriteToggle: (value: boolean) => void;
  handleDateRangeChange: (range: { from: Date; to: Date }) => void;
  toggleTagSelection: (tag: string) => void;
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
        state.filteredSnippets = filterSnippets(state.snippets, state.filters);
      }),

    removeFilter: (filterType: FilterType) =>
      set(state => {
        state.filters = state.filters.filter(f => f.type !== filterType);
        state.filteredSnippets = filterSnippets(state.snippets, state.filters);
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

        get().setFilter({ type: FilterType.TAGS, value: state.selectedTags });
      }),
  })),
);

const filterSnippets = (snippets: Snippet[], filters: Filter[]): Snippet[] => {
  return snippets.filter(snippet =>
    filters.every(filter => applyFilter(snippet, filter)),
  );
};

const applyFilter = (snippet: Snippet, filter: Filter): boolean => {
  switch (filter.type) {
    case FilterType.SEARCH:
      return applySearchFilter(snippet, filter.value);
    case FilterType.LANGUAGE:
      return applyLanguageFilter(snippet, filter.value);
    case FilterType.TAGS:
      return applyTagsFilter(snippet, filter.value);
    case FilterType.FAVORITE:
      return applyFavoriteFilter(snippet, filter.value);
    case FilterType.DATE_RANGE:
      return applyDateRangeFilter(snippet, filter.value);
    default:
      return true;
  }
};

const applySearchFilter = (snippet: Snippet, searchTerm: string): boolean => {
  const term = searchTerm.toLowerCase();
  return (
    snippet.title.toLowerCase().includes(term) ||
    snippet.description.toLowerCase().includes(term) ||
    snippet.code.toLowerCase().includes(term) ||
    snippet.tags?.some(tag => tag.name.toLowerCase().includes(term)) ||
    false
  );
};

const applyLanguageFilter = (
  snippet: Snippet,
  languages: string[],
): boolean => {
  return languages.length === 0 || languages.includes(snippet.language);
};

const applyTagsFilter = (snippet: Snippet, selectedTags: string[]): boolean => {
  return (
    selectedTags.length === 0 ||
    snippet.tags?.some(tag => selectedTags.includes(tag.name)) ||
    false
  );
};

const applyFavoriteFilter = (
  snippet: Snippet,
  isFavorite: boolean,
): boolean => {
  return isFavorite ? snippet.state?.isFavorite || false : true;
};

const applyDateRangeFilter = (
  snippet: Snippet,
  range: [Date, Date],
): boolean => {
  const snippetDate = new Date(snippet.createdAt);
  return snippetDate >= range[0] && snippetDate <= range[1];
};

export default useSnippetStore;
