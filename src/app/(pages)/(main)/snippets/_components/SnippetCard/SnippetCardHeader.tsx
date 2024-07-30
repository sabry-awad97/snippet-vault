import { Tooltip } from '@/components/Common/Tooltip';
import { CardHeader, CardTitle } from '@/components/ui/card';
import useSnippets from '@/hooks/useSnippets';
import { Snippet } from '@/lib/schemas/snippet';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useCallback } from 'react';
import { MdOutlineTitle } from 'react-icons/md';

interface SnippetCardHeaderProps {
  isHovered: boolean;
  isDarkMode: boolean;
  snippet: Snippet;
}

const SnippetCardHeader = ({
  isDarkMode,
  isHovered,
  snippet,
}: SnippetCardHeaderProps) => {
  const { toggleFavorite } = useSnippets();

  const handleToggleFavorite = useCallback(() => {
    toggleFavorite(snippet.id);
  }, [snippet.id, toggleFavorite]);

  return (
    <CardHeader
      className={cn('p-4', {
        'bg-gray-700': isDarkMode,
        'bg-purple-50': !isDarkMode,
      })}
    >
      <CardTitle
        className={cn('flex items-center text-lg font-semibold', {
          'text-purple-300': isDarkMode,
          'text-purple-800': !isDarkMode,
        })}
      >
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: isHovered ? 360 : 0 }}
          transition={{ duration: 0.5 }}
        >
          <MdOutlineTitle
            className={cn('mr-2 h-5 w-5', {
              'text-purple-400': isDarkMode,
              'text-purple-600': !isDarkMode,
            })}
          />
        </motion.div>

        <div className="flex flex-1 justify-between">
          <span className="text-lg font-bold leading-none">
            <p className="truncate whitespace-nowrap">{snippet.title}</p>
          </span>

          <Tooltip
            content={snippet.isFavorite ? 'Unfavorite' : 'Favorite'}
            sideOffset={5}
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              <Heart
                onClick={handleToggleFavorite}
                className={cn(
                  'h-4 w-4 cursor-pointer text-slate-400 hover:text-purple-600',
                  {
                    'fill-current text-purple-600': snippet.isFavorite,
                  },
                )}
              />
            </motion.div>
          </Tooltip>
        </div>
      </CardTitle>
    </CardHeader>
  );
};

export default SnippetCardHeader;
