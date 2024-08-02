'use client';

import { AnimatePresence } from 'framer-motion';
import React, { useState } from 'react';
import SidebarContent from './_components/SidebarContent';
import ToggleButton from './_components/ToggleButton';

interface SidebarProps {
  initialIsOpen?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ initialIsOpen = true }) => {
  const [isOpen, setIsOpen] = useState(initialIsOpen);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      <AnimatePresence>
        {isOpen && <SidebarContent toggleSidebar={toggleSidebar} />}
      </AnimatePresence>
      <ToggleButton isOpen={isOpen} toggleSidebar={toggleSidebar} />
    </>
  );
};

export default Sidebar;
