'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Code,
  Folder,
  Home,
  LogOut,
  Settings,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  isCollapsed: boolean;
}

const NavItem: React.FC<NavItemProps> = ({
  href,
  icon,
  title,
  isCollapsed,
}) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link href={href} passHref>
      <div
        className={`flex items-center rounded-lg p-2 transition-colors ${
          isActive
            ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200'
            : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800'
        }`}
      >
        <div className="mr-3 text-lg">{icon}</div>
        {!isCollapsed && <span>{title}</span>}
      </div>
    </Link>
  );
};

export const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const auth = useAuth();

  const { user, logout } = auth;

  const initials = user?.initials || '';
  const charCodeSum = initials
    .split('')
    .reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const avatarIndex = charCodeSum % 70;
  const avatarUrl = `https://i.pravatar.cc/300?img=${avatarIndex}`;

  const handleLogout = async () => {
    try {
      await logout();
      // Redirect to login page or home page after logout
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const sidebarVariants = {
    expanded: { width: '240px' },
    collapsed: { width: '80px' },
  };

  return (
    <motion.div
      className="flex flex-1 flex-col bg-white shadow-lg dark:bg-gray-900"
      initial="expanded"
      animate={isCollapsed ? 'collapsed' : 'expanded'}
      variants={sidebarVariants}
    >
      <div className="flex items-center justify-between p-4">
        {!isCollapsed && (
          <h1 className="text-xl font-bold text-purple-600 dark:text-purple-400">
            Snippet Vault
          </h1>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight size={24} /> : <ChevronLeft size={24} />}
        </Button>
      </div>

      <nav className="flex-grow space-y-2 p-4">
        <NavItem
          href="/dashboard"
          icon={<Home />}
          title="Dashboard"
          isCollapsed={isCollapsed}
        />
        <NavItem
          href="/snippets"
          icon={<Code />}
          title="Snippets"
          isCollapsed={isCollapsed}
        />
        <NavItem
          href="/collections"
          icon={<Folder />}
          title="Collections"
          isCollapsed={isCollapsed}
        />
        <NavItem
          href="/settings"
          icon={<Settings />}
          title="Settings"
          isCollapsed={isCollapsed}
        />
      </nav>

      <div className="border-t border-gray-200 p-4 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarImage src={avatarUrl} alt={user?.name} />
            <AvatarFallback>{user?.initials}</AvatarFallback>
          </Avatar>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <p className="font-medium text-gray-800 dark:text-gray-200">
                  {user?.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {user?.email}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <Button
          variant="ghost"
          className="mt-4 w-full justify-start"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          {!isCollapsed && <span>Logout</span>}
        </Button>
      </div>
    </motion.div>
  );
};
