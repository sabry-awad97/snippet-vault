'use client';

import notes from '@/initialData/notes';
import { Snippet, snippetSchema } from '@/lib/schemas/snippet';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createContext, ReactNode, useMemo } from 'react';
import { toast } from 'sonner';
import { useImmerReducer } from 'use-immer';

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

// Define the state interface
interface SnippetState {
  isSnippetDialogOpen: boolean;
  isEditMode: boolean;
  editingSnippet: Snippet | null;
  filters: Filter[];
}

type SnippetAction =
  | { type: 'SET_SNIPPET_DIALOG'; payload: boolean }
  | { type: 'SET_EDIT_MODE'; payload: boolean }
  | { type: 'SET_EDITING_SNIPPET'; payload: Snippet | null }
  | { type: 'SET_FILTER'; payload: Filter }
  | { type: 'REMOVE_FILTER'; payload: `${FilterType}` }
  | { type: 'CLEAR_FILTERS' };

const snippetReducer = (draft: SnippetState, action: SnippetAction) => {
  switch (action.type) {
    case 'SET_SNIPPET_DIALOG':
      draft.isSnippetDialogOpen = action.payload;
      break;
    case 'SET_EDIT_MODE':
      draft.isEditMode = action.payload;
      break;
    case 'SET_EDITING_SNIPPET':
      draft.editingSnippet = action.payload;
      break;
    case 'SET_FILTER':
      const existingFilterIndex = draft.filters.findIndex(
        f => f.type === action.payload.type,
      );
      if (existingFilterIndex !== -1) {
        draft.filters[existingFilterIndex] = action.payload;
      } else {
        draft.filters.push(action.payload);
      }
      break;
    case 'REMOVE_FILTER':
      draft.filters = draft.filters.filter(f => f.type !== action.payload);
      break;
    case 'CLEAR_FILTERS':
      draft.filters = [];
      break;
    default:
      break;
  }
};

// Define the context interface
interface SnippetContextValue {
  snippets: Snippet[];
  filteredSnippets: Snippet[];
  isSnippetDialogOpen: boolean;
  isEditMode: boolean;
  editingSnippet: Snippet | null;
  filters: Filter[];
  createSnippet: (newSnippet: Snippet) => Promise<void>;
  updateSnippet: (updatedSnippet: Snippet) => Promise<void>;
  deleteSnippet: (id: string) => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
  toggleDarkMode: (id: string) => Promise<void>;
  setSnippetDialog: (snippet: Snippet | null) => void;
  resetSnippetDialog: () => void;
  setFilter: (filter: Filter) => void;
  removeFilter: (filterType: `${FilterType}`) => void;
  clearFilters: () => void;
}

const SnippetContext = createContext<SnippetContextValue | undefined>(
  undefined,
);
SnippetContext.displayName = 'SnippetContext';

// Define the initial state
const initialState: SnippetState = {
  isSnippetDialogOpen: false,
  isEditMode: false,
  editingSnippet: null,
  filters: [],
};

// Mock initial snippets (replace with actual data fetching in production)
const initialSnippets = snippetSchema.array().parse(notes);

