import { CardFooter } from '@/components/ui/card';
import { useDeleteSnippet, useUpdateSnippetState } from '@/hooks/useSnippets';
import useSnippetStore from '@/hooks/useSnippetStore';
import { Snippet } from '@/lib/schemas/snippet';
import { cn } from '@/lib/utils';
import { titleCase } from '@/lib/utils/stringUtils';
import { motion } from 'framer-motion';
import { Check, Copy, Edit, Moon, Sun, Trash2 } from 'lucide-react';
import { useCallback, useState } from 'react';
import { IconType } from 'react-icons';
import { toast } from 'sonner';
import ActionButton from './ActionButton';

interface SnippetCardFooterProps {
  snippet: Snippet;
  languageIcon?: IconType;
}

const SnippetCardFooter: React.FC<SnippetCardFooterProps> = ({
  snippet,
  languageIcon: Icon,
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const updateSnippetStateMutation = useUpdateSnippetState();
  const deleteSnippetMutation = useDeleteSnippet();
  const { setSnippetDialog } = useSnippetStore();

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
    deleteSnippetMutation.mutateAsync(snippet.id);
  }, [deleteSnippetMutation, snippet.id]);

  return (
    <CardFooter
      className={cn(
        'flex items-center justify-between space-x-4 p-4 transition-colors duration-200',
        snippet.state?.isDark ? 'bg-gray-800' : 'bg-purple-50',
      )}
    >
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="flex items-center gap-2 text-slate-400"
      >
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        >
          {Icon && <Icon className="h-4 w-4" />}
        </motion.div>

        <span className="font-semibold">{titleCase(snippet.language)}</span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
        className="flex items-center gap-2"
      >
        {[
          {
            tooltip: 'Toggle Dark Mode',
            icon: snippet.state?.isDark ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            ),
            onClick: () =>
              updateSnippetStateMutation.mutateAsync({
                id: snippet.snippetStateId,
                data: {
                  isDark: !snippet.state?.isDark,
                },
              }),
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
            isDarkMode={snippet.state?.isDark}
            isDestructive={action.isDestructive}
          />
        ))}
      </motion.div>
    </CardFooter>
  );
};

export default SnippetCardFooter;
