import { CardContent } from '@/components/ui/card';
import { Snippet } from '@/lib/schemas/snippet';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { Tag } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import {
  vs,
  vscDarkPlus,
} from 'react-syntax-highlighter/dist/esm/styles/prism';

interface SnippetCardContentProps {
  snippet: Snippet;
  isDarkMode: boolean;
}

const SnippetCardContent = ({
  snippet,
  isDarkMode,
}: SnippetCardContentProps) => {
  return (
    <CardContent
      className={cn('flex-1 overflow-hidden p-4', {
        'text-gray-300': isDarkMode,
        'text-gray-800': !isDarkMode,
      })}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex-grow overflow-y-auto rounded-md"
      >
        <SyntaxHighlighter
          language={snippet.language}
          style={isDarkMode ? vscDarkPlus : vs}
          showLineNumbers
          customStyle={{
            margin: 0,
            borderRadius: '0.375rem',
            height: '100%',
          }}
        >
          {snippet.code}
        </SyntaxHighlighter>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-4 flex flex-wrap items-center"
      >
        <span
          className={`mr-4 flex items-center text-sm font-medium ${isDarkMode ? 'text-purple-300' : 'text-purple-700'}`}
        >
          <Tag className="mr-1 h-4 w-4" />
          {snippet.language}
        </span>
        <span className={isDarkMode ? 'text-purple-400' : 'text-purple-600'}>
          Created: {new Date(snippet.createdAt).toLocaleDateString()}
        </span>
      </motion.div>
      <AnimatePresence>
        {snippet.tags && snippet.tags.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ delay: 0.6 }}
            className="mt-2 flex flex-wrap"
          >
            {snippet.tags.map((tag, index) => (
              <motion.span
                key={tag}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index }}
                className={`mr-2 mt-2 rounded-full ${
                  isDarkMode
                    ? 'bg-purple-800 text-purple-200'
                    : 'bg-purple-100 text-purple-800'
                } px-2 py-1 text-xs font-medium`}
              >
                {tag}
              </motion.span>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </CardContent>
  );
};

export default SnippetCardContent;
