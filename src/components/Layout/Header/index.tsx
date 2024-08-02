'use client';

import ThemeSwitch from '@/components/Common/ThemeSwitch';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import NotificationButton from './_components/NotificationButton';
import SearchBar from './_components/SearchBar';
import Title from './_components/Title';

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
        <div className="flex items-center space-x-4">
          <Title text={pageTitle} />
        </div>

        <div className="flex flex-1 items-center justify-center px-4 md:px-8">
          <SearchBar />
        </div>

        <div className="flex items-center space-x-4">
          <NotificationButton />
          <ThemeSwitch />

          {/* <AnimatePresence>
            {auth.user ? (
              <UserMenu onLogout={handleLogout} />
            ) : (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
              >
                <Link href="/login">
                  <Button
                    variant="outline"
                    className="transition-colors duration-200 hover:bg-purple-100 dark:hover:bg-purple-900"
                  >
                    Login
                  </Button>
                </Link>
              </motion.div>
            )}
          </AnimatePresence> */}
        </div>
      </div>
    </motion.header>
  );
}
