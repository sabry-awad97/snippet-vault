'use client';

import useSnippets from '@/hooks/useSnippets';
import { Snippet } from '@/lib/schemas/snippet';
import {
  createContext,
  ReactNode,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { useImmerReducer } from 'use-immer';
import { SnippetAction, snippetReducer, SnippetState } from './snippetsReducer';
import { Filter, FilterType } from './types';

interface SnippetContextValue {
  filteredSnippets: Snippet[];
  isSnippetDialogOpen: boolean;
  isEditMode: boolean;
  editingSnippet: Snippet | null;
  filters: Filter[];
  setSnippetDialog: (snippet: Snippet | null) => void;
  resetSnippetDialog: () => void;
  setFilter: (filter: Filter) => void;
  removeFilter: (filterType: `${FilterType}`) => void;
  clearFilters: () => void;
  handleSearchChange: (value: string) => void;
  handleLanguageChange: (value: string) => void;
  handleFavoriteToggle: (value: boolean) => void;
  handleDateRangeChange: (range: { from: Date; to: Date }) => void;
}

const SnippetContext = createContext<SnippetContextValue | undefined>(
  undefined,
);
SnippetContext.displayName = 'SnippetContext';

const initialState: SnippetState = {
  isSnippetDialogOpen: false,
  isEditMode: false,
  editingSnippet: null,
  filters: [],
};

const SnippetProvider = ({ children }: { children: ReactNode }) => {
  const [activeFilters, setActiveFilters] = useState<{
    [K in FilterType]?: Extract<Filter, { type: K }>['value'];
  }>({});

  const [state, dispatch] = useImmerReducer(snippetReducer, initialState);
  const { snippets } = useSnippets();

  const setSnippetDialog = (snippet: Snippet | null) => {
    dispatch({ type: 'SET_SNIPPET_DIALOG', payload: true });
    if (snippet) {
      dispatchMultipleActions(dispatch, [
        { type: 'SET_EDIT_MODE', payload: true },
        { type: 'SET_EDITING_SNIPPET', payload: snippet },
      ]);
    }
  };

  const resetSnippetDialog = () => {
    dispatchMultipleActions(dispatch, [
      { type: 'SET_SNIPPET_DIALOG', payload: false },
      { type: 'SET_EDIT_MODE', payload: false },
      { type: 'SET_EDITING_SNIPPET', payload: null },
    ]);
  };

  const setFilter = useCallback(
    (filter: Filter) => {
      dispatch({ type: 'SET_FILTER', payload: filter });
    },
    [dispatch],
  );

  const removeFilter = (filterType: `${FilterType}`) => {
    dispatch({ type: 'REMOVE_FILTER', payload: filterType });
  };

  const clearFilters = useCallback(() => {
    dispatch({ type: 'CLEAR_FILTERS' });
  }, [dispatch]);

  const handleFilterChange = useCallback(
    (filter: Filter) => {
      setFilter(filter);
    },
    [setFilter],
  );

  const handleLanguageChange = useCallback(
    (value: string) => {
      const newLanguages =
        value === 'all'
          ? []
          : [...(activeFilters[FilterType.LANGUAGE] || []), value];
      handleFilterChange({ type: FilterType.LANGUAGE, value: newLanguages });
    },
    [handleFilterChange, activeFilters],
  );

  const handleFavoriteToggle = useCallback(
    (checked: boolean) => {
      handleFilterChange({ type: FilterType.FAVORITE, value: checked });
    },
    [handleFilterChange],
  );

  const handleDateRangeChange = useCallback(
    (range: { from: Date; to: Date }) => {
      handleFilterChange({
        type: FilterType.DATE_RANGE,
        value: [range.from, range.to],
      });
    },
    [handleFilterChange],
  );

  const handleSearchChange = (value: string) => {
    setFilter({ type: FilterType.SEARCH, value });
  };

  const handleClearFilters = useCallback(() => {
    clearFilters();
    setActiveFilters({});
  }, [clearFilters]);

  const applyFilter = (snippet: Snippet, filter: Filter): boolean => {
    switch (filter.type) {
      case FilterType.SEARCH:
        const searchTerm = filter.value.toLowerCase();
        return (
          snippet.title.toLowerCase().includes(searchTerm) ||
          snippet.code.toLowerCase().includes(searchTerm) ||
          snippet.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        );
      case FilterType.LANGUAGE:
        return (
          filter.value.length === 0 || filter.value.includes(snippet.language)
        );
      case FilterType.TAGS:
        return (
          filter.value.length === 0 ||
          filter.value.some(tag => snippet.tags.includes(tag))
        );
      case FilterType.FAVORITE:
        return filter.value ? snippet.state.isFavorite : true;
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

  const filteredSnippets = useMemo(() => {
    return snippets.filter(snippet =>
      state.filters.every(filter => applyFilter(snippet, filter)),
    );
  }, [snippets, state.filters]);

  const value: SnippetContextValue = {
    editingSnippet: state.editingSnippet,
    isEditMode: state.isEditMode,
    isSnippetDialogOpen: state.isSnippetDialogOpen,
    filters: state.filters,
    filteredSnippets,
    setSnippetDialog,
    resetSnippetDialog,
    setFilter,
    removeFilter,
    clearFilters,
    handleLanguageChange,
    handleFavoriteToggle,
    handleDateRangeChange,
    handleSearchChange,
  };

  return (
    <SnippetContext.Provider value={value}>{children}</SnippetContext.Provider>
  );
};

export { SnippetContext, SnippetProvider };

const dispatchMultipleActions = (
  dispatch: React.Dispatch<SnippetAction>,
  actions: SnippetAction[],
) => {
  actions.forEach(action => dispatch(action));
};
