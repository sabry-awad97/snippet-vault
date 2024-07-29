import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { useState } from 'react';

const SearchBar = () => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  return (
    <motion.div
      initial={false}
      animate={{ width: isSearchFocused ? '100%' : '80%' }}
      transition={{ duration: 0.2 }}
      className="relative w-full max-w-lg"
    >
      <input
        type="text"
        placeholder="Search..."
        className={cn(
          `w-full rounded-full border border-gray-300 bg-gray-100 py-2 pl-10 pr-4 text-gray-800 transition-all duration-300 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white`,
          {
            'ring-2 ring-indigo-500 dark:ring-indigo-400': isSearchFocused,
          },
        )}
        onFocus={() => setIsSearchFocused(true)}
        onBlur={() => setIsSearchFocused(false)}
      />
      <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
    </motion.div>
  );
};

export default SearchBar;
