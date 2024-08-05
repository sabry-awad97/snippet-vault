import { motion } from 'framer-motion';
import Languages from './Languages';
import SidebarHeader from './SidebarHeader';
import SidebarNav from './SidebarNav';

const sidebarVariants = {
  open: { x: 0, opacity: 1 },
  closed: { x: '-100%', opacity: 0 },
};

const SidebarContent: React.FC<{
  toggleSidebar: () => void;
}> = ({ toggleSidebar }) => (
  <motion.aside
    initial="closed"
    animate="open"
    exit="closed"
    variants={sidebarVariants}
    transition={{ duration: 0.3, ease: 'easeInOut' }}
    className="fixed inset-y-0 left-0 z-30 w-64 overflow-y-auto bg-gradient-to-b from-white to-gray-100 p-6 shadow-lg dark:from-gray-800 dark:to-gray-900 md:relative"
  >
    <SidebarHeader toggleSidebar={toggleSidebar} />
    <SidebarNav />
    <Languages />
  </motion.aside>
);

export default SidebarContent;
