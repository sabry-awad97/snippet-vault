'use client';

import { Header } from '@/components/Layout/Header';
import Sidebar from '@/components/Layout/Sidebar';
import useCurrentTheme from '@/hooks/useCurrentTheme';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
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
  const { theme } = useCurrentTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDarkMode = theme === 'dark';

  if (!mounted) return <Loader />;

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
        <Sidebar initialIsOpen={true} />
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
              className="flex flex-1 rounded-lg bg-white shadow-lg transition-all duration-300 ease-in-out dark:bg-gray-800 dark:shadow-indigo-500/20"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={children?.toString()}
                  {...pageTransition}
                  transition={{ duration: 0.3 }}
                  className="flex flex-1"
                >
                  {children}
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </main>
      </div>
    </motion.div>
  );
}

function Loader() {
  return (
    <div className="flex h-64 items-center justify-center">
      <motion.div
        className="h-12 w-12 animate-spin rounded-full border-4 border-t-4 border-indigo-500"
        initial={{ scale: 0.8, opacity: 0.5 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, yoyo: Infinity }}
      />
    </div>
  );
}
