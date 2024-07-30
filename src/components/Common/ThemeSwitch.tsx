'use client';

import useCurrentTheme from '@/hooks/useCurrentTheme';
import { AnimatePresence, motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

const ThemeSwitch = () => {
  const { theme, setTheme } = useCurrentTheme();
  const isDarkMode = theme === 'dark';
  const toggleTheme = () => {
    setTheme(isDarkMode ? 'light' : 'dark');
  };

  return (
    <motion.div variants={itemVariants} className="text-center md:text-right">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleTheme}
        className="inline-flex items-center rounded-full bg-gray-200 p-2 text-sm text-gray-700 transition-colors duration-200 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={isDarkMode ? 'moon' : 'sun'}
            initial={{ rotate: -180, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 180, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {isDarkMode ? (
              <Sun className="h-5 w-5 text-yellow-400" />
            ) : (
              <Moon className="h-5 w-5 text-indigo-600" />
            )}
          </motion.div>
        </AnimatePresence>
      </motion.button>
    </motion.div>
  );
};

export default ThemeSwitch;
