import { Tooltip } from '@/components/Common/Tooltip';
import { Button } from '@/components/ui/button';
import useSnippets from '@/hooks/useSnippetStore';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus, Search } from 'lucide-react';
import { useState } from 'react';

const SearchBar = () => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const { setSnippetDialog, handleSearchChange } = useSnippets();

  const handleNewSnippet = () => {
    setSnippetDialog(null);
  };

  return (
    <motion.div
      initial={false}
      animate={{ width: isSearchFocused ? '100%' : '85%' }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="relative w-full max-w-3xl"
    >
      <div className="relative flex items-center">
        <motion.input
          type="text"
          placeholder="Find your code snippets..."
          className={cn(
            `w-full rounded-full border py-3 pl-12 pr-36 text-sm transition-all duration-300 focus:outline-none`,
            `border-gray-300 bg-white text-gray-800 placeholder-gray-400`,
            `dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400`,
            {
              'ring-2 ring-purple-500 dark:ring-purple-400': isSearchFocused,
            },
          )}
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setIsSearchFocused(false)}
          onChange={e => handleSearchChange(e.target.value)}
          animate={{ paddingRight: isSearchFocused ? '8rem' : '9rem' }}
          transition={{ duration: 0.2 }}
        />
        <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 hover:text-purple-500 dark:text-gray-500" />
        <AnimatePresence>
          <motion.div
            key="new-snippet-button"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="absolute right-2 flex items-center justify-center"
          >
            <Button
              onClick={handleNewSnippet}
              size="sm"
              className={cn(
                `rounded-full text-sm font-medium transition-all duration-200`,
                `bg-gradient-to-r from-purple-600 to-indigo-600 text-white`,
                `hover:from-purple-700 hover:to-indigo-700`,
                `dark:from-purple-500 dark:to-indigo-500`,
                `dark:hover:from-purple-600 dark:hover:to-indigo-600`,
                `focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800`,
                `shadow-md hover:shadow-lg`,
                `px-4 py-2`,
              )}
            >
              <Tooltip content="New Snippet">
                <Plus className="h-4 w-4" />
              </Tooltip>
            </Button>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default SearchBar;
