import { Tooltip } from '@/components/Common/Tooltip';
import { Badge } from '@/components/ui/badge';
import { CardHeader, CardTitle } from '@/components/ui/card';
import useSnippets from '@/hooks/useSnippets';
import { Snippet } from '@/lib/schemas/snippet';
import { cn } from '@/lib/utils';
import { humanReadableTimestamp } from '@blaze/human-readable-timestamp';
import { AnimatePresence, motion } from 'framer-motion';
import { FileText, Heart, Tag } from 'lucide-react';
import { MdOutlineTitle } from 'react-icons/md';

interface SnippetCardHeaderProps {
  isHovered: boolean;
  snippet: Snippet;
}

const SnippetCardHeader = ({ isHovered, snippet }: SnippetCardHeaderProps) => {
  const { updateSnippetState } = useSnippets();

  const isDark = snippet.state?.isDark;
  const isFavorite = snippet.state?.isFavorite;

  return (
    <CardHeader
      className={cn('p-4', {
        'bg-gray-700': isDark,
        'bg-purple-50': !isDark,
      })}
    >
      <CardTitle
        className={cn('flex items-center text-lg font-semibold', {
          'text-purple-300': isDark,
          'text-purple-800': !isDark,
        })}
      >
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: isHovered ? 360 : 0 }}
          transition={{ duration: 0.5 }}
        >
          <MdOutlineTitle
            className={cn('h-5 w-5', {
              'text-purple-400': isDark,
              'text-purple-600': !isDark,
            })}
          />
        </motion.div>

        <motion.div className="flex flex-1 justify-between">
          <motion.span className="text-lg font-bold leading-none">
            <p className="truncate whitespace-nowrap">{snippet.title}</p>
          </motion.span>

          <Tooltip
            content={isFavorite ? 'Unfavorite' : 'Favorite'}
            sideOffset={5}
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              <Heart
                onClick={() =>
                  updateSnippetState({
                    id: snippet.snippetStateId,
                    data: {
                      isFavorite: !isFavorite,
                    },
                  })
                }
                className={cn(
                  'h-4 w-4 cursor-pointer text-slate-400 hover:text-purple-600',
                  {
                    'fill-current text-purple-600': isFavorite,
                  },
                )}
              />
            </motion.div>
          </Tooltip>
        </motion.div>
      </CardTitle>
      <motion.div className="text-muted-foreground">
        <motion.div className="flex justify-between text-xs font-medium">
          <motion.time dateTime={snippet.createdAt.toISOString()}>
            {snippet.createdAt.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: 'numeric',
              minute: 'numeric',
              second: 'numeric',
            })}
          </motion.time>
          <motion.span>{humanReadableTimestamp(snippet.createdAt)}</motion.span>
        </motion.div>

        <AnimatePresence>
          {snippet.tags && snippet.tags.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ delay: 0.6 }}
              className="mt-2 flex flex-wrap items-center gap-1"
            >
              <Tag className="h-4 w-4" />
              {snippet.tags.map((tag, index) => (
                <motion.span
                  key={tag.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <Badge>{tag.name}</Badge>
                </motion.span>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div className="mt-2 flex flex-wrap items-center gap-1">
          <FileText className="h-4 w-4" />
          <motion.p className="text-sm text-muted-foreground">
            {truncateString(snippet.description, 200)}
          </motion.p>
        </motion.div>
      </motion.div>
    </CardHeader>
  );
};

export default SnippetCardHeader;

const truncateString = (str: string, length: number) => {
  if (str.length > length) {
    return `${str.slice(0, length)}...`;
  }
  return str;
};
