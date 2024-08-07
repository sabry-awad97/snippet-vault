import { ScrollArea } from '@/components/ui/scroll-area';
import { Snippet } from '@/lib/schemas/snippet';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import SnippetCard from './SnippetCard';

interface SnippetGridProps {
  snippets: Snippet[];
}

function SnippetGrid({ snippets }: SnippetGridProps) {
  return (
    <ScrollArea className="h-[600px]">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className={cn({
          'grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3': true,
        })}
      >
        <AnimatePresence>
          {snippets.map(snippet => (
            <motion.div
              key={snippet.id}
              layout
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
              <SnippetCard snippet={snippet} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </ScrollArea>
  );
}

export default SnippetGrid;
