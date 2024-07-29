'use client';

import { Snippet, snippetSchema } from '@/lib/schemas/snippet';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createContext } from 'react';
import { toast } from 'sonner';
import { useImmerReducer } from 'use-immer';

// Define the state interface
interface State {
  isNewSnippetDialogOpen: boolean;
  isEditMode: boolean;
  editingSnippet: Snippet | null;
  searchTerm: string;
  filterLanguage: string;
}

type Action =
  | { type: 'SET_NEW_SNIPPET_DIALOG'; payload: boolean }
  | { type: 'SET_EDIT_MODE'; payload: boolean }
  | { type: 'SET_EDITING_SNIPPET'; payload: Snippet | null }
  | { type: 'SET_SEARCH_TERM'; payload: string }
  | { type: 'SET_FILTER_LANGUAGE'; payload: string };

const reducer = (draft: State, action: Action) => {
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
  }
};

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
  deleteSnippet: (id: string) => void;
  toggleFavorite: (id: string) => void;
  dispatch: React.Dispatch<Action>;
}

const SnippetContext = createContext<SnippetContextValue | undefined>(
  undefined,
);
SnippetContext.displayName = 'SnippetContext';

const initialState: State = {
  isNewSnippetDialogOpen: false,
  isEditMode: false,
  editingSnippet: null,
  searchTerm: '',
  filterLanguage: '',
};

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

const SnippetProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useImmerReducer(reducer, initialState);
  const queryClient = useQueryClient();

  const { data: snippets = [] } = useQuery({
    queryKey: ['snippets'],
    queryFn: () => initialSnippets,
  });

  const createMutation = useMutation({
    mutationFn: async (newSnippet: Snippet) => {
      initialSnippets.push(newSnippet);
      return newSnippet;
    },
    onSuccess: () => {
      dispatch({ type: 'SET_NEW_SNIPPET_DIALOG', payload: false });

      toast('Snippet Created', {
        description: 'Your new snippet has been successfully created.',
      });
      queryClient.invalidateQueries({ queryKey: ['snippets'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (updatedSnippet: Snippet) => {
      const index = initialSnippets.findIndex(s => s.id === updatedSnippet.id);
      if (index !== -1) {
        snippets[index] = updatedSnippet;
      }

      return updatedSnippet;
    },
    onSuccess: () => {
      dispatch({ type: 'SET_EDIT_MODE', payload: false });
      dispatch({ type: 'SET_EDITING_SNIPPET', payload: null });
      toast('Snippet Updated', {
        description: 'Your snippet has been successfully updated.',
      });
      queryClient.invalidateQueries({ queryKey: ['snippets'] });
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
      toast('Snippet Deleted', {
        description: 'Your snippet has been successfully deleted.',
      });
      queryClient.invalidateQueries({ queryKey: ['snippets'] });
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
  });

  const filteredSnippets = snippets.filter(snippet => {
    const matchesSearch =
      snippet.title.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
      snippet.code.toLowerCase().includes(state.searchTerm.toLowerCase());
    const matchesLanguage =
      state.filterLanguage === '' || snippet.language === state.filterLanguage;
    return matchesSearch && matchesLanguage;
  });

  return (
    <SnippetContext.Provider
      value={{
        ...state,
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
        dispatch,
      }}
    >
      {children}
    </SnippetContext.Provider>
  );
};

export { SnippetContext, SnippetProvider };
