'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, X } from 'lucide-react';
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

  const sidebarAnimation = {
    open: { x: 0, opacity: 1 },
    closed: { x: '-100%', opacity: 0 },
  };

  const navItemAnimation = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: [0.6, -0.05, 0.01, 0.99],
      },
    }),
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial="closed"
            animate="open"
            exit="closed"
            variants={sidebarAnimation}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed inset-y-0 left-0 z-30 w-64 overflow-y-auto bg-white p-6 shadow-lg dark:bg-gray-800 md:relative"
          >
            <div className="flex items-center justify-between">
              {logo || (
                <motion.h2
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="text-2xl font-bold text-purple-600 dark:text-purple-400"
                >
                  Snippet Vault
                </motion.h2>
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
              <AnimatePresence>
                <motion.ul
                  className="space-y-2 px-4"
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={{
                    visible: { transition: { staggerChildren: 0.07 } },
                  }}
                >
                  {navItems.map(({ href, icon: Icon, label }, index) => (
                    <motion.li
                      key={href}
                      variants={navItemAnimation}
                      custom={index}
                    >
                      <Link href={href}>
                        <motion.div
                          className={cn(
                            'flex items-center space-x-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors duration-200',
                            'text-gray-600 hover:bg-purple-50 hover:text-purple-700',
                            'dark:text-gray-300 dark:hover:bg-purple-900 dark:hover:text-purple-300',
                            pathname === href &&
                              'bg-purple-100 text-purple-700 dark:bg-purple-800 dark:text-purple-200',
                          )}
                          whileHover={{ x: 5 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Icon className="h-5 w-5" />
                          <span>{label}</span>
                        </motion.div>
                      </Link>
                    </motion.li>
                  ))}
                </motion.ul>
              </AnimatePresence>
            </nav>
          </motion.aside>
        )}
      </AnimatePresence>

      <motion.button
        initial={false}
        animate={{
          x: isOpen ? 256 : 0,
          boxShadow: isOpen ? '0px 0px 10px rgba(0, 0, 0, 0.1)' : 'none',
        }}
        transition={{ duration: 0.3 }}
        onClick={toggleSidebar}
        className="fixed left-0 top-1/2 z-40 -translate-y-1/2 rounded-r-lg bg-purple-600 p-2 text-white transition-all duration-200 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:bg-purple-700 dark:hover:bg-purple-600"
      >
        <motion.div
          animate={{ rotate: isOpen ? 0 : 180 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronLeft className="h-6 w-6" />
        </motion.div>
      </motion.button>
    </>
  );
};

export default Sidebar;
