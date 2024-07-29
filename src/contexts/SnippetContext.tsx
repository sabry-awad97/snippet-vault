'use client';

import { Snippet, snippetSchema } from '@/lib/schemas/snippet';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createContext, ReactNode } from 'react';
import { toast } from 'sonner';
import { useImmerReducer } from 'use-immer';

enum FilterType {
  SEARCH = 'search',
  LANGUAGE = 'language',
  FAVORITE = 'favorite',
  DATE_RANGE = 'dateRange',
}

type Filter =
  | {
      type: `${FilterType.SEARCH}`;
      value: String;
    }
  | {
      type: `${FilterType.LANGUAGE}`;
      value: String;
    }
  | {
      type: `${FilterType.FAVORITE}`;
      value: boolean;
    }
  | {
      type: `${FilterType.DATE_RANGE}`;
      value: [Date, Date];
    };

// Define the state interface
interface SnippetState {
  isNewSnippetDialogOpen: boolean;
  isEditMode: boolean;
  editingSnippet: Snippet | null;
  filters: Filter[];
}

type SnippetAction =
  | { type: 'SET_NEW_SNIPPET_DIALOG'; payload: boolean }
  | { type: 'SET_EDIT_MODE'; payload: boolean }
  | { type: 'SET_EDITING_SNIPPET'; payload: Snippet | null }
  | { type: 'SET_FILTER'; payload: Filter }
  | { type: 'REMOVE_FILTER'; payload: `${FilterType}` }
  | { type: 'CLEAR_FILTERS' };

const snippetReducer = (draft: SnippetState, action: SnippetAction) => {
  switch (action.type) {
    case 'SET_NEW_SNIPPET_DIALOG':
      draft.isNewSnippetDialogOpen = action.payload;
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
  isNewSnippetDialogOpen: boolean;
  isEditMode: boolean;
  editingSnippet: Snippet | null;
  filters: Filter[];
  createSnippet: (newSnippet: Snippet) => Promise<void>;
  updateSnippet: (updatedSnippet: Snippet) => Promise<void>;
  deleteSnippet: (id: string) => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
  resetSnippetDialog: () => void;
  setFilter: (filter: Filter) => void;
  removeFilter: (filterType: `${FilterType}`) => void;
  clearFilters: () => void;
  dispatch: React.Dispatch<SnippetAction>;
}

const SnippetContext = createContext<SnippetContextValue | undefined>(
  undefined,
);
SnippetContext.displayName = 'SnippetContext';

// Define the initial state
const initialState: SnippetState = {
  isNewSnippetDialogOpen: false,
  isEditMode: false,
  editingSnippet: null,
  filters: [],
};

// Mock initial snippets (replace with actual data fetching in production)
const initialSnippets = snippetSchema.array().parse([
  {
    id: '1',
    title: 'Hello World',
    code: 'console.log("Hello World!");',
    language: 'javascript',
    tags: ['hello', 'world'],
    isFavorite: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    title: 'Fizz Buzz',
    code: 'for (let i = 1; i <= 100; i++) {\n  if (i % 15 === 0) console.log("FizzBuzz");\n  else if (i % 3 === 0) console.log("Fizz");\n  else if (i % 5 === 0) console.log("Buzz");\n  else console.log(i);\n}',
    language: 'javascript',
    tags: [],
    isFavorite: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]);

const SnippetProvider = ({ children }: { children: ReactNode }) => {
  const [
    { editingSnippet, isEditMode, isNewSnippetDialogOpen, filters },
    dispatch,
  ] = useImmerReducer(snippetReducer, initialState);
  const queryClient = useQueryClient();

  const { data: snippets = [] } = useQuery<Snippet[]>({
    queryKey: ['snippets'],
    queryFn: () => initialSnippets,
  });

  const createMutation = useMutation({
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
    mutationFn: async (id: string) => {
      const index = initialSnippets.findIndex(s => s.id === id);
      if (index !== -1) {
        initialSnippets[index].isFavorite = !initialSnippets[index].isFavorite;
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

  const resetSnippetDialog = () => {
    dispatchMultipleActions(dispatch, [
      { type: 'SET_NEW_SNIPPET_DIALOG', payload: false },
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

  const filteredSnippets = snippets.filter(snippet => {
    return filters.every(filter => {
      switch (filter.type) {
        case 'search':
          return (
            snippet.title.toLowerCase().includes(filter.value.toLowerCase()) ||
            snippet.code.toLowerCase().includes(filter.value.toLowerCase())
          );
        case 'language':
          return filter.value === '' || snippet.language === filter.value;
        case 'favorite':
          return filter.value ? snippet.isFavorite : true;
        case 'dateRange':
          const snippetDate = snippet.createdAt;
          return (
            snippetDate >= filter.value[0] && snippetDate <= filter.value[1]
          );
        default:
          return true;
      }
    });
  });

  const value: SnippetContextValue = {
    editingSnippet,
    isEditMode,
    isNewSnippetDialogOpen,
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
    resetSnippetDialog,
    setFilter,
    removeFilter,
    clearFilters,
    dispatch,
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
