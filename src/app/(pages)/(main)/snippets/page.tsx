'use client';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Snippet } from '@/lib/schemas/snippet';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { useImmerReducer } from 'use-immer';
import SnippetCard from './_components/SnippetCard';
import SnippetDialog from './_components/SnippetDialog';

// Define the state interface
interface State {
  snippets: Snippet[];
  isNewSnippetDialogOpen: boolean;
  isEditMode: boolean;
  editingSnippet: Snippet | null;
}

// Define action types
type Action =
  | { type: 'SET_SNIPPETS'; payload: Snippet[] }
  | { type: 'ADD_SNIPPET'; payload: Snippet }
  | { type: 'UPDATE_SNIPPET'; payload: Snippet }
  | { type: 'DELETE_SNIPPET'; payload: string }
  | { type: 'TOGGLE_FAVORITE'; payload: string }
  | { type: 'SET_NEW_SNIPPET_DIALOG'; payload: boolean }
  | { type: 'SET_EDIT_MODE'; payload: boolean }
  | { type: 'SET_EDITING_SNIPPET'; payload: Snippet | null };

// Define the reducer function
const reducer = (draft: State, action: Action) => {
  switch (action.type) {
    case 'SET_SNIPPETS':
      draft.snippets = action.payload;
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
  }
};

export default function SnippetsPage() {
  const [state, dispatch] = useImmerReducer(reducer, {
    snippets: [] as Snippet[],
    isNewSnippetDialogOpen: false,
    isEditMode: false,
    editingSnippet: null,
  });

  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!auth?.user) {
      router.push('/login');
    } else {
      const fetchSnippets = async () => {
        // Replace with actual API call
        const mockSnippets: Snippet[] = [
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
        ];
        dispatch({ type: 'SET_SNIPPETS', payload: mockSnippets });
      };

      fetchSnippets();
    }
  }, [auth, dispatch, router]);

  const handleCreateSnippet = async (newSnippet: Snippet) => {
    // Replace with actual API call
    const newSnippetWithId = {
      ...newSnippet,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    dispatch({ type: 'ADD_SNIPPET', payload: newSnippetWithId });
    dispatch({ type: 'SET_NEW_SNIPPET_DIALOG', payload: false });
    toast('Snippet Created', {
      description: 'Your new snippet has been successfully created.',
    });
  };

  const handleUpdateSnippet = async (updatedSnippet: Snippet) => {
    // Replace with actual API call
    dispatch({ type: 'UPDATE_SNIPPET', payload: updatedSnippet });
    dispatch({ type: 'SET_EDIT_MODE', payload: false });
    dispatch({ type: 'SET_EDITING_SNIPPET', payload: null });
    toast('Snippet Updated', {
      description: 'Your snippet has been successfully updated.',
    });
  };

  const handleDeleteSnippet = async (id: string) => {
    // Replace with actual API call
    dispatch({ type: 'DELETE_SNIPPET', payload: id });
    toast('Snippet Deleted', {
      description: 'Your snippet has been successfully deleted.',
    });
  };

  const handleCopySnippet = (code: string) => {
    navigator.clipboard.writeText(code);
    toast('Copied to Clipboard', {
      description: 'The snippet code has been copied to your clipboard.',
    });
  };

  const handleFavoriteSnippet = (id: string) => {
    // Replace with actual API call
    dispatch({ type: 'TOGGLE_FAVORITE', payload: id });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-8"
    >
      <div className="mb-6 flex items-center justify-between">
        <Button
          onClick={() =>
            dispatch({ type: 'SET_NEW_SNIPPET_DIALOG', payload: true })
          }
          className="bg-purple-600 text-white transition-all duration-200 hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
        >
          <Plus className="mr-2 h-4 w-4" /> <span>New Snippet</span>
        </Button>
      </div>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
      >
        <AnimatePresence>
          {state.snippets.map(snippet => (
            <motion.div
              key={snippet.id}
              layout
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
              <SnippetCard
                snippet={snippet}
                onDelete={() => handleDeleteSnippet(snippet.id)}
                onCopy={() => handleCopySnippet(snippet.code)}
                onEdit={() => {
                  dispatch({ type: 'SET_EDIT_MODE', payload: true });
                  dispatch({ type: 'SET_EDITING_SNIPPET', payload: snippet });
                  dispatch({ type: 'SET_NEW_SNIPPET_DIALOG', payload: true });
                }}
                onFavorite={() => handleFavoriteSnippet(snippet.id)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
      <SnippetDialog
        isOpen={state.isNewSnippetDialogOpen}
        onClose={() => {
          dispatch({ type: 'SET_NEW_SNIPPET_DIALOG', payload: false });
          dispatch({ type: 'SET_EDIT_MODE', payload: false });
          dispatch({ type: 'SET_EDITING_SNIPPET', payload: null });
        }}
        onSubmit={state.isEditMode ? handleUpdateSnippet : handleCreateSnippet}
        initialData={state.editingSnippet}
        isEditMode={state.isEditMode}
      />
    </motion.div>
  );
}
