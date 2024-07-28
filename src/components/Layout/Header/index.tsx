'use client';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { Bell, Search } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import UserMenu from './_components/UserMenu';

export function Header() {
  const auth = useAuth();
  const router = useRouter();

  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const handleLogout = async () => {
    try {
      await auth.logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="bg-white shadow-lg transition-all duration-300 dark:bg-gray-800 dark:shadow-indigo-500/20">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-1 items-center justify-center px-4">
          <div className="relative w-full max-w-lg">
            <input
              type="text"
              placeholder="Search..."
              className={cn(
                `w-full rounded-full border border-gray-300 bg-gray-100 py-2 pl-10 pr-4 text-gray-800 transition-all duration-300 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white`,
                {
                  'ring-2 ring-indigo-500 dark:ring-indigo-400':
                    isSearchFocused,
                },
              )}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
            />
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <button className="relative mr-4 rounded-full p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700">
            <Bell className="h-6 w-6" />
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500"></span>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden items-center space-x-6 md:flex">
            {auth.user ? (
              <UserMenu onLogout={handleLogout} />
            ) : (
              <Link href="/login">
                <Button
                  variant="outline"
                  className="transition-colors duration-200 hover:bg-purple-100 dark:hover:bg-purple-900"
                >
                  Login
                </Button>
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
