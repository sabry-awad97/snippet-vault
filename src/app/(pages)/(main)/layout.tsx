'use client';

import { Header } from '@/components/Layout/Header';
import Sidebar from '@/components/Layout/Sidebar';
import useCurrentTheme from '@/hooks/useCurrentTheme';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { Bell, ChevronDown, Menu, Moon, Search, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
    <div
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
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <Header />

        {/* Page Content */}
        <main className="flex flex-1 overflow-auto p-4 md:p-6 lg:p-8">
          <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col">
            {/* Main content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex-1 rounded-lg bg-white p-6 shadow-lg transition-all duration-300 ease-in-out dark:bg-gray-800 dark:shadow-indigo-500/20"
            >
              {children}
            </motion.div>

            {/* Footer */}
            <footer className="mt-8 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
              <p>&copy; 2024. All rights reserved.</p>
              <button
                onClick={toggleTheme}
                className="rounded-full p-2 transition-colors duration-200 hover:bg-purple-100 dark:hover:bg-purple-900"
              >
                {isDarkMode ? (
                  <Sun className="h-5 w-5 text-yellow-400" />
                ) : (
                  <Moon className="h-5 w-5 text-indigo-600" />
                )}
              </button>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}

interface HeaderProps {
  onMenuClick: () => void;
}

function Header1({ onMenuClick }: HeaderProps) {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <header className="bg-white shadow-md dark:bg-gray-800 dark:shadow-indigo-500/20">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <button
            onClick={onMenuClick}
            className="mr-4 rounded-md p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
          >
            <Menu className="h-6 w-6" />
          </button>
          <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
            Dashboard
          </h1>
        </div>

        <div className="flex flex-1 items-center justify-center px-4">
          <div className="relative w-full max-w-lg">
            <input
              type="text"
              placeholder="Search..."
              className={`w-full rounded-full border border-gray-300 bg-gray-100 py-2 pl-10 pr-4 text-gray-800 transition-all duration-300 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white ${
                isSearchFocused
                  ? 'ring-2 ring-indigo-500 dark:ring-indigo-400'
                  : ''
              }`}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
            />
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        <div className="flex items-center">
          <button className="relative mr-4 rounded-full p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700">
            <Bell className="h-6 w-6" />
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500"></span>
          </button>

          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <img
                className="h-8 w-8 rounded-full"
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt="User profile"
              />
              <span className="ml-2 hidden text-gray-700 dark:text-gray-300 sm:inline-block">
                John Doe
              </span>
              <ChevronDown className="ml-1 h-4 w-4 text-gray-400" />
            </button>

            <AnimatePresence>
              {isProfileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-gray-700"
                >
                  <a
                    href="#profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600"
                  >
                    Your Profile
                  </a>
                  <a
                    href="#settings"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600"
                  >
                    Settings
                  </a>
                  <a
                    href="#signout"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600"
                  >
                    Sign out
                  </a>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}
