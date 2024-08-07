'use client';

import ThemeSwitch from '@/components/Common/ThemeSwitch';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import SearchBar from './_components/SearchBar';

const titles: { [key: string]: string } = {
  '/dashboard': 'Dashboard',
  '/snippets': 'Snippets',
  '/collections': 'Collections',
  '/settings': 'Settings',
};

const getTitleFromPathname = (pathname: string) => {
  return titles[pathname] || 'Snippet Vault';
};

export function Header() {
  const pathname = usePathname();
  const pageTitle = getTitleFromPathname(pathname);

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="sticky top-0 z-10 rounded-lg bg-white shadow-lg transition-all duration-300 ease-in-out dark:bg-gray-800 dark:shadow-indigo-500/20"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-between"
        >
          <h1
            className={cn(
              'text-3xl font-bold text-purple-800 dark:text-purple-200',
            )}
          >
            {pageTitle}
          </h1>
        </motion.div>

        <div className="flex flex-1 items-center justify-center px-4 md:px-8">
          <SearchBar />
        </div>

        <div className="flex items-center space-x-4">
          {/* <NotificationButton /> */}
          <ThemeSwitch />
        </div>
      </div>
    </motion.header>
  );
}
