'use client';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import NotificationButton from './_components/NotificationButton';
import SearchBar from './_components/SearchBar';
import Title from './_components/Title';
import UserMenu from './_components/UserMenu';

const getTitleFromPathname = (pathname: string) => {
  switch (pathname) {
    case '/dashboard':
      return 'Dashboard';
    case '/snippets':
      return 'Snippets';
    case '/collections':
      return 'Collections';
    case '/settings':
      return 'Settings';
    default:
      return 'Snippet Vault';
  }
};

export function Header() {
  const auth = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const pageTitle = getTitleFromPathname(pathname);

  const handleLogout = async () => {
    try {
      await auth.logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

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

          <AnimatePresence>
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
          </AnimatePresence>
        </div>
      </div>
    </motion.header>
  );
}
