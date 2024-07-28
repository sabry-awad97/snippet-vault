'use client';

import { Header } from '@/components/Layout/Header';
import { Button } from '@/components/ui/button';
import { Code, Folder, Home, Menu, Settings, X } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <Header />

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
          <div className="mx-auto">
            {/* Mobile menu button */}
            <div className="mb-4 md:hidden">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-6 w-6" />
              </Button>
            </div>

            {/* Main content */}
            <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
              {children}
            </div>
          </div>
        </main>
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-30 w-64 transform overflow-y-auto bg-white p-6 transition-transform duration-300 ease-in-out dark:bg-gray-800 md:relative md:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-purple-600 dark:text-purple-400">
          Snippet Vault
        </h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="md:hidden"
        >
          <X className="h-6 w-6" />
        </Button>
      </div>
      <nav className="mt-6">
        <ul className="space-y-2">
          <li>
            <Link
              href="/dashboard"
              className="flex items-center space-x-2 rounded-lg p-2 text-gray-600 hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400"
            >
              <Home className="h-5 w-5" />
              <span>Dashboard</span>
            </Link>
          </li>
          <li>
            <Link
              href="/snippets"
              className="flex items-center space-x-2 rounded-lg p-2 text-gray-600 hover:bg-gray-100 hover:text-purple-600 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-purple-400"
            >
              <Code className="h-5 w-5" />
              <span>Snippets</span>
            </Link>
          </li>
          <li>
            <Link
              href="/collections"
              className="flex items-center space-x-2 rounded-lg p-2 text-gray-600 hover:bg-gray-100 hover:text-purple-600 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-purple-400"
            >
              <Folder className="h-5 w-5" />
              <span>Collections</span>
            </Link>
          </li>
          <li>
            <Link
              href="/settings"
              className="flex items-center space-x-2 rounded-lg p-2 text-gray-600 hover:bg-gray-100 hover:text-purple-600 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-purple-400"
            >
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};
