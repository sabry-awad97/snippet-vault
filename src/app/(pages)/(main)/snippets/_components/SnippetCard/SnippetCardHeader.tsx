import { Tooltip } from '@/components/Common/Tooltip';
import { Badge } from '@/components/ui/badge';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { useUpdateSnippetState } from '@/hooks/useSnippets';
import { Snippet } from '@/lib/schemas/snippet';
import { cn } from '@/lib/utils';
import { humanReadableTimestamp } from '@blaze/human-readable-timestamp';
import { AnimatePresence, motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { MdOutlineTitle } from 'react-icons/md';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';

interface SnippetCardHeaderProps {
  isHovered: boolean;
  snippet: Snippet;
}

const SnippetCardHeader = ({ isHovered, snippet }: SnippetCardHeaderProps) => {
  const updateSnippetStateMutation = useUpdateSnippetState();

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
          <motion.span className="w-[calc(100%-6rem)] overflow-hidden text-ellipsis whitespace-nowrap">
            {snippet.title}
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
                  updateSnippetStateMutation.mutateAsync({
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
              className="mt-2"
            >
              <Slider
                dots={false}
                infinite={true}
                speed={500}
                slidesToShow={3}
                slidesToScroll={1}
                autoplay={true}
                autoplaySpeed={3000}
                pauseOnHover={true}
              >
                {snippet.tags.map(tag => (
                  <div key={tag.id} className="px-1">
                    <Badge className="inline-flex w-full items-center justify-center text-center text-xs font-medium transition-all duration-200 ease-in-out hover:scale-105">
                      <span className="truncate px-2">{tag.name}</span>
                    </Badge>
                  </div>
                ))}
              </Slider>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div className="mt-2 h-20 overflow-hidden text-sm text-muted-foreground">
          <p>{truncateString(snippet.description, 200)}</p>
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
