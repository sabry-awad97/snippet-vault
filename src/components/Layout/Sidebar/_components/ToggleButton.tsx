import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import React from 'react';

const ToggleButton: React.FC<{
  isOpen: boolean;
  toggleSidebar: () => void;
}> = ({ isOpen, toggleSidebar }) => (
  <motion.button
    initial={false}
    animate={{
      x: isOpen ? 256 : 0,
      boxShadow: isOpen ? '0px 0px 15px rgba(0, 0, 0, 0.2)' : 'none',
      scale: isOpen ? 1.1 : 1,
    }}
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.95 }}
    transition={{
      type: 'spring',
      stiffness: 300,
      damping: 20,
      duration: 0.3,
    }}
    onClick={toggleSidebar}
    className="fixed left-0 top-1/2 z-40 -translate-y-1/2 rounded-r-full bg-gradient-to-r from-purple-600 to-purple-700 p-2 text-white transition-colors duration-200 hover:from-purple-500 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:from-purple-700 dark:to-purple-800 dark:hover:from-purple-600 dark:hover:to-purple-700"
  >
    <motion.div
      animate={{
        rotate: isOpen ? 0 : 180,
        x: isOpen ? 5 : 0,
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 20,
        duration: 0.3,
      }}
    >
      <ChevronLeft className="h-6 w-6" />
    </motion.div>
  </motion.button>
);

export default ToggleButton;