const SnippetProvider = ({ children }: { children: ReactNode }) => {
  const [
    { editingSnippet, isEditMode, isSnippetDialogOpen, filters },
    dispatch,
  ] = useImmerReducer(snippetReducer, initialState);
  const queryClient = useQueryClient();

  const { data: snippets = [] } = useQuery<Snippet[]>({
    queryKey: ['snippets'],
    queryFn: () => initialSnippets,
  });

  const createMutation = useMutation({
    mutationKey: ['createSnippet'],
    mutationFn: async (newSnippet: Snippet) => {
      initialSnippets.push(newSnippet);
      return newSnippet;
    },
    onSuccess: () => {
      resetSnippetDialog();

      toast.success('Snippet Created', {
        description: 'Your snippet has been successfully created.',
      });
      queryClient.invalidateQueries({ queryKey: ['snippets'] });
    },
    onError: error => {
      toast.error('Error', {
        description: 'Failed to create snippet.',
      });
      console.error('Create Snippet Error:', error);
    },
  });

  const updateMutation = useMutation({
    mutationKey: ['updateSnippet'],
    mutationFn: async (updatedSnippet: Snippet) => {
      const index = initialSnippets.findIndex(s => s.id === updatedSnippet.id);
      if (index !== -1) {
        initialSnippets[index] = updatedSnippet;
      }
      return updatedSnippet;
    },
    onSuccess: () => {
      resetSnippetDialog();

      toast.success('Snippet Updated', {
        description: 'Your snippet has been successfully updated.',
      });
      queryClient.invalidateQueries({ queryKey: ['snippets'] });
    },
    onError: error => {
      toast.error('Error', {
        description: 'Failed to update snippet.',
      });
      console.error('Update Snippet Error:', error);
    },
  });

  const deleteMutation = useMutation({
    mutationKey: ['deleteSnippet'],
    mutationFn: async (id: string) => {
      const index = initialSnippets.findIndex(s => s.id === id);
      if (index !== -1) {
        initialSnippets.splice(index, 1);
      }
      return id;
    },
    onSuccess: () => {
      toast.success('Snippet Deleted', {
        description: 'Your snippet has been successfully deleted.',
      });
      queryClient.invalidateQueries({ queryKey: ['snippets'] });
    },
    onError: error => {
      toast.error('Error', {
        description: 'Failed to delete snippet.',
      });
      console.error('Delete Snippet Error:', error);
    },
  });

  const toggleFavoriteMutation = useMutation({
    mutationKey: ['toggleFavorite'],
    mutationFn: async (id: string) => {
      const index = initialSnippets.findIndex(s => s.id === id);
      if (index !== -1) {
        initialSnippets[index].state.isFavorite =
          !initialSnippets[index].state.isFavorite;
      }
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['snippets'] });
    },
    onError: error => {
      toast.error('Error', {
        description: 'Failed to toggle favorite.',
      });
      console.error('Toggle Favorite Error:', error);
    },
  });

  const toggleDarkModeMutation = useMutation({
    mutationKey: ['toggleDarkMode'],
    mutationFn: async (id: string) => {
      const index = initialSnippets.findIndex(s => s.id === id);
      if (index !== -1) {
        initialSnippets[index].state.isDark =
          !initialSnippets[index].state.isDark;
      }
      return id;
    },
  });

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

  const setFilter = (filter: Filter) => {
    dispatch({ type: 'SET_FILTER', payload: filter });
  };

  const removeFilter = (filterType: `${FilterType}`) => {
    dispatch({ type: 'REMOVE_FILTER', payload: filterType });
  };

  const clearFilters = () => {
    dispatch({ type: 'CLEAR_FILTERS' });
  };

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
      filters.every(filter => applyFilter(snippet, filter)),
    );
  }, [snippets, filters]);

  const value: SnippetContextValue = {
    editingSnippet,
    isEditMode,
    isSnippetDialogOpen,
    filters,
    snippets,
    filteredSnippets,
    createSnippet: async (newSnippet: Snippet) => {
      await createMutation.mutateAsync(newSnippet);
    },
    updateSnippet: async (updatedSnippet: Snippet) => {
      await updateMutation.mutateAsync(updatedSnippet);
    },
    deleteSnippet: async (id: string) => {
      await deleteMutation.mutateAsync(id);
    },
    toggleFavorite: async (id: string) => {
      await toggleFavoriteMutation.mutateAsync(id);
    },
    toggleDarkMode: async (id: string) => {
      await toggleDarkModeMutation.mutateAsync(id);
    },
    setSnippetDialog,
    resetSnippetDialog,
    setFilter,
    removeFilter,
    clearFilters,
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
