import { CardFooter } from '@/components/ui/card';
import useSnippets from '@/hooks/useSnippets';
import { Snippet } from '@/lib/schemas/snippet';
import { cn } from '@/lib/utils';
import { Copy, Edit, Moon, Star, Sun, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import ActionButton from './ActionButton';

interface SnippetCardFooterProps {
  snippet: Snippet;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const SnippetCardFooter = ({
  snippet,
  isDarkMode,
  toggleDarkMode,
}: SnippetCardFooterProps) => {
  const [isFavorite, setIsFavorite] = useState(snippet.isFavorite || false);

  const snippetsContext = useSnippets();

  const {
    editingSnippet,
    filteredSnippets,
    isEditMode,
    isNewSnippetDialogOpen,
    createSnippet,
    updateSnippet,
    deleteSnippet,
    toggleFavorite,
    dispatch,
  } = snippetsContext;

  const handleCopySnippet = (code: string) => {
    navigator.clipboard.writeText(code);
    toast('Copied to Clipboard', {
      description: 'The snippet code has been copied to your clipboard.',
    });
  };

  return (
    <CardFooter
      className={cn('flex justify-end space-x-2 p-4', {
        'bg-gray-700': isDarkMode,
        'bg-purple-50': !isDarkMode,
      })}
    >
      <ActionButton
        tooltip="Toggle Dark Mode"
        icon={
          isDarkMode ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )
        }
        onClick={toggleDarkMode}
        isDarkMode={isDarkMode}
      />

      <ActionButton
        tooltip={isFavorite ? 'Unfavorite' : 'Favorite'}
        icon={
          <Star className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
        }
        onClick={() => toggleFavorite(snippet.id)}
        isDarkMode={isDarkMode}
      />

      <ActionButton
        tooltip="Copy"
        icon={<Copy className="h-4 w-4" />}
        onClick={() => handleCopySnippet(snippet.code)}
        isDarkMode={isDarkMode}
      />

      <ActionButton
        tooltip="Edit"
        icon={<Edit className="h-4 w-4" />}
        onClick={() => {
          dispatch({ type: 'SET_EDIT_MODE', payload: true });
          dispatch({ type: 'SET_EDITING_SNIPPET', payload: snippet });
          dispatch({ type: 'SET_NEW_SNIPPET_DIALOG', payload: true });
        }}
        isDarkMode={isDarkMode}
      />

      <ActionButton
        tooltip="Delete"
        icon={<Trash2 className="h-4 w-4" />}
        onClick={() => deleteSnippet(snippet.id)}
        isDestructive
        isDarkMode={isDarkMode}
      />
    </CardFooter>
  );
};

export default SnippetCardFooter;
