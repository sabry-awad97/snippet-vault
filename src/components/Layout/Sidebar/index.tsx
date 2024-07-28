'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';

interface NavItem {
  href: string;
  icon: React.ElementType;
  label: string;
}

interface SidebarProps {
  initialIsOpen?: boolean;
  logo?: React.ReactNode;
  navItems: NavItem[];
}

const Sidebar: React.FC<SidebarProps> = ({
  initialIsOpen = true,
  logo,
  navItems,
}) => {
  const [isOpen, setIsOpen] = useState(initialIsOpen);
  const pathname = usePathname();

  const toggleSidebar = () => setIsOpen(!isOpen);

  const sidebarVariants = {
    open: { x: 0 },
    closed: { x: '-100%' },
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial="closed"
            animate="open"
            exit="closed"
            variants={sidebarVariants}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed inset-y-0 left-0 z-30 w-64 overflow-y-auto bg-white p-6 shadow-lg dark:bg-gray-800 md:relative"
          >
            <div className="flex items-center justify-between">
              {logo || (
                <h2 className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  Snippet Vault
                </h2>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSidebar}
                className="md:hidden"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>
            <nav className="mt-8">
              <ul className="space-y-2">
                {navItems.map(({ href, icon: Icon, label }) => (
                  <li key={href}>
                    <Link href={href}>
                      <motion.div
                        whileHover={{ x: 5 }}
                        className={cn(
                          'flex items-center space-x-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors duration-200',
                          'text-gray-600 hover:bg-purple-50 hover:text-purple-700',
                          'dark:text-gray-300 dark:hover:bg-purple-900 dark:hover:text-purple-300',
                          pathname === href &&
                            'bg-purple-100 text-purple-700 dark:bg-purple-800 dark:text-purple-200',
                        )}
                      >
                        <Icon className="h-5 w-5" />
                        <span>{label}</span>
                      </motion.div>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </motion.aside>
        )}
      </AnimatePresence>

      <motion.button
        initial={false}
        animate={{ x: isOpen ? 256 : 0 }}
        transition={{ duration: 0.3 }}
        onClick={toggleSidebar}
        className={cn(
          'fixed left-0 top-1/2 z-40 -translate-y-1/2 rounded-r-lg bg-purple-600 p-2 text-white shadow-md',
          'hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2',
          'dark:bg-purple-700 dark:hover:bg-purple-600',
          'transition-colors duration-200',
        )}
      >
        {isOpen ? (
          <ChevronLeft className="h-6 w-6" />
        ) : (
          <ChevronRight className="h-6 w-6" />
        )}
      </motion.button>
    </>
  );
};

export default Sidebar;
