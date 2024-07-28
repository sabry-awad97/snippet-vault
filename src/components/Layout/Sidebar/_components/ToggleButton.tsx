import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';

const ToggleButton: React.FC<{
  isOpen: boolean;
  toggleSidebar: () => void;
}> = ({ isOpen, toggleSidebar }) => (
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
);

export default ToggleButton;
