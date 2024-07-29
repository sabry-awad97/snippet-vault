'use client';

import { AnimatePresence } from 'framer-motion';
import React, { useState } from 'react';
import { NavItem } from './_components/NavItem';
import SidebarContent from './_components/SidebarContent';
import ToggleButton from './_components/ToggleButton';

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

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <SidebarContent
            logo={logo}
            navItems={navItems}
            toggleSidebar={toggleSidebar}
          />
        )}
      </AnimatePresence>
      <ToggleButton isOpen={isOpen} toggleSidebar={toggleSidebar} />
    </>
  );
};

export default Sidebar;
