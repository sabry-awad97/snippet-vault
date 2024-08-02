import { CardContent } from '@/components/ui/card';
import { Snippet } from '@/lib/schemas/snippet';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import {
  vs,
  vscDarkPlus,
} from 'react-syntax-highlighter/dist/esm/styles/prism';

interface SnippetCardContentProps {
  snippet: Snippet;
}

const SnippetCardContent = ({ snippet }: SnippetCardContentProps) => {
  return (
    <CardContent
      className={cn('h-full overflow-hidden p-4', {
        'text-gray-300': snippet.state?.isDark,
        'text-gray-800': !snippet.state?.isDark,
      })}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="h-full overflow-y-auto rounded-md"
      >
        <SyntaxHighlighter
          language={snippet.language}
          style={snippet.state?.isDark ? vscDarkPlus : vs}
          customStyle={{
            margin: 0,
            borderRadius: '0.375rem',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
          }}
        >
          {snippet.code}
        </SyntaxHighlighter>
      </motion.div>
    </CardContent>
  );
};

export default SnippetCardContent;
