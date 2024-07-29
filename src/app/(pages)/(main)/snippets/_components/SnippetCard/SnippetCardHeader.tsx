import { CardHeader, CardTitle } from '@/components/ui/card';
import { Snippet } from '@/lib/schemas/snippet';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Code } from 'lucide-react';

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
          <Code
            className={cn('mr-2 h-5 w-5', {
              'text-purple-400': isDarkMode,
              'text-purple-600': !isDarkMode,
            })}
          />
        </motion.div>
        {snippet.title}
      </CardTitle>
    </CardHeader>
  );
};

export default SnippetCardHeader;
