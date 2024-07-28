'use client';

import { Header } from '@/components/Layout/Header';
import Sidebar from '@/components/Layout/Sidebar';
import useCurrentTheme from '@/hooks/useCurrentTheme';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { Code, Folder, Home, Moon, Settings, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const navItems = [
    { href: '/dashboard', icon: Home, label: 'Dashboard' },
    { href: '/snippets', icon: Code, label: 'Snippets' },
    { href: '/collections', icon: Folder, label: 'Collections' },
    { href: '/settings', icon: Settings, label: 'Settings' },
  ];

  const { theme, setTheme } = useCurrentTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDarkMode = theme === 'dark';

  const toggleTheme = () => {
    setTheme(isDarkMode ? 'light' : 'dark');
  };

  if (!mounted) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={cn(
        'flex h-screen overflow-hidden transition-all duration-500 ease-in-out',
        {
          'bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900':
            isDarkMode,
          'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50':
            !isDarkMode,
        },
      )}
    >
      <AnimatePresence>
        <Sidebar navItems={navItems} initialIsOpen={true} />
      </AnimatePresence>

      <div className="flex flex-1 flex-col overflow-hidden">
        <main className="flex flex-1 overflow-auto p-4 md:p-6 lg:p-8">
          <motion.div
            className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <Header />
            </motion.div>
            <motion.div
              variants={itemVariants}
              className="flex-1 rounded-lg bg-white p-6 shadow-lg transition-all duration-300 ease-in-out dark:bg-gray-800 dark:shadow-indigo-500/20"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={children?.toString()}
                  {...pageTransition}
                  transition={{ duration: 0.3 }}
                >
                  {children}
                </motion.div>
              </AnimatePresence>
            </motion.div>

            <motion.footer
              variants={itemVariants}
              className="mt-8 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400"
            >
              <p>
                &copy; {new Date().getFullYear()} Your Company. All rights
                reserved.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleTheme}
                className="rounded-full p-2 transition-colors duration-200 hover:bg-purple-100 dark:hover:bg-purple-900"
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
            </motion.footer>
          </motion.div>
        </main>
      </div>
    </motion.div>
  );
}
