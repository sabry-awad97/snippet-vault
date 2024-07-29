'use client';

import { Snippet } from '@/lib/schemas/snippet';
import { createContext } from 'react';
import { useImmerReducer } from 'use-immer';

// Define the state interface
interface State {
  snippets: Snippet[];
  filteredSnippets: Snippet[];
  isNewSnippetDialogOpen: boolean;
  isEditMode: boolean;
  editingSnippet: Snippet | null;
  searchTerm: string;
  filterLanguage: string;
}

type Action =
  | { type: 'SET_SNIPPETS'; payload: Snippet[] }
  | { type: 'ADD_SNIPPET'; payload: Snippet }
  | { type: 'UPDATE_SNIPPET'; payload: Snippet }
  | { type: 'DELETE_SNIPPET'; payload: string }
  | { type: 'TOGGLE_FAVORITE'; payload: string }
  | { type: 'SET_NEW_SNIPPET_DIALOG'; payload: boolean }
  | { type: 'SET_EDIT_MODE'; payload: boolean }
  | { type: 'SET_EDITING_SNIPPET'; payload: Snippet | null }
  | { type: 'SET_SEARCH_TERM'; payload: string }
  | { type: 'SET_FILTER_LANGUAGE'; payload: string }
  | { type: 'APPLY_FILTERS' };

const reducer = (draft: State, action: Action) => {
  switch (action.type) {
    case 'SET_SNIPPETS':
      draft.snippets = action.payload;
      draft.filteredSnippets = action.payload;
      break;
    case 'ADD_SNIPPET':
      draft.snippets.push(action.payload);
      break;
    case 'UPDATE_SNIPPET':
      const index = draft.snippets.findIndex(s => s.id === action.payload.id);
      if (index !== -1) {
        draft.snippets[index] = action.payload;
      }
      break;
    case 'DELETE_SNIPPET':
      draft.snippets = draft.snippets.filter(s => s.id !== action.payload);
      break;
    case 'TOGGLE_FAVORITE':
      const snippetIndex = draft.snippets.findIndex(
        s => s.id === action.payload,
      );
      if (snippetIndex !== -1) {
        draft.snippets[snippetIndex].isFavorite =
          !draft.snippets[snippetIndex].isFavorite;
      }
      break;
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
    case 'APPLY_FILTERS':
      draft.filteredSnippets = draft.snippets.filter(snippet => {
        const matchesSearch =
          snippet.title
            .toLowerCase()
            .includes(draft.searchTerm.toLowerCase()) ||
          snippet.code.toLowerCase().includes(draft.searchTerm.toLowerCase());
        const matchesLanguage =
          draft.filterLanguage === '' ||
          snippet.language === draft.filterLanguage;
        return matchesSearch && matchesLanguage;
      });
      break;
  }
};

interface SnippetContextValue {
  state: State;
  dispatch: React.Dispatch<Action>;
}

const SnippetContext = createContext<SnippetContextValue | undefined>(
  undefined,
);
SnippetContext.displayName = 'SnippetContext';

const initialState: State = {
  snippets: [],
  filteredSnippets: [],
  isNewSnippetDialogOpen: false,
  isEditMode: false,
  editingSnippet: null,
  searchTerm: '',
  filterLanguage: '',
};

const SnippetProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useImmerReducer(reducer, initialState);

  return (
    <SnippetContext.Provider value={{ state, dispatch }}>
      {children}
    </SnippetContext.Provider>
  );
};

export { SnippetContext, SnippetProvider };
