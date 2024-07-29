import { motion } from 'framer-motion';
import { NavItem } from './NavItem';
import SidebarHeader from './SidebarHeader';
import SidebarNav from './SidebarNav';

const sidebarVariants = {
  open: { x: 0, opacity: 1 },
  closed: { x: '-100%', opacity: 0 },
};

const SidebarContent: React.FC<{
  logo?: React.ReactNode;
  navItems: NavItem[];
  toggleSidebar: () => void;
}> = ({ logo, navItems, toggleSidebar }) => (
  <motion.aside
    initial="closed"
    animate="open"
    exit="closed"
    variants={sidebarVariants}
    transition={{ duration: 0.3, ease: 'easeInOut' }}
    className="fixed inset-y-0 left-0 z-30 w-64 overflow-y-auto bg-gradient-to-b from-white to-gray-100 p-6 shadow-lg dark:from-gray-800 dark:to-gray-900 md:relative"
  >
    <SidebarHeader logo={logo} toggleSidebar={toggleSidebar} />
    <SidebarNav navItems={navItems} />
  </motion.aside>
);

export default SidebarContent;