import { CardFooter } from '@/components/ui/card';
import useSnippets from '@/hooks/useSnippets';
import { Snippet } from '@/lib/schemas/snippet';
import { cn } from '@/lib/utils';
import { Check, Copy, Edit, Moon, Sun, Trash2 } from 'lucide-react';
import React, { useCallback, useState } from 'react';
import { toast } from 'sonner';
import ActionButton from './ActionButton';

interface SnippetCardFooterProps {
  snippet: Snippet;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const SnippetCardFooter: React.FC<SnippetCardFooterProps> = ({
  snippet,
  isDarkMode,
  toggleDarkMode,
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const { deleteSnippet, setSnippetDialog } = useSnippets();

  const handleCopySnippet = useCallback(() => {
    navigator.clipboard
      .writeText(snippet.code)
      .then(() => {
        toast.success('Copied to Clipboard', {
          description: 'The snippet code has been copied to your clipboard.',
        });
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 1000);
      })
      .catch(() => {
        toast.error('Failed to copy', {
          description: 'An error occurred while copying the snippet.',
        });
      });
  }, [snippet.code]);

  const handleEdit = useCallback(() => {
    setSnippetDialog(snippet);
  }, [setSnippetDialog, snippet]);

  const handleDelete = useCallback(() => {
    deleteSnippet(snippet.id);
  }, [deleteSnippet, snippet.id]);

  return (
    <CardFooter
      className={cn(
        'flex justify-end space-x-2 p-4 transition-colors duration-200',
        isDarkMode ? 'bg-gray-800' : 'bg-purple-50',
      )}
    >
      {[
        {
          tooltip: 'Toggle Dark Mode',
          icon: isDarkMode ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          ),
          onClick: toggleDarkMode,
        },
        {
          tooltip: isCopied ? 'Copied!' : 'Copy',
          icon: isCopied ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className="h-4 w-4" />
          ),
          onClick: handleCopySnippet,
        },
        {
          tooltip: 'Edit',
          icon: <Edit className="h-4 w-4" />,
          onClick: handleEdit,
        },
        {
          tooltip: 'Delete',
          icon: <Trash2 className="h-4 w-4" />,
          onClick: handleDelete,
          isDestructive: true,
        },
      ].map((action, index) => (
        <ActionButton
          key={index}
          tooltip={action.tooltip}
          icon={action.icon}
          onClick={action.onClick}
          isDarkMode={isDarkMode}
          isDestructive={action.isDestructive}
        />
      ))}
    </CardFooter>
  );
};

export default SnippetCardFooter;
