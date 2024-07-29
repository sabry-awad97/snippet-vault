'use client';

import { Snippet, snippetSchema } from '@/lib/schemas/snippet';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createContext, ReactNode } from 'react';
import { toast } from 'sonner';
import { useImmerReducer } from 'use-immer';

// Define the state interface
interface SnippetState {
  isNewSnippetDialogOpen: boolean;
  isEditMode: boolean;
  editingSnippet: Snippet | null;
  searchTerm: string;
  filterLanguage: string;
}

type SnippetAction =
  | { type: 'SET_NEW_SNIPPET_DIALOG'; payload: boolean }
  | { type: 'SET_EDIT_MODE'; payload: boolean }
  | { type: 'SET_EDITING_SNIPPET'; payload: Snippet | null }
  | { type: 'SET_SEARCH_TERM'; payload: string }
  | { type: 'SET_FILTER_LANGUAGE'; payload: string };

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
    case 'SET_SEARCH_TERM':
      draft.searchTerm = action.payload;
      break;
    case 'SET_FILTER_LANGUAGE':
      draft.filterLanguage = action.payload;
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
  searchTerm: string;
  filterLanguage: string;
  createSnippet: (newSnippet: Snippet) => Promise<void>;
  updateSnippet: (updatedSnippet: Snippet) => Promise<void>;
  deleteSnippet: (id: string) => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
  resetSnippetDialog: () => void;
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
  searchTerm: '',
  filterLanguage: '',
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
    {
      editingSnippet,
      filterLanguage,
      isEditMode,
      isNewSnippetDialogOpen,
      searchTerm,
    },
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

  const filteredSnippets = snippets.filter(snippet => {
    const matchesSearch =
      snippet.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      snippet.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLanguage =
      filterLanguage === '' || snippet.language === filterLanguage;
    return matchesSearch && matchesLanguage;
  });

  const value: SnippetContextValue = {
    editingSnippet,
    filterLanguage,
    isEditMode,
    isNewSnippetDialogOpen,
    searchTerm,
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
