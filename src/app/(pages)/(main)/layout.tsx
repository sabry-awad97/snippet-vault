'use client';

import { Header } from '@/components/Layout/Header';
import Sidebar from '@/components/Layout/Sidebar';
import useCurrentTheme from '@/hooks/useCurrentTheme';
import { cn } from '@/lib/utils';
import React, { useState } from 'react';

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme } = useCurrentTheme();

  const isDarkMode = theme === 'dark';

  return (
    <div
      className={cn(
        'flex h-screen overflow-hidden transition-colors duration-300 ease-in-out',
        {
          'bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900':
            isDarkMode,
          'bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100':
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
            <div className="flex-1 rounded-lg bg-white p-6 shadow-lg transition-all duration-300 ease-in-out dark:bg-gray-800 dark:shadow-indigo-500/50">
              {children}
            </div>

            {/* Footer */}
            <footer className="mt-8 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
              <p>&copy; 2024. All rights reserved.</p>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}
